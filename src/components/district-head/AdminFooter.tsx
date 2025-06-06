import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="bg-white shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 Gujarat Health Monitor - Admin Portal. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Admin Guide</a>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Documentation</a>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;