import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useApiClient } from "@/hooks/use-api-client.ts"
import type { components, paths } from "@/lib/api"

type QueryParams =
  paths["/domains/{domain}/reports"]["get"]["parameters"]["query"]

type ReportsResponse = components["schemas"]["ReportsResponse"]

export function useGetReports(
  domain: string,
  queryParams: QueryParams,
  options?: Pick<UseQueryOptions<ReportsResponse>, "enabled" | "staleTime">
) {
  const client = useApiClient()
  return useQuery({
    queryKey: ["Reports", domain, queryParams],
    queryFn: async () => {
      const { data, error } = await client.GET("/domains/{domain}/reports", {
        params: {
          path: { domain },
          query: queryParams,
        },
      })
      if (error) throw error
      return data
    },
    ...options,
  })
}
