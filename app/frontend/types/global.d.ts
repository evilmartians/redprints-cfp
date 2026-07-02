import type { PageProps as InertiaPageProps } from "@inertiajs/core";

import type { CFP, User } from "@/serializers";

type AppPageProps<T extends Record<string, unknown> = Record<string, unknown>> =
  T & {
    user: User;
    flash: Record<"alert" | "notice", string?>;
    primary_cfp: CFP;
  };

declare module "@inertiajs/core" {
  interface PageProps extends InertiaPageProps, AppPageProps {}
}
