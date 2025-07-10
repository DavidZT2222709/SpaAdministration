import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import PatientList from './components/patients/PatientList';
import AppointmentList from './components/appointments/AppointmentList';
import Settings from './components/settings/SettingsPanel';
import MedicalRecordList from './components/medical-records/MedicalRecordList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

const viewTitles = {
  dashboard: 'Dashboard',
  appointments: 'Citas',
  patients: 'Pacientes',
  'medical-records': 'Historias Clínicas',
  settings: 'Configuración'
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <AppointmentList />;
      case 'patients':
        return <PatientList />;
      case 'settings':
        return <Settings/>;
      case 'medical-records':
        return <MedicalRecordList/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[activeView]} />
        <main className="flex-1 overflow-auto p-6">
          {renderActiveView()}
        </main>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}

export default App;