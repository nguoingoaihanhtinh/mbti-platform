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

/**
 * Tailwind-based Button component with variants, sizes, loading state and icon support.
 * [Button()](mbti-platform/apps/web/src/components/ui/button.tsx:1)
 */
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
    "relative inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizes: Record<ButtonSize, string> = {
    sm: "text-xs h-7 px-3",
    md: "text-sm h-10 px-4",
    lg: "text-base h-12 px-6",
    icon: "h-10 w-10",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 focus-visible:ring-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-900",
    outline:
      "border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-900",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-900",
    danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-600",
    link: "text-gray-900 underline-offset-4 hover:underline px-0 font-medium h-auto",
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
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
        </span>
      )}
    </button>
  );
};

/**
 * Destructive action convenience wrapper.
 * [DangerButton()](mbti-platform/apps/web/src/components/ui/button.tsx:1)
 */
export const DangerButton = (props: Omit<ButtonProps, "variant">) => <Button {...props} variant="danger" />;

/**
 * Icon-only button wrapper.
 * [IconButton()](mbti-platform/apps/web/src/components/ui/button.tsx:1)
 */
export const IconButton = ({
  children,
  "aria-label": ariaLabel,
  ...rest
}: Omit<ButtonProps, "size"> & { "aria-label": string }) => (
  <Button size="icon" aria-label={ariaLabel} {...rest}>
    {children}
  </Button>
);
