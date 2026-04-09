import { useQuery } from "@tanstack/react-query"
import { useApiClient } from "@/hooks/use-api-client.ts"

export function useGetReports(domain: string, limit?: number) {
  const client = useApiClient()
  return useQuery({
    queryKey: ["Reports", domain, limit],
    queryFn: async () => {
      const { data, error } = await client.GET("/domains/{domain}/reports", {
        params: {
          path: { domain },
          query: { limit },
        },
      })
      if (error) throw error
      return data
    },
  })
}
