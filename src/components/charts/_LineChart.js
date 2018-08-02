import React from 'react';
import {Line , Bar} from 'react-chartjs-2';
export default class  extends React.Component{
    constructor(props){
        super(props);
        this.data  = {
            labels: props.data.map((e) => e.x) ,
            datasets: [
              {
                label: 'Number of Devices in the station',
                fill: true,
                lineTension: 0.1,
                backgroundColor: 'rgba(35, 63, 154,0.4)',
                borderColor: 'rgba(35, 63, 154,1)',
                borderCapStyle: 'ass',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(35, 63, 154,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(35, 63, 154,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: props.data.map((e) => e.y)
              }
            ]
          };
    }
    
    render(){
       return(
        <Bar         
          data={this.data}/>);
    }
}