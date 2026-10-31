import { forwardRef, type ButtonHTMLAttributes } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "console-btn-ghost", ...props }, ref) => <button ref={ref} className={className} {...props} />,
);
Button.displayName = "Button";