import { KpiIcon } from '../icons/Icons'

type KpiCardProps = {
  label: string
  value: string
  change?: string
  sub?: string
  tone: 'blue' | 'orange' | 'red' | 'purple'
  icon: string
}

export function KpiCard({ label, value, change, sub, tone, icon }: KpiCardProps) {
  return (
    <article className="dash-kpi">
      <div className="dash-kpi__top">
        <div className="dash-kpi__body">
          <p className="dash-kpi__label">{label}</p>
          <p className="dash-kpi__value">{value}</p>
          {change && <p className="dash-kpi__change">{change}</p>}
          {sub && <p className="dash-kpi__sub">{sub}</p>}
        </div>
        <div className={`dash-kpi__icon dash-kpi__icon--${tone}`}>
          <KpiIcon name={icon} />
        </div>
      </div>
    </article>
  )
}
