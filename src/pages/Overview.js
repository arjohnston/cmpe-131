import React, { Component } from 'react'

// 1. Get analytics for all entries and store in state
// 2. filter function to choose which analytic to present
// 3. D3 graph to display graph of chosen analytic
// 4. Initially display all data

// Calories
// Weight
// Daily exercise
// Blood Pressure
// heart rate
// Food entry?? Maybe..

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
