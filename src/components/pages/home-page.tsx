import { useQuery } from "@tanstack/react-query"
import { useAuth } from "react-oidc-context"
import { Spinner } from "@/components/ui/spinner.tsx"

const HomePage = () => {
  const auth = useAuth()

  const callPing = async () => {
    const res = await fetch(
      "https://2lfdv4gtw0.execute-api.eu-west-1.amazonaws.com/prod/ping",
      {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      }
    )

    return res.json()
  }

  const { isLoading, isError, error, isSuccess, data } = useQuery({
    queryKey: ["ping"],
    queryFn: callPing,
  })

  return (
    <p>
      {isLoading && <Spinner />}
      {isError && <p>{error.message}</p>}
      {isSuccess && <p>{data.message}</p>}
    </p>
  )
}

export default HomePage
