"use client";
import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface Message {
  onClose: () => void;
  message?: string;
}

const ErrorModal: React.FC<Message> = ({ onClose, message = "" }) => {
  //passing error message as props
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-black">Error</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message */}
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-gray-800 leading-relaxed mb-6">
          {message}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 text-sm font-semibold rounded-lg text-black bg-white hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
