import { Header } from './Header';
import { Footer } from './Footer';
import { User } from '../serializers';

interface LayoutProps {
  currentUser: User;
  children: React.ReactNode;
}

export default function Layout({ currentUser, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative overflow-hidden transition-colors duration-300 font-display">
      <Header currentUser={currentUser} />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
