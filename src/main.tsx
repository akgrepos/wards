import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../vendor/akg/bundle.css';
import './design/tokens.css';
import './design/base.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
