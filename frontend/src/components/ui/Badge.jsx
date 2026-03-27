const Badge = ({ children, variant = "default" }) => {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
    default: "bg-slate-500/10 text-slate-600 border border-slate-500/20"
  };

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest inline-flex items-center space-x-2 shadow-sm ${styles[variant] || styles.default}`}>
       <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
       <span>{children}</span>
    </span>
  );
};

export default Badge;
