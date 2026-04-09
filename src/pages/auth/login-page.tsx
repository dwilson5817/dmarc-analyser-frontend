import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useAuth } from "react-oidc-context"
import { Field } from "@/components/ui/field.tsx"

const LoginPage = () => {
  const { signinRedirect } = useAuth()

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Login to continue</CardTitle>
        <CardDescription>Select an authentication provider</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={() => signinRedirect()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              data-icon="inline-start"
            >
              <path d="m15.734 6.1-.022-.058L13.534.358a.57.57 0 0 0-.563-.356.6.6 0 0 0-.328.122.6.6 0 0 0-.193.294l-1.47 4.499H5.025l-1.47-4.5A.572.572 0 0 0 2.47.358L.289 6.04l-.022.057A4.044 4.044 0 0 0 1.61 10.77l.007.006.02.014 3.318 2.485 1.64 1.242 1 .755a.67.67 0 0 0 .814 0l1-.755 1.64-1.242 3.338-2.5.009-.007a4.05 4.05 0 0 0 1.34-4.668Z" />
            </svg>
            Login with GitLab
          </Button>
        </Field>
      </CardContent>
    </Card>
  )
}

export default LoginPage
