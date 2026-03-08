//src/pages/Contact.js
export default function Contact() {
  const submit = (e) => {
    e.preventDefault()
    alert('Thanks! We will get back to you soon.')
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="font-[Poppins] text-3xl font-bold">Contact</h2>
      <p className="text-slate-700 mt-2">We’re happy to help with itineraries, mood suggestions, routes, and snack guides.</p>
      <form onSubmit={submit} className="tile mt-6 grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Name</span>
          <input className="border rounded-lg px-3 py-2" required />
        </label>
        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Email</span>
          <input type="email" className="border rounded-lg px-3 py-2" required />
        </label>
        <label className="sm:col-span-2 flex flex-col">
          <span className="text-sm text-slate-600">Message</span>
          <textarea className="border rounded-lg px-3 py-2 h-28" required />
        </label>
        <button className="btn-primary sm:col-span-2">Send message</button>
      </form>
    </div>
  )
}
