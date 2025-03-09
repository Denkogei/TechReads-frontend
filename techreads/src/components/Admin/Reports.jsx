import React from 'react';
import Sidebar from "./Sidebar";

function Reports() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 fixed h-full bg-white shadow-xl">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reports Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            This feature is currently under development
          </p>
          <p className="text-gray-500 mt-4">
            Check back soon for exciting updates!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Reports;