import { useQuery } from "@tanstack/react-query"
import { useApiClient } from "@/hooks/use-api-client.ts"

export function useGetRecords(domain: string, reportId: string) {
  const client = useApiClient()
  return useQuery({
    queryKey: ["Records", domain, reportId],
    queryFn: async () => {
      const { data, error } = await client.GET(
        "/domains/{domain}/reports/{report_id}/records",
        { params: { path: { domain, report_id: reportId } } }
      )
      if (error) throw error
      return data
    },
  })
}
