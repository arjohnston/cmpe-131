import React, { Component } from 'react'

// Until the profile is set up, direct a user to the profile pge on log in
// Show progress bar (e.g. 25% profile set up)

// profile is set up:
// name entered, gender entered, etc..

// Change password - clicking on this button shows a form w/ confirm, new pass, confirm new pass
// Delete account - clicking instills popup to re-enter username. Log them out once deleted

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
