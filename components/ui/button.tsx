// components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-primary-900",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-gray-100 text-primary-600 hover:bg-gray-200 dark:bg-primary-800 dark:text-primary-50 dark:hover:bg-primary-700",
        outline: "border border-primary-500 text-primary-500 hover:bg-primary-100 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900",
        ghost: "text-primary-600 hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900",
        destructive: "bg-accent-500 text-white hover:bg-accent-600 dark:bg-accent-600 dark:hover:bg-accent-700",
        success: "bg-success text-white hover:bg-success/90",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 rounded-md",
        lg: "h-12 px-6 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };