export function getRelativeDays(timestamp: number) {
  const diffDays = Math.floor((Date.now() - timestamp) / 86_400_000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays > 0) return `${diffDays}d ago`
  return `In ${Math.abs(diffDays)}d`
}

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp * 1000))
}
