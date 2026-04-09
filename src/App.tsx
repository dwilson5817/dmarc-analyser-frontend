import { AuthProvider } from "react-oidc-context"
import { ThemeProvider } from "./components/theme-provider"
import { TooltipProvider } from "./components/ui/tooltip"
import { BrowserRouter, Route, Routes } from "react-router"
import ProtectedRoute from "./components/protected-route"
import { AppLayout } from "./components/layouts/app-layout"
import HomePage from "./pages/home-page"
import PublicRoute from "./components/public-route"
import AuthLayout from "./components/layouts/auth-layout"
import CallbackPage from "./pages/callback-page"
import LoginPage from "./pages/login-page"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

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
            <BrowserRouter>
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                  </Route>
                </Route>

                <Route element={<PublicRoute />}>
                  <Route path="auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="callback" element={<CallbackPage />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
