

export interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'Sin datos disponibles',
  description = 'No hay información registrada para mostrar en este período.'
}: EmptyStateProps) {
  return (
    <div className="empty-state" data-testid="empty-state-container">
      <div className="empty-state__icon" aria-hidden="true">
        📭
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
    </div>
  );
}
