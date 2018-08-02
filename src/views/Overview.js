import React from 'react';
import { Widget , IBox, IBoxContent, IBoxTitle } from '../components/ui';
import {lazur_bg, navy_bg , yellow_bg , red_bg} from '../components/ui/Backgrounds';
import { get } from '../lib/index';
import BarChart from '../components/charts/BarChart'
import BubbleChart from '../components/charts/BubbleChart'
import Moment from 'moment';
import { getAllStations } from '../fetchers/StationsFetcher';
class Main extends React.Component {
    constructor(){
        super();
        this.state={         
            stations:[],
            ageGroup:[
                {x:"1-10",y:2112},
                {x:"11-20",y:8356},
                {x:"21-30",y:57948},
                {x:"31-40",y:177055},
                {x:"41-50",y:282639},
                {x:"51-60",y:376276},
                {x:"61-70",y:317104},
                {x:"71-120",y:132714},
                
            ],
            countriesGroup:[{x:"INDIA",y:6700},
                    {x:"PAKISTAN" ,y:73209 },
                    {x:"BANGLADESH",y:3738},
                    {x:"Dhaka",y:7065},
                    {x:"NIGERIA",y:2655},
                    {x:"Jakarta",y:8578},
                    {x:"Islamabad",y:7660},
                    {x:"INDONESIA",y:124257},
                    {x:"TURKEY",y:4516},
                    {x:"EGYPT",y:2774},
                    {x:"IRAN", y:31971},
                    {x:"Karachi",y:3164},
                    {x:"Amman",y:6306},
                    {x:"Kano",y:6148},
                    {x:"Bombay",y:6080},
                    {x:"MOROCCO",y:5875},
                    {x:"ALGERIA",y:5828},
                    {x:"New Delhi" ,y:14493},
                    {x:"MALAYSIA",y:3615 },
                    {x:"IRAQ",y:3585}]
                    
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
                            <div className="row">
                                <div className="col-xs-12">
                                    <Widget backgroundClass={lazur_bg} 
                                        icon="fa fa-user" 
                                        title="Pilgrims Count" 
                                        value={1355271} />   
                                </div>
                                <div className="col-xs-6">
                                    <Widget backgroundClass={navy_bg} 
                                        icon="fa fa-male" 
                                        title="Male Pilgrims" 
                                        value={736299} />   
                                </div>
                                <div className="col-xs-6">
                                    <Widget backgroundClass={red_bg} 
                                        icon="fa fa-female" 
                                        title="Female Pilgrims" 
                                        value={617951} />   
                                </div>
                                <div className="col-xs-12">
                                    <IBox>
                                        <IBoxTitle>Top Countries</IBoxTitle>
                                        <IBoxContent>
                                            <BubbleChart data={this.state.countriesGroup} />
                                        </IBoxContent>
                                    </IBox>
                                </div>
                            </div>
                             
                        </div>             
                        <div className="col-xs-12 col-md-8">
                            <div className="row">
                                <div className="col-xs-12">
                                    <IBox>
                                        <IBoxTitle>Age Group</IBoxTitle>
                                        <IBoxContent>
                                            <BarChart data={this.state.ageGroup} />
                                        </IBoxContent>
                                    </IBox>
                                </div>      
                                <div className="col-xs-12">
                                    <IBox>
                                        <IBoxTitle>Entries in:</IBoxTitle>
                                        <IBoxContent>
                                            <div className="col-sm-4">
                                                <h1 className="m-b-xs">
                                                982
                                                </h1>
                                                <small>
                                                    Shawwal
                                                </small>
                                            </div> 
                                            <div className="col-sm-4">
                                                <h1 className="m-b-xs">
                                                1004057
                                                </h1>
                                                <small>
                                                    Dhul Qa'dah
                                                </small>
                                            </div> 
                                            <div className="col-sm-4">
                                                <h1 className="m-b-xs">
                                                349210
                                                </h1>
                                                <small>
                                                    Dhul Hijjah
                                                </small>
                                            </div> 
                                            <div className="clearfix"></div>
                                        </IBoxContent>
                                    </IBox>
                                </div>                          
                            </div>
                            
                        </div>                 
                </div>
            </div>
        )
    }

}

export default Main