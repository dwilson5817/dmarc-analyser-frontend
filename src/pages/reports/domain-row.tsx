import { useGetReports } from "@/hooks/use-get-reports.ts"
import { getRelativeDays } from "@/lib/format.ts"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Button } from "@/components/ui/button.tsx"
import { TableCell, TableRow } from "@/components/ui/table.tsx"
import { ArrowRight, Globe } from "lucide-react"
import { Link } from "react-router"
import { PolicyBadge } from "@/components/policy-badge.tsx"

const DomainRow = ({ domain }: { domain: string | null }) => {
  const { data, isLoading } = useGetReports(domain ?? "", 1)

  const latestReport = data?.items?.[0]
  const loading = domain === null || isLoading

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <span className="font-medium">{domain}</span>
          )}
        </div>
      </TableCell>

      <TableCell>
        {loading ? (
          <Skeleton className="h-5 w-20 rounded-full" />
        ) : latestReport ? (
          <PolicyBadge policy={latestReport.policy} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : latestReport ? (
          latestReport.org_name
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {loading ? (
          <Skeleton className="h-4 w-12" />
        ) : latestReport ? (
          `${latestReport.pct}%`
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {loading ? (
          <Skeleton className="h-4 w-16" />
        ) : latestReport ? (
          getRelativeDays(latestReport.begin_date * 1000)
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="text-right">
        {loading ? (
          <Skeleton className="ml-auto h-8 w-8 rounded-md" />
        ) : (
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/reports/${domain}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default DomainRow
