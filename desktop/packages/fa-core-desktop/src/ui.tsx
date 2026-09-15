import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode } from "react";

function joinClassNames(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, type = "button", variant = "primary", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={joinClassNames("core-button", `core-button-${variant}`, className)} {...props} />;
});

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={joinClassNames("core-input", className)} {...props} />;
});

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={joinClassNames("core-label", className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={joinClassNames("core-card", className)} {...props} />;
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "error" | "info" | "success";
  children: ReactNode;
}

export function Alert({ className, variant = "error", children, ...props }: AlertProps) {
  return (
    <div className={joinClassNames("core-alert", `core-alert-${variant}`, className)} role="alert" {...props}>
      {children}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <span className={joinClassNames("core-spinner", className)} aria-hidden="true" />;
}
