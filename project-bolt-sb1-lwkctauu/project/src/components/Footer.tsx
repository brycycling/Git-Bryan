import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Clinical Assessment Tools. For healthcare professional use only.
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
            Terms of Use
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}