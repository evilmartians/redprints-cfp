import { Header } from './Header';
import { User } from '../serializers';

interface LayoutProps {
  currentUser: User;
  children: React.ReactNode;
}

export default function Layout({ currentUser, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1516] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      <Header currentUser={currentUser} />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
