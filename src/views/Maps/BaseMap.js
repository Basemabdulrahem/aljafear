import React from "react";
import Snap from 'snapsvg-cjs';
import { intersection } from 'lodash';
import $ from 'jquery/dist/jquery.min';
import { get, post } from '../../lib';
import { IBox,IBoxContent,IBoxTitle,Widget  } from '../../components/ui'
import {  lazur_bg , navy_bg, red_bg , yellow_bg } from '../../components/ui/Backgrounds';
import svgPanZoom from 'svg-pan-zoom';
import { TweenLite, TweenMax , Linear } from 'gsap';
import ReactTooltip from 'react-tooltip'
import SockJS from 'sockjs-client';
import diff, { diffArrays } from 'diff';
import { BASE_LINK } from '../../config/consts';
import {getAllStations} from '../../fetchers/StationsFetcher';
var Stomp = require("stompjs/lib/stomp.js").Stomp
var NotificationSystem = require('react-notification-system');
var classifyPoint = require("robust-point-in-polygon")


export default class extends React.Component{
    constructor(){
        super();
        this.zoomCounter = 100;
        this.element = null;
        this.state={
            sorted_by:"all",
            minmum_ap:3,
            assoc_count: 0,
            unassoc_count: 0,
            one_assoc_count:0,
            two_assoc_count:0,
            three_assoc_count:0,
            one_unassoc_count:0,
            two_unassoc_count:0,
            three_unassoc_count:0,
            all_count:0,
            all_assoc_count:0,
            all_unassoc_count:0,
            global: 0,
            local : 0,
            intervalId:"",
            show_arrow:false
        }
        this.isConnected = false;
        this.mapPath = "/maps/haram.svg";
        this.mapid = "";
        this.viewBox = "0 0 2900 2050";
        this.mapName = "";
        this.stompClient = null;     
        this.enableHover = true;   
        this.NotificationSystem = null;
    }

