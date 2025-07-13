import { Header } from './Header';
import { Footer } from './Footer';
import { User } from '../serializers';
import { usePage } from '@inertiajs/react'

interface LayoutProps {
  currentUser: User;
  children: React.ReactNode;
}

export default function Layout({ currentUser, children }: LayoutProps) {
  const { flash } = usePage().props

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative overflow-hidden transition-colors duration-300 font-display">
      <Header currentUser={currentUser} />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {flash.alert && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{flash.alert}</span>
            </div>
          )}
          {flash.notice && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{flash.notice}</span>
            </div>
          )}
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
