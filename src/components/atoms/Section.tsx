import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode | string;
  className?: string;
  href?: string;
};

const Section: React.FunctionComponent<Props> = (
  { as: Component = "div", children, className = "", href }: Props,
  ref,
) => (
  <Component className={cn("mb-4 w-full border-b py-2", className)} href={href}>
    {children}
  </Component>
);
Section.displayName = "Section";

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
SectionHeader.displayName = "SectionHeader";

const SectionTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
SectionTitle.displayName = "SectionTitle";

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
SectionDescription.displayName = "SectionDescription";

const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 py-4", className)}
    {...props}
  />
));
SectionContent.displayName = "SectionContent";

const SectionFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center py-4 pt-0", className)}
    {...props}
  />
));
SectionFooter.displayName = "SectionFooter";

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  SectionFooter,
};
