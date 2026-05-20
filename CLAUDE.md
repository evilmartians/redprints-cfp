# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A CFP ("call for proposals") management Rails app — a "redprint" template originally built for SF Ruby Conference. Stack: Rails 8, SQLite + Litestream, Inertia.js + React 19, Vite, TailwindCSS v4, Alba (JSON) + Typelizer (TS types), Avo (admin), Lookbook, OmniAuth (Google/GitHub), Solid Queue.

## Common commands

```sh
bin/setup                    # install Ruby + JS deps, prepare DB
bin/dev                      # run Rails + Vite via Procfile.dev (uses overmind)
bundle exec rspec            # run non-system specs (system excluded by default)
bundle exec rspec spec/system           # run system specs explicitly
bundle exec rspec --tag type:system     # same
HEADY=1 bundle exec rspec spec/system   # run system specs with visible browser
bin/rubocop                  # lint Ruby (also runs via lefthook pre-commit)
bin/rails db:prepare         # create/migrate DB
```

System specs use **Cuprite** (Chrome via CDP) and **SitePrism** page objects in `spec/system/pages/`. The `data-test-id` attribute is registered as Capybara's `test_id` selector.

`spec/rails_helper.rb` auto-derives RSpec metadata `type` from the `spec/<type>/` directory name (e.g. `spec/forms/...` → `type: :form`). System specs are excluded unless the spec path or `--tag type:system` is given.

## Dev URLs

- App: http://localhost:3000
- Avo admin: `/admin` (requires `admin: true` on the user)
- Lookbook: `/dev/lookbook`
- Letter Opener inbox: `/dev/letters`
- Mission Control (jobs): `/dev/jobs`
- Litestream UI: `/dev/litestream` (only if configured)

Login in dev: use `karl@sfruby.com` (seeded developer) or any seeded record from `db/seeds.rb`. "Sign in as developer" is available in dev/test.

## Architecture

### Inertia.js + React, not a SPA, not classic Rails views

Controllers render React pages via `render inertia: "Path/Component", props: {...}`. Page components live in `app/frontend/pages/<resource>/{Index,Show,Form}.tsx`. The Inertia entrypoint is `app/frontend/entrypoints/inertia.ts`. There are essentially **no ERB views for user-facing pages** — only mailers, Avo, and Lookbook use server-rendered templates.

Global Inertia shared props (set in `ApplicationController#inertia_share`): `user`, `flash`, `cfp_closed`.

When redirecting after a non-GET Inertia request, use `inertia_location <path>` (not `redirect_to`) so Inertia performs a full visit. See `ProposalsController#create`/`#update`/`#destroy`.

### Serializers: Alba + Typelizer (Ruby drives TS types)

- Ruby serializers: `app/serializers/*_serializer.rb` extending `ApplicationSerializer` (Alba + Typelizer).
- TypeScript types are **auto-generated** into `app/frontend/serializers/` (see `config/initializers/typelizer.rb`). **Do not edit those `.ts` files by hand** — regenerate after changing a serializer.
- `ApplicationSerializer.one(name)` / `.many(name)` auto-resolve nested serializers by classifying the attribute name (e.g. `one :speaker_profile` → `SpeakerProfileSerializer`).
- In controllers, use `serialize(obj)` (defined in `ApplicationController`) — it infers the serializer from the model class name.

### Form objects (`app/forms/`)

Complex writes go through `ApplicationForm` subclasses (`ProposalForm`, `ReviewForm`, `OAuthForm`, etc.) — **not** strong params in controllers. Pattern: `MyForm.with(context: ...).from(params.require(:my))` then `form.save`. The base form provides:

- `ActiveModel::API` + `ActiveModel::Attributes` interface
- A `ContextProxy` (via `.with(**ctx)`) that injects ambient context (current user, parent record) before attribute assignment.
- `with_transaction` wrapping `save`, with `after_save` and `after_commit` callbacks (uses `after_commit_everywhere`).
- `attributes_from_context` populates the form from an existing record so it can be re-rendered on edit.

If you need to validate or persist anything beyond a trivial update, add a form object — don't put logic in the controller.

### CFP and Evaluation domain

