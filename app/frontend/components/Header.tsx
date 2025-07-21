import { Link, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { Menu, X } from 'lucide-react';
import { User } from "../serializers";
import { useState } from "react";

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
    <header className="bg-cloud-50 border-b border-primary-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {url === "/" ? (
              <img src="/sfruby.png" className="h-6" />
            ) : (
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-85"
                prefetch
              >
                <img src="/sfruby.png" className="h-6" />
              </Link>
            )}
          </div>

          {currentUser && (
            <div className="sm:hidden print:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
            <nav className="hidden sm:flex items-center space-x-4 justify-end print:hidden">
              {!cfp_closed &&
                <Link
                  href="/proposals/new"
                  className={`text-sm font-medium transition-colors ${
                    url === '/proposals/new'
                      ? "text-secondary-800 border-b border-secondary-800"
                      : "text-primary hover:text-primary-300"
                  }`}
                >
                  Submit proposal
                </Link>
              }

              <Link
                href="/proposals"
                className={`text-sm font-medium transition-colors ${
                  url === '/proposals'
                    ? "text-secondary-800 border-b border-secondary-800"
                    : "text-primary hover:text-primary-300"
                }`}
              >
                My proposals
              </Link>
              {currentUser.is_reviewer && (
                <Link
                  href="/evaluations"
                  className="btn btn-primary py-1 px-2 text-sm"
                  title="Review"
                >
                  Review
                </Link>
              )}
              <Link
                href="/auth/sign_out"
                method="delete"
                as="button"
                className="text-sm font-medium transition-colors text-cloud-800 hover:text-cloud-700 cursor-pointer"
                title="Sign out"
              >
                Sign out
              </Link>
            </nav>
          )}
        </div>
        {currentUser && (
          <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-secondary-800">
              <Link
                href="/"
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium`}
              >
                Home
              </Link>
              {!cfp_closed &&
                <Link
                  href="/proposals/new"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium`}
                >
                  Submit Proposal
                </Link>
              }
              {currentUser.is_reviewer && (
                <Link
                  href="/evaluations"
                  className="btn btn-primary py-1 px-2 text-sm"
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
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium`}
              >
                My Proposals
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
};
