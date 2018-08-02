import React from 'react';
import { get } from '../../lib';
import { IBox, IBoxContent } from '../../components/ui'
import Snap from 'snapsvg-cjs';
import moment, { unix } from 'moment';
import $ from 'jquery/dist/jquery.min';
import DateNavigator from './DateNavigator';

export default class extends React.Component{

    constructor(){
        super();
        this.selectedMapID = 0;
        this.latestElementId = 0;
        this.navigator= null;
        this.state={
            default_message:"Enter the mac address please",
            //tracked_mac:"88:b4:a6:53:84:38",
            tracked_mac:"",
            all_data:[], // All the points
            data:[] //only today
        }
    }
    componentDidMount(){
        console.log(this.props.match);
        if(this.props.match.params['mac']){
            this.setState({
                default_message:"Loading ...",
                tracked_mac:this.props.match.params['mac']
            },()=>{

                this.getTrackData();
            });
        }

    }
    getTrackData(){
         
        if(!this.state.tracked_mac){
            alert("Please enter a mac address");
            return;
        }
        this,this.setState({
            default_message:"Loading"
        });
        get(`api/track/${this.state.tracked_mac}`).then((r)=>{
            if(!r.data){
                throw "";
                return;
            }
            let data = r.data.hits.hits.map((e)=>e._source);
            //add unique ids
            data = data.filter((e) => e.x != 0).map((e)=>{
                let timestamp = e["@timestamp"];
                let m = moment(timestamp)
                let id = m.unix();                          
                return {
                    "@timestamp":timestamp,
                    id : id,
                    as : 1,
                    px: e.x,
                    py: e.y,
                    si : e.mac,
                    pn : 3
                }
            });
            
            
            //Get the date of the first element (Last time the device was seen)
            let latest = data[0]["@timestamp"];
            let m = moment(latest);
            this.navigator.setInitialDate(m); //Set initial date at the navigator
            let start_day = m.clone().startOf('day');
            let end_day = m.clone().endOf('day');        
            let filtered_data = data.filter((e) => moment(e["@timestamp"]).isBetween(start_day,end_day));
            
            
            console.log(`We are getting tracking history for ${this.state.tracked_mac}`);
            this.setState({
                all_data:data,
                data: filtered_data
            });
            this.parseFilteredData(filtered_data);

        }).catch((e)=>{
            this.setState({
                default_message:"No Data Is Available"
            });
        });;

    }
    parseFilteredData(data){
        let latest = data[0];        
        //Load the map for the latest
        this.loadMap(1,data);
    }
    drawData(data){
        for (let i = 0; i < data.length - 1; i++) {
            const first = data[i];
            const second = data[i+1];
            this.drawLine(first,second);
            
        }

    }
    loadMap(mapId,points){
        let mapPath = "/maps/boulevard.svg";
        let viewBox = "0 0 1400 750";        
        this.element = Snap(this.svgRef);
        this.element.attr({
            height:'100%',
            width:'100%',
            viewBox:viewBox
        });      
        Snap.load(mapPath,(data)=>{
            this.element.clear();
            this.element.append(data);   
            let paper = data.paper;
            //-----------------------
            //----- Draw PATHS ------
            //-----------------------
            //Create arrow head
            var arrow = paper.polygon([0, 10, 4, 10, 2, 0, 0, 10]).attr({ fill: '#000' }).transform('r90');
            var marker = arrow.marker(0, 0, 10, 10, 5, 5).attr({
                id:"arrow",
                orient:"auto",
                markerUnits:"strokeWidth"
            }).toDefs();
            points = points.reverse();

            
            for (let i = 0; i < points.length - 1; i++) {
                const first = points[i];
                const second = points[i+1];
                let paper = data.paper;
                //let g = data.paper.g();
            //Draw the starting point in the first loop
        
                                            
                var line = paper.line(first.px, first.py, second.px, second.py).attr({
                    id: `t${points[i+1].id}`,
                    stroke: "#000",
                    strokeWidth: 3,
                    markerEnd: marker
                });     
                
                if(i == 0)
                    paper.circle(first.px,first.py,10).attr({
                        fill:"#ff0",
                        stroke:"#000",
                        id:points[i].id
                    });        

                let c = paper.circle(second.px,second.py,10).attr({
                    fill:"#ff0",
                    stroke:"#000",
                    id:points[i+1].id
                });           
            }

            

            // for (let i = 0; i < points.length; i++) {
            //     console.log("DRAW ", i);
            //     const el = points[i].lt;

            //     let g = data.paper.g();
            //     let c = g.paper.circle(el.px,el.py,20).attr({fill:"#ff0",class:"unassoc",stroke:"#000"});

            // }

        }); 

    }
    onRowMouseOver(row){
        console.log("Your are over " , row);
      // console.log("Index of " , this.state.data.indexOf(row));
        //First Make sure that the right map is loaded
        // let mapId = row.lt.mp;
        // if(this.selectedMapID !== mapId){
        //     console.log(`this.loadMap(${mapId});`);
        //     this.svgRef.c
        //     this.loadMap(mapId,this.state.data);
        //     this.selectedMapID = mapId;
        // }
        let id = row.id;
        $(`#${id}`).first().attr("fill","#0f0");
        

        
    }
    onRowMouseLeave(row){
        console.log("ON MOUSE LEAVE");
        $(`#${row.id}`).attr("fill","#ff0");
        
    }
    getMapById(id){
        if (id == "1")
            return "Concourse";
        if (id == "2")
            return "Platform";     
        if (id == "4")
            return "Ebbsfleet";
        if (id == "5")
            return "Stratford";
        if( id == "9")
            return "FCC";
        
    }
    onNavigatorChange(current_date){
        
        let start_day = current_date.clone().startOf("day");
        let end_day = current_date.clone().endOf("day");        
        console.log(start_day);
        console.log(end_day);
        let all_data = this.state.all_data;
        let new_data = all_data.filter((e)=>{
            let timestamp = e["@timestamp"];
            let m = moment(timestamp);
            
            return m.isBetween(start_day,end_day);
        });
        console.log("baby");
        console.log(new_data);
            console.log(new_data);
            this.setState({
                data:new_data
            });
        if(new_data.length > 0){
            this.parseFilteredData(new_data);
        }
    }
    render(){
        return(
            <div>           
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-9 col-xs-12">
                        <h2>Enter Mac Address</h2>                                              
                    </div>
                    <div className="col-lg-3 col-xs-12 m-t-md">
                        
                        <button onClick={this.getTrackData.bind(this)} className="btn btn-primary m-r-xs">Track</button>
                        <input type="text" 
                            placeholder="Enter a mac address"
                            style={{width:"75%", display:"inline-block"}} 
                            className="form-control"
                            value={this.state.tracked_mac}
                            onChange={(e)=>this.setState({tracked_mac:e.target.value})}
                            />
                    </div>                  
                </div>    
                <IBox>
                    <IBoxContent>
                    <div className="col-xs-12 col-md-8">
                        <svg id="svg" ref={(r)=> this.svgRef = r}>
                        </svg>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <div style={{"height":"480px","overflowY":"auto"}}>
                            <table className="table table-hover text-center">
                                <thead>
                                    <tr>
                                        <td><b>Time</b></td>
                                        <td><b>Map</b></td>
                                        <td><b>X</b></td>
                                        <td><b>Y</b></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(this.state.data.length > 0)?(this.state.data.map((e,i)=>(
                                        <tr key={i} 
                                            onMouseOver={()=> { this.onRowMouseOver(e); }} 
                                            onMouseLeave={()=> { this.onRowMouseLeave(e); }}
                                            >
                                            <td>{e['@timestamp'].replace("T", " ").substring(0,e['@timestamp'].length-5)}</td>
                                            <td>Boulevard</td>
                                            <td>{e.px}</td>
                                            <td>{e.py}</td>
                                        </tr>
                                    ))):(
                                        <tr>
                                            <td colSpan="5" className="text-center">{this.state.default_message}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <DateNavigator ref={(e)=> this.navigator = e} onChange={this.onNavigatorChange.bind(this)} />
                    </div>
                    <div className="clearfix"></div>
                    </IBoxContent>
                </IBox>   

            </div>
        );
    }

}