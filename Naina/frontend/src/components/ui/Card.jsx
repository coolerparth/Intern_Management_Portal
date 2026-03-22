import { motion } from "framer-motion"; // Assume installed or use CSS transitions

const Card = ({ title, value, trend, icon: Icon, variant = "metric" }) => {
  const variants = {
    primary: "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg",
    default: "bg-white shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
  };

  return (
    <motion.div 
      className={`p-6 rounded-2xl ${variants[variant] || variants.default} flex-1 min-h-[120px] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-8 h-8 opacity-80" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;

