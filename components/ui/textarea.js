export function Textarea({ value, onChange, placeholder }) {
  return <textarea value={value} onChange={onChange} placeholder={placeholder} className="w-full p-2 rounded-xl border" rows={4} />;
}
