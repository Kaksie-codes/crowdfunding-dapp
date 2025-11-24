import React, { ReactNode, MouseEventHandler } from "react";
import { Loader2 } from "lucide-react";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  text: string;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  direction?: "left" | "right";
  variant?: "primary" | "secondary" | "danger" | "outline" | "success";
  isRounded?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isFullWidth?: boolean;
  disabled?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base", 
  lg: "px-6 py-3 text-lg",
};


const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-white hover:bg-green-700",
  success: "bg-green-600 text-white hover:bg-green-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
};

export default function Button({
  text,
  size = "md",
  isLoading = false,
  icon,
  direction = "left",
  variant = "primary",
  isRounded = false,
  onClick,
  isFullWidth = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex cursor-pointer items-center ${isFullWidth ? "w-full" : ""} justify-center gap-2 font-semibold transition-all duration-200 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${isRounded ? "rounded-full" : "rounded-xl"} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {/* LEFT ICON */}
      {!isLoading && icon && direction === "left" && <span>{icon}</span>}

      {/* LOADING SPINNER */}
      {isLoading && <Loader2 className="animate-spin" size={20} />}

      {/* BUTTON TEXT */}
      <span>{text}</span>

      {/* RIGHT ICON */}
      {!isLoading && icon && direction === "right" && <span>{icon}</span>}
    </button>
  );
}