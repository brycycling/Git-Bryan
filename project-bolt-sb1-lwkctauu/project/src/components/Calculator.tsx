import React, { useState, useEffect } from 'react';
import { InputField } from './InputField';
import { ResultCard } from './ResultCard';
import { calculateResults } from '../utils/calculations';
import { ArrowRight } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [values, setValues] = useState({
    num1: '',
    num2: '',
    operation: 'add'
  });
  
  const [errors, setErrors] = useState({
    num1: '',
    num2: ''
  });
  
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const operations = [
    { value: 'add', label: 'Addition (+)' },
    { value: 'subtract', label: 'Subtraction (-)' },
    { value: 'multiply', label: 'Multiplication (×)' },
    { value: 'divide', label: 'Division (÷)' },
    { value: 'power', label: 'Power (^)' }
  ];

  const validateInput = (name: string, value: string) => {
    if (!value) {
      return `This field is required`;
    }
    
    const num = parseFloat(value);
    if (isNaN(num)) {
      return 'Please enter a valid number';
    }
    
    if (name === 'num2' && values.operation === 'divide' && num === 0) {
      return 'Cannot divide by zero';
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'num1' || name === 'num2') {
      setErrors(prev => ({
        ...prev,
        [name]: validateInput(name, value)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate both inputs
    const num1Error = validateInput('num1', values.num1);
    const num2Error = validateInput('num2', values.num2);
    
    setErrors({
      num1: num1Error,
      num2: num2Error
    });
    
    if (!num1Error && !num2Error) {
      setIsCalculating(true);
      
      // Simulate calculation delay for visual effect
      setTimeout(() => {
        const calculatedResult = calculateResults(
          parseFloat(values.num1),
          parseFloat(values.num2),
          values.operation
        );
        setResult(calculatedResult);
        setIsCalculating(false);
      }, 500);
    } else {
      setResult(null);
    }
  };

  // Calculate result as user types if both inputs are valid
  useEffect(() => {
    if (values.num1 && values.num2 && !errors.num1 && !errors.num2) {
      const newNum2Error = validateInput('num2', values.num2);
      if (!newNum2Error) {
        setIsCalculating(true);
        const timer = setTimeout(() => {
          const calculatedResult = calculateResults(
            parseFloat(values.num1),
            parseFloat(values.num2),
            values.operation
          );
          setResult(calculatedResult);
          setIsCalculating(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [values, errors]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Smart Calculator</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="First Number"
              name="num1"
              value={values.num1}
              onChange={handleChange}
              error={errors.num1}
              placeholder="Enter first number"
            />
            
            <div className="form-control">
              <label htmlFor="operation" className="block text-sm font-medium text-gray-700 mb-1">
                Operation
              </label>
              <select
                id="operation"
                name="operation"
                value={values.operation}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {operations.map(op => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>
            
            <InputField
              label="Second Number"
              name="num2"
              value={values.num2}
              onChange={handleChange}
              error={errors.num2}
              placeholder="Enter second number"
            />
            
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Calculate <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
        
        {(result !== null || isCalculating) && (
          <ResultCard result={result} isCalculating={isCalculating} operation={values.operation} />
        )}
      </div>
    </div>
  );
};