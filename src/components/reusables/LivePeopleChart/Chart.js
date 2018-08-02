import React from 'react';
import StackedBarChart from './StackedBarChart';
import {get} from '../../../lib';
import {unix} from 'moment-timezone';

// import moment from 'moment';
export default class extends React.Component{
    constructor(){
        super();
        this.state={
            assoc_data:[],
            unassoc_data:[]
        }
    }
    componentDidMount(){
        get('api/touches/getLastMinutes/15').then((r)=>{
            let buckets = r.data.aggregations['date_histogram#date'].buckets.filter((el) =>  el['lterms#devices'].buckets.length !== 0);;
            let assoc_data = [];
            let unassoc_data = [];
            for (let i = 0; i < buckets.length; i++) {
                const el = buckets[i];
                
                //console.log();
                //let x = el.key_as_string.split('T')[1].slice(0,5);
                let x = unix(el.key/1000).tz("Europe/London").format("HH:mm");
                let unassoc_value = el['lterms#devices'].buckets['0']['cardinality#unique'].value;
                let assoc_value = el['lterms#devices'].buckets['1']['cardinality#unique'].value;
                assoc_data.push({
                    x:x,
                    y:assoc_value
                });
                unassoc_data.push({
                    x:x,
                    y:unassoc_value
                });            
            }
            this.setState({
                assoc_data,
                unassoc_data,
            });
        });
    }
    
    render(){
        return (<div>
                    <div>
                        <span>
                            <span style={{display:'inline-block', backgroundColor:'#FF991F', height:10, width:10,marginLeft:'10px'}}></span> 
                            <span> Associated Devices</span>
                        </span>
                        <span>
                            <span style={{display:'inline-block', backgroundColor:'#223F9A', height:10, width:10,marginLeft:'10px'}}></span> 
                            <span> Unassociated Devices</span>
                        </span>
                        <h5 className="text-center">Number of devices in the station</h5>
                    </div>
                    {(this.state.assoc_data.length > 0)?(<StackedBarChart unassoc_data={this.state.unassoc_data} assoc_data={this.state.assoc_data}  />):(<h1 className="text-center">No Data is available at the moment</h1>)}
                </div>)
    }
}