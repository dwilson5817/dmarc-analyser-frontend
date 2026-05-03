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
import { ArrowRight } from "lucide-react"

const LoginPage = () => {
  const { signinRedirect } = useAuth()

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Authentication required</CardTitle>
        <CardDescription>Please login to access DMARC Analyzer</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={() => signinRedirect()}
          >
            Continue to login
            <ArrowRight />
          </Button>
        </Field>
      </CardContent>
    </Card>
  )
}

export default LoginPage
