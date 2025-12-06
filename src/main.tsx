import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import 'dayjs/locale/tr';

//CSS
import dayjs from 'dayjs';
import Head from './components/Head.tsx';

const container = document.getElementById('root');

dayjs.locale('tr');

ReactDOM.createRoot(container!).render(
  <React.Fragment>
    <Head />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.Fragment>,
);
