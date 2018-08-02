import React from 'react';
import { Widget , IBox, IBoxContent, IBoxTitle } from '../components/ui';
import {lazur_bg, navy_bg , yellow_bg , red_bg} from '../components/ui/Backgrounds';
import { get } from '../lib/index';
import BarChart from '../components/charts/BarChart'
import Moment from 'moment';
import { getAllStations } from '../fetchers/StationsFetcher';
class Main extends React.Component {
    constructor(){
        super();
        this.state={         
            stations:[]
        }
    }
    componentDidMount(){
        getAllStations().then((e) => {

            this.setState({stations:e.data});
        });
    }
    render() {
        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                      <div className="col-xs-12 col-md-4">
                        <Widget backgroundClass={lazur_bg} 
                                icon="fa fa-user" 
                                title="Haj Count" 
                                value={this.state.stations.length} />
                
                
                        </div>             
                </div>
            </div>
        )
    }

}

export default Main