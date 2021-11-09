import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import store from '~redux-store/store';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from '~ui/components/ScrollToTop';

const App: React.FC<{}> = () => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <SnackbarProvider>
            <ScrollToTop />
            <Router />
          </SnackbarProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
};

export default React.memo(App);
