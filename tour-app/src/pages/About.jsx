//src/pages/About.js
import avatar from '../assets/avatar.jpg';
export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="font-[Poppins] text-3xl font-bold">About Us</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-6 items-start">
        
        {/* Author details */}
        <div className="tile">
          <div className="flex items-center gap-4">
            <img src={avatar} alt="Author" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <h3 className="font-semibold">Maliha Shafi</h3>
              <p className="text-slate-600 text-sm">
                Building accessible, real‑world travel tools.
              </p>
            </div>
          </div>
          <p className="mt-4 text-slate-700">
            Tour&Travel helps travelers plan fast with curated itineraries and smart suggestions.
            We care about local culture, accessible design, and joy in exploration.
          </p>
        </div>

        {/* Location */}
        <div className="tile">
          <h4 className="font-semibold mb-2">Location</h4>
          <p className="text-sm text-slate-600">Based in Lahore, Pakistan.</p>
          <iframe
            title="Author Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
            className="w-full h-64 rounded-lg mt-4"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
