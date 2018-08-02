import React from 'react';
import axios from 'axios';
import { IBox, IBoxContent, IBoxTitle } from '../ui'
import {get} from '../../lib';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/_LineChart';
import { mapSubAggregationToData } from '../../utils/statistics';
import Moment from 'moment';
export default class extends React.Component{
    constructor(){
        super();
        let month = this._generateMonthList();
        this.state = {
            data:[],
            count:0,
            months:month,
            acitve_month:month[0].props.children.props.children,
        };
        
    }
    _generateMonthList(){
        let oldest_month = 7;
        let oldest_year = 2017;
        let loop = true;

        let now = Moment.utc();
        let list = [];
        while(loop){
            list.push(
                <li key={now.format("MM,YYYY")}>
                    <a onClick={this._onMonthChange.bind(this,now.month()+1,now.year())}  href="#">{now.format("MMM YYYY")}</a>
                </li>
            );
            
            if(now.month() == 8 && now.year() == 2017)
                loop = false;
            now = now.subtract('1','month');
        }
        return list;        
    }
    _onMonthChange(month,year){
        let acitve_month = Moment().month(month-1).year(year).format("MMM YYYY");
        this.setState({data:[],acitve_month});
        let count = 0;
        get(`api/touches/peopleInMonth/${month}/${year}`).then((r)=>{
            let list =  r.data.aggregations['date_histogram#date'].buckets;
            let data = list.map((e)=>{
                let x = e.key_as_string.split('T')[0];
                let y = e['cardinality#unique'].value;
                count = count + y;
                return {x, y};
            });
            this.setState({data,count});
        });
    }
    componentDidMount(){
        
        let time_arr = this.state.months[0].key.split(',');
        let count = 0;

        get(`api/touches/peopleInMonth/${time_arr[0]}/${time_arr[1]}`).then((r)=>{
            let list =  r.data.aggregations['date_histogram#date'].buckets;
            let data = list.map((e)=>{
                let x = e.key_as_string.split('T')[0];
                let y = e['cardinality#unique'].value;
                count = count + y;

                return {x, y};
            });
            this.setState({data,count});
        });
    }
    render(){
        return(
            <div>
                <div style={{position:'relative'}}>
                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                        {this.state.acitve_month}<i className="caret"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-user">
                        {this.state.months}                        
                    </ul>
                    <h4 className="pull-right">Number of devices this month : <b>{this.state.count}</b></h4>
                </div>
                {(this.state.data.length != 0 )?(<LineChart data={this.state.data} />):<h3>We have no data for this month currently.</h3>}
            </div>
        );
    }
}