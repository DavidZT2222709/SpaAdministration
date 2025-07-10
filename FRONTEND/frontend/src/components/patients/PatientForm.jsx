import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  createPatient,
  updatePatient,
  getDocumentTypes
} from '../../lib/api';

export default function PatientForm({ patient, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipo_documento: '',
    numero_documento: '',
    celular: '',
    direccion: '',
    fecha_nacimiento: '',
    emergencia_nombre: '',
    emergencia_number: '',
    condiciones_medicas: '',
    alergias: ''
  });

  const [errors, setErrors] = useState({});
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    if (patient) {
      setFormData({
        nombres: patient.nombres || '',
        apellidos: patient.apellidos || '',
        tipo_documento: patient.tipo_documento || '',
        numero_documento: patient.numero_documento || '',
        celular: patient.celular || '',
        direccion: patient.direccion || '',
        fecha_nacimiento: patient.fecha_nacimiento || '',
        emergencia_nombre: patient.emergencia_nombre || '',
        emergencia_number: patient.emergencia_number || '',
        condiciones_medicas: patient.condiciones_medicas || '',
        alergias: patient.alergias || ''
      });
    }
  }, [patient]);

  useEffect(() => {
    getDocumentTypes()
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
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (patient?.id) {
        await updatePatient(patient.id, formData);
        toast.success("Paciente actualizado correctamente");
      } else {
        await createPatient(formData);
        toast.success("Paciente registrado correctamente");
      }
      if (onSave) onSave();
    } catch (error) {
      console.error("Error al guardar el paciente:", error);
      console.error("Detalles del error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
        </h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Nombres */}
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

              {/* Apellidos */}
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

              {/* Tipo de Documento */}
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

              {/* Número de Documento */}
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

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.fecha_nacimiento && <p className="text-sm text-red-600">{errors.fecha_nacimiento}</p>}
              </div>


              {/* Celular */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular *</label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.celular ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.celular && <p className="text-sm text-red-600">{errors.celular}</p>}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto de Emergencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="emergencia_nombre"
                  value={formData.emergencia_nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                <input
                  type="tel"
                  name="emergencia_number"
                  value={formData.emergencia_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Médica</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condiciones Médicas</label>
                <textarea
                  name="condiciones_medicas"
                  value={formData.condiciones_medicas}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
                <textarea
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
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
