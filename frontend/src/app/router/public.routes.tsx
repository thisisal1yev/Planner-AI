import type { RouteObject } from 'react-router'
import { HomePage } from '@pages/home'
import { EventsListPage } from '@pages/events-list'
import { EventDetailPage } from '@pages/event-detail'
import { VenuesListPage } from '@pages/venues-list'
import { VenueDetailPage } from '@pages/venue-detail'
import { ServicesListPage } from '@pages/services-list'
import { ServiceDetailPage } from '@pages/service-detail'
import { AuthPage } from '@pages/auth'
import { AboutPage } from '@pages/about'
import { BlogPage } from '@pages/blog'
import { PrivacyPage } from '@pages/privacy'
import { TermsPage } from '@pages/terms'

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <AuthPage /> },
  { path: '/register', element: <AuthPage /> },
  { path: '/events', element: <EventsListPage /> },
  { path: '/events/:id', element: <EventDetailPage /> },
  { path: '/venues', element: <VenuesListPage /> },
  { path: '/venues/:id', element: <VenueDetailPage /> },
  { path: '/services', element: <ServicesListPage /> },
  { path: '/services/:id', element: <ServiceDetailPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
]
