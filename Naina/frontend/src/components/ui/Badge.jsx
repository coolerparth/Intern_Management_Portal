// Placeholder - will fill in step 2
const Badge = ({ children, variant = "default" }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    variant === "success" ? "bg-green-100 text-green-800" :
    variant === "warning" ? "bg-yellow-100 text-yellow-800" :
    variant === "danger" ? "bg-red-100 text-red-800" :
    "bg-gray-100 text-gray-800"
  }`}>
    {children}
  </span>
);

Badge.defaultProps = {
  variant: "default"
};

export default Badge;

