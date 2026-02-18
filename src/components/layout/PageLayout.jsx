
const PageLayout = ({ children, title }) => {
  return (
    // ELIMINAMOS: min-h-screen, bg-gradient, etc.
    // Solo dejamos el contenedor de ancho máximo y centrado.
    <div className="w-full max-w-4xl mx-auto">
      
      {title && (
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8 tracking-tight">
          {title}
        </h1>
      )}

      {/* Contenido hijo */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;