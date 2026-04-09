import { useGetReports } from "@/hooks/use-get-reports.ts"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Button } from "@/components/ui/button.tsx"
import { TableCell, TableRow } from "@/components/ui/table.tsx"
import { ArrowRight, Globe } from "lucide-react"
import { Link } from "react-router"

type Policy = "reject" | "quarantine" | "none"

const POLICY_STYLES: Record<Policy, { label: string; className: string }> = {
  reject: {
    label: "Reject",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  quarantine: {
    label: "Quarantine",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  none: {
    label: "None",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
}

function PolicyBadge({ policy }: { policy: string }) {
  const style = POLICY_STYLES[policy as Policy] ?? {
    label: policy,
    className: "bg-muted text-muted-foreground",
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  )
}

function getRelativeDays(timestamp: number) {
  const diffDays = Math.floor((Date.now() - timestamp) / 86_400_000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays > 0) return `${diffDays}d ago`
  return `In ${Math.abs(diffDays)}d`
}

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
