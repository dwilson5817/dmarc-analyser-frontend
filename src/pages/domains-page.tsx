import { useGetDomains } from "@/hooks/use-get-domains.ts"
import DomainRow from "@/pages/domain-row.tsx"
import { DataTablePagination } from "@/components/data-table-pagination"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

const PAGE_SIZE = 10

const columnHelper = createColumnHelper<string>()
const columns = [columnHelper.display({ id: "row" })]

const DomainsPage = () => {
  const { data, isLoading } = useGetDomains()
  const domains: string[] = isLoading
    ? Array.from({ length: PAGE_SIZE }, () => "")
    : (data?.domains ?? [])

  const table = useReactTable({
    data: domains,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  })

  const visibleDomains = table.getRowModel().rows.map((r) => r.original)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Reports</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {data?.domains.length != null
            ? `${data.domains.length} domain${data.domains.length !== 1 ? "s" : ""} monitored`
            : "Loading domains…"}
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Last reporter</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Last report</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleDomains.map((domain, i) => (
              <DomainRow key={domain || i} domain={domain || null} />
            ))}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && <DataTablePagination table={table} />}
    </div>
  )
}

export default DomainsPage
