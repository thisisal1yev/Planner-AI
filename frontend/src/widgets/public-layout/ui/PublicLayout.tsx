import { Outlet } from 'react-router'
import { Header } from '../../header/ui/Header'
import { Footer } from '../../footer'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
