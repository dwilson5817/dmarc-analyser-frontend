import { useAuth } from "react-oidc-context"
import { Spinner } from "@/components/ui/spinner.tsx"
import { Navigate, Outlet } from "react-router"

const PublicRoute = () => {
  const auth = useAuth()

  if (auth.isLoading) return <Spinner />
  if (auth.isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}

export default PublicRoute
