import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { BookingWizard } from '@/pages/booking/BookingWizard'
import { LoginPage } from '@/pages/LoginPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { PricingPage } from '@/pages/PricingPage'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Dashboard } from '@/pages/admin/Dashboard'
import Customers from '@/pages/admin/Customers'
import Schedule from '@/pages/admin/Schedule'
import Subscriptions from '@/pages/admin/Subscriptions'
import Settings from '@/pages/admin/Settings'
import JobQueue from '@/pages/tech/JobQueue'
import Users from '@/pages/admin/Users'
import JobDetails from '@/pages/tech/JobDetails'
import MyBookings from '@/pages/customer/MyBookings'
import { AppLayout } from '@/components/layout/AppLayout'
import Reviews from '@/pages/admin/Reviews'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/booking",
    element: <BookingWizard />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/my-bookings",
    element: (
      <AuthGuard allowedRoles={["customer", "admin"]}>
        <MyBookings />
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: (
      <AuthGuard allowedRoles={["admin"]}>
        <AppLayout container>
          <Dashboard />
        </AppLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/customers",
    element: (
      <AuthGuard allowedRoles={["admin"]}>
        <AppLayout container>
          <Customers />
        </AppLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/users",
    element: (
      <AuthGuard allowedRoles={["admin"]}>
        <AppLayout container>
          <Users />
        </AppLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/schedule",
    element: (
      <AuthGuard allowedRoles={["admin"]}>
        <AppLayout container>
          <Schedule />
        </AppLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/subs",
    element: (
      <AuthGuard allowedRoles={["admin"]}>
        <AppLayout container>
          <Subscriptions />
        </AppLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/settings",
    element: (
      <AuthGuard allowedRoles={["admin"]}>
        <AppLayout container>
          <Settings />
        </AppLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/reviews",
    element: (
      <AuthGuard allowedRoles={["admin"]}>
        <AppLayout container>
          <Reviews />
        </AppLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/tech",
    element: (
      <AuthGuard allowedRoles={["tech"]}>
        <JobQueue />
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/tech/jobs/:id",
    element: (
      <AuthGuard allowedRoles={["tech"]}>
        <JobDetails />
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </QueryClientProvider>
)