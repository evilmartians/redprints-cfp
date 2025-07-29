import { GithubIcon } from "lucide-react";
import type { JSX } from "react";

import GoogleIcon from "../icons/Google";

export const OAuthButtons: Record<string, () => JSX.Element | null> = {
  github: () => {
    return (
      <a
        href="/auth/github"
        className="btn btn-outline flex items-center justify-center bg-[#24292F] text-white hover:bg-[#24292F]/90"
      >
        <GithubIcon className="mr-2 h-5 w-5" />
        Sign in with GitHub
      </a>
    );
  },
  developer: () => {
    return (
      <a
        href="/auth/developer"
        className="btn btn-outline flex items-center justify-center"
      >
        Sign in as developer
      </a>
    );
  },
  google_oauth2: () => {
    return (
      <a
        href="/auth/google_oauth2"
        className="btn btn-outline flex items-center justify-center"
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Sign in with Google
      </a>
    );
  },
};
