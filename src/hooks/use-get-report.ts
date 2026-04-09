import { useQuery } from "@tanstack/react-query"
import { useApiClient } from "@/hooks/use-api-client.ts"

export function useGetReport(domain: string, reportId: string) {
  const client = useApiClient()
  return useQuery({
    queryKey: ["Report", domain, reportId],
    queryFn: async () => {
      const { data, error } = await client.GET(
        "/domains/{domain}/reports/{report_id}",
        { params: { path: { domain, report_id: reportId } } }
      )
      if (error) throw error
      return data
    },
  })
}
