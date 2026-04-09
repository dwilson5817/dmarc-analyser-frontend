import { useQuery } from "@tanstack/react-query"
import { useAuth } from "react-oidc-context"

export const useGetReport = (domain: string, reportId: string) => {
  const auth = useAuth()

  return useQuery({
    queryKey: ["Report", domain, reportId],
    queryFn: async () => {
      const res = await fetch(
        `https://2lfdv4gtw0.execute-api.eu-west-1.amazonaws.com/prod/domains/${domain}/reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
          },
        }
      )
      return res.json()
    },
  })
}
