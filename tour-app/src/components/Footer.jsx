// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <h4 className="font-[Poppins] font-bold text-lg">Tour&Travel</h4>
          <p className="text-sm text-slate-600 mt-2">
            Smart, mood-based trips with local flavors, hidden gems, and live route insights.
          </p>

          <div className="flex gap-3 mt-3">
            <a className="btn-outline text-sm" href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a className="btn-outline text-sm" href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="btn-outline text-sm" href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <div>
          <h5 className="font-semibold">Links</h5>
          <ul className="mt-2 space-y-2 text-slate-700">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/budget-calculator">Budget Calculator</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Legal</h5>
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} Tour&Travel. All rights reserved.</p>
          <p className="text-sm text-slate-600 mt-3">Built with care • Accessible design</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-6 flex items-center justify-between text-sm text-slate-500">
        <div>Made with ♥ in Pakistan</div>
        <div className="flex items-center gap-4">
          <a href="#top" className="hover:underline">Back to top</a>
        </div>
      </div>
    </footer>
  );
}