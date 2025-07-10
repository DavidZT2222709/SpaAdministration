import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { getWorkers, createWorker, updateWorker, deleteWorker } from '../../lib/api';
import WorkersForm from './WorkersForm';
import { toast } from 'react-toastify';

export default function WorkerList() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    const filtered = workers.filter(worker =>
      `${worker.nombres} ${worker.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.numero_documento.includes(searchTerm) ||
      worker.celular.includes(searchTerm)
    );
    setFilteredWorkers(filtered);
  }, [searchTerm, workers]);

  const loadWorkers = async () => {
    try {
      const data = await getWorkers();
      setWorkers(data);
    } catch (error) {
      console.error('Error cargando colaboradores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorker = async (workerData) => {
    try {
      if (selectedWorker) {
        await updateWorker(selectedWorker.id, workerData);
      } else {
        await createWorker(workerData);
      }
      await loadWorkers();
      setShowForm(false);
      setSelectedWorker(null);
    } catch (error) {
      console.error('Error guardando colaborador:', error);
      console.error("Detalles del error:", error.response?.data || error.message);
    }
  };

  const confirmDeleteWorker = (worker) => {
    setWorkerToDelete(worker);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteWorker(workerToDelete.id);
      toast.success("Colaborador eliminado correctamente");
      setShowDeleteModal(false);
      setWorkerToDelete(null);
      await loadWorkers();
    } catch (error) {
      toast.error("Error al eliminar colaborador");
      console.error("Error al eliminar colaborador:", error);
    }
  };

  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setShowForm(true);
  };

  const handleNewWorker = () => {
    setSelectedWorker(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <WorkersForm
        worker={selectedWorker}
        onSave={handleSaveWorker}
        onCancel={() => {
          setShowForm(false);
          setSelectedWorker(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Buscador y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar colaboradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleNewWorker}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Colaborador</span>
        </button>
      </div>

      {/* Lista de trabajadores */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No se encontraron colaboradores</div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Celular</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorkers.map(worker => (
                  <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{worker.nombres} {worker.apellidos}</td>
                    <td className="px-6 py-4">{worker.tipo_documento} {worker.numero_documento}</td>
                    <td className="px-6 py-4">{worker.celular}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditWorker(worker)}
                          className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDeleteWorker(worker)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Eliminar"
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
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar Colaborador?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Deseas eliminar al colaborador <strong>{workerToDelete?.nombres} {workerToDelete?.apellidos}</strong>?
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
