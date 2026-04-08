import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { useAuth } from "react-oidc-context"
import { Spinner } from "@/components/ui/spinner.tsx"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertOctagonIcon, CheckCircle2 } from "lucide-react"
import { Navigate } from "react-router"

const CallbackPage = () => {
  const { isAuthenticated, isLoading, error, user } = useAuth()

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Almost done</CardTitle>
        <CardDescription>We are logging you in...</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <Spinner className="mx-auto size-6" />}
        {isAuthenticated && (
          <Alert className="max-w-md">
            <CheckCircle2 />
            <AlertTitle>Hello {user?.profile.name}</AlertTitle>
            <AlertDescription>
              You will be redirected shortly...
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <AlertOctagonIcon />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !isAuthenticated && !error && (
          <Navigate to="/auth/login" />
        )}
      </CardContent>
    </Card>
  )
}

export default CallbackPage
