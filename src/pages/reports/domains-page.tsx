import { useState } from "react"
import { useGetDomains } from "@/hooks/use-get-domains.ts"
import DomainRow from "@/pages/reports/domain-row.tsx"
import { DataTablePagination } from "@/components/data-table-pagination.tsx"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"

const PAGE_SIZE = 10

const DomainsPage = () => {
  const { data, isLoading } = useGetDomains()
  const [pageIndex, setPageIndex] = useState(0)

  const domains: string[] = isLoading
    ? Array.from({ length: PAGE_SIZE }, () => "")
    : (data?.domains ?? [])

  const pageCount = Math.ceil(domains.length / PAGE_SIZE)
  const visibleDomains = domains.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  )

  const pagination = {
    getState: () => ({ pagination: { pageIndex } }),
    getPageCount: () => pageCount,
    setPageIndex,
    getCanPreviousPage: () => pageIndex > 0,
    getCanNextPage: () => pageIndex < pageCount - 1,
    previousPage: () => setPageIndex(pageIndex - 1),
    nextPage: () => setPageIndex(pageIndex + 1),
  }

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
      {pageCount > 1 && <DataTablePagination table={pagination} />}
    </div>
  )
}

export default DomainsPage
