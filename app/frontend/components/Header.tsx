import { Link, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import type { User } from "../serializers";

import { Logo } from "./Logo";

interface HeaderProps {
  currentUser: User;
}

export function Header({ currentUser }: HeaderProps) {
  const { url } = usePage();
  const { cfp_closed } = usePage().props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-cloud-50 border-primary-200 sticky top-0 z-10 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {url === "/" ? (
              <Logo />
            ) : (
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-85"
                prefetch
              >
                <Logo />
              </Link>
            )}
          </div>

          {currentUser && (
            <div className="sm:hidden print:hidden">
              <button
                onClick={toggleMenu}
                className="hover:text-primary-700 focus:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:ring-2 focus:outline-none focus:ring-inset"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          )}

          {currentUser && (
            <nav className="hidden items-center justify-end space-x-4 sm:flex print:hidden">
              {!cfp_closed && (
                <Link
                  href="/proposals/new"
                  className={`text-sm font-medium transition-colors ${
                    url === "/proposals/new"
                      ? "text-secondary-800 border-secondary-800 border-b"
                      : "text-primary hover:text-primary-300"
                  }`}
                >
                  Submit proposal
                </Link>
              )}

              <Link
                href="/proposals"
                className={`text-sm font-medium transition-colors ${
                  url === "/proposals"
                    ? "text-secondary-800 border-secondary-800 border-b"
                    : "text-primary hover:text-primary-300"
                }`}
              >
                My proposals
              </Link>
              {currentUser.is_reviewer && (
                <Link
                  href="/evaluations"
                  className="btn btn-primary px-2 py-1 text-sm"
                  title="Review"
                >
                  Review
                </Link>
              )}
              <Link
                href="/auth/sign_out"
                method="delete"
                onClick={() => router.clearHistory()}
                as="button"
                className="text-cloud-800 hover:text-cloud-700 cursor-pointer text-sm font-medium transition-colors"
                title="Sign out"
              >
                Sign out
              </Link>
            </nav>
          )}
        </div>
        {currentUser && (
          <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
            <div className="border-secondary-800 space-y-1 border-b bg-white px-2 pt-2 pb-3">
              <Link
                href="/"
                className={`block w-full rounded-md px-3 py-2 text-left text-base font-medium`}
              >
                Home
              </Link>
              {!cfp_closed && (
                <Link
                  href="/proposals/new"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-2 text-left text-base font-medium`}
                >
                  Submit Proposal
                </Link>
              )}
              {currentUser.is_reviewer && (
                <Link
                  href="/evaluations"
                  className="btn btn-primary px-2 py-1 text-sm"
                  title="Review"
                >
                  Review
                </Link>
              )}
              <Link
                href="/proposals"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`block w-full rounded-md px-3 py-2 text-left text-base font-medium`}
              >
                My Proposals
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
