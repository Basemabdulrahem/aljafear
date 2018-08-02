import {FlexibleXYPlot ,  XAxis, YAxis, HorizontalGridLines, VerticalGridLines,  VerticalBarSeries  } from 'react-vis';
import React from 'react';
import propTypes from 'prop-types';
import BarChart from '../../charts/BarChart';

export default class extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            assoc_data :[],
            unassoc_data :[]
        }
    }
    static propTypes ={
        assoc_data : propTypes.array.isRequired,
        unassoc_data : propTypes.array.isRequired
    }
    componentWillReceiveProps(props){
        if(props.assoc_data){
            this.setState({
                assoc_data :props.assoc_data,
                unassoc_data :props.unassoc_data
            });
        }
    }
    shouldComponentUpdate(nextProps){      
        if(this.state.assoc_data.length === nextProps.assoc_data.length){
            return false;
        }
        return true;
    }
    render(){                
        return(
            <FlexibleXYPlot  margin={{left: 50}} height={500} xType="ordinal" stackBy="y" >                   
                <HorizontalGridLines />
                <VerticalGridLines />
                <VerticalBarSeries
                    style={{width:30}}
                    data={this.props.assoc_data}
                    color="#FF991F"
                    />
                <VerticalBarSeries
                    style={{width:30}}
                    data={this.props.unassoc_data}
                    color="#223F9A"
                    />
                {/* {this._renderHint()} */}
                <XAxis />
                <YAxis />   
            </FlexibleXYPlot>
        );
    }
}
