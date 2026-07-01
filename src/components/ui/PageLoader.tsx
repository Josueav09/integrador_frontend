export function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite" data-testid="page-loader">
      <div className="page-loader__ring" />
      <p>GNN Crime AI</p>
    </div>
  )
}
