import React, { Component } from 'react'
import LineChart from '../components/LineChart/LineChart'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
      name: '',
      weight: '',
      gender: '',
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

    this.setState(
      {
        token: token
      },
      () => this.getProfile()
    )

    // console.log(window)
  }

  getProfile () {
    axios.post('/api/auth/getUser', { token: this.state.token }).then(res => {
      this.setState({
        name: res.data.name || 'Not set',
        weight: res.data.weight || 'Not set',
        gender: res.data.gender || 'Not set'
      })
    })
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
              border: '1px solid #DDD',
              display: 'flex'
            }}
          >
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <svg
                viewBox='0 0 24 24'
                style={{
                  backgroundColor: 'DDD',
                  fill: 'white',
                  marginBottom: '24px',
                  marginTop: '24px',
                  width: '200px'
                }}
              >
                <path d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' />
              </svg>

              <Link to='/profile' className='button primary'>
                Update profile
              </Link>
            </div>

            <div style={{ width: '50%', marginTop: '36px' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#515151' }}>Your name</span>
                <p style={{ margin: '0 12px', fontSize: '1.2em' }}>
                  {this.state.name}
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#515151' }}>Weight</span>
                <p style={{ margin: '0 12px', fontSize: '1.2em' }}>
                  {this.state.weight}
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#515151' }}>Gender</span>
                <p style={{ margin: '0 12px', fontSize: '1.2em' }}>
                  {this.state.gender}
                </p>
              </div>
            </div>
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
