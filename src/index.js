import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route, StaticRouter } from 'react-router';
import routes from './config/routes';
import { scaleOrdinal} from 'd3-scale';

import './global';

import metismenu from 'metismenu';
import bootstrap from 'bootstrap';
import { utc } from 'moment';

import './../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './../node_modules/font-awesome/css/font-awesome.css'
import './../node_modules/animate.css/animate.min.css'
import 'react-vis/dist/style.css';
//import 'react-bubble-chart/src/style.css';
import registerServiceWorker from './registerServiceWorker';
import './../public/styles/style.css'
import './../public/styles/utils.css'
import LoginView from './views/Login/View';
import Main from './components/layouts/Main';
import { BrowserRouter,HashRouter } from 'react-router-dom'

registerServiceWorker();

let isAuthenticated = true;

// if(localStorage.getItem("token"))
// {
//     let exp = localStorage.getItem("exp");
//     let isExpired = utc().unix() > exp;
//     if(!isExpired)
//         isAuthenticated = true;
// }

if(isAuthenticated)
    ReactDOM.render(
    <HashRouter >
        <Route path="/" component={Main} />
    </HashRouter>,
        document.getElementById('root')
    );
else
    ReactDOM.render(<LoginView />,document.getElementById('root'));