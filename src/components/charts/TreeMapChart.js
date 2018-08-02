import React from 'react';
import propTypes from 'prop-types';
import {Treemap , Hint } from 'react-vis';

function _prepareData(data) {
    const leaves = [];
    for (let i = 0; i < data.length; i++) {
      let current = data[i];
      leaves.push({
        name: current.x,
        size: current.y,
        color: Math.random() * 1000,
        style:{
          color:'#fff',
          textAlign:'center'
        }     
      });
    }
    return {
      title: '',
      color: 1,
      children: leaves

    };
  }
  
export default class DynamicTreemapExample extends React.Component {
    static propTypes = {
      data: propTypes.array.isRequired
    }
    constructor(props){
      super(props);
      let data = [];

      if(props.data){
        data = _prepareData(props);
      }
      this.state = {
        hoveredNode: false,
        treemapData: data,
        useCirclePacking: false
      }
    }
  componentWillReceiveProps(props){
    if(props.data){
      let _data = _prepareData(props.data);
      this.setState({
        treemapData : _data
      });
    }
  
  }
   
  render() {
    if(this.state.treemapData.children.length == 0) 
      return null;
    const {hoveredNode, useCirclePacking} = this.state;
    const treeProps = {
      animation: {
        damping: 9,
        stiffness: 300
      },
      renderMode:"DOM",
      data: this.state.treemapData,
      onLeafMouseOver: x => this.setState({hoveredNode: x}),
      onLeafMouseOut: () => this.setState({hoveredNode: false}),
      // onLeafClick: () => this.setState({treemapData: _getRandomData()}),
      height: 300,
      mode: this.state.useCirclePacking ? 'circlePack' : 'squarify',
      getLabel: x => x.name,
      width: 350
    };
    return (
      <div className="dynamic-treemap-example">          
        <Treemap {...treeProps}/>
        click above to the update data
        {hoveredNode && hoveredNode.value}
      </div>
    );
  }
  
}
