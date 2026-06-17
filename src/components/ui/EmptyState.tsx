type EmptyStateProps = {
  message: string
  title?: string
}

export function EmptyState({ title = 'Sin datos', message }: EmptyStateProps) {
  return (
    <div className="dash-empty-state" role="status" data-testid="empty-state">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  )
}
