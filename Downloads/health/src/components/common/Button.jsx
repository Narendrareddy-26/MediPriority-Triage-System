// Reusable Button Component

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  // Define button styles based on variant
  const baseStyles = "px-4 py-2 rounded font-semibold transition duration-200";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400",
    secondary: "bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
    success: "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300",
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {children}
    </button>
  );
}