- **`CFP`** is a `FrozenRecord` model backed by `config/data/cfps.yml`, not the database. Each CFP has `id`, `tracks` (hash → enum values on `Proposal#track`), `deadline`, and optional `field_names` for form-label customization. `CFP.primary` and `CFP.startups` are the canonical lookups.
- **`Proposal#track`** enum is built dynamically from `CFP.all.flat_map { it.tracks.keys }`. Adding a new track value means editing `config/data/cfps.yml`, not adding a migration.
- **`Evaluation`** owns review rounds. `Evaluation::Distribution` (an `ActiveRecord::AssociatedObject`, accessed as `evaluation.distribution`) builds proposal↔reviewer pairs and upserts pending `Review` records. Default distribution = every reviewer reviews every submitted proposal in the evaluation's tracks. To customize, override `Evaluation::Distribution#proposal_reviewer_pairs`.
- `Evaluation#invalidate!` delegates to the distribution and is **idempotent** — call it any time reviewers or proposals change. It's exposed as an Avo action.
- `ReviewForm` recomputes proposal scores via `Proposal#invalidate_scores!` (raw SQL aggregate) on save, unless the evaluation is `personal`.

### Authentication

- Cookie-based via signed `session_token` cookie matching `User#auth_token` (`has_secure_token`). See `app/controllers/concerns/authenticated.rb` — included by `ApplicationController` so every controller requires auth by default.
- Use `skip_authentication` (class method on the concern) to opt out (e.g. `Auth::OmniauthController`).
- OAuth flow: `omniauth-google-oauth2` + `omniauth-github`. Callback hits `Auth::OmniauthController#create`, which runs `OAuthForm` to find-or-create the user and oauth provider record, then `login_user!` rotates the session.
- Provider availability is conditional on credentials being present (`GithubConfig`, `GoogleConfig`) — see `config/configs/`.
- Authorize reviewers in controllers via `before_action :authenticate_reviewer!` (admin or `role: "reviewer"`).

### Configuration: Anyway Config

App config classes live in `config/configs/` (`AppConfig`, `GithubConfig`, `GoogleConfig`, `SmtpConfig`, `MailerConfig`, `LitestreamConfig`). Each maps to a YAML file (`config/<name>.yml`) and/or Rails credentials and/or env vars. Use the `*Config.new` / `*Config.configured?` pattern — don't read `Rails.application.credentials` directly in code.

### Deliveries (notifications)

`app/deliveries/` uses the **`active_delivery`** gem. `ProposalDelivery.with(proposal:, speaker:).proposal_submitted.deliver_later` dispatches across multiple channels (mailer + Slack notifier). Mailer: `app/mailers/`; Slack: `ApplicationSlackNotifier`.

### Admin (Avo)

Avo resources in `app/avo/resources/` (proposal, evaluation, review, speaker_profile, user). Actions in `app/avo/actions/`. Avo is mounted at `/admin` and gated to admin users (`config/initializers/avo.rb`).

### Async jobs

Solid Queue. Recurring jobs configured in `config/recurring.yml`. Mission Control UI at `/dev/jobs`.

## Conventions and gotchas

- **Ruby**: Standard Ruby style (via `standard` + `rubocop-rails` + `rubocop-performance`); strict rule: no `binding.pry` left in code. Ruby 3.4+. `freezolite` auto-freezes string literals — no `# frozen_string_literal: true` magic comment needed.
- **Identifiers**: `Proposal#to_param` returns `external_id` (Nanoid, 8 chars). Use `current_user.proposals.find_by!(external_id: params[:id])` (already done in `ProposalsController#set_proposal`) — never `find(params[:id])` for user-facing routes.
- **CFP closed**: Editing a proposal after `cfp.closed?` is blocked unless `proposal.accepted?`. The `cfp_closed` shared Inertia prop reflects the primary CFP only.
- **TypeScript types**: regenerate after touching Ruby serializers; don't hand-edit `app/frontend/serializers/*.ts`.
- **Drafts**: `ProposalForm` skips presence validation when `drafting: true`; the submit transitions `status` from `draft` → `submitted` and stamps `submitted_at`.
- **Lefthook**: pre-commit runs Rubocop on staged Ruby files. If it blocks you, fix the lint or skip-stage individual files — don't pass `--no-verify` without a reason.
- **Database**: SQLite. Backups via Litestream (`config/litestream.yml`); the queue uses a separate SQLite DB (`db/queue_schema.rb`).
