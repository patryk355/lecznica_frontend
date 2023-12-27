import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import App from './App.jsx';
import {AppContextProvider} from './context/appContext.jsx';

import './index.scss';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppContextProvider>
            <HashRouter basename={'/'}>
                <App/>
                <ToastContainer autoClose={2500}/>
            </HashRouter>
        </AppContextProvider>
    </React.StrictMode>
);
