import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Save, 
  X,
  MessageCircleQuestion 
} from "lucide-react";

// Importa tus funciones reales de API aquí.
// Por ahora usaré mocks para que la UI funcione visualmente.
import { getFaqs } from "../helpers/faqApi"; 
// import { postFaq, putFaq, deleteFaq } from "../helpers/faqApi"; 

const FaqsAdmin = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null); // null = creando, objeto = editando
  const [formData, setFormData] = useState({ pregunta: "", respuesta: "" });

  // --- Cargar Datos ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getFaqs();
      setFaqs(data);
    } catch (error) {
      console.error(error);
      // Fallback data para visualización si falla la API
      setFaqs([
        { id_faq: 1, pregunta: "¿Dónde pido el certificado?", respuesta: "En ventanilla 4.", ultima_modificacion: new Date() },
        { id_faq: 2, pregunta: "¿Horarios de atención?", respuesta: "De 8 a 12hs.", ultima_modificacion: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejadores del Modal ---
  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({ pregunta: "", respuesta: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({ pregunta: faq.pregunta, respuesta: faq.respuesta });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ pregunta: "", respuesta: "" });
  };

  // --- CRUD Operations ---
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.pregunta.trim() || !formData.respuesta.trim()) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      if (editingFaq) {
        // Lógica de UPDATE (PUT)
        // await putFaq(editingFaq.id_faq, formData);
        
        // Simulación visual de update
        setFaqs(faqs.map(f => f.id_faq === editingFaq.id_faq ? { ...f, ...formData, ultima_modificacion: new Date() } : f));
        Swal.fire("Actualizado", "La pregunta ha sido actualizada.", "success");
      } else {
        // Lógica de CREATE (POST)
        // const newFaq = await postFaq(formData);

        // Simulación visual de create
        const newMock = { id_faq: Date.now(), ...formData, ultima_modificacion: new Date() };
        setFaqs([...faqs, newMock]);
        Swal.fire("Creado", "Nueva pregunta agregada.", "success");
      }
      handleCloseModal();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar los cambios", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1e293b', 
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // await deleteFaq(id);
          
          // Simulación visual
          setFaqs(faqs.filter(f => f.id_faq !== id));
          Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  // --- Filtrado ---
  const filteredFaqs = faqs.filter(f => 
    f.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.respuesta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                   Gestión de FAQs
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Administra la base de conocimiento</p>
            </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar pregunta..." 
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all font-semibold"
            >
                <Plus size={18} /> Nuevo
            </button>
        </div>
      </header>

      {/* LISTA DE CARDS */}
      <div className="grid gap-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div 
                key={faq.id_faq} 
                className="group bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                             <MessageCircleQuestion size={18} className="text-blue-500" />
                             <h3 className="font-bold text-lg text-slate-800 dark:text-white">{faq.pregunta}</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            {faq.respuesta}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 text-right">
                            Última mod: {new Date(faq.ultima_modificacion).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleOpenEdit(faq)}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Pencil size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(faq.id_faq)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
          ))
        ) : (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                <p>No se encontraron resultados.</p>
            </div>
        )}
      </div>

      {/* MODAL (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {editingFaq ? "Editar Pregunta" : "Nueva Pregunta"}
                    </h2>
                    <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pregunta</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors"
                            placeholder="Ej: ¿Qué documentación necesito?"
                            value={formData.pregunta}
                            onChange={(e) => setFormData({...formData, pregunta: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Respuesta</label>
                        <textarea 
                            rows="4"
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors resize-none"
                            placeholder="Escribe la respuesta detallada aquí..."
                            value={formData.respuesta}
                            onChange={(e) => setFormData({...formData, respuesta: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={handleCloseModal}
                            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all flex justify-center items-center gap-2"
                        >
                            <Save size={18} /> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default FaqsAdmin;