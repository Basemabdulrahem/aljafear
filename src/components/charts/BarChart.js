import {FlexibleXYPlot , Hint , XAxis, YAxis, HorizontalGridLines, VerticalGridLines,  VerticalBarSeries  } from 'react-vis';
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
    componentWillReceiveProps(props){
        if(props.data.length > 0)
        {
            let total = 0;
            props.data.forEach((v)=>{
                total += v.y;
            });
            this.setState({
                total:total
            });
        }            
    }
    _onMouseOver(data){
        this.setState({
            selected:data
        });
    }
    _onMouseOut(d){
        console.log("_onMouseOut");
        this.setState({
            selected:null
        });
    }
    _renderHint(){        
        if(this.state.selected){
            return (
                <Hint value={this.state.selected}>
                    <div style={{ color:'#000', background: 'rgba(240,240,240,0.80)', padding:8}}>
                        <h3>{this.state.selected.x}</h3>
                        <p>This bar represents <b>{this.state.selected.x}</b></p>
                        <p>It has <b>{this.state.selected.y}</b> units and this is <b>{   ((this.state.selected.y / this.state.total) * 100).toFixed(2) }%</b> </p>
                    </div>
                </Hint>
            );
        }
        else{
            return null;
        }
    }
    render(){        
        let _data = [];
        if(this.props.data){            
            _data = this.props.data.map((e,i)=>{
                let r = Math.floor(Math.random() * 10);
                return {
                    ...e,
                    color :i
                }
            });
            console.log(_data);
        }
        return(
            <FlexibleXYPlot  margin={{left: 50}} height={500} xType="ordinal" colorRange={['#22594e', '#a1d9ce']} >
              
                <HorizontalGridLines />
                <VerticalGridLines />
                <VerticalBarSeries
                    data={_data}
                    onValueMouseOver={this._onMouseOver.bind(this)}
                    onValueMouseOut={this._onMouseOut.bind(this)}
                    />
                {this._renderHint()}
                <XAxis />
                <YAxis />   
            </FlexibleXYPlot>
        );
    }
}
