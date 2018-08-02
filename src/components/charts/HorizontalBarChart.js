import {FlexibleXYPlot , Hint , XAxis, YAxis, HorizontalGridLines, VerticalGridLines,  VerticalBarSeries, HorizontalBarSeries  } from 'react-vis';
import React from 'react';
import propTypes from 'prop-types';


export default class extends React.Component{
    static propTypes = {
        data: propTypes.array.isRequired
    }
    constructor(props){
        super(props);        
        let total = 0;
        let selected = null;      
        this.state={
            total,
            selected
        }
    }
    render(){        
        let total = this.props.data.reduce((p,c)=> p+c.y,0);
        return(
            <table className="table">
                <tbody>
                    {this.props.data.map((e,u)=>(
                        <tr key={u}>
                            <td width="30%" >{e.x}</td>
                            <td width="50%"><span style={{
                                display:"block",
                                backgroundColor:"#3ab394",
                                height:"20px",
                                borderRadius:"10px",
                                width:`${e.y*100/total}%`}}></span></td>
                            <td width="10%">{`${parseFloat(e.y*100/total).toFixed(2)}%`}</td>
                            <td width="10%">{`${e.y} Unit`}</td>
                        </tr>
                    ))}                    
                </tbody>
                
            </table>

        );
    }
}
