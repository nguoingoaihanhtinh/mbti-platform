export function Label({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-neutral-700 mb-1 ${className}`}>
      {children}
    </label>
  );
}
