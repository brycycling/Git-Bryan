import React from 'react';
import { AssessmentForm } from './components/AssessmentForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AssessmentForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;