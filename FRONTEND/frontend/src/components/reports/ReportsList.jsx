import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReportsList() {
  const [months, setMonths] = useState([]);

  useEffect(() => {
    fetchAvailableReports();
  }, []);

  const fetchAvailableReports = async () => {
    try {
      const res = await axios.get('/api/reportes/meses/');
      setMonths(res.data); // Ej: ["2025-07", "2025-06", ...]
    } catch (error) {
      console.error('Error cargando meses de reportes', error);
    }
  };

  const handleDownload = async (mes) => {
    try {
      const response = await axios.get(`/api/reportes/${mes}/pdf/`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reporte-${mes}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reportes mensuales</h2>
      <ul className="bg-white shadow rounded divide-y">
        {months.map((mes) => (
          <li key={mes} className="flex justify-between items-center p-4">
            <span>Reporte - {new Date(`${mes}-01`).toLocaleString('es-CO', { month: 'long', year: 'numeric' })}</span>
            <button
              onClick={() => handleDownload(mes)}
              className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600"
            >
              Descargar PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
