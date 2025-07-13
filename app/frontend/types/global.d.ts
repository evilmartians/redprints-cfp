import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User } from "../serializers";

type AppPageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  user: User
  flash: Record<'alert' | 'notice', string?>
  cfp_closed: boolean
  startup_cfp_closed: boolean
}

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps, AppPageProps {}
}
