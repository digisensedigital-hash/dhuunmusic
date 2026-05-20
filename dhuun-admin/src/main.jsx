import React from 'react';

import ReactDOM from 'react-dom/client';

import { Toaster } from 'react-hot-toast';

import App from './App';

import './index.css';

import {
  AuthProvider,
} from './context/AuthContext';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>

    <AuthProvider>
      <App />
    </AuthProvider>

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,

        style: {
          background: '#09090b',
          color: '#ffffff',
          border: '1px solid #27272a',
          borderRadius: '16px',
          padding: '14px 16px',
          fontSize: '14px',
        },

        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },

        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />

  </React.StrictMode>
);