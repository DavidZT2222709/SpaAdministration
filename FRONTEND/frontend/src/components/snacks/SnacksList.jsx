import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { getSnacks, deleteSnack } from '../../lib/api';
import SnacksForm from './SnacksForm';
import { toast } from 'react-toastify';

export default function SnacksList() {
  const [snacks, setSnacks] = useState([]);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [snackToDelete, setSnackToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadSnacks();
  }, []);

  const loadSnacks = async () => {
    try {
      const data = await getSnacks();
      setSnacks(data);
    } catch (err) {
      console.error('Error cargando aperitivos:', err);
    }
  };

  const handleEdit = (snack) => {
    setSelectedSnack(snack);
    setShowForm(true);
  };

  const confirmDelete = (snack) => {
    setSnackToDelete(snack);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteSnack(snackToDelete.id);
      toast.success('Aperitivo eliminado correctamente');
      setSnackToDelete(null);
      setShowDeleteModal(false);
      loadSnacks();
    } catch (err) {
      toast.error('Error al eliminar aperitivo');
      console.error(err);
    }
  };

  if (showForm) {
    return (
      <SnacksForm
        snack={selectedSnack}
        onSave={() => {
          setShowForm(false);
          setSelectedSnack(null);
          loadSnacks();
        }}
        onCancel={() => {
          setShowForm(false);
          setSelectedSnack(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Aperitivos</h2>
        <button
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2"
          onClick={() => {
            setSelectedSnack(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-5 w-5" />
          Nuevo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border divide-y">
        {snacks.map((snack) => (
          <div key={snack.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-800">{snack.nombre}</h3>
              <p className="text-sm text-gray-600">${snack.precio}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(snack)} title="Editar">
                <Edit className="text-emerald-600 hover:text-emerald-800" />
              </button>
              <button onClick={() => confirmDelete(snack)} title="Eliminar">
                <Trash2 className="text-red-600 hover:text-red-800" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar Aperitivo?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Deseas eliminar el aperitivo <strong>{snackToDelete?.nombre}</strong>?
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
