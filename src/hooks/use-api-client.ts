import { useMemo } from "react"
import { useAuth } from "react-oidc-context"
import createClient from "openapi-fetch"
import type { paths } from "@/lib/api.d.ts"

export function useApiClient() {
  const auth = useAuth()
  return useMemo(
    () =>
      createClient<paths>({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      }),
    [auth.user?.access_token]
  )
}
