import React, { Component } from 'react'

// Form entry to POST info to DB:
// Water intake interval
// Thank you or submittal screen after submitted

// May need to load current settings on componentDidMount
// so user can edit the settings

// * Need model, route
// * Need cronjob or similar to send notifications at set interval

export default class extends Component {
  render () {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 'calc(100% - 80px)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img
          style={{ maxWidth: '750px' }}
          src='./construction.png'
          alt='This webpage is under construction'
        />
      </div>
    )
  }
}
