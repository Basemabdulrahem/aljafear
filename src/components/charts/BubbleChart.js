import React from 'react';
import propTypes from 'prop-types';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { format } from 'd3-format';
import { hierarchy , pack } from 'd3-hierarchy';
import Dimension from 'react-dimensions'



class BubbleChart extends React.Component{
  static propTypes = {
    data: propTypes.any.isRequired,
    lgSize : propTypes.number,
    mdSize : propTypes.number,
    xsSize : propTypes.number
  }
  constructor(props){
    super(props);
    this.state={
      loaded:false
    }
   

  }
  componentDidMount(){
   
  }  
  render(){
    
    this.width = this.props.containerWidth;
    this.height = 500;      
    this._format = format(',d');
    this.color =  scaleOrdinal(schemeCategory10);
    this._pack = pack().size([this.width,this.height]).padding(5);   
    this.hierachChart = hierarchy({children:this.props.data}).sum((d) => d.y);   
    let leaves = this._pack(this.hierachChart).leaves();
    return(
      <svg  viewBox={`0 0 ${this.width} ${this.height}`} >
         {leaves.filter((v) => v.value != 0).map((d,i,nodes) => (
          <g key={i} className="node" transform={"translate(" + d.x + "," + d.y + ")"}>
            <circle strokeWidth=".5" strokeOpacity=".5" stroke="#000" id={d.data.x} r={d.r} fill={this.color(d.data.x)} />
            <clipPath id={`id_${d.data.x.replace(' ','_')}`}>
              <use xlinkHref={`#${d.data.x}`} />
            </clipPath>
            <text  textAnchor="middle" clipPath={"url(#id_" + d.data.x.replace(' ','_') + ")"}>
              <tspan x={0} y={0} >{d.data.x}</tspan>
            </text>
            <title> { `${d.data.x} :  ${this._format(d.data.y)} (${(d.data.y * 100 /this.hierachChart.value).toFixed(2)}%)` } </title>
          </g>
         ))}
      </svg>
    );
  }
}

export default Dimension()(BubbleChart);