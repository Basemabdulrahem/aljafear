import React from 'react';

import {get} from '../../lib';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/_LineChart';
export default class extends React.Component{
    constructor(){
        super();
        this.state = {
            data:[],
            count:0
        };
    }
    componentDidMount(){
        get("api/touches/getPeopleInWeek").then((r)=>{
            let list =  r.data.aggregations['date_histogram#date'].buckets;
            let count = 0;
            let data = list.map((e)=>{
                let x = e.key_as_string.split('T')[0];
                let y = e['cardinality#unique'].value;
                count = count + y;
                return {x, y};
            });
            this.setState({ data, count});
        });
    }
    render(){
        if(this.state.data.length == 0) return (null);
        return(
            <div>
                <div style={{position:'relative'}}>
                    <h4 className="pull-right">Number of devices this week : <b>{this.state.count}</b></h4>
                </div>
                {(this.state.data.length != 0 )?(<LineChart data={this.state.data} />):null}
            </div>
            );
    }
}