import { Outlet } from 'react-router'
import { Header } from '../../header/ui/Header'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
