import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

// Simple to start- just give them a new pwd
// if time allows, hook up w/ email: Mailchimp?

export default class extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      message: '',
      submitted: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    const state = Object.assign({}, { ...this.state }, null)
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  handleSubmit (e) {
    e.preventDefault()

    const { username } = this.state

    axios
      .post('/api/auth/forgot-password', { username })
      .then(() => {
        this.setState({
          message: 'An email has been sent to the users email address.',
          submitted: true
        })
      })
      .catch(error => {
        this.setState({
          message: error.response.data.message
        })
      })
  }

  render () {
    const { username, message } = this.state

    return !this.state.submitted ? (
      <div className='login-container'>
        <div className='login-header'>
          <svg viewBox='0 0 449.61 410.14'>
            <path d='M330.86,0a49.93,49.93,0,1,1-49.93,49.93A49.93,49.93,0,0,1,330.86,0Zm45.65,410.14a36.11,36.11,0,0,1-24.63-9.74l0,0-123-119.64-33.69,32.93A103.9,103.9,0,0,1,71.89,332.11,104.25,104.25,0,0,1,50.27,316.5l.88-.93-.9.91L9.48,276.66l0,0L9,276.19,8.77,276h0c-.7-.81-1.37-1.66-2-2.52a36.1,36.1,0,0,1,54.55-46.89h0l.14.15c.38.37.74.74,1.1,1.13l38.93,40.25a26.93,26.93,0,0,0,37.06-.06L221,187.54h0a11.75,11.75,0,0,1,16.74.11l0,0,164.45,161h0a36.1,36.1,0,0,1-25.65,61.49ZM438.7,154.86l-.06-.07-54.77,53.28,0,0a65.26,65.26,0,0,1-47.46,20.58,64.43,64.43,0,0,1-47-20.11l.86-.82-.9.85-45.2-47.89a21.45,21.45,0,0,0-28.43-.52l0,0L154,219l.07.07c-.49.45-1,.88-1.51,1.29l-.35.34,0,0a36.1,36.1,0,0,1-48.69-53l.08.07,58.82-59,0,0,.67-.6.14-.14h0a98.73,98.73,0,0,1,131.49.31l0,0,.75.75.06.07h0l42.64,43.18L388.53,103h0l.47-.45.57-.55,0,0a36.09,36.09,0,0,1,49.12,52.87Z' />
          </svg>
        </div>
        <h1>Forgot Password</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='username'>Username</label>
          <div className='form-input-wrapper'>
            <input
              type='email'
              name='username'
              id='username'
              value={username}
              onChange={this.handleChange}
              onBlur={this.handleCheckIfUserExists}
              required
            />
            <svg viewBox='0 0 24 24'>
              <path d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' />
            </svg>
          </div>

          <button
            disabled={!this.state.username.length > 0}
            className={this.state.username.length > 0 ? 'active' : 'inactive'}
            type='submit'
          >
            Send email with reset link
          </button>
        </form>

        <p>
          Already know your password? <Link to='/login'>Login</Link>
        </p>
      </div>
    ) : (
      <div className='login-container'>
        <div className='login-header'>
          <svg viewBox='0 0 449.61 410.14'>
            <path d='M330.86,0a49.93,49.93,0,1,1-49.93,49.93A49.93,49.93,0,0,1,330.86,0Zm45.65,410.14a36.11,36.11,0,0,1-24.63-9.74l0,0-123-119.64-33.69,32.93A103.9,103.9,0,0,1,71.89,332.11,104.25,104.25,0,0,1,50.27,316.5l.88-.93-.9.91L9.48,276.66l0,0L9,276.19,8.77,276h0c-.7-.81-1.37-1.66-2-2.52a36.1,36.1,0,0,1,54.55-46.89h0l.14.15c.38.37.74.74,1.1,1.13l38.93,40.25a26.93,26.93,0,0,0,37.06-.06L221,187.54h0a11.75,11.75,0,0,1,16.74.11l0,0,164.45,161h0a36.1,36.1,0,0,1-25.65,61.49ZM438.7,154.86l-.06-.07-54.77,53.28,0,0a65.26,65.26,0,0,1-47.46,20.58,64.43,64.43,0,0,1-47-20.11l.86-.82-.9.85-45.2-47.89a21.45,21.45,0,0,0-28.43-.52l0,0L154,219l.07.07c-.49.45-1,.88-1.51,1.29l-.35.34,0,0a36.1,36.1,0,0,1-48.69-53l.08.07,58.82-59,0,0,.67-.6.14-.14h0a98.73,98.73,0,0,1,131.49.31l0,0,.75.75.06.07h0l42.64,43.18L388.53,103h0l.47-.45.57-.55,0,0a36.09,36.09,0,0,1,49.12,52.87Z' />
          </svg>
        </div>
        <h1>{message}</h1>
        <p style={{ fontSize: '1em' }}>
          <Link to='/login'>Return to login</Link>
        </p>
      </div>
    )
  }
}
