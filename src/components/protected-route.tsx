import { useAuth } from "react-oidc-context"
import { Spinner } from "@/components/ui/spinner.tsx"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
  const auth = useAuth()

  if (auth.isLoading) return <Spinner />
  if (!auth.isAuthenticated) return <Navigate to="/auth/login" replace />

  return <Outlet />
}

export default ProtectedRoute
