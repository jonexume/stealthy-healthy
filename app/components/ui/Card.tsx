import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md";
  border?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

const shadowClasses = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      padding = "md",
      shadow = "sm",
      border = true,
      className = "",
      children,
      ...rest
    },
    ref
  ) => (
    <div
      ref={ref}
      className={[
        "bg-white rounded-2xl",
        border ? "border border-slate-200" : "",
        paddingClasses[padding],
        shadowClasses[shadow],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";
export default Card;
