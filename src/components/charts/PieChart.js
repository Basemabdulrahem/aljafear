import React from 'react';
import propTypes from 'prop-types';
import { VictoryPie , VictoryLabel, VictoryTooltip } from 'victory';
import ReactSvgPieChart from "react-svg-piechart"
export default class extends React.Component{
    static propTypes = {
        data: propTypes.array.isRequired,
        color:propTypes.string.isRequired,
        total:0
    }

    render(){
        const colors = [
            "#22594e","#2f7d6d", "#3da18d","#69c2b0","#a1d9ce"
          ]
          
        console.log(this.props.data);
        if(this.props.data.length == 0) return (null);

        let total = this.props.data.map(e => e.y).reduce((a,b)=>a+b,0);
        let data  = this.props.data.map((e,i)=>{
            return {
                title: `${e.x} - ${parseFloat((e.y * 100) / total).toFixed(2)}% `,
                value: e.y,
                color:colors[(i+1) % colors.length ]
            }
        });
        let legands = data.map((e) => (<span><span style={{display:'inline-block', backgroundColor:e.color, height:10, width:10,marginLeft:'10px'}}></span> <span>{e.title}</span></span>));
        return (
            <div>
                <div>
                    {legands}                    
                </div>
                <ReactSvgPieChart
                    data={data}
                    // If you need expand on hover (or touch) effect
                    expandOnHover
                    expandSize={1}
                    // If you need custom behavior when sector is hovered (or touched)
                    onSectorHover={(d, i, e) => {
                    if (d) {
                        console.log("Mouse enter - Index:", i, "Data:", d, "Event:", e)
                    } else {
                        console.log("Mouse leave - Index:", i, "Event:", e)
                    }
                    }}
            />
          </div>);
    }
}