export const calculateResults = (num1: number, num2: number, operation: string): number => {
  switch (operation) {
    case 'add':
      return num1 + num2;
    case 'subtract':
      return num1 - num2;
    case 'multiply':
      return num1 * num2;
    case 'divide':
      if (num2 === 0) {
        throw new Error('Cannot divide by zero');
      }
      return num1 / num2;
    case 'power':
      return Math.pow(num1, num2);
    default:
      throw new Error('Invalid operation');
  }
};