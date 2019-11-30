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

// Filter by date function
// Date range

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      name: '',
      weight: '',
      gender: '',
      chartOne: null,
      chartTwo: null,
      chartThree: null,
      width: 600,
      height: 400
    }

    this.onWindowResized = this.onWindowResized.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    this.setState(
      {
        token: token
      },
      () => {
        this.getProfile()
        this.getEntries()
        this.onWindowResized()
      }
    )

    if (!window) {
      return
    }
    if (window.addEventListener) {
      window.addEventListener('resize', this.onWindowResized)
    } else {
      window.attachEvent('onresize', this.onWindowResized)
    }
  }

  componentWillUnmount () {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.onWindowResized)
    } else {
      window.detachEvent('onresize', this.onWindowResized)
    }
  }

  onWindowResized () {
    let { width, height } = this.state

    console.log(window.innerWidth)

    if (!window) return

    const DEFAULT_SIZE = 600
    const PADDING = 24
    const SCROLL_BAR_WIDTH = 60
    if (window.innerWidth < DEFAULT_SIZE + PADDING + SCROLL_BAR_WIDTH) {
      width = window.innerWidth - PADDING - SCROLL_BAR_WIDTH
    } else {
      width = DEFAULT_SIZE
    }

    height = (width / 6) * 4

    this.setState({
      width: width,
      height: height
    })
  }

  getEntries () {
    const chartOne = []
    const chartTwo = []
    const chartThree = []

    axios
      .post('/api/dailyEntry/getEntries', { token: this.state.token })
      .then(res => {
        res.data.forEach(entry => {
          const chartOneObj = {}
          const chartTwoObj = {}
          const chartThreeObj = {}

          let date = new Date(entry.date)
          date = `${date.getMonth() +
            1}/${date.getUTCDate()}/${date.getUTCFullYear()}`

          chartOneObj.date = date
          chartTwoObj.date = date
          chartThreeObj.date = date

          chartOneObj.calories = entry.foodCalorie.reduce((total, calorie) => {
            return total + (parseInt(calorie, 10) || 0)
          })

          chartTwoObj.exercise = parseInt(entry.dailyExercise, 10) || 0

          chartThreeObj.bloodPressure = parseInt(entry.bloodPressure, 10) || 0
          chartThreeObj.heartRate = parseInt(entry.heartRate, 10) || 0

          chartOne.push(chartOneObj)
          chartTwo.push(chartTwoObj)
          chartThree.push(chartThreeObj)
        })

        this.setState({
          chartOne: chartOne,
          chartTwo: chartTwo,
          chartThree: chartThree
        })
      })
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
    const { width, height } = this.state

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
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex'
              }}
              className='overview-profile-wrapper'
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

            <Link
              to='/profile'
              className='button primary'
              style={{ margin: 'auto' }}
            >
              Update profile
            </Link>
          </div>
        </div>
        {this.state.chartOne && (
          <LineChart
            data={this.state.chartOne}
            width={width}
            height={height}
            titleOne='Calories'
          />
        )}
        {this.state.chartTwo && (
          <LineChart
            data={this.state.chartTwo}
            width={width}
            height={height}
            titleOne='Exercise'
          />
        )}
        {this.state.chartThree && (
          <LineChart
            data={this.state.chartThree}
            width={width}
            height={height}
            titleOne='Blood Pressure'
            titleTwo='Heart Rate'
          />
        )}
      </div>
    )
  }
}
