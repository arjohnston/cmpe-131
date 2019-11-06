import React, { Component } from 'react'

// Form entry to POST info to DB:
// 1. Date (Date)
// 2. Notes (String)
// Thank you or submittal screen after submitted

// Probably want to display historical view of entries
// when loading, get entries

// * Need model, route

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
