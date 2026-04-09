import { useQuery } from "@tanstack/react-query"
import { useApiClient } from "@/hooks/use-api-client.ts"

export function useGetDomains() {
  const client = useApiClient()
  return useQuery({
    queryKey: ["Domains"],
    queryFn: async () => {
      const { data, error } = await client.GET("/domains")
      if (error) throw error
      return data
    },
  })
}
