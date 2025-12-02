import React from "react";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  ...rest
}: ButtonProps) => {
  const base =
    "relative inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizes: Record<ButtonSize, string> = {
    sm: "text-xs h-7 px-3",
    md: "text-sm h-10 px-4",
    lg: "text-base h-12 px-6",
    icon: "h-10 w-10",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary-500 text-primary-foreground hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500",

    secondary:
      "bg-secondary-300 text-secondary-foreground hover:bg-secondary-400 active:bg-secondary-500 focus-visible:ring-secondary-500",

    outline:
      "border border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-primary-500",

    ghost: "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-primary-500",

    danger:
      "bg-danger-600 text-danger-foreground hover:bg-danger-500 active:bg-danger-700 focus-visible:ring-danger-500",

    link: "text-primary-600 underline-offset-4 hover:underline px-0 font-medium h-auto",
  };

  const spinnerColors: Record<ButtonVariant, string> = {
    primary: "border-primary-200 border-t-transparent",
    secondary: "border-secondary-500 border-t-transparent",
    outline: "border-neutral-400 border-t-transparent",
    ghost: "border-neutral-500 border-t-transparent",
    danger: "border-danger-200 border-t-transparent",
    link: "border-primary-300 border-t-transparent",
  };

  const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

  return (
    <button
      className={cx(base, sizes[size], variants[variant], fullWidth && "w-full", loading && "opacity-90", className)}
      disabled={disabled || loading}
      {...rest}
    >
      {leftIcon && <span className={cx(rightIcon || children ? "mr-2" : "")}>{leftIcon}</span>}

      <span className={loading ? "opacity-0" : ""}>{children}</span>

      {rightIcon && <span className={cx(leftIcon || children ? "ml-2" : "")}>{rightIcon}</span>}

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className={cx("h-4 w-4 animate-spin rounded-full border-2", spinnerColors[variant])} />
        </span>
      )}
    </button>
  );
};

export const DangerButton = (props: Omit<ButtonProps, "variant">) => <Button {...props} variant="danger" />;

export const IconButton = ({
  children,
  "aria-label": ariaLabel,
  ...rest
}: Omit<ButtonProps, "size"> & { "aria-label": string }) => (
  <Button size="icon" aria-label={ariaLabel} {...rest}>
    {children}
  </Button>
);
