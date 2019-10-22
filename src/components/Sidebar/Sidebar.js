import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './style.css'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sideBarExpanded: false
    }
  }

  handleSidebarClick () {
    this.setState({
      sideBarExpanded: !this.state.sideBarExpanded
    })
  }

  render () {
    return (
      <div className={`sidebar ${this.state.sideBarExpanded ? 'expanded' : ''}`}>
        <div className='logo'>
          <svg viewBox='0 0 449.61 410.14'>
            <path d='M330.86,0a49.93,49.93,0,1,1-49.93,49.93A49.93,49.93,0,0,1,330.86,0Zm45.65,410.14a36.11,36.11,0,0,1-24.63-9.74l0,0-123-119.64-33.69,32.93A103.9,103.9,0,0,1,71.89,332.11,104.25,104.25,0,0,1,50.27,316.5l.88-.93-.9.91L9.48,276.66l0,0L9,276.19,8.77,276h0c-.7-.81-1.37-1.66-2-2.52a36.1,36.1,0,0,1,54.55-46.89h0l.14.15c.38.37.74.74,1.1,1.13l38.93,40.25a26.93,26.93,0,0,0,37.06-.06L221,187.54h0a11.75,11.75,0,0,1,16.74.11l0,0,164.45,161h0a36.1,36.1,0,0,1-25.65,61.49ZM438.7,154.86l-.06-.07-54.77,53.28,0,0a65.26,65.26,0,0,1-47.46,20.58,64.43,64.43,0,0,1-47-20.11l.86-.82-.9.85-45.2-47.89a21.45,21.45,0,0,0-28.43-.52l0,0L154,219l.07.07c-.49.45-1,.88-1.51,1.29l-.35.34,0,0a36.1,36.1,0,0,1-48.69-53l.08.07,58.82-59,0,0,.67-.6.14-.14h0a98.73,98.73,0,0,1,131.49.31l0,0,.75.75.06.07h0l42.64,43.18L388.53,103h0l.47-.45.57-.55,0,0a36.09,36.09,0,0,1,49.12,52.87Z' />
          </svg>
        </div>

        <nav>
          <NavLink activeClassName='active' exact to='/'>
            <div className='icon' style={{ backgroundColor: '#d498dd' }}>
              <svg viewBox='0 0 24 24'>
                <path d='M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z' />
              </svg>
            </div>
            <span>Overview</span>
          </NavLink>
          <NavLink activeClassName='active' to='/daily-entry'>
            <div className='icon' style={{ backgroundColor: '#4dc79d' }}>
              <svg viewBox='0 0 24 24'>
                <path d='M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z' />
              </svg>
            </div>
            <span>Daily Entry</span>
          </NavLink>
          <NavLink activeClassName='active' to='/doctor-visits'>
            <div className='icon' style={{ backgroundColor: '#5aa9e3' }}>
              <svg viewBox='0 0 24 24'>
                <path d='M19,8C19.56,8 20,8.43 20,9A1,1 0 0,1 19,10C18.43,10 18,9.55 18,9C18,8.43 18.43,8 19,8M2,2V11C2,13.96 4.19,16.5 7.14,16.91C7.76,19.92 10.42,22 13.5,22A6.5,6.5 0 0,0 20,15.5V11.81C21.16,11.39 22,10.29 22,9A3,3 0 0,0 19,6A3,3 0 0,0 16,9C16,10.29 16.84,11.4 18,11.81V15.41C18,17.91 16,19.91 13.5,19.91C11.5,19.91 9.82,18.7 9.22,16.9C12,16.3 14,13.8 14,11V2H10V5H12V11A4,4 0 0,1 8,15A4,4 0 0,1 4,11V5H6V2H2Z' />
              </svg>
            </div>
            <span>Doctor Visits</span>
          </NavLink>
          <NavLink activeClassName='active' to='/water-intake'>
            <div className='icon' style={{ backgroundColor: '#53b8c0' }}>
              <svg viewBox='0 0 24 24'>
                <path d='M12,3.77L11.25,4.61C11.25,4.61 9.97,6.06 8.68,7.94C7.39,9.82 6,12.07 6,14.23A6,6 0 0,0 12,20.23A6,6 0 0,0 18,14.23C18,12.07 16.61,9.82 15.32,7.94C14.03,6.06 12.75,4.61 12.75,4.61L12,3.77M12,6.9C12.44,7.42 12.84,7.85 13.68,9.07C14.89,10.83 16,13.07 16,14.23C16,16.45 14.22,18.23 12,18.23C9.78,18.23 8,16.45 8,14.23C8,13.07 9.11,10.83 10.32,9.07C11.16,7.85 11.56,7.42 12,6.9Z' />
              </svg>
            </div>
            <span>Water Intake</span>
          </NavLink>
        </nav>
        <div className='expand-sidebar-button' onClick={this.handleSidebarClick.bind(this)}>
          <svg viewBox='0 0 24 24'>
            <path d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' />
          </svg>
        </div>
      </div>
    )
  }
}
