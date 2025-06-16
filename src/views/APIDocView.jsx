
import React from 'react';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const APIDocView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              🚀 Gemini OS API Documentation
            </h1>
            <p className="mt-2 text-gray-600">
              Complete API reference for webhooks, multilingual GPT, and tier management
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <SwaggerUI 
            url="/docs/swagger.json"
            deepLinking={true}
            displayRequestDuration={true}
          />
        </div>
      </div>
    </div>
  );
};

export default APIDocView;
