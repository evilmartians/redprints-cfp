import { createInertiaApp } from "@inertiajs/react";
import type { ReactNode } from "react";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

interface ResolvedComponent {
  default: ReactNode;
  layout?: (page: ReactNode) => ReactNode;
}

void createInertiaApp({
  // Set default page title
  // see https://inertia-rails.netlify.app/guide/title-and-meta
  //
  // FIXME: Replace with your application's title
  title: (title) => (title ? `${title}, CFP App` : "CFP App"),

  // Disable progress bar
  //
  // see https://inertia-rails.netlify.app/guide/progress-indicators
  // progress: false,

  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", {
      eager: true,
    });
    const page = pages[`../pages/${name}.tsx`];

    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }

    // To use a default layout, import the Layout component
    // and use the following lines.
    // see https://inertia-rails.netlify.app/guide/pages#default-layouts
    //
    // page.default.layout ||= (page) => createElement(Layout, null, page)

    return page;
  },

  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(createElement(App, props));
  },
});
