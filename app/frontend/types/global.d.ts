import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User } from "../serializers";

type AppPageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  user: User
  oauth_providers: string[]
}

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps, AppPageProps {}
}
