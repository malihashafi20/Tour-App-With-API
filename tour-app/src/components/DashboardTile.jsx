//src/components/dashboardtitle.js
import { Link } from 'react-router-dom'

export default function DashboardTile({ to, title, desc }) {
  return (
    <Link to={to} className="tile block hover:-translate-y-0.5">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </Link>
  )
}
