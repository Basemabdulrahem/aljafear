import React from 'react';
import propTypes from 'prop-types';
export default class Widget extends React.Component{
    static propTypes = {
        backgroundClass : propTypes.string.isRequired,
        icon : propTypes.string.isRequired,
        title : propTypes.string.isRequired,
        value : propTypes.any.isRequired
    };
    render(){
        return(
            <div className={`widget style1 ${this.props.backgroundClass}`}>
                    <div className="row">
                        <div className="col-xs-4">
                            <i className={`fa ${this.props.icon} fa-5x`}></i>
                        </div>
                        <div className="col-xs-8 text-right">
                            <span> {this.props.title} </span>
                            <h2 className="font-bold">{this.props.value}</h2>
                        </div>
                    </div>
            </div>
        );
    }
}
