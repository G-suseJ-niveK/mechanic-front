import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from '~ui/components/ScrollToTop';

const App: React.FC<{}> = () => {
  return (
    <HelmetProvider>
      <BrowserRouter basename="/">
        <SnackbarProvider>
          <ScrollToTop />
          <Router />
        </SnackbarProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default React.memo(App);
