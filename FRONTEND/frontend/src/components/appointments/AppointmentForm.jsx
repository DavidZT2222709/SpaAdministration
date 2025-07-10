import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getPatients,
  getWorkers,
  getServices,
  createAppointment,
  updateAppointment,
  getSnacks,
} from '../../lib/api';

export default function AppointmentForm({ appointment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    paciente_id: '',
    colaborador_id: '',
    servicio_id: '',
    fecha_hora: '',
    hora: '',
    notas: '',
    saldo_pend: '',
    estado: 'PEND',
    aperitivos: []
  });

  const [patients, setPatients] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [errors, setErrors] = useState({});

  // Nuevos estados para el buscador de pacientes
  const [query, setQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadData();

    if (appointment) {
      setFormData({
        paciente_id: appointment.paciente?.id || '',
        colaborador_id: appointment.colaborador?.id || '',
        servicio_id: appointment.servicio?.id || '',
        fecha_hora: appointment.fecha_hora || '',
        hora: appointment.hora || '',
        notas: appointment.notas || '',
        saldo_pend: appointment.saldo_pend || '',
        estado: appointment.estado || 'PEND',
        aperitivos: appointment.aperitivos_info?.map((s) => s.id) || []
      });

      if (appointment.paciente) {
        setQuery(`${appointment.paciente.nombres} ${appointment.paciente.apellidos}`);
      }
    }
  }, [appointment]);

  const loadData = async () => {
    try {
      const [pats, works, servs, snacksRes] = await Promise.all([
        getPatients(),
        getWorkers(),
        getServices(),
        getSnacks()
      ]);
      setPatients(pats);
      setWorkers(works);
      setServices(servs);
      setSnacks(snacksRes);
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const handleSnackToggle = (snackId) => {
    const alreadySelected = formData.aperitivos.includes(snackId);
    const newSelection = alreadySelected
      ? formData.aperitivos.filter(id => id !== snackId)
      : [...formData.aperitivos, snackId];

    const totalSnackPrice = snacks
      .filter(s => newSelection.includes(s.id))
      .reduce((sum, s) => sum + parseFloat(s.precio), 0);

    const servicioPrecio = parseFloat(
      services.find(s => s.id === parseInt(formData.servicio_id))?.precio || 0
    );

    setFormData((prev) => ({
      ...prev,
      aperitivos: newSelection,
      saldo_pend: (servicioPrecio + totalSnackPrice).toFixed(2)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'servicio_id') {
      const selectedService = services.find((s) => s.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        saldo_pend: selectedService ? selectedService.precio : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePatientSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    const results = patients.filter((p) => {
      const fullName = `${p.nombres} ${p.apellidos}`.toLowerCase();
      return fullName.includes(value.toLowerCase());
    });

    setFilteredPatients(results);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.paciente_id) newErrors.paciente_id = 'Requerido';
    if (!formData.colaborador_id) newErrors.colaborador_id = 'Requerido';
    if (!formData.servicio_id) newErrors.servicio_id = 'Requerido';
    if (!formData.fecha_hora) newErrors.fecha_hora = 'Requerido';
    if (!formData.hora) newErrors.hora = 'Requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        aperitivos: formData.aperitivos
      };

      if (appointment?.id) {
        await updateAppointment(appointment.id, payload);
        toast.success("Cita actualizada correctamente");
      } else {
        await createAppointment({ ...payload, estado: 'PEND' });
        toast.success("Cita registrada correctamente");
      }
      if (onSave) onSave();
    } catch (err) {
      toast.error("Error al guardar cita");
      console.error('Error al guardar cita:', err);
      console.error("Detalles del error:", err.response?.data || err.message);
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
          {appointment ? 'Editar Cita' : 'Nueva Cita'}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Buscador de paciente */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">Paciente</label>
              <input
                type="text"
                placeholder="Buscar paciente por nombre..."
                value={query}
                onChange={handlePatientSearch}
                onFocus={() => setShowSuggestions(true)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.paciente_id ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.paciente_id && <p className="text-sm text-red-600">{errors.paciente_id}</p>}

              {showSuggestions && query && filteredPatients.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-lg max-h-48 overflow-y-auto w-full shadow">
                  {filteredPatients.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => {
                        setFormData({ ...formData, paciente_id: p.id });
                        setQuery(`${p.nombres} ${p.apellidos}`);
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-emerald-100"
                    >
                      {p.nombres} {p.apellidos}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Colaborador */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Colaborador</label>
              <select
                name="colaborador_id"
                value={formData.colaborador_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.colaborador_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona un colaborador</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nombres} {w.apellidos}
                  </option>
                ))}
              </select>
              {errors.colaborador_id && <p className="text-sm text-red-600">{errors.colaborador_id}</p>}
            </div>

            {/* Servicio */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Servicio</label>
              <select
                name="servicio_id"
                value={formData.servicio_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.servicio_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona un servicio</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              {errors.servicio_id && <p className="text-sm text-red-600">{errors.servicio_id}</p>}
            </div>

            {/* Aperitivos */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Aperitivos</label>
              <div className="space-y-2">
                {snacks.map((snack) => (
                  <label key={snack.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.aperitivos.includes(snack.id)}
                      onChange={() => handleSnackToggle(snack.id, snack.precio)}
                      className="rounded border-gray-300"
                    />
                    <span>{snack.nombre} (${snack.precio})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Precio */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Precio</label>
              <input
                type="text"
                name="saldo_pend"
                value={formData.saldo_pend}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 border-gray-300"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                name="fecha_hora"
                value={formData.fecha_hora}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.fecha_hora ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fecha_hora && <p className="text-sm text-red-600">{errors.fecha_hora}</p>}
            </div>

            {/* Hora */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Hora</label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.hora ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.hora && <p className="text-sm text-red-600">{errors.hora}</p>}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
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
