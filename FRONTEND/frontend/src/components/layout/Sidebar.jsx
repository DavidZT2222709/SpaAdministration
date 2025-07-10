import React from 'react';
import { Calendar, Users, FileText, BarChart3, Settings, Vegan as Spa } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'appointments', label: 'Citas', icon: Calendar },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'medical-records', label: 'Historias Clínicas', icon: FileText },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <div className="w-64 bg-gradient-to-b from-emerald-50 to-teal-50 border-r border-emerald-100 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-100">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Spa className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Belleza Plena</h1>
            <p className="text-sm text-gray-600">Administrador de Información</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-100">
        <div className="text-xs text-gray-500 text-center">
          <p>SerenSpa Management</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
}