import React, { Component } from 'react'

// Form entry to POST info to DB:
// 1. Date (Date)
// 2. Notes (String)
// 3. Blood pressure (number)
// 4. Heart rate (number)
// 5. Daily exercise (minutes) (number)
// 6. Weight (number)
// 7. Food entry:
//      calories  (number)
//      food name (String)
//      food macro (object?)
// Thank you or submittal screen after submitted

// starting to type the food should pop with macro suggestions w/ previously entered food groups
// should retrieve previous macros - so the app "learns"

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
