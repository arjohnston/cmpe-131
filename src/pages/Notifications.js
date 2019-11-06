import React, { Component } from 'react'

// Show all user entries have been made
// Make notifications for water intake
// notification counter should feed header
// load data on load

// all form saves should increment / save for notifications

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
