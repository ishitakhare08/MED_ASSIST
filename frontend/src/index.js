import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SymptomsContextProvider } from './context/SymptomContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SymptomsContextProvider>
        <App />
      </SymptomsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

