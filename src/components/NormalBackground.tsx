import { useTheme } from "@/contexts/ThemeContext";

const NormalBackground = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100'
      }`}
    />
  );
};

export default NormalBackground;