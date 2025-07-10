import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import {
  getPatients,
  deletePatient
} from '../../lib/api';
import PatientForm from './PatientForm';
import PatientView from './PatientView';
import { toast } from 'react-toastify';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      `${patient.nombres} ${patient.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.celular && patient.celular.includes(searchTerm))
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePatient = async () => {
    await loadPatients();
    setShowForm(false);
    setSelectedPatient(null);
  };

  const confirmDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deletePatient(patientToDelete.id);
      toast.success('Paciente eliminado correctamente');
      setShowDeleteModal(false);
      setPatientToDelete(null);
      await loadPatients();
    } catch (error) {
      toast.error('Error al eliminar paciente');
      console.error('Error deleting patient:', error);
    }
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowForm(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowView(true);
  };

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <PatientForm
        patient={selectedPatient}
        onSave={handleSavePatient}
        onCancel={() => {
          setShowForm(false);
          setSelectedPatient(null);
        }}
      />
    );
  }

  if (showView && selectedPatient) {
    return (
      <PatientView
        patient={selectedPatient}
        onClose={() => {
          setShowView(false);
          setSelectedPatient(null);
        }}
        onEdit={() => {
          setShowView(false);
          handleEditPatient(selectedPatient);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleNewPatient}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      {/* Patients List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron pacientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nacimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{patient.nombres} {patient.apellidos}</div>
                        {patient.condiciones_medicas && (
                          <div className="text-sm text-gray-500">Condiciones médicas</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.celular}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.fecha_nacimiento ? patient.fecha_nacimiento.split('-').reverse().join('/') : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewPatient(patient)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDeletePatient(patient)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Confirmación Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar Paciente?</h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de eliminar al paciente <strong>{patientToDelete?.nombres} {patientToDelete?.apellidos}</strong>? Esta acción no se puede deshacer.
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
