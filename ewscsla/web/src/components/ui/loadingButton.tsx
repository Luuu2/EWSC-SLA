import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"
import {Loader2} from "lucide-react";

const loadingButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
    {
        variants: {
            variant: {
                default:
                    "bg-lusanda text-slate-50 shadow hover:bg-lusanda/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
                destructive:
                    "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
                outline:
                    "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                secondary:
                    "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
                ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface LoadingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof loadingButtonVariants> {
    asChild?: boolean,
    loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({className, variant, children, loading, size, asChild = false, ...props}, ref) => {
        if (asChild) {
            return (
                <Slot ref={ref} {...props}>
                    <>
                        {React.Children.map(children as React.ReactElement, (child: React.ReactElement) => {
                            return React.cloneElement(child, {
                                className: cn(loadingButtonVariants({variant, size}), className),
                                children: (
                                    <>
                                        {loading && (
                                            <Loader2 className={cn('h-4 w-4 animate-spin', children && 'mr-2')}/>
                                        )}
                                        {child.props.children}
                                    </>
                                ),
                            });
                        })}
                    </>
                </Slot>
            );
        }

        return (
            <button
                className={cn(loadingButtonVariants({variant, size, className}))}
                disabled={loading}
                ref={ref}
                {...props}
            >
                <>
                    {loading && <Loader2 className={cn('h-4 w-4 animate-spin', children && 'mr-2')}/>}
                    {children}
                </>
            </button>
        );
    },
)
LoadingButton.displayName = "Button"

export {LoadingButton, loadingButtonVariants}
