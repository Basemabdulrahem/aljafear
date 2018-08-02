import React from 'react';

export default class extends React.Component{
    constructor(){
        super();
    }

    render(){

        if(this.props.show)
            return(
                this.props.children
            );
        else
            return(null);
    }

}