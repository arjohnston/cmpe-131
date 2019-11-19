import React, { Component } from 'react'
import axios from 'axios'

// To support a mailer system for delivering notifications
// a crontab or similar would need to be setup in order to
// create notifications & send emails server side

// animation when saving

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectionMenu: 0,
      canUpdate: false,
      message: ''
    }
  }

  componentDidMount () {
    // put in current value
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    this.setState(
      {
        token: token
      },
      () => this.getCurrentWaterIntake()
    )
  }

  getCurrentWaterIntake () {
    axios
      .post('/api/auth/getWaterIntakeFrequency', { token: this.state.token })
      .then(res => {
        this.setState({
          username: res.data.username,
          selectionMenu: res.data.waterIntakeFrequency || 0
        })
      })
  }

  handleChange (e) {
    this.setState({
      selectionMenu: e.target.value,
      canUpdate: e.target.value !== this.state.selectionMenu,
      message: ''
    })
  }

  handleUpdateWaterIntake () {
    axios
      .post('/api/auth/edit', {
        waterIntakeFrequency: this.state.selectionMenu,
        // This token must be passed in for authentication
        token: this.state.token
      })
      .then(() => {
        this.setState({
          canUpdate: false,
          message: 'Water intake interval has been updated.'
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  renderSelectMenu () {
    const options = []

    for (let i = 0; i <= 24; i++) {
      options.push(i)
    }
    return (
      <select
        style={{ fontSize: '1.2em' }}
        onChange={this.handleChange.bind(this)}
        value={this.state.selectionMenu}
      >
        {options.map((optionIndex, index) => {
          const amountOfTime = optionIndex > 0 ? optionIndex : 'None'
          const hourLabel =
            optionIndex > 0 ? (optionIndex <= 1 ? ' hour' : ' hours') : ''
          return (
            <option value={optionIndex} key={index}>
              {amountOfTime}
              {hourLabel}
            </option>
          )
        })}
      </select>
    )
  }

  render () {
    return (
      <div className='dashboard-page' style={{ paddingTop: '72px' }}>
        <h2>
          How often would you like to receive reminders for your water intake?
        </h2>
        <p>{this.state.message}</p>

        {this.renderSelectMenu()}

        {this.state.canUpdate && (
          <button
            onClick={this.handleUpdateWaterIntake.bind(this)}
            className='entry-form-cta'
            style={{ alignSelf: 'center', marginTop: '24px' }}
          >
            <svg
              viewBox='0 0 24 24'
              style={{ width: '30px', fill: 'white', marginRight: '6px' }}
            >
              <path d='M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z' />
            </svg>
            Save
          </button>
        )}
      </div>
    )
  }
}
