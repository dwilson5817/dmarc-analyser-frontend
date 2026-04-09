import { AuthProvider } from "react-oidc-context"
import { ThemeProvider } from "./components/theme-provider"
import { TooltipProvider } from "./components/ui/tooltip"
import { createBrowserRouter, RouterProvider } from "react-router"
import ProtectedRoute from "./components/protected-route"
import { AppLayout } from "./components/layouts/app-layout"
import HomePage from "./pages/home-page"
import PublicRoute from "./components/public-route"
import AuthLayout from "./components/layouts/auth-layout"
import CallbackPage from "./pages/callback-page"
import LoginPage from "./pages/login-page"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ReportsPage from "@/pages/reports-page.tsx"
import ReportPage from "@/pages/report-page.tsx"
import DomainsPage from "@/pages/domains-page.tsx"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        handle: {
          crumb: () => ({ label: "Home", to: "/" }),
        },
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "reports",
            handle: {
              crumb: () => ({ label: "Reports", to: "/reports" }),
            },
            children: [
              { index: true, element: <DomainsPage /> },
              {
                path: ":domain",
                handle: {
                  crumb: (match: { params: { domain: string } }) => ({
                    label: match.params.domain,
                    to: `/reports/${match.params.domain}`,
                  }),
                },
                children: [
                  { index: true, element: <ReportsPage /> },
                  {
                    path: ":report",
                    element: <ReportPage />,
                    handle: {
                      crumb: (match: {
                        params: { domain: string; report: string }
                      }) => ({
                        label: match.params.report,
                        to: `/reports/${match.params.domain}/${match.params.report}`,
                      }),
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "callback", element: <CallbackPage /> },
        ],
      },
    ],
  },
])

export function App() {
  return (
    <AuthProvider
      authority={import.meta.env.VITE_AUTH_AUTHORITY}
      client_id={import.meta.env.VITE_AUTH_CLIENT_ID}
      redirect_uri={window.location.origin + "/auth/callback"}
      scope="openid profile email"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
