import React from 'react';

export default class extends React.Component{
    constructor(){
        super();
    }    
    render(){
        return(
            <div {...this.props} className="ibox" >
                {this.props.children}
           </div>
        );
    }
}