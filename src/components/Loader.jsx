import { Loader2 } from "lucide-react";

const Loader = ({ texto = "Cargando InfoTrack..." }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner giratorio con el color de tu marca */}
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-500" />
        
        {/* Texto con efecto de pulso */}
        <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">
          {texto}
        </p>
      </div>
    </div>
  );
};

export default Loader;