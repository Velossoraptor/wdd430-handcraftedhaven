interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}

export function Input({ children, ...props }: InputProps) {
  return <input {...props}>{children}</input>;
}
