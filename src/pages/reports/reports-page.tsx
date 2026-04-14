import { useParams, Link } from "react-router"
import { DataTable } from "@/components/data-table.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowRight,
  ShieldCheck,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Percent,
  ShieldHalf,
  Shield,
} from "lucide-react"
import { PolicyBadge } from "@/components/policy-badge.tsx"
import { StatCard } from "@/components/stat-card.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { formatDate } from "@/lib/format.ts"
import type { components } from "@/lib/api.d.ts"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import * as React from "react"
import type { DateRange } from "react-day-picker"
import { format, subMonths } from "date-fns"
import { Calendar } from "@/components/ui/calendar.tsx"
import { useGetReports } from "@/hooks/use-get-reports.ts"

const PAGE_SIZE = 15

type Report = components["schemas"]["Report"]

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

const columns = (domain: string): ColumnDef<Report>[] => [
  {
    header: "Period",
    meta: {
      skeleton: (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ),
    },
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
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subMonths(
      new Date(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
      ),
      3
    ),
    to: new Date(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    ),
  })
  const [cursors, setCursors] = React.useState<string[]>([])

  const { domain = "" } = useParams()
  const { data, isLoading } = useGetReports(
    domain,
    {
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      limit: PAGE_SIZE,
      cursor: cursors[cursors.length - 1],
    },
    { staleTime: Infinity }
  )
  const { data: latestData, isLoading: isLatestLoading } = useGetReports(
    domain,
    { limit: 1 }
  )

  const reports = React.useMemo<Report[]>(() => data?.items ?? [], [data])
  const latestReport = latestData?.items[0]

  const tableColumns = React.useMemo(() => columns(domain), [domain])

  const table = useReactTable({
    data: reports,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setCursors([])
  }

  const handleNextPage = () => {
    if (data?.next_cursor) setCursors((prev) => [...prev, data.next_cursor!])
  }

  const handlePrevPage = () => {
    setCursors((prev) => prev.slice(0, -1))
  }

  const pageIndex = cursors.length
  const hasPrevPage = pageIndex > 0
  const hasNextPage = !!data?.next_cursor

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-xl font-semibold">{domain}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">DMARC reports</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Current policy"
          value={
            latestReport ? <PolicyBadge policy={latestReport.policy} /> : "—"
          }
          icon={<ShieldCheck className="h-4 w-4" />}
          loading={isLatestLoading}
        />
        <StatCard
          label="Coverage"
          value={latestReport ? `${latestReport.pct}%` : "—"}
          icon={<Percent className="h-4 w-4" />}
          loading={isLatestLoading}
        />
        <StatCard
          label="DKIM alignment"
          value={
            latestReport
              ? latestReport.adkim === "s"
                ? "Strict"
                : "Relaxed"
              : "—"
          }
          icon={<ShieldHalf className="h-4 w-4" />}
          loading={isLatestLoading}
        />
        <StatCard
          label="SPF alignment"
          value={
            latestReport
              ? latestReport.aspf === "s"
                ? "Strict"
                : "Relaxed"
              : "—"
          }
          icon={<Shield className="h-4 w-4" />}
          loading={isLatestLoading}
        />
      </div>

      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-range"
              className="justify-start px-2.5 font-normal"
            >
              <CalendarIcon />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {(hasPrevPage || hasNextPage) && (
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pageIndex + 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={handlePrevPage}
              disabled={!hasPrevPage}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={handleNextPage}
              disabled={!hasNextPage}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
      <DataTable table={table} loading={isLoading} skeletonRows={PAGE_SIZE} />
    </div>
  )
}

export default ReportsPage
