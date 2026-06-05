import { splitProps, type JSX } from "solid-js";
import Loader from "lucide-solid/icons/loader";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant;
  size?:      Size;
  loading?:   boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:   "bg-accent hover:bg-accent-dark text-white shadow-md hover:shadow-lg hover:shadow-accent/25",
  secondary: "bg-navy hover:bg-navy-dark text-white shadow-sm",
  danger:    "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  ghost:     "bg-transparent hover:bg-white/10 text-navy",
  outline:   "border-2 border-accent text-accent hover:bg-accent hover:text-white",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "size", "loading", "fullWidth", "class", "children", "disabled"]);

  return (
    <button
      {...rest}
      disabled={local.disabled || local.loading}
      class={[
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]",
        VARIANTS[local.variant ?? "primary"],
        SIZES[local.size ?? "md"],
        local.fullWidth ? "w-full" : "",
        local.class ?? "",
      ].join(" ")}
    >
      {local.loading && <Loader class="w-4 h-4 animate-spin" />}
      {local.children}
    </button>
  );
}
