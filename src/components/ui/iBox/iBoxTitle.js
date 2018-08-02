import React from 'react';

export default class extends React.Component{
    constructor(){
        super();
    }
    render(){
        return(
            <div className="ibox-title">
                {this.props.children}
           </div>
        );
    }
}