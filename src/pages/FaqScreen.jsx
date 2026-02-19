import React, { useEffect, useState } from "react";
// import { getFaqs } from "../helpers/faqApi.js"; // Comentado temporalmente
import { ChevronDown, ChevronUp, HelpCircle, MessageCircleQuestion } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";

const FaqScreen = () => {
  const [faqData, setFaqData] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // --- DATOS HARDCODEADOS (Misma lista que en Admin) ---
  const MOCK_FAQS = [
    { 
      id_faq: 1, 
      pregunta: "¿Cuáles son los horarios de atención?", 
      respuesta: "Atendemos de Lunes a Viernes de 08:00 a 12:00 y de 16:00 a 20:00 hs.", 
      ultima_modificacion: new Date('2024-03-10') 
    },
    { 
      id_faq: 2, 
      pregunta: "¿Qué documentación necesito para inscribirme?", 
      respuesta: "DNI original y fotocopia, título secundario o constancia de título en trámite, y 2 fotos carnet.", 
      ultima_modificacion: new Date('2024-03-12') 
    },
    { 
      id_faq: 3, 
      pregunta: "¿Cómo solicito el certificado de alumno regular?", 
      respuesta: "Debes solicitarlo a través del sistema Sysacad y retirarlo por ventanilla pasadas las 48hs hábiles.", 
      ultima_modificacion: new Date('2024-04-05') 
    },
    { 
      id_faq: 4, 
      pregunta: "¿Dónde legalizo mi título secundario?", 
      respuesta: "Debes dirigirte al Rectorado de la universidad o al Ministerio de Educación, dependiendo de la procedencia del título.", 
      ultima_modificacion: new Date('2024-05-20') 
    },
    { 
      id_faq: 5, 
      pregunta: "¿Cómo recupero mi clave de Sysacad?", 
      respuesta: "Si olvidaste tu clave, debes acercarte personalmente a la oficina de Alumnos con tu DNI para blanquearla.", 
      ultima_modificacion: new Date('2024-06-01') 
    }
  ];

  useEffect(() => {
    // Simulamos carga de datos
    const fetchData = async () => {
      try {
        // const data = await getFaqs();
        // setFaqData(data);
        
        // Usamos el mock directo
        setFaqData(MOCK_FAQS);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        // Fallback en caso de error real
        setFaqData(MOCK_FAQS); 
      }
    };
    fetchData();
  }, []);

  const toggleCollapse = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <PageLayout title="Preguntas Frecuentes">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado descriptivo */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 transition-colors">
             <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
            Encuentra respuestas rápidas a las consultas más comunes del Departamento de Alumnos.
          </p>
        </div>

        {/* Acordeón */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = expanded === index;
            return (
              <div
                key={faq.id_faq}
                className={`rounded-xl border transition-all duration-300 ${
                  isOpen 
                    ? "bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/50 shadow-md" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700"
                }`}
              >
                <button
                  onClick={() => toggleCollapse(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`font-semibold text-lg transition-colors ${
                      isOpen 
                        ? "text-blue-700 dark:text-blue-400" 
                        : "text-slate-700 dark:text-slate-200"
                    }`}>
                    {faq.pregunta}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-blue-500 dark:text-blue-400 w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="text-slate-400 dark:text-slate-500 w-5 h-5 flex-shrink-0" />
                  )}
                </button>

                {/* Contenido Desplegable */}
                {isOpen && (
                  <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
                        {faq.respuesta}
                      </p>
                      <div className="mt-4 flex items-center justify-end">
                        <small className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded transition-colors">
                          Actualizado: {new Date(faq.ultima_modificacion).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sección de "No encontré respuesta" */}
        <div className="mt-12 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 border-dashed transition-colors">
          <MessageCircleQuestion className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <h4 className="text-slate-700 dark:text-white font-semibold mb-2">¿No encuentras tu respuesta?</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Nuestro equipo está disponible para ayudarte con consultas específicas.
          </p>
          <a
            href="mailto:alumnos@frt.utn.edu.ar" 
            className="inline-block px-6 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
          >
            Contáctanos
          </a>
        </div>

      </div>
    </PageLayout>
  );
};

export default FaqScreen;