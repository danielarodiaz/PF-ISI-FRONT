import React, { useState } from "react";
import { sendMessageToChatbot } from "../helpers/chatbotApi";
import "../css/chatbot.css";
import { Spinner } from "react-bootstrap";

const ChatbotScreen = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Evita enviar mensajes vacíos
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(message, chatHistory);
      setChatHistory([
        ...chatHistory,
        { autor: "usuario", contenido: message },
        { autor: "bot", contenido: response.respuesta_bot },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    } finally {
      setIsLoading(false); // Oculta el spinner
    }
  };

  return (
    <div className="chatbot-container mt-5 mx-auto p-3 shadow">
      <h2 className="text-center mb-4 color-title">Soy Uteniano 😎</h2>
      <div className="chat-history p-3 bg-light rounded overflow-auto">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.autor}`}>
            <strong>{msg.autor === "usuario" ? "Tú: " : "Bot: "}</strong>
            {msg.contenido}
          </div>
        ))}
        {isLoading && (
          <div className="text-center mt-3">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        )}
      </div>
      <div className="input-group mt-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="form-control chat-input"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="btn btn-primary send-button"
          disabled={isLoading}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatbotScreen;
