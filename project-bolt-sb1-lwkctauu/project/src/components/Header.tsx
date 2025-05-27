import React from 'react';
import { Stethoscope } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">Antipsychotic Assessment Tool</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Guidelines</a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Resources</a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Help</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}