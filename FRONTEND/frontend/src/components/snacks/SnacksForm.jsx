import React, { useEffect, useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { createSnack, updateSnack } from '../../lib/api';

export default function SnacksForm({ snack, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: ''
  });

  useEffect(() => {
    if (snack) {
      setFormData({
        nombre: snack.nombre || '',
        precio: snack.precio || ''
      });
    }
  }, [snack]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (snack?.id) {
        await updateSnack(snack.id, formData);
        toast.success('Aperitivo actualizado');
      } else {
        await createSnack(formData);
        toast.success('Aperitivo creado');
      }
      if (onSave) onSave();
    } catch (error) {
      toast.error('Error al guardar');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold">{snack ? 'Editar Aperitivo' : 'Nuevo Aperitivo'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">Precio (COP)</label>
          <input
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
