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

export function PolicyBadge({ policy }: { policy: string }) {
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
