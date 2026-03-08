//src/components/servicecard.js
// Example ServiceCard component (previous file exported a Footer by mistake)
import { Link } from 'react-router-dom';

export default function ServiceCard({ title, description, to, icon }) {
  return (
    <Link to={to} className="tile block hover:-translate-y-0.5 p-4">
      {icon && <div className="mb-2">{icon}</div>}
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </Link>
  );
}
