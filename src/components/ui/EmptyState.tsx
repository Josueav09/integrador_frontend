type EmptyStateProps = {
  message: string
  title?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ title = 'Sin datos', message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="dash-empty-state" role="status" data-testid="empty-state">
      <strong>{title}</strong>
      <p>{message}</p>
      {actionLabel && actionHref && (
        <p className="dash-empty-state__action">
          <a href={actionHref}>{actionLabel}</a>
        </p>
      )}
    </div>
  )
}
