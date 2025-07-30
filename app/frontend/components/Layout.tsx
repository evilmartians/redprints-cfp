import { usePage } from "@inertiajs/react";

import type { User } from "@/serializers";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  currentUser: User;
  children: React.ReactNode;
}

export default function Layout({ currentUser, children }: LayoutProps) {
  const { flash } = usePage().props;

  return (
    <div className="font-display relative flex min-h-screen flex-col overflow-hidden bg-white text-gray-900 transition-colors duration-300">
      <Header currentUser={currentUser} />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 print:w-full print:!px-2">
          {flash.alert && (
            <div
              className="relative mb-2 rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <span className="block sm:inline">{flash.alert}</span>
            </div>
          )}
          {flash.notice && (
            <div
              className="relative mb-2 rounded-md border border-green-400 bg-green-100 px-4 py-3 text-green-700"
              role="alert"
            >
              <span className="block sm:inline">{flash.notice}</span>
            </div>
          )}
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
