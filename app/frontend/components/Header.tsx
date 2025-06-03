import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { User } from "../serializers";

interface HeaderProps {
  currentUser: User;
}

export function Header({ currentUser }: HeaderProps) {
  const { url } = usePage();

  return (
    <header className="bg-cloud-50 border-b border-ruby-200 sticky top-0 z-10">
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
            <nav className="flex items-center space-x-6">
              <Link
                href="/proposals/new"
                className={`text-sm font-medium transition-colors text-ruby hover:text-ruby-300`}
              >
                Submit proposal
              </Link>

              <Link
                href="/proposals"
                className={`text-sm font-medium transition-colors ${
                  url === '/proposals'
                    ? "text-sky-800 border-b border-sky-800"
                    : "text-ruby hover:text-ruby-300"
                }`}
              >
                My proposals
              </Link>
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
      </div>
    </header>
  )
};
