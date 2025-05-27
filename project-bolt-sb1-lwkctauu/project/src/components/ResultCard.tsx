import React from 'react';
import { Loader2 } from 'lucide-react';

interface ResultCardProps {
  result: number | null;
  isCalculating: boolean;
  operation: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, isCalculating, operation }) => {
  const getOperationSymbol = (op: string) => {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      case 'power': return '^';
      default: return '';
    }
  };

  const getResultLabel = () => {
    switch (operation) {
      case 'add': return 'Sum';
      case 'subtract': return 'Difference';
      case 'multiply': return 'Product';
      case 'divide': return 'Quotient';
      case 'power': return 'Result';
      default: return 'Result';
    }
  };

  return (
    <div className="bg-blue-50 p-6 sm:p-8 border-t border-blue-100">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-gray-700">{getResultLabel()}</span>
        <span className="text-xs font-medium text-blue-600 bg-blue-100 py-1 px-2 rounded-full">
          Operation: {getOperationSymbol(operation)}
        </span>
      </div>
      
      <div className="mt-3">
        {isCalculating ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600">Calculating...</span>
          </div>
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800 transition-all duration-500 animate-fade-in">
              {result !== null ? result.toLocaleString('en-US', { maximumFractionDigits: 10 }) : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};