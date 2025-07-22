# CFP for all

This is a CFP management app for conferences built with Ruby on Rails, Inertia.js and React.

> Built for [SF Ruby Conference](https://sfruby.com), open to everyone!

## Requirements

- Ruby 3.4+

## Development

### Installation

Install dependencies:

```sh
bin/setup
```

Run a web server along with the Vite dev server:

```sh
bin/dev
```

Go to [localhost:3000](http://localhost:3000) and check it out!

### Running tests

We use RSpec to write tests. You can run them with:

```sh
bundle exec rspec
```

Note that system tests are excluded by default. You can run them as follows:

```sh
bundle exec rspec spec/system
# or
bundle exec rspec --tag type:system
```

### Logging in

In development, use a corresponding record from `db/seeds.rb` or log in via Google or GitHub. If you need admin access, use `admin: true`, or login as a developer using the following email: `karl@sfruby.com`.

### Admin console

You can access our [Avo](https://avohq.io) admin console at: [localhost:3000/admin](http://localhost:3000/admin).

**NOTE:** You must have `admin: true` in your user record to access the admin console. Feel free to update it from the Rails console.

### Lookbook

We use [Lookbook](https://lookbook.build) to work with UI (development, previews). All the code related to previews is stored under the `lookbook/` fodler. The lookbook itself is available at: [localhost:3000/dev/lookbook](http://localhost:3000/dev/lookbook).

### Working with emails

We use [letter_opener_web](https://github.com/fgrehm/letter_opener_web) to delivery and view emails in development. You can access the inbox at [localhost:3000/dev/letters](http://localhost:3000/dev/letters).

## Setting up

> Check out a demo PR that shows which changes required to create an SF Ruby CFP app from this template: TBD

### Authentication

We use OAuth via [omniauth](https://github.com/omniauth/omniauth) to authenticate users. By default, GitHub and Google plugins are added and activated if the corresponding credentials are configured.

For GitHub, see the [omniauth-github](https://github.com/omniauth/omniauth-github) documentation. Put the credenetials in the Rails credentials file as follows:

```yml
github:
  oauth_key: <key>
  oauth_secret: <secret>
```

For Google, see the [omniauth-google-oauth2](https://github.com/zquestz/omniauth-google-oauth2) documentation. Put the credenetials in the Rails credentials file as follows:

```yml
google:
  client_id: <client-id>
  client_secret: <secret>
```

If you omit credentials for any of the default providers, they won't be activated (and available to users). Thus, it's not necessary to configure both.

In development and tests, the "Sign in as developer" option is available.

### Mailers / SMTP

The default SMTP configuration for mailers is stored in the `config/smtp.yml` file (we use Mandrill by default). SMTP authentication credentials must be stored in the Rails credentials file as follows:

```yml
smtp:
  username: <username>
  password: <password>
```

Default mailer parameters (From, Reply-To) are defined in the `config/mailer.yml` file.

### Slack Notifications

You can configure Slack notifications to notify about proposal submissions. For that, add a webhook URL to the credentials as follows:

```yml
app:
  slack_notifications_url: https://hooks.slack.com/services/...
```

### Database backups / Litestream

We use SQLite3 as a database and provide the [Litestream](https://litestream.io/) configuration for creating backups. All you need is to provide your S3 bucket access information in the credentials:

```yml
litestream_rails:
  bucket: <bucket-name>
  access_key_id: <access-key-id>
  secret_access_key: <secret-access-key>
```

> [!TIP]
> We use [Anyway Config](https://github.com/palkan/anyway_config) for configuration management, so you can also use env variables for providing secrets, not necessary Rails credentials.

## CFP(-s) Configuration

This app is meant to be used for a single event and by default has a signle ("primary") CFP configured in a YAML file (`config/data/cfps.yml`):

```yml
- id: primary
  tracks:
    general: "General"
    oss: "Open Source Tooling"
    scale: "Scaling with Ruby and Rails"
  deadline:  "2026-06-14T00:00:00-07:00"
```

**NOTE:** Tracks must also be specified in the `Proposal` model (we use Rails enum feature there).

### Multiple forms / submission flows

The apps supports handling different submission types (i.e., different forms). For example, if you want to have a separate form for workshops and lightning talks (with different verbiage), you can add another CFP configuration:

```yml
- id: primary
  # ...
- id: workshops
  tracks:
    workshop: ""
  deadline:  "2026-06-14T00:00:00-07:00"
  field_names:
    header: "Submit Your Workshop"
- id: lts
  tracks:
    lt: ""
  deadline:  "2026-10-14T00:00:00-07:00"
  field_names:
    header: "Submit Your Lightning Talk"
    description: >
      Share your quick insights and lightning-fast ideas with the Ruby community!
    talk_header: "Lightning Talk Information"
    title: "Title"
    title_description: ""
    abstract: "What will you talk about?"
    abstract_description: "Give us a brief overview of your lightning talk topic"
    details: "Talk Details"
    details_description: "Tell us more about what you'll cover in your 5-minute presentation. What key points will you share with the audience?"
    details_notice: "Remember, lightning talks are typically 5 minutes long with no Q&A."
    pitch: "Why is this relevant to the Ruby community?"
    pitch_description: ""
```

The `field_names` mapping allows you to customize the form field labels.

## Evaluation Configuration

The review process is managed by the Evaluation object. There can be multiple evaulations (distinct by tracks or reviewers).

You can create a new evaluation in Avo. Here are some settings explained:

- `tracks`: you can select the tracks to only include submitted proposals matching these tracks. This way, for example, you can configure different reviewers for different tracks.

- `criteria`: list of the evaulation criteria (any words), e.g., "Novelty", "Relevance", etc. These will translate into "stars" inputs in the review form.

- `blind`: whether the review process is blind or not (showing speaker details or not).

- `personal`: personal evaulations do not update the proposal scores; you can use them as _readonly evaluations_ (e.g., if you want to share the proposals with non-reviewers).

- `deadline`: defines the final date when reviews could be submitted by the reviewers (and the final results become available to them).

After creating the evaulation configuration, add reviewers (users with the role "reviewer") and trigger the "Invalidate" action (all in Avo)—that would populate pending reviews for the reviewers. You MUST trigger invalidate every time you add a reviewer or a proposal to review (the action is assumed to be idempotent).

### Proposals Distribution

The default proposals distribution among reviewers logic is "everyone must review everything". You can tweak it by updating the `Evaluation::Distribution` model (`app/models/evaluation/distribution.rb`).

## Styling / UI

### CSS

Go to `app/frontend/styles/theme.css` to change the colors and the default font family. For example, SF Ruby CFP app configuration is as follows:

```css
@theme {
  --font-display: 'Martian Grotesk', 'sans-serif';

  /* https://oklch.com/#0.65,0.25,25,100 */
  --clr-primary-chroma: 0.25;
  --clr-primary-hue: 25;

  /* https://oklch.com/#0.65,0.17,250,100 */
  --clr-secondary-chroma: 0.17;
  --clr-secondary-hue: 250;
}
```

### Logo

Add your logo by updating the `frontend/components/Logo.tsx` component. That's it!

### Views / Mailers

You may want to add your conference name and various links to some Inertia pages and components as well as mailer templates—just do that! The React UI is not meant to be magically configurabale, tune it up to your needs (but prefer to stick to the page props, so you don't need to touch backend).

### Admin

Go to `config/initializers/avo.rb` and update the corresponding configuration. See [Avo docs](https://docs.avohq.io/3.0/branding.html).

## Deployment

There is a production Dockerfile and an example [Fly.io](https://fly.io) configuration is included in the template. Change the `app` value in the `fly.toml` file (and, optionally, the `primary_region`) and run the `fly deploy` command to bring your app to live!
