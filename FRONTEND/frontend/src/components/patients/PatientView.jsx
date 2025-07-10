import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Phone, Mail, Calendar, AlertTriangle, FileText } from 'lucide-react';
import { getMedicalRecords } from '../../lib/api';

export default function PatientView({ patient, onClose, onEdit }) {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicalRecords();
  }, [patient.id]);

  const loadMedicalRecords = async () => {
    try {
      const records = await getMedicalRecords(); // si quieres filtrar por paciente, aplica un filtro en el backend o aquí
      const filtered = records.filter(r => r.patient_id === patient.id);
      setMedicalRecords(filtered);
    } catch (error) {
      console.error('Error loading medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {patient.nombres} {patient.apellidos}
            </h2>
            <p className="text-gray-600">Perfil del Paciente</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Editar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{patient.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Celular</p>
                  <p className="font-medium text-gray-800">{patient.celular}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                  <p className="font-medium text-gray-800">
                    {patient.fecha_nacimiento
                      ? `${patient.fecha_nacimiento.split('-').reverse().join('/')} (${calculateAge(patient.fecha_nacimiento)} años)`
                      : '—'}
                  </p>
                </div>
              </div>
              {patient.direccion && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-medium text-gray-800">{patient.direccion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {(patient.contacto_emergencia || patient.celular_emergencia) && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto de Emergencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.contacto_emergencia && (
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-800">{patient.contacto_emergencia}</p>
                  </div>
                )}
                {patient.celular_emergencia && (
                  <div>
                    <p className="text-sm text-gray-600">Celular</p>
                    <p className="font-medium text-gray-800">{patient.celular_emergencia}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical Info */}
          {(patient.condiciones_medicas || patient.alergias) && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Información Médica</span>
              </h3>
              <div className="space-y-4">
                {patient.condiciones_medicas && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Condiciones Médicas</p>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{patient.condiciones_medicas}</p>
                  </div>
                )}
                {patient.alergias && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Alergias</p>
                    <p className="text-gray-800 bg-red-50 p-3 rounded-lg border border-red-200">{patient.alergias}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Registrado desde</span>
                <span className="font-medium">
                  {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Historias clínicas</span>
                <span className="font-medium">{medicalRecords.length}</span>
              </div>
            </div>
          </div>

          {/* Medical Records */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Historias Recientes</span>
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
              </div>
            ) : medicalRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay historias clínicas</p>
            ) : (
              <div className="space-y-3">
                {medicalRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800 text-sm">{record.treatment}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {medicalRecords.length > 3 && (
                  <p className="text-sm text-emerald-600 text-center font-medium">
                    +{medicalRecords.length - 3} más
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
