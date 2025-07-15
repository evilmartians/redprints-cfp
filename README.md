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

In development, use a corresponding record from `db/seeds.rb` or log in via Google or GitHub. If you need admin access, use `admin: true`, or login as a developer using the following email: `karl@sfruby.com`.

## Admin console

You can access our [Avo](https://avohq.io) admin console at: [localhost:3000/admin](http://localhost:3000/admin).

**NOTE:** You must have `admin: true` in your user record to access the admin console. Feel free to update it from the Rails console.

## Lookbook

We use [Lookbook](https://lookbook.build) to work with UI (development, previews). All the code related to previews is stored under the `lookbook/` fodler. The lookbook itself is available at: [localhost:3000/dev/lookbook](http://localhost:3000/dev/lookbook).

## Working with emails

We use [letter_opener_web](https://github.com/fgrehm/letter_opener_web) to delivery and view emails in development. You can access the inbox at [localhost:3000/dev/letters](http://localhost:3000/dev/letters).

## Styling

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

### Admin

Go to `config/initializers/avo.rb` and update the corresponding configuration. See [Avo docs](https://docs.avohq.io/3.0/branding.html).
