import { useParams, Link } from "react-router"
import { useGetReports } from "@/hooks/use-get-reports.ts"
import { DataTable } from "@/components/data-table.tsx"
import { DataTablePagination } from "@/components/data-table-pagination.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowRight, FileText, CalendarDays, ShieldCheck } from "lucide-react"

type Report = {
  report_id: string
  org_name: string
  org_email: string
  begin_date: number
  end_date: number
  policy: "reject" | "quarantine" | "none"
  adkim: "r" | "s"
  aspf: "r" | "s"
  subdomain_policy: "reject" | "quarantine" | "none" | null
  pct: number
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp * 1000))
}

function timeAgo(timestamp: number) {
  const seconds = Math.floor(Date.now() / 1000) - timestamp
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1)
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`
  }
  return "just now"
}

function PolicyBadge({ policy }: { policy: string }) {
  const styles: Record<string, string> = {
    reject:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    quarantine:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    none: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[policy] ?? ""}`}
    >
      {policy}
    </span>
  )
}

function StatCard({
  label,
  value,
  icon,
  loading,
}: {
  label: string
  value: React.ReactNode
  icon: React.ReactNode
  loading: boolean
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

const columns = (domain: string): ColumnDef<Report>[] => [
  {
    header: "Period",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {formatDate(row.original.begin_date)}
        </span>
        <span className="text-xs text-muted-foreground">
          {timeAgo(row.original.begin_date)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "org_name",
    header: "Reporting org",
  },
  {
    accessorKey: "policy",
    header: "Policy",
    cell: ({ row }) => <PolicyBadge policy={row.original.policy} />,
  },
  {
    accessorKey: "pct",
    header: "Coverage",
    cell: ({ row }) => `${row.original.pct}%`,
  },
  {
    header: "DKIM / SPF",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.adkim === "s" ? "Strict" : "Relaxed"} /{" "}
        {row.original.aspf === "s" ? "Strict" : "Relaxed"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/reports/${domain}/${row.original.report_id}`}>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
]

const ReportsPage = () => {
  const { domain = "" } = useParams()
  const { data, isLoading } = useGetReports(domain)

  const reports: Report[] = data?.items ?? []
  const latest = reports[0]

  const table = useReactTable({
    data: reports,
    columns: columns(domain),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Reports loaded"
          value={reports.length}
          icon={<FileText className="h-4 w-4" />}
          loading={isLoading}
        />
        <StatCard
          label="Latest report"
          value={latest ? formatDate(latest.begin_date) : "—"}
          icon={<CalendarDays className="h-4 w-4" />}
          loading={isLoading}
        />
        <StatCard
          label="Current policy"
          value={latest ? <PolicyBadge policy={latest.policy} /> : "—"}
          icon={<ShieldCheck className="h-4 w-4" />}
          loading={isLoading}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium">Reports</h2>
        <DataTable table={table} />
        {table.getPageCount() > 1 && <DataTablePagination table={table} />}
      </div>
    </div>
  )
}

export default ReportsPage
