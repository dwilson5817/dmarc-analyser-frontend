import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx"
import { Link, useMatches } from "react-router"

type CrumbHandle = {
  crumb: (match: unknown) => { label: string; to: string }
}

const hasCrumb = (handle: unknown): handle is CrumbHandle =>
  typeof handle === "object" && handle !== null && "crumb" in handle

export function SiteHeader() {
  const matches = useMatches()
  const crumbs = matches.filter((match) => hasCrumb(match.handle))

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((match, index) => {
              const { label, to } = (match.handle as CrumbHandle).crumb(match)
              const isLast = index === crumbs.length - 1
              return (
                <>
                  <BreadcrumbItem key={match.id}>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={to}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator key={`sep-${match.id}`} />}
                </>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
