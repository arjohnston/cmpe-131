import React, { Component } from 'react'
import * as d3 from 'd3'

import './style.css'

// https://github.com/sxywu/react-d3-example/blob/master/src/visualizations/LineChart.js

const margin = 20

const colors = ['#2887d6', '#13c16f']

class LineChart extends Component {
  constructor (props) {
    super(props)

    this.state = {
      xAxis: null,
      yAxis: null
    }
  }

  componentDidMount () {
    this.setAxises()
  }

  getTimeFormat () {
    if (!this.props.timeFormat) return d3.timeFormat('%b')

    switch (this.props.timeFormat) {
      case 'day':
        return d3.timeFormat('%d')

      case 'week':
        return d3.timeFormat('%a %d')

      default:
        // month
        return d3.timeFormat('%b')
    }
  }

  getYAxisMax () {
    const { data } = this.props
    if (!data) return

    if (Object.keys(data[0]).length <= 2) {
      return d3.max(data, d => d[Object.keys(data[0])[1]])
    } else {
      let max = 0

      for (let i = 1; i <= Object.keys(data[0]).length; i++) {
        const newMax = d3.max(data, d => d[Object.keys(data[0])[i]])

        if (newMax > max) max = newMax
      }

      return max
    }
  }

  setAxises () {
    const { data, width, height } = this.props

    const w = width - 2 * margin
    const h = height - 2 * margin

    const xAxis = d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)))
      .range([margin + 15, w])

    const yAxis = d3
      .scaleLinear()
      .domain([0, this.getYAxisMax()])
      .range([h, margin])

    this.setState({
      xAxis: xAxis,
      yAxis: yAxis
    })
  }

  renderLines () {
    const lines = []
    const { data } = this.props

    console.log(data)

    const line = d3
      .line()
      .x(data => this.state.xAxis(new Date(data.date)))
      .y(data => this.state.yAxis(data.y))

    for (let i = 1; i < Object.keys(data[0]).length; i++) {
      const dataArr = []

      data.forEach(dataPoint => {
        const dataObj = {}
        dataObj.date = dataPoint.date

        dataObj.y = dataPoint[Object.keys(dataPoint)[i]]

        dataArr.push(dataObj)
      })

      lines.push(line(dataArr))
    }

    return lines
  }

  renderChart () {
    const { width, height } = this.props
    const { xAxis, yAxis } = this.state

    const h = height - 2 * margin
    const w = width - 2 * margin

    // number formatter
    const xAxisFormat = this.getTimeFormat()
    const yAxisFormat = d3.format('.4')

    if (!xAxis || !yAxis) return

    const xTicks = xAxis.ticks(6).map((dataPoint, index) =>
      xAxis(dataPoint) > margin && xAxis(dataPoint) < w ? (
        <g
          transform={`translate(${xAxis(dataPoint)},${h + margin})`}
          key={index}
        >
          <text>{xAxisFormat(dataPoint)}</text>
          <line x1='0' x2='0' y1='0' y2='5' transform='translate(0,-20)' />
        </g>
      ) : null
    )

    const yTicks = yAxis.ticks(5).map((dataPoint, index) =>
      yAxis(dataPoint) > 10 && yAxis(dataPoint) < h ? (
        <g transform={`translate(${margin}, ${yAxis(dataPoint)})`} key={index}>
          <text x='-5' y='5'>
            {yAxisFormat(dataPoint)}
          </text>
          <line
            className='gridline'
            x1='15'
            x2={w - margin}
            y1='0'
            y2='0'
            transform='translate(-5,0)'
          />
        </g>
      ) : null
    )

    return (
      <svg width={width} height={height}>
        <line className='axis' x1={margin + 15} x2={w} y1={h} y2={h} />
        {this.renderLines().map((line, index) => {
          return <path d={line} stroke={colors[index]} key={index} />
        })}
        <g className='axis-labels'>{xTicks}</g>
        <g className='axis-labels'>{yTicks}</g>
      </svg>
    )
  }

  render () {
    return (
      <div
        style={{
          width: `${this.props.width + 38}px`,
          minHeight: `${this.props.height}px`,
          margin: '12px'
        }}
      >
        <h2>{this.props.title}</h2>
        <div className='line-chart'>{this.renderChart()}</div>
      </div>
    )
  }
}

export default LineChart
