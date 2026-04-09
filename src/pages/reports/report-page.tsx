import { useParams } from "react-router"
import { useGetRecords } from "@/hooks/use-get-records.ts"
import { useGetReport } from "@/hooks/use-get-report.ts"
import { DataTable } from "@/components/data-table.tsx"
import { DataTablePagination } from "@/components/data-table-pagination.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { PolicyBadge } from "@/components/policy-badge.tsx"
import { StatCard } from "@/components/stat-card.tsx"
import { formatDate } from "@/lib/format.ts"
import type { components } from "@/lib/api.d.ts"
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2,
  XCircle,
  Mail,
  Server,
  ShieldCheck,
  ShieldX,
} from "lucide-react"

type DMARCRecord = components["schemas"]["Record"]

function alignmentLabel(mode: string) {
  return mode === "s" ? "Strict" : "Relaxed"
}

function PassBadge({ pass }: { pass: boolean }) {
  return pass ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
      <CheckCircle2 className="h-3 w-3" /> Pass
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
      <XCircle className="h-3 w-3" /> Fail
    </span>
  )
}

function DispositionBadge({ disposition }: { disposition: string }) {
  const styles: Record<string, string> = {
    none: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    quarantine:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    reject: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[disposition] ?? styles.none}`}
    >
      {disposition}
    </span>
  )
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

const columns: ColumnDef<DMARCRecord>[] = [
  {
    accessorKey: "source_ip",
    header: "Source IP",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.source_ip}</span>
    ),
  },
  {
    accessorKey: "count",
    header: "Messages",
  },
  {
    id: "result",
    header: "DMARC",
    cell: ({ row }) => {
      const pass =
        row.original.dkim_aligned === "pass" ||
        row.original.spf_aligned === "pass"
      return <PassBadge pass={pass} />
    },
  },
  {
    accessorKey: "disposition",
    header: "Disposition",
    cell: ({ row }) => (
      <DispositionBadge disposition={row.original.disposition} />
    ),
  },
  {
    accessorKey: "dkim_aligned",
    header: "DKIM",
    cell: ({ row }) => (
      <PassBadge pass={row.original.dkim_aligned === "pass"} />
    ),
  },
  {
    accessorKey: "spf_aligned",
    header: "SPF",
    cell: ({ row }) => <PassBadge pass={row.original.spf_aligned === "pass"} />,
  },
  {
    accessorKey: "header_from",
    header: "Header From",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.header_from}</span>
    ),
  },
]

const ReportPage = () => {
  const { domain = "", report: reportId = "" } = useParams()
  const { data: recordsData, isLoading: recordsLoading } = useGetRecords(
    domain,
    reportId
  )
  const { data: report, isLoading: reportLoading } = useGetReport(
    domain,
    reportId
  )

  const records: DMARCRecord[] = recordsData?.items ?? []
  const totalMessages = records.reduce((sum, r) => sum + r.count, 0)
  const passedMessages = records
    .filter((r) => r.dkim_aligned === "pass" || r.spf_aligned === "pass")
    .reduce((sum, r) => sum + r.count, 0)
  const failedMessages = totalMessages - passedMessages
  const uniqueSenders = records.length

  const loading = recordsLoading || reportLoading

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total messages"
          value={totalMessages.toLocaleString()}
          icon={<Mail className="h-4 w-4" />}
          loading={loading}
        />
        <StatCard
          label="Passed"
          value={
            <span className="text-green-600 dark:text-green-400">
              {passedMessages.toLocaleString()}
            </span>
          }
          icon={<ShieldCheck className="h-4 w-4" />}
          loading={loading}
        />
        <StatCard
          label="Failed"
          value={
            <span
              className={
                failedMessages > 0 ? "text-red-600 dark:text-red-400" : ""
              }
            >
              {failedMessages.toLocaleString()}
            </span>
          }
          icon={<ShieldX className="h-4 w-4" />}
          loading={loading}
        />
        <StatCard
          label="Unique senders"
          value={uniqueSenders}
          icon={<Server className="h-4 w-4" />}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Reporter</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <MetaRow
              label="Organisation"
              value={
                loading ? <Skeleton className="h-4 w-40" /> : report?.org_name
              }
            />
            <MetaRow
              label="Email"
              value={
                loading ? <Skeleton className="h-4 w-40" /> : report?.org_email
              }
            />
            <MetaRow
              label="Period"
              value={
                loading ? (
                  <Skeleton className="h-4 w-40" />
                ) : report ? (
                  `${formatDate(report.begin_date)} – ${formatDate(report.end_date)}`
                ) : null
              }
            />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Policy</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <MetaRow
              label="DMARC policy"
              value={
                loading ? (
                  <Skeleton className="h-4 w-20" />
                ) : report ? (
                  <PolicyBadge policy={report.policy} />
                ) : null
              }
            />
            <MetaRow
              label="Subdomain policy"
              value={
                loading ? (
                  <Skeleton className="h-4 w-20" />
                ) : report ? (
                  <PolicyBadge
                    policy={report.subdomain_policy ?? report.policy}
                  />
                ) : null
              }
            />
            <MetaRow
              label="DKIM alignment"
              value={
                loading ? (
                  <Skeleton className="h-4 w-16" />
                ) : report ? (
                  alignmentLabel(report.adkim)
                ) : null
              }
            />
            <MetaRow
              label="SPF alignment"
              value={
                loading ? (
                  <Skeleton className="h-4 w-16" />
                ) : report ? (
                  alignmentLabel(report.aspf)
                ) : null
              }
            />
            <MetaRow
              label="Coverage"
              value={
                loading ? (
                  <Skeleton className="h-4 w-10" />
                ) : report ? (
                  `${report.pct}%`
                ) : null
              }
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium">Records</h2>
        <DataTable table={table} />
        {table.getPageCount() > 1 && <DataTablePagination table={table} />}
      </div>
    </div>
  )
}

export default ReportPage
