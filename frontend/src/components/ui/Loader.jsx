const Loader = ({ size = "md", color = "emerald" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colorClasses = {
    emerald: "border-emerald-500 border-t-emerald-500",
    gray: "border-gray-300 border-t-gray-300",
    blue: "border-blue-500 border-t-blue-500"
  };

  return (
    <div 
      className={`animate-spin rounded-full border-4 border-gray-200 ${sizeClasses[size]} ${colorClasses[color] || colorClasses.emerald}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;

