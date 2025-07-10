import React, { useEffect, useState, useRef } from 'react';
import { getPatients, getAppointments } from '../../lib/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function MedicalRecordList() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    getPatients().then((data) => {
      setPatients(data);
      setFilteredPatients(data);
    });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        p.nombres.toLowerCase().includes(query) ||
        p.apellidos.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const allAppointments = await getAppointments();
      const patientAppointments = allAppointments.filter(
        (cita) => cita.paciente?.id === patient.id
      );
      setAppointments(patientAppointments);
    } catch (err) {
      console.error('Error cargando citas:', err);
    }
  };

  const exportToPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`historia_clinica_${selectedPatient?.nombres}_${selectedPatient?.apellidos}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Historias Clínicas</h2>

        <input
          type="text"
          placeholder="Buscar paciente..."
          onChange={handleSearch}
          className="w-full max-w-sm mb-4 px-3 py-2 border border-gray-300 rounded-lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              className="cursor-pointer p-4 border rounded hover:border-emerald-500"
              onClick={() => handleSelectPatient(p)}
            >
              <p className="font-semibold text-gray-800">
                {p.nombres} {p.apellidos}
              </p>
              <p className="text-sm text-gray-500">{p.numero_documento}</p>
            </div>
          ))}
        </div>

        {selectedPatient && (
          <div className="flex justify-end mb-4">
            <button
              onClick={exportToPDF}
              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
            >
              Descargar PDF
            </button>
          </div>
        )}

        <div ref={printRef}>
          {selectedPatient && (
            <div className="bg-gray-50 p-4 rounded border mb-6">
              <h3 className="text-lg font-semibold mb-2">Paciente:</h3>
              <p><strong>Nombre:</strong> {selectedPatient.nombres} {selectedPatient.apellidos}</p>
              <p><strong>Documento:</strong> {selectedPatient.tipo_documento} {selectedPatient.numero_documento}</p>
              <p><strong>Celular:</strong> {selectedPatient.celular}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Fecha de nacimiento:</strong> {selectedPatient.fecha_nacimiento}</p>
            </div>
          )}

          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <p><strong>Fecha:</strong> {appt.fecha_hora}</p>
                  <p><strong>Hora:</strong> {appt.hora}</p>
                  <p><strong>Servicio:</strong> {appt.servicio?.nombre || 'N/A'}</p>
                  <p><strong>Colaborador:</strong> {appt.colaborador?.nombres || 'N/A'} {appt.colaborador?.apellidos || ''}</p>
                  <p><strong>Notas:</strong> {appt.notas || 'N/A'}</p>
                  <p><strong>Saldo Pendiente:</strong> ${appt.saldo_pend}</p>
                  <p><strong>Estado:</strong> {appt.estado}</p>
                </div>
              ))}
            </div>
          ) : selectedPatient ? (
            <p className="text-gray-500">Este paciente aún no tiene citas registradas.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
