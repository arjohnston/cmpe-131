import React, { Component } from 'react'
import LineChart from '../components/LineChart/LineChart'

// sort out data to make 3x graphs
// filter btn by date
// Title above graphs
// Hover over graph = description popup
// resize width / height
// Should always keep 6:4 aspect ratio

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
const margin = 20

const data = [
  { a: '1/1/2017', b: 3 },
  { a: '2/2/2017', b: 6 },
  { a: '3/3/2017', b: 2 },
  { a: '4/4/2017', b: 12 },
  { a: '5/5/2017', b: 8 }
]

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      data: [
        {
          date: '1/1/2017',
          calories: 540,
          weight: 180,
          exercise: 30,
          bloodPressure: 180,
          heartRate: 105
        },
        {
          date: '1/5/2017',
          calories: 1024,
          weight: 174,
          exercise: 25,
          bloodPressure: 170,
          heartRate: 95
        },
        {
          date: '1/10/2017',
          calories: 512,
          weight: 170,
          exercise: 0,
          bloodPressure: 160,
          heartRate: 100
        },
        {
          date: '1/21/2017',
          calories: 618,
          weight: 175,
          exercise: 45,
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
            minHeight: `${height + 41}px`,
            background: 'white',
            padding: '18px',
            border: '1px solid #DDD',
            margin: '12px'
          }}
        >
          Profile Snapshot
        </div>
        <LineChart data={data} width={width} height={height} margin={margin} />
        <LineChart data={data} width={width} height={height} margin={margin} />
        <LineChart data={data} width={width} height={height} margin={margin} />
      </div>
    )
  }
}
