
import React from 'react';

import {
  FlexibleWidthXYPlot,
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  LineSeries,
  Hint,
  Crosshair
} from 'react-vis';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      crosshairValues: [
          {x:0,y:0},
          {x:0,y:0},
          {x:0,y:0}
      ]
    };

  }


  render() {
    return (
      <FlexibleWidthXYPlot        
        height={300}
        xType="ordinal"             
        onMouseLeave={()=> this.setState({crosshairValues:[{x:0,y:0},{x:0,y:0},{x:0,y:0}]})} >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis title="Mbps"  />        

        <LineSeries
            color="#cd3b54"
            onNearestX={(value, {index}) => this.setState({crosshairValues: this.props.DATA.map(d => d[index])})}
            data={this.props.DATA[0]}/>
        <LineSeries
            color="#59b953" 
            data={this.props.DATA[1]}/>
         <LineSeries
            color="#ba4fb9" 
            data={this.props.DATA[2]}/>            
        {
            (this.state.crosshairValues[0].x != 0)?
            (<Crosshair values={this.state.crosshairValues}>
      
              <div style={{background: '#efefef',color:'#000',padding:5,width:110,paddingRight:0}}>            
                  <p><span style={{backgroundColor:'#cd3b54',display:'inline-block', height:9, width:9,marginRight:5}}></span><b>RX</b> : {this.state.crosshairValues[0].y.toFixed(2)}</p>
                  <p><span style={{backgroundColor:'#59b953',display:'inline-block', height:9, width:9,marginRight:5}}></span><b>TX</b> : {this.state.crosshairValues[1].y.toFixed(2)}</p>
                  <p><span style={{backgroundColor:'#ba4fb9',display:'inline-block', height:9, width:9,marginRight:5}}></span><b>RX/TX</b> : {this.state.crosshairValues[2].y.toFixed(2)}</p>
              </div>
            </Crosshair>):null
        }

      </FlexibleWidthXYPlot>
    );
  }
}