# SF Ruby CFP app

This is a CFP management app for SF Ruby conference.

## Requirements

- Ruby 3.4+

## Running locally

Install dependencies:

```sh
bin/setup
```

Run a web server along with the Vite dev server:

```sh
bin/dev
```

Go to [localhost:3000](http://localhost:3000) and check it out!

## Running tests

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

## Logging in

In development, use a corresponding record from `db/seeds.rb`. If you need admin access, use `admin: true`.

To log in, the email must end with `@evilmartians.com`.

## Admin console

You can access our [Avo](https://avohq.io) admin console at: [localhost:3000/avo](http://localhost:3000/avo).

**NOTE:** You must have `admin: true` in your user record to access the admin console. Feel free to update it from the Rails console.

## Lookbook

We use [Lookbook](https://lookbook.build) to work with UI (development, previews). All the code related to previews is stored under the `lookbook/` fodler. The lookbook itself is available at: [localhost:3000/dev/lookbook](http://localhost:3000/dev/lookbook).

## Working with emails

We use [letter_opener_web](https://github.com/fgrehm/letter_opener_web) to delivery and view emails in development. You can access the inbox at [localhost:3000/dev/letters](http://localhost:3000/dev/letters).
