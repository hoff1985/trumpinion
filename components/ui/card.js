export function Card({ children, className }) {
  return <div className={`rounded-2xl shadow-md p-4 bg-white ${className}`}>{children}</div>;
}
export function CardContent({ children }) {
  return <div>{children}</div>;
}
