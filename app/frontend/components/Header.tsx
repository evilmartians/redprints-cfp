import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { User } from "../serializers";

interface HeaderProps {
  currentUser: User;
}

export function Header({ currentUser }: HeaderProps) {
  const { url } = usePage();

  return (
    <header className="border-b border-gray-200 dark:border-[#2D3A39] bg-white/50 dark:bg-[#0B1516]/50 backdrop-blur-xs sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {url === "/" ? (
            <div className="flex items-center space-x-2 text-festive-green dark:text-primary transition-colors">
              <span className="hidden sm:inline text-xl font-bold">
                SF Ruby CFP
              </span>
            </div>
          ) : (
            <Link
              href="/"
              className="flex items-center space-x-2 text-festive-green hover:text-green-700 dark:text-primary dark:hover:text-primary-hover transition-colors"
              prefetch
            >
              <span className="hidden sm:inline text-xl font-bold">
                SF Ruby CFP
              </span>
            </Link>
          )}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-3">
              {currentUser && (
                <Link
                  href="/auth/sign_out"
                  method="delete"
                  as="button"
                  className="p-2 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-[#2D3A39] dark:hover:bg-[#3D4A49] group"
                  title="Sign out"
                >
                  Sign out
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
