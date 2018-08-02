import React from 'react';
import propTypes from 'prop-types';
import moment from 'moment';
export default class extends React.Component{
    static propTypes={
        onChange : propTypes.func.isRequired
    }
    constructor(){
        super();
        let today = moment();
        
        this.state={
            current_date:today
        }
    }
    setInitialDate(m){
        this.setState({
            current_date:m
        });
    }
    onPreviousClick(){
        let current = this.state.current_date.clone();
        current.subtract(1,"day");
        this.setState({
            current_date:current
        });
        this.props.onChange(current);
    }
    onNextClick(){
        let current = this.state.current_date.clone();
        current.add(1,"day");
        this.setState({
            current_date:current
        });
        this.props.onChange(current);
    }
    render(){
        return(
        <div style={{ textAlign:"center" }}>
            <button onClick={this.onPreviousClick.bind(this)} style={{marginTop:"-3px"}} className="btn btn-primary"> &lt;&lt;</button>
            <input className="form-control" 
                   disabled={true}  
                   type="text" 
                   style={{
                       textAlign:"center",
                       width:"auto",
                       display:"inline"
                   }}
                   value={this.state.current_date.format("DD-MM-YYYY")} />
            <button onClick={this.onNextClick.bind(this)} style={{marginTop:"-3px"}} className="btn btn-primary"> >> </button>
        </div>);
    }
}