import React from 'react';
import { Widget , IBox, IBoxContent, IBoxTitle } from '../ui';
import {lazur_bg, navy_bg , yellow_bg , red_bg} from '../ui/Backgrounds';
import { get } from '../../lib';
export default class extends React.Component{
    constructor(){
        super();
        this.state={
            live_sessions : 0,
            total_sessions : 0,
            unique_sessions : 0
        }
    }
    componentDidMount(){
        Promise.all([get('api/livesessions/count'),get('api/sessions/getTodaysDeviceCount')]).then((results)=>{
            let d1 = results[0].data;
            let d2 = results[1].data;
                        
            this.setState({
                live_sessions: d1,
                total_sessions: d2.hits.total + d1,
                unique_sessions: d2.aggregations["cardinality#unique"].value
            });
        });      
    }
    render(){
        return(
        <div>
            <div className="col-xs-12 col-lg-4">
                <Widget icon="fa-cloud" backgroundClass={lazur_bg} title="Live Sessions" value={this.state.live_sessions} />
            </div>
            <div className="col-xs-12 col-lg-4">
                <Widget icon="fa-handshake-o" backgroundClass={lazur_bg} title="Total Number of Sessions Today" value={this.state.total_sessions} />
            </div>
            <div className="col-xs-12 col-lg-4">
                <Widget icon="fa-mobile" backgroundClass={lazur_bg} title="Total Number of Devices Today" value={this.state.unique_sessions} />
            </div>
        </div>);
    }
}