import { CSSProperties } from "react";

interface IProps {
  onClick?: () => void;
  children: any;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "warning" | "danger";
  className?: string;
  style?: CSSProperties;
  minWidth?: number;
  loading?: boolean;
  disabled?: boolean;
}

const sizeClassNameMap = {
  sm: "border-2 px-2 py-1 rounded-md text-sm",
  md: "border-2 px-4 py-2 rounded-lg text-lg",
  lg: "border-2 px-8 py-4 rounded-lg text-xl",
};

const variantClassNameMap = {
  primary: "border-primary bg-primary  transition-all",
  secondary: "border-secondary bg-secondary  transition-all",
  warning: "border-warning bg-warning  transition-all",
  danger: "border-danger bg-danger  transition-all",
};
const Button: React.FC<IProps> = ({
  children,
  onClick = () => {},
  variant = "secondary",
  size = "md",
  className = "",
  minWidth,
  style = {},
  loading = false,
  disabled = false,
}: IProps) => {
  return (
    <button
      disabled={disabled}
      className={`${sizeClassNameMap[size]} ${
        variantClassNameMap[variant]
      } ${className} ${disabled && "opacity-60"}`}
      style={minWidth ? { minWidth, ...style } : style}
      onClick={onClick}
    >
      {loading ? "..." : children}
    </button>
  );
};

export default Button;
