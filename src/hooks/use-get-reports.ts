import { useQuery } from "@tanstack/react-query"
import { useAuth } from "react-oidc-context"

export const useGetReports = (domain: string, limit?: number) => {
  const auth = useAuth()

  return useQuery({
    queryKey: ["Reports", domain, limit],
    queryFn: async () => {
      const url = new URL(
        `https://2lfdv4gtw0.execute-api.eu-west-1.amazonaws.com/prod/domains/${domain}/reports`
      )
      if (limit != null) url.searchParams.set("limit", String(limit))

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      })

      return res.json()
    },
  })
}
