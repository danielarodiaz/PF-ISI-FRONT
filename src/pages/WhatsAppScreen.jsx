import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarTelefonoEnTurno } from "../helpers/filaApi";
import { MessageCircle, Phone, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import PageLayout from "../components/layout/PageLayout";

const WhatsAppScreen = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState("");

  const handleContinue = async (acepta) => {
    // 1. Si el usuario no acepta, nos vamos directo
    if (!acepta) {
        navigate("/turno");
        return;
    }

    // 2. Si acepta, validamos el formato (Regla: 10 dígitos, sin 0 ni 15)
    // Ejemplo válido: 3815616705
    const regexValido = /^[1-9]\d{9}$/; 

    if (!regexValido.test(telefono)) {
        Swal.fire({
            title: "Formato incorrecto",
            html: `El número debe tener <b>10 dígitos</b>:<br/>
                   Código de área (sin 0) + número (sin 15).<br/><br/>
                   <i>Ejemplo: 3815616705</i>`,
            icon: "warning",
            confirmButtonColor: "#16a34a",
            background: '#1e293b',
            color: '#fff'
        });
        return; // Cortamos la ejecución aquí para que el usuario corrija
    }

    // 3. Si pasó la validación, procedemos con el registro
    try {
        const turnoActivoStr = sessionStorage.getItem("turnoActivo");
        
        if (turnoActivoStr) {
            const turnoData = JSON.parse(turnoActivoStr);
            await registrarTelefonoEnTurno(turnoData.idTurno, telefono);
            console.log("Teléfono vinculado con éxito");
        }
        // Solo navegamos si el registro fue exitoso o si no había turno (fallback)
        navigate("/turno");
    } catch (error) {
        console.error("No se pudo registrar el teléfono:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al registrar tu teléfono. Intenta de nuevo.",
            icon: "error",
            background: '#1e293b',
            color: '#fff'
        });
    }
};

  return (
    <PageLayout title="Notificaciones">
      <div className="max-w-md mx-auto">
        {/* 1. CONTENEDOR TARJETA:
            - dark:bg-slate-900: Fondo oscuro.
            - dark:border-slate-800: Borde sutil.
        */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center relative overflow-hidden transition-colors duration-300">
            
            {/* Decoración de fondo (Barra superior) */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

            {/* Icono Principal (Círculo de fondo) */}
            <div className="mx-auto w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm transition-colors">
                <MessageCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
            </div>

            {/* Título y Texto */}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                ¿Te avisamos por WhatsApp?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Podemos enviarte una alerta cuando sea tu turno para que no tengas que esperar mirando la pantalla.
            </p>

            <div className="space-y-5 text-left">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                        Número de celular
                    </label>
                    <div className="relative group">
                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                        {/* 2. INPUT:
                            - dark:bg-slate-800: Fondo del input oscuro.
                            - dark:text-white: Letra blanca al escribir.
                        */}
                        <input
                            type="number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
                            placeholder="Ej: 3815789536"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 ml-1">
                        *No enviaremos spam, solo la notificación de tu turno.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                     {/* Botón NO */}
                     <button
                        onClick={() => handleContinue(false)}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all active:scale-95"
                    >
                        <XCircle size={18} />
                        No, gracias
                    </button>
                    
                    {/* Botón SI */}
                    <button
                        onClick={() => handleContinue(true)}
                        disabled={!telefono} 
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-green-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <CheckCircle size={18} />
                        Sí, avísame
                    </button>
                </div>
            </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default WhatsAppScreen;
