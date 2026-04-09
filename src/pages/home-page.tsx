import { Link } from "react-router"
import { useGetDomains } from "@/hooks/use-get-domains.ts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutDashboard, MailSearch, Globe, ArrowRight } from "lucide-react"

const HomePage = () => {
  const { data, isLoading } = useGetDomains()
  const domains = data?.domains ?? []

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold">Welcome to DMARC Analyser</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor your email authentication and analyse DMARC reports across
          your domains.
        </p>
      </div>

      {/* Stat */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Domains monitored
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <p className="text-2xl font-bold">{domains.length}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card size="sm" className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Get an overview of your DMARC compliance across all domains.
            </p>
            <Button asChild className="self-start">
              <Link to="/dashboard">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card size="sm" className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MailSearch className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Browse and analyse DMARC aggregate reports submitted by mail
              receivers.
            </p>
            <Button variant="outline" asChild className="self-start">
              <Link to="/reports">
                View Reports <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Domain list */}
      {!isLoading && domains.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium">Monitored domains</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain) => (
              <Link
                key={domain}
                to={`/reports/${domain}`}
                className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="font-medium">{domain}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