    loadSVG(){
        this.element = Snap(this.svgDiv);
        this.element.attr({
            height:'100%',
            width:'100%',
            viewBox:this.viewBox
        });         
        Snap.load(this.mapPath,(data)=>{
            //let paper = data.paper;
            //paper.circle(100,100,100);
            this.element.append(data);   
            let result = [];             
            //let is_local_regex = /^.(2|3|6|7|a|b|e|f|A|B|E|F).*/;  
            if(this.enableHover){
                $('rect, path').mouseenter(this.onLocationMouseEnter.bind(this));                                      
                $('rect, path').mouseleave(this.onLocationMouseLeave.bind(this));   
            }
            getAllStations().then((e)=>{
                let stations = e.data.map((source)=>{                                        
                    return {
                        ...source,
                        as : 1,
                        px: source.x,
                        py: source.y,
                        si : source.mac,
                        pn : 3
                    }
                });
                // this.setState({
                //     all_count:e.data.length,
                //     all_assoc_count:e.data.filter((e) => e.as == 1).length,
                //     all_unassoc_count:e.data.filter((e) => e.as == 0).length,
                // });
                //let stations = e.data.filter((a) => a.mp == this.mapid);                
                console.log(`There is ${stations.length} in this map `);               
                stations.forEach((v,i)=>{                                    
                    let g = data.paper.g();
                    let c = null;
                    if(v.as == 1){                                                                                                                      
                        c = g.paper.circle(v.px,v.py,5).attr({fill:"#0f0", class:"assoc",stroke:"#000","data-ap":v.pn,"id":v.si,"style":"cursor: pointer"});
                    }
                    else{
                        c = g.paper.circle(v.px,v.py,5).attr({fill:"#ff0",class:"unassoc",stroke:"#000","data-ap":v.pn,"id":v.si,"style":"cursor: pointer"});                        
                    }      
                    console.log(c.node);
                    console.log(v);
                    var t = TweenMax.to(c.node,v.speed,{rotation:-360, transformOrigin:v.circlePath, ease:Linear.easeNone,repeat:-1});
                    t.progress(Math.random());
                    let parent = this;
                    c.click(function (){                        
                        c.attr("fill","#f00");
                        parent.NotificationSystem.addNotification({
                            title:'Tracking Message',
                            message: 'Some Infos about the selected pilgrims',
                            children:(
                                <div>
                                    <div className="form-group">
                                        <span>Name : </span> <label>{v.name}</label>
                                    </div>
                                    <div className="form-group">
                                        <span>Country : </span> <label>{v.country}</label>
                                    </div>
                                    <div className="form-group">
                                        <span>Age : </span> <label>{parseInt(v.age)}</label>
                                    </div>
                                    <div className="form-group">
                                        <span>Medical history : </span> <label>{v.medical_history}</label>                                                                                        
                                    </div>                                                                      
                                    <div className="clearfix"></div>
                                </div>
                            ),
                            level: 'warning',
                            autoDismiss:0,
                            dismissible:'both',
                            position:'tc',
                            action: {
                                label: 'Track',
                                callback: () => {
                                    let mac = c.attr("id");
                                    parent.props.history.push(`/tracking/${mac}`);
                                }                        
                            },
                            onRemove: ()=>{
                                if(c.attr("class") == "assoc")
                                   c.attr("fill","#ff0");
                                else 
                                   c.attr("fill","#0f0");
                            }
                        });                    
                    });
                    let hover_title = `<title>MAC : ${v.si}`;
                    // if(v.dm){
                    //     hover_title += `<br/>Manfucture: ${v.dm}`;
                    // }
                    //hover_title += `<br/>Strength: ${v.sc}`;
                    //hover_title += `<br/>Access Point: ${v.apMac}`;
                    hover_title += '</title>';
                    var title = Snap.parse(hover_title);
                    c.append(title);  
                });  
                                               
                       

                this.updateStatistics(stations);
            });   

        });



    }
    clearDiffs(old_data,new_data){             
        old_data = old_data.filter((e) => e !== "");
        //Data in the old_data ( Mean it's on the map) and it's not in the new (Mean disconnected)
        let removed = [];
        for (let i = 0; i < old_data.length; i++) {
            const mac = old_data[i];
            if(new_data.indexOf(mac) == -1)
                removed.push(mac);
            
        }
      
      
        console.log("OLD DATA LENGTH " + old_data.length);
        console.log("NEW DATA LENGTH " + new_data.length);
        console.log("REMOVED DATA LENGTH " + removed.length);
        

        removed.forEach(id => {
           let element =  document.getElementById(id);           
           if(element)
                element.remove();
        });

    }
    updateStatistics(stations){
        let assoc_count = stations.filter((e) => e.as == 1).length;             
        let unassoc_count = stations.filter((e) => e.as == 0).length;  
        let one_assoc_count = stations.reduce((previous,current)=>{
            if(current.as == 1)
                return previous + ((current.pn == 1) ? 1 : 0);
            else
                return previous;

        },0);             

        let two_assoc_count = stations.reduce((previous,current)=>{
            if(current.as == 1)
                return previous + ((current.pn == 2) ? 1 : 0);
            else
                return previous;

        },0);             
        let three_assoc_count = stations.reduce((previous,current)=>{
            if(current.as == 1)
                return previous + ((current.pn >= 3) ? 1 : 0);
            else
                return previous;

        },0);  
        let one_unassoc_count = stations.reduce((previous,current)=>{
            if(current.as == 0)
                return previous + ((current.pn == 1) ? 1 : 0);
            else
                return previous;

        },0);             

        let two_unassoc_count = stations.reduce((previous,current)=>{
            if(current.as == 0)
                return previous + ((current.pn == 2) ? 1 : 0);
            else
                return previous;

        },0);             
        let three_unassoc_count = stations.reduce((previous,current)=>{
            if(current.as == 0)
                return previous + ((current.pn >= 3) ? 1 : 0);
            else
                return previous;

        },0);     
        //var intervalId = setInterval(this.timer.bind(this), 15000);
        this.setState({
            assoc_count,
            unassoc_count,      
            one_assoc_count,
            two_assoc_count,
            three_assoc_count    ,
            one_unassoc_count,
            two_unassoc_count,
            three_unassoc_count
            // intervalId
        });
        
    }
    /**
     *  @description handles mouse wheel movment on map to zoom out and zoom in
     */    
    onMouseWheelEvent(e){
        let delta = e.deltaY;
        let viewBox = this.element.attr("viewBox");
        let width = viewBox["width"];
        let height = viewBox["height"];       
    }
    componentDidMount(){
        this.loadSVG();
        let link = "/dashboard?token="+localStorage.getItem("token");
        if(BASE_LINK === ""){
            link = link.substring(1);
        }
        let socket = new SockJS(BASE_LINK+link);

        this.stompClient = Stomp.over(socket);        

        this.stompClient.connect({'X-Authorization': localStorage.getItem("token")},(frame)=> {
            console.log('Connected to our servers over ws: ' + frame);  
            this.isConnected = true;          
            this.stompClient.subscribe('/tracking/indoor',  (sessions) => {
                
                let data = JSON.parse(sessions.body);      console.log("let stations = JSON.parse(sessions.body);");
                let stations = data.hits.hits.map((h)=>{
                    let source = h["_source"];
                    
                    return {
                        as : 1,
                        px: source.x,
                        py: source.y,
                        si : source.mac,
                        pn : 3
                    }
                });
                let ids = Array.from(document.getElementsByTagName("circle")).map((e)=> e.id);
                let new_data = stations.filter((a) => a.mp == this.mapid).map((e)=> e.si);
                console.log("NEW_DATA");
                this.animateStations(stations);
                //this.clearDiffs(ids,new_data); console.log("this.clearDiffs(new_data,ids);");
            });

        });


    }
    getAcitveSortingButton(sort){
        if(this.state.sorted_by == sort)
            return "btn-warning";
        else
            return "";
    }
    filter(){
        let type = this.state.sorted_by;
        let minmum_ap = this.state.minmum_ap;
        //View ALL
        $(".assoc").removeAttr("display");
        $(".unassoc").removeAttr("display");

        if(type == "all"){
            $(".assoc").removeAttr("display");
            $(".unassoc").removeAttr("display");
            
        }
        else if (type == "none"){
            $(".unassoc").attr("display","none");
            $(".assoc").attr("display","none");
        }
        else if (type == "assoc")
        {
            

            $(".assoc").removeAttr("display");
            $(".unassoc").attr("display","none");
        }
        else if (type == "unassoc"){

            $(".unassoc").removeAttr("display");
            $(".assoc").attr("display","none");
        }
        //filter by AP
        if(this.state.minmum_ap == 3){
            $(`[data-ap="2"]`).attr("display","none");
            $(`[data-ap="1"]`).attr("display","none");
        }
        else if(this.state.minmum_ap == 2){
            $(`[data-ap="1"]`).attr("display","none");
        }


    }
    animate(mac_address,x,y,pn,assoc,v){    
        if(x == 0){
            return;           
        }
        let el = document.getElementById(mac_address);        
        if(el){
            
            let current_ap = el.getAttribute("data-ap");            

            if (pn >= this.state.minmum_ap){          
                
                el.removeAttribute("display");      
                if(assoc == 1){
                    el.setAttribute("fill","#0f0");
                    el.setAttribute("class","assoc");
                }   
                else{
                    el.setAttribute("fill","#ff0");
                    el.setAttribute("class","unassoc");
                }  

                TweenMax.to(el,17,{attr:{cx:x,cy:y},ease:Linear.easeNone});                                
            }
            else{
                el.setAttribute("display","none");
            }

            el.setAttribute("data-ap",pn);


        }
        else{
            if(pn > this.state.minmum_ap){
                //Draw if not found
                let g = this.element.paper.g();
                let c = null;
                if(assoc == 1){                                                                                                                      
                    c = g.paper.circle(x,y,5).attr({fill:"#0f0", class:"assoc",stroke:"#000","data-ap":pn,"id":mac_address,"style":"cursor: pointer"});
                }
                else{
                    c = g.paper.circle(x,y,5).attr({fill:"#ff0",class:"unassoc",stroke:"#000","data-ap":pn,"id":mac_address,"style":"cursor: pointer"});                        
                }
                let parent = this;
                c.click(function (){                        
                    c.attr("fill","#f00");
                    parent.NotificationSystem.addNotification({
                        title:'Tracking Message',
                        message: 'Do you want to track the highlighted pilgrims?',
                        level: 'warning',
                        autoDismiss:0,
                        dismissible:'both',
                        position:'br',
                        action: {
                            label: 'Track',
                            callback: () => {
                                let mac = c.attr("id");
                                parent.props.history.push(`/tracking/${mac}`);
                            }                        
                        },
                        onRemove: ()=>{
                            if(c.attr("class") == "assoc")
                               c.attr("fill","#ff0");
                            else 
                               c.attr("fill","#0f0");
                        }
                    });                    
                });
                let hover_title = `<title>MAC : ${v.si}`;
                if(v.dm){
                    hover_title += `<br/>Manfucture: ${v.dm}`;
                }
                hover_title += `<br/>Strength: ${v.sc}`;
                hover_title += `<br/>Access Point: ${v.apMac}`;
                hover_title += '</title>';

                var title = Snap.parse(hover_title);
                c.append(title);  
            }
        }
    }
    filterByAps(event){
        let min = event.target.value;
        this.setState({
            minmum_ap:min
        },()=>{ this.filter() });

    }
    filterByType(type){
        this.setState({
            sorted_by:type
        },()=>{ this.filter() });        
    }
    animateStations(stations){
                
        console.log("Updating Locations ! " + stations.length);
        let start_time = Date.now();
        for (let i = 0; i < stations.length; i++) {
            const station = stations[i];                
            this.animate(station.si,station.px,station.py,station.pn,station.as,station);                
            
        }   

    }
    onLocationMouseEnter(e){

        let element = e.target;
        let name = e.target.id;     
 
        
        // let height = e.target.height.baseVal.value;
        // let width = e.target.width.baseVal.value;

        // let x = e.target.x.baseVal.value;
        // let y = e.target.y.baseVal.value;
        
        // let x2 = x + width;
        // let y2 = y + height;

        // console.log(x);
        // console.log(y);
        // //console.log(x2,y2);


        // this.element.paper.circle(x2,y2,5).attr({fill:"#00f",class:"unassoc",stroke:"#000"});

        if(name != "outline"){
            let polygon = [];
            for (let i = 0; i < e.target.getTotalLength(); i = i +10) {
                let y = e.target.getPointAtLength(i);
                polygon.push([y.x,y.y]);                
                //this.element.paper.circle(y.x,y.y,2).attr({fill:"#00f",class:"unassoc",stroke:"#000"});                    
            }


            let elements = document.getElementsByTagName("circle");                        
            let in_points =  0;
            let stats={
                assoc:0,
                assoc_3_and_more:0,
                assoc_by_2:0,
                assoc_by_1:0,
                unassoc:0,
                unassoc_3_and_more:0,
                unassoc_by_2:0,
                unassoc_by_1:0,
            }
            let deb = [];
            for (let i = 0; i < elements.length; i++) {
                const device = elements[i];
                let isAccessPoint = device.getAttribute('data-ap') != null;
                if(isAccessPoint){
                    let device_x = device.getAttribute('cx');
                    let device_y = device.getAttribute('cy');
                    let detected_by = device.getAttribute('data-ap');
                    let isAssociated = device.getAttribute('class') == "assoc";
                    let res = classifyPoint(polygon,[device_x,device_y]);
                    if(res<1){
                        in_points++;
                        if(isAssociated){
                            stats.assoc++;
                            if(detected_by >= 3)
                                stats.assoc_3_and_more++;
                            else if(detected_by == 2)
                                stats.assoc_by_2++;                               
                            else 
                                stats.assoc_by_1++;
                        }
                        else{
                            stats.unassoc++;
                            if(detected_by >= 3)
                                stats.unassoc_3_and_more++;
                            else if(detected_by == 2)
                                stats.unassoc_by_2++;                               
                            else 
                                stats.unassoc_by_1++;
                        }


                        deb.push(device);                
                    }
                }
                
            }
        //     console.log("IN POINTS" , in_points );
        //     deb.forEach((e)=>{
        //         console.log(`Mac : ${e.getAttribute("id")} X: ${e.getAttribute("cx")} Y: ${e.getAttribute("cy")} Detected by : ${e.getAttribute("data-ap")}`);
        //     });
        //     console.log(deb);
        //   //  return;     
    
            let tip = `Name: ${name} <br/>`;
            tip += `Total Devices: ${in_points} <br/>`;
            tip += `---------------------------<br/>`;
            tip += `Associated Devices: ${stats.assoc} <br/>`;
            tip += `Associated Touching >= 3 APs: ${stats.assoc_3_and_more} <br/>`;
            tip += `Associated Touching 2 APs: ${stats.assoc_by_2} <br/>`;
            tip += `Associated Touching 1 AP: ${stats.assoc_by_1} <br/>`;
            tip += `---------------------------<br/>`;
            tip += `Unassociated Devices: ${stats.unassoc} <br/>`;        
            tip += `Unassociated Touching >= 3 APs: ${stats.unassoc_3_and_more} <br/>`;
            tip += `Unassociated Touching 2 APs: ${stats.unassoc_by_2} <br/>`;
            tip += `Unassociated Touching 1 AP: ${stats.unassoc_by_1} <br/>`;    
            let color = $(element).css("fill");
            $(element).attr("data-c",color);
            if(this.enableHover){
                $(element).attr("data-tip",tip);
                ReactTooltip.show(element);
            }
            $(element).css("fill","rgba(239,239,239,1)");
            $(element).css("stroke","#000");
            this.setState({show_arrow:true});

        }
        
    }
    onLocationMouseLeave(e){

        let element = e.target;
        let name = e.target.id;            
        if(name != "outline"){
            let color  = $(element).attr("data-c");
            $(element).css("fill",color);
            if(this.enableHover){
                ReactTooltip.hide(element);
            }
            $(element).css("stroke","#fff");
            this.setState({show_arrow:false});

        }

    }
    componentWillUnmount(){
        if(this.isConnected)
            this.stompClient.disconnect();
        // clearInterval(this.state.intervalId);
    }
    render(){
        return(
            <div>
                <NotificationSystem ref={(r)=> this.NotificationSystem = r} />     

                <div className="row">
                    <div className="col-xs-12">
                        <IBox>
                            <IBoxTitle>{this.mapName} Map (click To Show Details)</IBoxTitle>
                            
                            <IBoxContent>
                                <div className="col-sm-12">
                                    <h1 className="m-b-xs">
                                       {this.state.unassoc_count + this.state.assoc_count}
                                    </h1>
                                    <small>
                                        Total Pilgrims
                                    </small>
                                </div> 
                                <div className="clearfix"></div>     
                                <svg  
                                    className="map" 
                                    ref={d => this.svgDiv = d}> 
                                </svg>
                                <ReactTooltip multiline={true} effect="solid" delayShow={0} place="left" offset={{top:-5,right:10}}  />

                            </IBoxContent>
                        </IBox>
                        
                    </div>
                </div>
            </div>
        );
    }
}