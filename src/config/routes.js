import React from 'react'
import Main from '../components/layouts/Main';
import Blank from '../components/layouts/Blank';

import Overview_View from '../views/Overview';
import MapView from '../views/Maps/BaseMap';
//import Boulevard_Map from '../views/Overview';
import Tracking_view from '../views/Tracking/View';

import { Router, Route, MemoryRouter, Switch,} from 'react-router';
import { BrowserRouter } from 'react-router-dom'




export default (
    <Switch>

        <Route path="/"  exact component={Overview_View} />
        <Route path="/overview"  component={Overview_View } />

        <Route path="/map"  component={MapView} />
        <Route path="/tracking/:mac"  component={Tracking_view} />        
        <Route path="/tracking"  component={Tracking_view} />
    
    </Switch>           

);