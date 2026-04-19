import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
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
import { Dashboard } from '@/pages/admin/Dashboard'
import Customers from '@/pages/admin/Customers'
import { AppLayout } from '@/components/layout/AppLayout'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/booking",
    element: <BookingWizard />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: (
      <AppLayout container>
        <Dashboard />
      </AppLayout>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/customers",
    element: (
      <AppLayout>
        <Customers />
      </AppLayout>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/schedule",
    element: (
      <AppLayout container>
        <div className="p-8">Schedule View (Coming Soon)</div>
      </AppLayout>
    ),
    errorElement: <RouteErrorBoundary />,
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)