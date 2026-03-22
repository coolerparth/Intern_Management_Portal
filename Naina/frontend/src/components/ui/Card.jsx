import { motion } from "framer-motion";

const Card = ({ title, value, trend, icon, variant = "default" }) => {
  const styles = {
    primary: "bg-green-600 text-white shadow-lg shadow-green-600/10",
    default: "bg-white text-slate-900 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
  };

  return (
    <motion.div 
      className={`p-6 rounded-2xl ${styles[variant] || styles.default} flex-1 min-h-[140px] flex flex-col justify-between group transition-all duration-300`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${
            variant === 'primary' ? 'text-green-50' : 'text-slate-400'
          }`}>
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1 items-baseline">
              <span className={`text-[11px] font-bold ${
                trend > 0 
                ? (variant === 'primary' ? 'text-green-100' : 'text-green-600') 
                : (variant === 'primary' ? 'text-red-100' : 'text-red-600')
              }`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className={`text-[10px] font-medium opacity-60 ${
                variant === 'primary' ? 'text-green-50' : 'text-slate-400'
              }`}>
                vs last week
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
            variant === 'primary' ? 'bg-white/20' : 'bg-slate-50 text-slate-400'
          }`}>
            {typeof icon === 'string' ? icon : icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
