"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";

const variantClass = {
  default: "bg-(--cm-primary) text-white shadow hover:opacity-90",
  destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  outline:
    "border border-[#D4D4D2] bg-white shadow-sm hover:bg-(--cm-surface) hover:text-(--cm-primary)",
  secondary: "bg-(--cm-accent) text-(--cm-text) shadow-sm hover:opacity-80",
  ghost: "hover:bg-(--cm-surface) hover:text-(--cm-primary)",
  link: "text-(--cm-primary) underline-offset-4 hover:underline",
};

const sizeClass = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
};

export function buttonVariants({ variant = "default", size = "default", className } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--cm-primary)/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    variantClass[variant] || variantClass.default,
    sizeClass[size] || sizeClass.default,
    className,
  );
}

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  );
});

export { Button };
