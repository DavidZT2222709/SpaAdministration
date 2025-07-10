import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { getDocumentTypes2 } from "../../lib/api";
import { toast } from "react-toastify";

export default function WorkerForm({ worker, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipo_documento: '',
    numero_documento: '',
    celular: ''
  });

  const [errors, setErrors] = useState({});
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    if (worker) {
      setFormData({
        nombres: worker.nombres || '',
        apellidos: worker.apellidos || '',
        tipo_documento: worker.tipo_documento || '',
        numero_documento: worker.numero_documento || '',
        celular: worker.celular || ''
      });
    }
  }, [worker]);

  useEffect(() => {
    getDocumentTypes2()
      .then(data => setDocumentTypes(data))
      .catch(err => console.error('Error cargando tipos de documento:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombres.trim()) newErrors.nombres = 'El nombre es requerido';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'El apellido es requerido';
    if (!formData.tipo_documento.trim()) newErrors.tipo_documento = 'Seleccione tipo de documento';
    if (!formData.numero_documento.trim()) newErrors.numero_documento = 'Ingrese su número de documento';
    if (!formData.celular.trim()) newErrors.celular = 'El celular es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cleanedData = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      tipo_documento: formData.tipo_documento.trim(),
      numero_documento: formData.numero_documento.trim(),
      celular: formData.celular.trim(),
    };

    try {
      if (onSave) await onSave(cleanedData); // 👈 Esta línea es clave
    } catch (error) {
      toast.error("Error al guardar al colaborador");
      console.error("Error al guardar el colaborador:", error);
      console.error("Detalles del error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {worker ? 'Editar Colaborador' : 'Nuevo Colaborador'}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.nombres ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nombres && <p className="text-sm text-red-600">{errors.nombres}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.apellidos ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.apellidos && <p className="text-sm text-red-600">{errors.apellidos}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento *</label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.tipo_documento ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona un tipo</option>
                {documentTypes.map((tipo) => (
                  <option key={tipo.codigo} value={tipo.codigo}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              {errors.tipo_documento && <p className="text-sm text-red-600">{errors.tipo_documento}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento *</label>
              <input
                type="text"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.numero_documento ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.numero_documento && <p className="text-sm text-red-600">{errors.numero_documento}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celular *</label>
              <input
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.celular ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.celular && <p className="text-sm text-red-600">{errors.celular}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
