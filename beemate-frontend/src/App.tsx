import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { ToastProvider } from './context/ToastContext';
import { Toast } from './components/common/Toast';

/**
 * Root application component
 * Provides routing, toast notifications, and global context
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-container">
          <AppRouter />
          <Toast />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;