import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Plus, Edit, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import {
  getAppointments,
  updateAppointment,
  createAppointment,
  deleteAppointment,
  getAppointmentStatuses
} from '../../lib/api';
import AppointmentForm from './AppointmentForm';
import { toast } from 'react-toastify';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [appointmentStatuses, setAppointmentStatuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadStatuses();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, selectedDate, statusFilter]);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error al cargar las citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatuses = async () => {
    try {
      const data = await getAppointmentStatuses();
      setAppointmentStatuses(data);
    } catch (error) {
      console.error('Error cargando estados:', error);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(appt => appt.estado === statusFilter);
    }

    if (selectedDate?.trim()) {
      filtered = filtered.filter(appt => appt.fecha_hora === selectedDate);
    }

    const estadoOrden = { 'PEND': 0, 'CONF': 1, 'REAL': 2, 'CANC': 3 };
    filtered.sort((a, b) => (estadoOrden[a.estado] ?? 99) - (estadoOrden[b.estado] ?? 99));

    setFilteredAppointments(filtered);
  };

  const handleSaveAppointment = async () => {
    await loadAppointments();
    setShowForm(false);
    setSelectedAppointment(null);
  };

  const confirmDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteAppointment(appointmentToDelete.id);
      toast.success("Cita eliminada correctamente");
      setShowDeleteModal(false);
      setAppointmentToDelete(null);
      await loadAppointments();
    } catch (error) {
      toast.error("Error al eliminar la cita");
      console.error("Error al eliminar cita:", error);
    }
  };

  const handleStatusChange = async (appointment, newStatus) => {
    try {
      await updateAppointment(appointment.id, {
        paciente_id: appointment.paciente?.id,
        colaborador_id: appointment.colaborador?.id,
        servicio_id: appointment.servicio?.id,
        aperitivos: appointment.aperitivos?.map(s => s.id) || [],
        fecha_hora: appointment.fecha_hora,
        hora: appointment.hora,
        estado: newStatus,
        notas: appointment.notas,
        saldo_pend: appointment.saldo_pend
      });
      toast.success("Estado actualizado");
      await loadAppointments();
    } catch (error) {
      toast.error("Error al actualizar estado");
      console.error('Error actualizando estado:', error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <AppointmentForm
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
        onCancel={() => {
          setShowForm(false);
          setSelectedAppointment(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="all">Todos los estados</option>
              {appointmentStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleNewAppointment}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* Lista de Citas */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-emerald-500 rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border divide-y max-h-[calc(100vh-220px)] overflow-y-auto">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No hay citas registradas</div>
          ) : (
            filteredAppointments.map((appt) => (
              <div key={appt.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-gray-800">
                    {appt.paciente?.nombres} {appt.paciente?.apellidos}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {appt.servicio?.nombre || 'Servicio'}
                  </p>
                  <div className="text-sm text-gray-600 flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    {appt.fecha_hora}
                    <Clock className="h-4 w-4" />
                    {appt.hora}
                  </div>
                  {appt.notas && (
                    <p className="text-sm mt-1 text-gray-500 bg-gray-50 p-2 rounded">{appt.notas}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                    {appointmentStatuses.find(s => s.value === appt.estado)?.label || appt.estado}
                  </span>
                  {appt.estado === 'PEND' && (
                    <>
                      <button onClick={() => handleStatusChange(appt, 'REAL')} title="Marcar como realizada">
                        <CheckCircle className="text-green-600 hover:text-green-800" />
                      </button>
                      <button onClick={() => handleStatusChange(appt, 'CANC')} title="Cancelar">
                        <XCircle className="text-red-600 hover:text-red-800" />
                      </button>
                    </>
                  )}
                  <button onClick={() => handleEditAppointment(appt)} title="Editar">
                    <Edit className="text-emerald-600 hover:text-emerald-800" />
                  </button>
                  <button onClick={() => confirmDeleteAppointment(appt)} title="Eliminar">
                    <Trash2 className="text-red-600 hover:text-red-800" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Confirmación Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Eliminar Cita?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Deseas eliminar la cita del paciente <strong>{appointmentToDelete?.paciente?.nombres}</strong>?
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
