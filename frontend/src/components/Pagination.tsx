import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}) => {
  return (
    <div className="mt-12 flex justify-center transition-transform duration-500 hover:scale-105">
      <div className="inline-flex items-center space-x-4 bg-white rounded-2xl shadow-lg hover:shadow-xl p-4 border border-gray-200">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page Indicator */}
        <span className="text-sm font-medium text-gray-700">
          Page <span className="font-bold text-gray-900">{page}</span> of{" "}
          <span className="font-bold text-gray-900">{totalPages}</span>
        </span>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
