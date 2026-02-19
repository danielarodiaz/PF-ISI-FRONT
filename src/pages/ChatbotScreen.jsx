import { useEffect,useState,useRef } from "react";
import { sendMessageToChatbot } from "../helpers/chatbotApi";
import { verificarConexionChat } from "../helpers/verificationConnection";
import { SERVICE_ERROR_CODES, isConfigMissingError } from "../helpers/serviceErrors";
import { Send, Bot, User, Loader2 } from "lucide-react"; // Iconos
import PageLayout from "../components/layout/PageLayout";

const INITIAL_MESSAGE_DELAY_MS = 1200;

const ChatbotScreen = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatAvailable, setChatAvailable] = useState(false);
  const [chatStatusChecked, setChatStatusChecked] = useState(false);
  const [chatErrorType, setChatErrorType] = useState(null);
  const messagesEndRef = useRef(null);
  const isWaitingBotResponse = isLoading || !chatStatusChecked;
  const botLoadingText = chatStatusChecked ? "Pensando..." : "Conectando...";

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const checkConnection = async () => {
      let healthResponded = false;
      let healthAvailable = false;
      let healthReason = SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE;

      verificarConexionChat().then((result) => {
        healthResponded = true;
        healthAvailable = Boolean(result?.ok);
        healthReason = result?.reason || SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE;
      });

      await sleep(INITIAL_MESSAGE_DELAY_MS);

      if (isCancelled) return;

      const available = healthResponded && healthAvailable;
      setChatAvailable(Boolean(available));
      setChatStatusChecked(true);
      setChatErrorType(available ? null : healthReason);
      if (available) {
        setChatHistory([{ autor: "bot", contenido: "¡Hola! Soy Uteniano 😎. ¿En qué puedo ayudarte hoy?" }]);
      } else if (healthReason === SERVICE_ERROR_CODES.CONFIG_MISSING) {
        setChatHistory([{ autor: "bot", contenido: "El asistente no está configurado. Contacta al administrador." }]);
      } else {
        setChatHistory([{ autor: "bot", contenido: "El asistente no está disponible en este momento." }]);
      }
    };
    checkConnection();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Auto-scroll al fondo cuando llega un mensaje nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault(); 
    if (!chatAvailable || !message.trim()) return;

    const currentMsg = message;
    setMessage("");
    setIsLoading(true);

    setChatHistory((prev) => [...prev, { autor: "usuario", contenido: currentMsg }]);

    try {
      const response = await sendMessageToChatbot(currentMsg, chatHistory);
      setChatHistory((prev) => [
        ...prev,
        { autor: "bot", contenido: response.respuesta_bot },
      ]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const unavailableMessage = isConfigMissingError(error)
        ? "El asistente no está configurado. Contacta al administrador."
        : "Lo siento, tuve un problema de conexión. Intenta de nuevo.";
      setChatHistory((prev) => [
        ...prev,
        { autor: "bot", contenido: unavailableMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Asistente Virtual">
      <div className="max-w-3xl mx-auto">
        
        {/* Contenedor principal del chat */}
        {/* dark:bg-slate-900 y dark:border-slate-800 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] transition-colors duration-300">
          
          {/* Header del Chat - Mantenemos colores vivos, pero suavizamos el texto */}
          <div className="bg-blue-600 dark:bg-blue-900 p-4 flex items-center gap-3 shadow-md z-10">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot className="text-white w-6 h-6" />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg">Uteniano 😎</h3>
                <p className="text-blue-100 dark:text-blue-300 text-xs flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${chatAvailable ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></span>
                    {chatAvailable ? "En línea" : chatErrorType === SERVICE_ERROR_CODES.CONFIG_MISSING ? "Sin configurar" : "No disponible"}
                </p>
            </div>
          </div>

          {/* Área de Mensajes */}
          {/* dark:bg-slate-950 para el fondo del historial */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${msg.autor === "usuario" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] md:max-w-[70%] gap-2 ${msg.autor === "usuario" ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Icono del Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        msg.autor === "usuario" 
                          ? "bg-blue-100 dark:bg-blue-900/40" 
                          : "bg-orange-100 dark:bg-orange-900/40"
                    }`}>
                        {msg.autor === "usuario" 
                          ? <User size={16} className="text-blue-600 dark:text-blue-300"/> 
                          : <Bot size={16} className="text-orange-600 dark:text-orange-300"/>
                        }
                    </div>

                    {/* Burbuja de Texto */}
                    <div
                        className={`p-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                        msg.autor === "usuario"
                            ? "bg-blue-600 text-white rounded-tr-none" // Los colores de usuario son fijos y vibrantes
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none" // Burbuja de Bot se oscurece
                        }`}
                    >
                        {msg.contenido}
                    </div>
                </div>
              </div>
            ))}

            {/* Indicador de "Escribiendo..." */}
            {isWaitingBotResponse && (
              <div className="flex justify-start w-full">
                 <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-full rounded-tl-none animate-pulse">
                    <Loader2 className="w-4 h-4 text-slate-500 dark:text-slate-400 animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{botLoadingText}</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {/* dark:bg-slate-900 para el área de input y dark:border-slate-800 */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={chatAvailable ? "Escribe tu consulta aquí..." : "Asistente no disponible"}
                // dark:bg-slate-800, dark:text-white para la escritura
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                disabled={isWaitingBotResponse || !chatAvailable}
              />
              <button
                type="submit"
                disabled={isWaitingBotResponse || !chatAvailable || !message.trim()}
                // Botón deshabilitado adaptado
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg hover:shadow-blue-200 dark:shadow-none active:scale-95 flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </PageLayout>
  );
};

export default ChatbotScreen;
