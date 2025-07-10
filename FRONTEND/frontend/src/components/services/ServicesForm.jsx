import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { getTreatments, createService, updateService } from "../../lib/api";
import { toast } from "react-toastify";

export default function ServicesForm({ service, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    duracion: '',
    precio: '',
    tratamientos: []
  });

  const [errors, setErrors] = useState({});
  const [allTreatments, setAllTreatments] = useState([]);
  const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState([]);

  useEffect(() => {
    getTreatments().then(setAllTreatments).catch(console.error);
  }, []);

  useEffect(() => {
    if (service) {
      setFormData({
        nombre: service.nombre || '',
        duracion: service.duracion || '',
        precio: service.precio || '',
        tratamientos: service.tratamientos || []
      });
      setSelectedTreatmentIds(service.tratamientos?.map(t => t.id) || []);
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.duracion) newErrors.duracion = 'La duración es requerida';
    if (!formData.precio) newErrors.precio = 'El precio es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleTreatment = (id) => {
    setSelectedTreatmentIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const applyTreatments = () => {
    setFormData(prev => ({
      ...prev,
      tratamientos: allTreatments.filter(t => selectedTreatmentIds.includes(t.id))
    }));
    setShowTreatmentSelector(false);
  };

  const removeTreatment = (id) => {
    setSelectedTreatmentIds((prev) => prev.filter(t => t !== id));
    setFormData(prev => ({
      ...prev,
      tratamientos: prev.tratamientos.filter(t => t.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      tratamientos: selectedTreatmentIds
    };

    try {
      if (service?.id) {
        await updateService(service.id, payload);
        toast.success("Servicio actualizado correctamente");
      } else {
        await createService(payload);
        toast.success("Servicio registrado correctamente");
      }
      if (onSave) onSave();
    } catch (error) {
      toast.error("Error al guardar el servicio");
      console.error("Error al guardar el servicio:", error);
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
          {service ? "Editar Servicio" : "Nuevo Servicio"}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.precio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.precio && <p className="text-sm text-red-600">{errors.precio}</p>}
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
              <select
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.duracion ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Seleccionar duración</option>
                {[15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((min) => (
                  <option key={min} value={min}>{min} minutos</option>
                ))}
              </select>
              {errors.duracion && <p className="text-sm text-red-600">{errors.duracion}</p>}
            </div>

            {/* Tratamientos */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tratamientos</label>
              <button
                type="button"
                onClick={() => setShowTreatmentSelector(true)}
                className="mb-2 text-sm text-emerald-600 hover:underline"
              >
                Ver lista de tratamientos
              </button>

              {/* Tratamientos seleccionados */}
              {formData.tratamientos.length > 0 && (
                <div className="space-y-2">
                  {formData.tratamientos.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                    >
                      <span>{t.nombre}</span>
                      <button
                        type="button"
                        onClick={() => removeTreatment(t.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selector flotante */}
          {showTreatmentSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                <h3 className="text-lg font-semibold">Selecciona tratamientos</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {allTreatments.map((t) => (
                    <label key={t.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTreatmentIds.includes(t.id)}
                        onChange={() => toggleTreatment(t.id)}
                      />
                      <span>{t.nombre}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowTreatmentSelector(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={applyTreatments}
                    className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          )}

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
