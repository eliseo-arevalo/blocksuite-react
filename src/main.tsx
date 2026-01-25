import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/app.css';
import './styles/overrides.css';

// Hide the loading screen once React is ready
const hideLoader = () => {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hide loader after initial render
setTimeout(hideLoader, 100);
