import React from 'react';
import axios from 'axios';
import { Widget , IBox, IBoxContent, IBoxTitle } from '../../ui';
import { get } from '../../../lib';
import LineChart from './LineChart';
import Moment from 'moment-timezone';
import { XMS_DATE_FORMAT } from '../../../config/consts';
export default class extends React.Component{
    constructor(){
        super();
        this.state={
            throughput_Data:[
                [],
                [],
                []
            ],
            hours:1
        }
    }
    componentDidMount(){
        //Force udpate after loading
        this._loadData().then(()=>{ this.forceUpdate(); });
    }
    _getActiveClass(preset){
        let selected_preset  = this.state.hours;
        if(selected_preset == preset){
            return "btn-warning";
        }
        return "";
    }
    _loadData(){
        return new Promise((resolve,reject)=>{
            get(`api/sessions/throughput/${this.state.hours}`).then((r) => {
                let data = r.data;
                let tx = [];
                let rx = [];
                let txrx =[];
                for (let i = 0; i < data.length; i++) {
                    const e = data[i];

                    
                    // let time = e['historyDate'].split('T')[1].slice(0,5);
                    let time = Moment.utc(e['historyDate'],XMS_DATE_FORMAT).tz("Europe/London").format("hh:mm");                                    
                    let _tx = e['statsStationReport'].avgTx;
                    let _rx = e['statsStationReport'].avgRx;
                    let _txrx = e['statsStationReport'].avgTxRx;
                    //-------------------
                    // We are swapping RX with TX 
                    //-------------------
                    tx.push({
                        x:time,
                        y:_rx
                    });
                    rx.push({
                        x:time,
                        y:_tx
                    });
                    txrx.push({
                        x:time,
                        y:_txrx
                    });                                
                }
                if(this.state.hours > 1){
                    rx = this._filterData(rx);
                    tx = this._filterData(tx);
                    txrx = this._filterData(txrx);
                }
                this.setState({
                    throughput_Data:[rx,tx,txrx],                 
                },()=>{ resolve(); });
                 
            });   
        });
    }
    _filterData(array){
        let hours = this.state.hours;
        let now = Moment.tz("Europe/London").startOf('hour');
        let formats = [];
        for (let i = 0; i < hours; i++) {
            let format = now.format('kk:mm').toString();
            formats.push(format);
            now = now.subtract('1','hour');            
        }
        
        return array.filter((e) => formats.indexOf(e.x) > -1);

    }
    _onButtonClick(h){
        this.setState({hours:h},()=>{
            this._loadData().then(()=>{ this.forceUpdate(); });
        
        });
    }
    render(){
        return(
            <IBox>
                <IBoxTitle>
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            Station Throughput (Mbps)
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <div className="pull-right">
                                <button onClick={this._onButtonClick.bind(this,1)} className={`btn m-l-xs btn-sm ${this._getActiveClass(1)}`}>1 Hrs</button>
                                <button onClick={this._onButtonClick.bind(this,6)} className={`btn m-l-xs btn-sm ${this._getActiveClass(6)}`}>6 Hrs</button>
                                <button onClick={this._onButtonClick.bind(this,12)} className={`btn m-l-xs btn-sm ${this._getActiveClass(12)}`}>12 Hrs</button>
                                <button onClick={this._onButtonClick.bind(this,24)} className={`btn m-l-xs btn-sm ${this._getActiveClass(24)}`}>24 Hrs</button>
                            </div>
                        </div>
                    </div>
                    
                    
                </IBoxTitle>
                <IBoxContent>
                    <div>
                        <span>
                            <span style={{display:'inline-block', backgroundColor:'#cd3b54', height:10, width:10,marginLeft:'10px'}}></span> 
                            <span> RX </span>
                        </span>
                        <span>
                            <span style={{display:'inline-block', backgroundColor:'#59b953', height:10, width:10,marginLeft:'10px'}}></span> 
                            <span> TX </span>
                        </span>
                        <span>
                            <span style={{display:'inline-block', backgroundColor:'#ba4fb9', height:10, width:10,marginLeft:'10px'}}></span> 
                            <span> RX/TX </span>
                        </span>
                    </div>
                    {(this.state.throughput_Data[0].length > 0)?<LineChart  DATA={this.state.throughput_Data}  /> 
                    : (<div className="m-lg text-center"><h3>Sorry, There is no data available now.  </h3></div>)}
                </IBoxContent>
           </IBox>
        );
    }
}