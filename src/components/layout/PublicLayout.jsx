import { Link, useLocation, Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, MessageCircle, HelpCircle, List, Home, LayoutDashboard, BarChart3 } from "lucide-react"; 
import logoUTN from "../../assets/UTN-TUC.png"; 
import logoInfoTrack from "../../assets/LogoInfo_track.png";
import { getTurnoActivoRef } from "../../helpers/turnoStorage";

const PublicLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const hasActiveTurno = Boolean(getTurnoActivoRef()?.publicToken);
  const filaNavPath = hasActiveTurno ? "/turno" : "/fila";
  const filaNavLabel = hasActiveTurno ? "Mi turno" : "Solicitar turno";

  const publicNavItems = [
    { path: filaNavPath, label: filaNavLabel, icon: <List size={20} /> },
    { path: "/faq", label: "Ayuda", icon: <HelpCircle size={20} /> },
    { path: "/chatbot", label: "Asistente", icon: <MessageCircle size={20} /> },
  ];
  const adminNavItems = [
    { path: "/admin/homeAdmin", label: "Turnos", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
    { path: "/admin/faqs", label: "FAQs", icon: <HelpCircle size={20} /> },
  ];
  const navItems = isAdminRoute ? adminNavItems : publicNavItems;
  const mobileHomePath = isAdminRoute ? "/admin/homeAdmin" : "/";
  const mobileHomeLabel = isAdminRoute ? "Panel" : "Inicio";
  const logoHomePath = isAdminRoute ? "/admin/homeAdmin" : "/";

  return (
    // CAMBIO IMPORTANTE AQUÍ ABAJO:
    // Agregamos bg-slate-50 (fondo claro), dark:bg-slate-950 (fondo oscuro) y colores de texto globales.
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Fondo decorativo (blobs) - Ajustados para que se vean sutiles en ambos modos */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Navbar Glassmorphism */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo y Home */}
          <Link to={logoHomePath} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logoUTN} alt="UTN Logo" className="h-8 w-auto" />
            {/* <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Fila Virtual
            </span> */}
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Botón Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-grow container mx-auto px-4 py-8 animate-in fade-in zoom-in duration-500">
        <Outlet /> 
      </main>

      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 mb-16 md:mb-0 flex flex-col items-center justify-center gap-1 text-xs text-slate-600 dark:text-slate-400">
          <img src={logoInfoTrack} alt="InfoTrack Logo" className="h-5 w-auto" />
          <span>
            Organizacion potenciada con <strong>InfoTrack</strong>, un producto de{" "}
            <strong>Ludem Software</strong>.
          </span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around py-3 z-50 safe-area-pb">
         <Link to={mobileHomePath} className={`flex flex-col items-center gap-1 ${location.pathname === mobileHomePath ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
            <Home size={24} />
            <span className="text-[10px]">{mobileHomeLabel}</span>
         </Link>
         {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 ${location.pathname === item.path ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </Link>
         ))}
      </div>
    </div>
  );
};

export default PublicLayout;
