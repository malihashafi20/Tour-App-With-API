//src/components/snackcard.js
export default function SnackCard({ snack }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow">
      <img src={snack.img} alt={snack.name} className="h-32 w-full object-cover" />
      <div className="p-4">
        <h4 className="font-semibold">{snack.name}</h4>
        <p className="text-slate-600 text-sm">{snack.area}</p>
      </div>
    </div>
  )
}
