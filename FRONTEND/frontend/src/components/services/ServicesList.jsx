import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getServices, deleteService } from "../../lib/api";
import ServicesForm from "./ServicesForm";
import { toast } from "react-toastify";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error cargando servicios:", error);
    }
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteService(serviceToDelete.id);
      toast.success("Servicio eliminado correctamente");
      setShowDeleteModal(false);
      setServiceToDelete(null);
      loadServices();
    } catch (err) {
      toast.error("Error al eliminar servicio");
      console.error("Error eliminando servicio:", err);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleNew = () => {
    setSelectedService(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <ServicesForm
        service={selectedService}
        onSave={() => {
          setShowForm(false);
          loadServices();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Servicios</h2>
        <button
          onClick={handleNew}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      <div className="bg-white border rounded-xl shadow-lg">
        {services.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No hay servicios registrados.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duración</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 text-gray-800">{service.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{service.duracion} min</td>
                  <td className="px-6 py-4 text-gray-600">${parseFloat(service.precio).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(service)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar Servicio?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Deseas eliminar el servicio <strong>{serviceToDelete?.nombre}</strong>?
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
