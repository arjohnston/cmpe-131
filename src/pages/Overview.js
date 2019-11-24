import React, { Component } from 'react'
import LineChart from '../components/LineChart/LineChart'

// sort out data to make 3x graphs
// filter btn by date
// Title above graphs
// Hover over graph = description popup
// resize width / height
// Should always keep 6:4 aspect ratio

// get profile info & display
// get daily entries info & build 3x chart data

// Overview of their profile:
// Weight
// Gender
// Name

// chart 1
// Calories

// chart 3
// Daily exercise

// chart 4
// Blood Pressure
// heart rate

// Filter by date function
// Date range

const width = 600
const height = 400

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      chartOne: [
        {
          date: '1/1/2017',
          calories: 540
        },
        {
          date: '2/5/2017',
          calories: 1024
        },
        {
          date: '3/10/2017',
          calories: 512
        },
        {
          date: '4/21/2017',
          calories: 618
        }
      ],
      chartTwo: [
        {
          date: '1/1/2017',
          exercise: 30
        },
        {
          date: '2/5/2017',
          exercise: 25
        },
        {
          date: '3/10/2017',
          exercise: 0
        },
        {
          date: '4/21/2017',
          exercise: 45
        }
      ],
      chartThree: [
        {
          date: '1/1/2017',
          bloodPressure: 180,
          heartRate: 105
        },
        {
          date: '2/5/2017',
          bloodPressure: 170,
          heartRate: 95
        },
        {
          date: '3/10/2017',
          bloodPressure: 160,
          heartRate: 100
        },
        {
          date: '4/21/2017',
          bloodPressure: 175,
          heartRate: 110
        }
      ]
    }
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    this.setState({ token: token })

    console.log(window)
  }

  render () {
    return (
      <div
        className='dashboard-page'
        style={{
          paddingTop: '36px',
          flexWrap: 'wrap',
          flexDirection: 'initial',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: `${width + 38}px`,
            margin: '12px'
          }}
        >
          <h2>Profile Snapshot</h2>
          <div
            style={{
              width: '100%',
              minHeight: `${height + 41}px`,
              background: 'white',
              padding: '18px',
              border: '1px solid #DDD'
            }}
          >
            profile....
          </div>
        </div>
        <LineChart
          data={this.state.chartOne}
          width={width}
          height={height}
          title='Calories'
        />
        <LineChart
          data={this.state.chartTwo}
          width={width}
          height={height}
          title='Exercise'
        />
        <LineChart
          data={this.state.chartThree}
          width={width}
          height={height}
          title='Blood Pressure & Heart Rate'
        />
      </div>
    )
  }
}
