import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getTreatments, createTreatment, updateTreatment, deleteTreatment } from '../../lib/api';
import TreatmentsForm from './TreatmentsForm';
import { toast } from 'react-toastify';

export default function TreatmentsList() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      const data = await getTreatments();
      setTreatments(data);
    } catch (error) {
      console.error('Error cargando tratamientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedTreatment(null);
    setShowForm(true);
  };

  const handleEdit = (treatment) => {
    setSelectedTreatment(treatment);
    setShowForm(true);
  };

  const confirmDeleteTreatment = (treatment) =>{
    setTreatmentToDelete(treatment);
    setShowDeleteModal(true);
  }

  const handleDeleteConfirmed = async () => {
    try {
      await deleteTreatment(treatmentToDelete.id);
      toast.success('Tratamiento eliminado correctamente');
      setShowDeleteModal(false);
      setTreatmentToDelete(null);
      await loadTreatments();
    }catch(error){
      toast.error("Error al eliminar la tratamiento");
      console.error("Error al eliminar tratamiento:", error);
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedTreatment) {
        await updateTreatment(selectedTreatment.id, data);
        toast.success("Tratamiento actualizado correctamente");
      } else {
        await createTreatment(data);
        toast.success("Tratamiento registrado correctamente");
      }
      setShowForm(false);
      setSelectedTreatment(null);
      await loadTreatments();
    } catch (error) {
      console.error('Error guardando tratamiento:', error);
      console.error("Detalles del error:", error.response?.data || error.message);
      throw error; // se propaga para que el formulario lo capture y muestre notificación
    }
  };

  if (showForm) {
    return (
      <TreatmentsForm
        treatment={selectedTreatment}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setSelectedTreatment(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tratamientos</h2>
        <button
          onClick={handleNew}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Tratamiento</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : treatments.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No hay tratamientos registrados</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{treatment.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{treatment.duracion} min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{treatment.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(treatment)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <Edit className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => confirmDeleteTreatment(treatment)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar Cita?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Deseas eliminar el tratamiento de la lista <strong>{treatmentToDelete?.nombre}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
