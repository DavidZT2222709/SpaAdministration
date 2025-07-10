import api from './axiosClient'

export const getPatients = () => api.get('pacientes/').then(res => res.data);
export const getPatient = (id) => api.get(`pacientes/${id}/`).then(res => res.data);
export const createPatient = (data) => api.post('pacientes/', data);
export const updatePatient = (id, data) => api.put(`pacientes/${id}/`, data);
export const deletePatient = (id) => api.delete(`pacientes/${id}/`);

// ---------------------- CITAS ----------------------
export const getAppointments = () => api.get('citas/').then(res => res.data);
export const getAppointment = (id) => api.get(`citas/${id}/`).then(res => res.data);
export const createAppointment = (data) => api.post('citas/', data);
export const updateAppointment = (id, data) => api.put(`citas/${id}/`, data);
export const deleteAppointment = (id) => api.delete(`citas/${id}/`);

// ---------------------- HISTORIAS CLÍNICAS ----------------------
export async function getMedicalRecords() {
  const response = await axios.get('/api/historias-clinicas/');
  return response.data;
}
export const updateMedicalRecord = (id, data) =>
  axios.put(`/api/historias/${id}/`, data).then(res => res.data);

// ---------------------- TRATAMIENTOS ----------------------
export const getTreatments = () => api.get('tratamientos/').then(res => res.data);
export const getTreatment = (id) => api.get(`tratamientos/${id}/`).then(res => res.data);
export const createTreatment = (data) => api.post('tratamientos/', data);
export const updateTreatment = (id, data) => api.put(`tratamientos/${id}/`, data);
export const deleteTreatment = (id) => api.delete(`tratamientos/${id}/`);

// ---------------------- TRATAMIENTOS ----------------------
export const getSnacks = () => api.get('aperitivos/').then(res => res.data);
export const getSnack = (id) => api.get(`aperitivos/${id}/`).then(res => res.data);
export const createSnack = (data) => api.post('aperitivos/', data);
export const updateSnack = (id, data) => api.put(`aperitivos/${id}/`, data);
export const deleteSnack = (id) => api.delete(`aperitivos/${id}/`);

// ---------------------- SERVICIOS ----------------------
export const getServices = () => api.get('servicios/').then(res => res.data);
export const getService = (id) => api.get(`servicios/${id}/`).then(res => res.data);
export const createService = (data) => api.post('servicios/', data);
export const updateService = (id, data) => api.put(`servicios/${id}/`, data);
export const deleteService = (id) => api.delete(`servicios/${id}/`);

// ---------------------- TRABAJADORES ----------------------
export const getWorkers = () => api.get('trabajadores/').then(res => res.data);
export const getWorker = (id) => api.get(`trabajadores/${id}/`).then(res => res.data);
export const createWorker = (data) => api.post('trabajadores/', data);
export const updateWorker = (id, data) => api.put(`trabajadores/${id}/`, data);
export const deleteWorker = (id) => api.delete(`trabajadores/${id}/`);

//------------------------TIPO DE DOCUMENTOS(PACIENTE)------------------
export const getDocumentTypes = () => api.get('tipos-documento/').then(res => res.data);

//------------------------ESTADOS DE LAS CITAS------------------
export const getAppointmentStatuses = () => api.get('estados-cita/').then(res => res.data);

//------------------------TIPO DE DOCUMENTOS(COLABORADOR)------------------
export const getDocumentTypes2 = () => api.get('tipos-documento2/').then(res => res.data);
