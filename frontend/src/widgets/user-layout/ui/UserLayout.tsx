import { Outlet } from 'react-router'
import { Header } from '@widgets/header'
import { FeedbackButton } from '@widgets/feedback-button'

export function UserLayout() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-360 flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <FeedbackButton />
    </div>
  )
}
