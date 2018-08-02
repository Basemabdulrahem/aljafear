import React from 'react';

import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  FlexibleWidthXYPlot,
  LineSeries,
  VerticalBarSeries,
  DiscreteColorLegend
} from 'react-vis';
import Highlight from './Highlight';

const totalValues = 100;

/**
 * Get the array of x and y pairs.
 * The function tries to avoid too large changes of the chart.
 * @param {number} total Total number of values.
 * @returns {Array} Array of data.
 * @private
 */
function getRandomSeriesData(total) {
  const result = [];
  let lastY = Math.random() * 40 - 20;
  let y;
  const firstY = lastY;
  for (let i = 0; i < total; i++) {
    y = Math.random() * firstY - firstY / 2 + lastY;
    result.push({
      x: i,
      y
    });
    lastY = y;
  }
  return result;
}

export default class ZoomableChartExample extends React.Component {

  state = {
    lastDrawLocation: null,
    series: [
      {
        title: 'Apples',
        disabled: false,
        data: getRandomSeriesData(totalValues)
      }
    ]
  }

  render() {
    const {series, lastDrawLocation} = this.state;
    return (
      <div className="example-with-click-me">
        <div className="chart no-select">
          <FlexibleWidthXYPlot
            animation
            xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]} 
            onWheel={(e) => { 
                console.log(e.deltaY);
            }}           
            height={300}>

            <HorizontalGridLines />

            <YAxis />
            <XAxis />

            {series.map(entry => (
              <VerticalBarSeries
                key={entry.title}
                data={entry.data}
              />
            ))}

            <Highlight onBrushEnd={(area) => {
              this.setState({
                lastDrawLocation: area
              },console.log(area));
            }} />

          </FlexibleWidthXYPlot>
        </div>

        <button className="showcase-button" onClick={() => {
          this.setState({lastDrawLocation: null});
        }}>
          Reset Zoom
        </button>

        <div>
          <h4>
            <b>Last Draw Area</b>
          </h4>
          {lastDrawLocation ? (
            <ul style={{listStyle: 'none'}}>
              <li><b>Top:</b> {lastDrawLocation.top}</li>
              <li><b>Right:</b> {lastDrawLocation.right}</li>
              <li><b>Bottom:</b> {lastDrawLocation.bottom}</li>
              <li><b>Left:</b> {lastDrawLocation.left}</li>
            </ul>
          ) : <span>N/A</span>}
        </div>
      </div>
    );
  }
}