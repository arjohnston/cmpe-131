import React, { Component } from 'react'
import axios from 'axios'

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      notifications: []
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
      () => this.getNotifications()
    )
  }

  getNotifications () {
    axios
      .post('/api/notification/getNotifications', { token: this.state.token })
      .then(res => {
        res.data.forEach(e => {
          delete e.user
          delete e._id
          delete e.__v
        })

        this.setState({
          notifications: res.data.reverse()
        })
      })
  }

  getNotificationIcon (type) {
    switch (type) {
      case 'dailyEntry':
        return (
          <div
            className='notification-icon'
            style={{ backgroundColor: '#4dc79d' }}
          >
            <svg viewBox='0 0 24 24'>
              <path d='M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z' />
            </svg>
          </div>
        )

      case 'doctorVisit':
        return (
          <div
            className='notification-icon'
            style={{ backgroundColor: '#5aa9e3' }}
          >
            <svg viewBox='0 0 24 24'>
              <path d='M19,8C19.56,8 20,8.43 20,9A1,1 0 0,1 19,10C18.43,10 18,9.55 18,9C18,8.43 18.43,8 19,8M2,2V11C2,13.96 4.19,16.5 7.14,16.91C7.76,19.92 10.42,22 13.5,22A6.5,6.5 0 0,0 20,15.5V11.81C21.16,11.39 22,10.29 22,9A3,3 0 0,0 19,6A3,3 0 0,0 16,9C16,10.29 16.84,11.4 18,11.81V15.41C18,17.91 16,19.91 13.5,19.91C11.5,19.91 9.82,18.7 9.22,16.9C12,16.3 14,13.8 14,11V2H10V5H12V11A4,4 0 0,1 8,15A4,4 0 0,1 4,11V5H6V2H2Z' />
            </svg>
          </div>
        )

      case 'waterIntake':
        return (
          <div
            className='notification-icon'
            style={{ backgroundColor: '#53b8c0' }}
          >
            <svg viewBox='0 0 24 24'>
              <path d='M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,6.9C12.44,7.42 12.84,7.85 13.68,9.07C14.89,10.83 16,13.07 16,14.23C16,16.45 14.22,18.23 12,18.23C9.78,18.23 8,16.45 8,14.23C8,13.07 9.11,10.83 10.32,9.07C11.16,7.85 11.56,7.42 12,6.9Z' />
            </svg>
          </div>
        )

      default:
      //
    }
  }

  getTimeStamp (entryDate) {
    const oldDate = Date.parse(entryDate)
    const newDate = new Date()
    const timeDiffInMilliseconds = newDate - oldDate

    const seconds = timeDiffInMilliseconds / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    let dateDiff = seconds
    let dateType = 's'

    if (seconds > 59) {
      dateDiff = minutes
      dateType = 'm'
    }

    if (minutes > 59) {
      dateDiff = hours
      dateType = 'h'
    }

    if (hours > 23) {
      dateDiff = days
      dateType = 'd'
    }

    dateDiff = Math.round(dateDiff)

    return `${dateDiff}${dateType}`
  }

  markNotificationAsRead (entry) {
    axios
      .post('/api/notification/markAsRead', {
        token: this.state.token,
        ...entry
      })
      .then(res => {
        this.getNotifications()
        this.props.renderNotificationBadge()
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderNotifications () {
    if (!this.state.notifications) return

    if (this.state.notifications.length <= 0) {
      return <div style={{ marginTop: '72px' }}>'No notifications to show'</div>
    }

    const notifications = this.state.notifications.map((entry, index) => (
      <li key={index} className={entry.isUnread ? 'isUnread entry' : 'entry'}>
        {this.getNotificationIcon(entry.type)}

        <div className='message' style={{ borderLeft: 'none' }}>
          {entry.message}
        </div>

        <div className='meta-data' style={{ borderLeft: 'none' }}>
          {this.getTimeStamp(entry.date)}
          {entry.isUnread && (
            <div
              className='mark-as-read'
              onClick={this.markNotificationAsRead.bind(this, entry)}
            >
              <svg viewBox='0 0 24 24'>
                <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
              </svg>
            </div>
          )}
        </div>
      </li>
    ))

    return <ul className='data-row'>{notifications}</ul>
  }

  render () {
    return <div className='dashboard-page'>{this.renderNotifications()}</div>
  }
}
