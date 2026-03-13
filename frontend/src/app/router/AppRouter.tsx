import { Routes, Route, Navigate } from 'react-router'
import { useAuthStore } from '@shared/model/auth.store'

// Layouts
import { PublicLayout } from '@widgets/public-layout'
import { AuthLayout } from '@widgets/auth-layout'
import { DashboardLayout } from '@widgets/dashboard-layout'

// Public browsing pages
import { HomePage } from '@pages/home'
import { EventsListPage } from '@pages/events-list'
import { EventDetailPage } from '@pages/event-detail'
import { VenuesListPage } from '@pages/venues-list'
import { VenueDetailPage } from '@pages/venue-detail'
import { ServicesListPage } from '@pages/services-list'
import { ServiceDetailPage } from '@pages/service-detail'

// Auth pages
import { LoginPage } from '@pages/login'
import { RegisterPage } from '@pages/register'

// Participant (public layout + auth)
import { ProfilePage } from '@pages/profile'
import { MyTicketsPage } from '@pages/my-tickets'
import { TicketDetailPage } from '@pages/ticket-detail'

// Organizer (dashboard layout)
import { OrganizerDashboardPage } from '@pages/organizer-dashboard'
import { MyEventsPage } from '@pages/my-events'
import { CreateEventPage } from '@pages/create-event'
import { EditEventPage } from '@pages/edit-event'
import { EventParticipantsPage } from '@pages/event-participants'
import { EventVolunteersPage } from '@pages/event-volunteers'
import { EventServicesPage } from '@pages/event-services'

// Vendor (dashboard layout)
import { MyVenuesPage } from '@pages/my-venues'
import { CreateVenuePage } from '@pages/create-venue'
import { EditVenuePage } from '@pages/edit-venue'
import { MyServicesPage } from '@pages/my-services'
import { CreateServicePage } from '@pages/create-service'
import { EditServicePage } from '@pages/edit-service'

// Admin (dashboard layout)
import { AdminUsersPage } from '@pages/admin-users'

export function AppRouter() {
  const user = useAuthStore((s) => s.user)
  const isAuth = !!useAuthStore((s) => s.accessToken)

  return (
    <Routes>
      {/* ── Auth layout ── */}
      <Route element={isAuth ? <Navigate to="/" replace /> : <AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Public layout (with Header) ── */}
      <Route element={<PublicLayout />}>
        {/* Browsing */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/venues" element={<VenuesListPage />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />
        <Route path="/services" element={<ServicesListPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />

        {/* Participant (requires auth) */}
        <Route path="/profile" element={isAuth ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="/tickets" element={isAuth ? <MyTicketsPage /> : <Navigate to="/login" replace />} />
        <Route path="/tickets/:id" element={isAuth ? <TicketDetailPage /> : <Navigate to="/login" replace />} />
      </Route>

      {/* ── Dashboard layout ── */}
      <Route element={isAuth ? <DashboardLayout /> : <Navigate to="/login" replace />}>
        {/* Organizer */}
        <Route path="/dashboard" element={user?.role === 'ORGANIZER' ? <OrganizerDashboardPage /> : <Navigate to="/" replace />} />
        <Route path="/my-events" element={user?.role === 'ORGANIZER' ? <MyEventsPage /> : <Navigate to="/" replace />} />
        <Route path="/my-events/create" element={user?.role === 'ORGANIZER' ? <CreateEventPage /> : <Navigate to="/" replace />} />
        <Route path="/my-events/:id/edit" element={user?.role === 'ORGANIZER' ? <EditEventPage /> : <Navigate to="/" replace />} />
        <Route path="/my-events/:id/participants" element={user?.role === 'ORGANIZER' ? <EventParticipantsPage /> : <Navigate to="/" replace />} />
        <Route path="/my-events/:id/volunteers" element={user?.role === 'ORGANIZER' ? <EventVolunteersPage /> : <Navigate to="/" replace />} />
        <Route path="/my-events/:id/services" element={user?.role === 'ORGANIZER' ? <EventServicesPage /> : <Navigate to="/" replace />} />

        {/* Vendor */}
        <Route path="/my-venues" element={user?.role === 'VENDOR' ? <MyVenuesPage /> : <Navigate to="/" replace />} />
        <Route path="/my-venues/create" element={user?.role === 'VENDOR' ? <CreateVenuePage /> : <Navigate to="/" replace />} />
        <Route path="/my-venues/:id/edit" element={user?.role === 'VENDOR' ? <EditVenuePage /> : <Navigate to="/" replace />} />
        <Route path="/my-services" element={user?.role === 'VENDOR' ? <MyServicesPage /> : <Navigate to="/" replace />} />
        <Route path="/my-services/create" element={user?.role === 'VENDOR' ? <CreateServicePage /> : <Navigate to="/" replace />} />
        <Route path="/my-services/:id/edit" element={user?.role === 'VENDOR' ? <EditServicePage /> : <Navigate to="/" replace />} />

        {/* Admin */}
        <Route path="/admin/users" element={user?.role === 'ADMIN' ? <AdminUsersPage /> : <Navigate to="/" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
