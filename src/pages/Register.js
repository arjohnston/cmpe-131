import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      message: '',
      passwordStrength: 'Too short',
      passwordStrengthScore: 0,
      passwordMeterColor: 'red',
      passwordMeterProgress: '25%',
      usernameAvailable: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCheckIfUserExists = this.handleCheckIfUserExists.bind(this)
  }

  handleCheckIfUserExists () {
    if (!this.state.username) return

    if (!/^.+@.+\..+$/.test(this.state.username)) {
      this.setState({
        message: 'Invalid email address'
      })

      return
    }

    axios
      .post('/api/auth/checkIfUserExists', { username: this.state.username })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          this.setState({
            usernameAvailable: true,
            message: ''
          })
        }
      })
      .catch(() => {
        this.setState({
          usernameAvailable: false,
          message: ''
        })
      })
  }

  handleChange (e) {
    const state = Object.assign({}, { ...this.state }, null)
    state[e.target.name] = e.target.value
    this.setState(state)

    if (e.target.name === 'password') {
      this.scorePassword(e.target.value)
    }
  }

  scorePassword (password) {
    let score = 0
    if (!password) return score

    // award every unique letter until 5 repetitions
    const letters = {}
    for (let i = 0; i < password.length; i++) {
      letters[password[i]] = (letters[password[i]] || 0) + 1
      score += 5.0 / letters[password[i]]
    }

    // bonus points for mixing it up
    var variations = {
      digits: /\d/.test(password),
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      nonWords: /\W/.test(password)
    }

    let variationCount = 0
    for (var check in variations) {
      variationCount += variations[check] === true ? 1 : 0
    }
    score += (variationCount - 1) * 10

    let passwordStrength = 'Too short'
    let passwordMeterColor = 'red'
    let passwordMeterProgress = '25%'

    if (score > 80) {
      passwordStrength = 'Strong'
      passwordMeterColor = 'green'
      passwordMeterProgress = '100%'
    } else if (score > 60) {
      passwordStrength = 'Good'
      passwordMeterColor = 'orange'
      passwordMeterProgress = '75%'
    } else if (score >= 30) {
      passwordStrength = 'Weak'
      passwordMeterColor = 'red'
      passwordMeterProgress = '50%'
    }

    this.setState({
      passwordStrengthScore: score,
      passwordStrength: passwordStrength,
      passwordMeterColor: passwordMeterColor,
      passwordMeterProgress: passwordMeterProgress
    })
  }

  handleSubmit (e) {
    e.preventDefault()

    const { username, password, confirmPassword } = this.state

    // If the password doesn't exist or the password and confirmPassword don't match,
    // then return
    if (!password || !confirmPassword) {
      this.setState({
        message: 'Password missing'
      })

      return
    }

    if (password !== confirmPassword) {
      this.setState({
        message: 'Passwords do not match'
      })

      return
    }

    axios
      .post('/api/auth/register', { username, password })
      .then(() => {
        this.setState({ message: '' })
        this.props.history.push('/login')
      })
      .catch(error => {
        this.setState({
          message: error.response.data.message
        })
      })
  }

  render () {
    const { username, password, confirmPassword, message } = this.state

    return (
      <div className='login-container'>
        <div className='login-header'>
          <svg viewBox='0 0 449.61 410.14'>
            <path d='M330.86,0a49.93,49.93,0,1,1-49.93,49.93A49.93,49.93,0,0,1,330.86,0Zm45.65,410.14a36.11,36.11,0,0,1-24.63-9.74l0,0-123-119.64-33.69,32.93A103.9,103.9,0,0,1,71.89,332.11,104.25,104.25,0,0,1,50.27,316.5l.88-.93-.9.91L9.48,276.66l0,0L9,276.19,8.77,276h0c-.7-.81-1.37-1.66-2-2.52a36.1,36.1,0,0,1,54.55-46.89h0l.14.15c.38.37.74.74,1.1,1.13l38.93,40.25a26.93,26.93,0,0,0,37.06-.06L221,187.54h0a11.75,11.75,0,0,1,16.74.11l0,0,164.45,161h0a36.1,36.1,0,0,1-25.65,61.49ZM438.7,154.86l-.06-.07-54.77,53.28,0,0a65.26,65.26,0,0,1-47.46,20.58,64.43,64.43,0,0,1-47-20.11l.86-.82-.9.85-45.2-47.89a21.45,21.45,0,0,0-28.43-.52l0,0L154,219l.07.07c-.49.45-1,.88-1.51,1.29l-.35.34,0,0a36.1,36.1,0,0,1-48.69-53l.08.07,58.82-59,0,0,.67-.6.14-.14h0a98.73,98.73,0,0,1,131.49.31l0,0,.75.75.06.07h0l42.64,43.18L388.53,103h0l.47-.45.57-.55,0,0a36.09,36.09,0,0,1,49.12,52.87Z' />
          </svg>
        </div>
        <h1>Create your account</h1>
        <form onSubmit={this.handleSubmit}>
          {message !== '' && <span>{message}</span>}

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
          {this.state.usernameAvailable !== null && (
            <div style={{ margin: '0 0 12px 12px' }}>
              {this.state.usernameAvailable ? (
                <span style={{ color: 'green' }}>✔ Username available</span>
              ) : (
                <span>✘ Username not available</span>
              )}
            </div>
          )}

          <label htmlFor='password'>Password</label>
          <div className='form-input-wrapper'>
            <input
              type='password'
              name='password'
              id='password'
              value={password}
              onChange={this.handleChange}
              required
            />
            <svg viewBox='0 0 24 24'>
              <path d='M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z' />
            </svg>
          </div>

          <label htmlFor='confirmPassword'>Confirm Password</label>
          <div className='form-input-wrapper'>
            <input
              type='password'
              name='confirmPassword'
              id='confirmPassword'
              value={confirmPassword}
              onChange={this.handleChange}
              required
            />
            <svg viewBox='0 0 24 24'>
              <path d='M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z' />
            </svg>
          </div>

          {this.state.password.length > 0 && (
            <div className='password-strength'>
              Password Strength:{' '}
              <span style={{ color: this.state.passwordMeterColor }}>
                {this.state.passwordStrength}
              </span>
            </div>
          )}

          {this.state.password.length > 0 && (
            <div className='password-meter-wrapper'>
              <div
                className='password-meter'
                style={{
                  background: this.state.passwordMeterColor,
                  width: this.state.passwordMeterProgress
                }}
              />
            </div>
          )}

          <button
            disabled={
              !this.state.password.length > 0 &&
              !this.state.confirmPassword.length > 0 &&
              !this.state.username.length > 0
            }
            className={
              this.state.password.length > 0 &&
              this.state.confirmPassword.length > 0 &&
              this.state.username.length > 0
                ? 'active'
                : 'inactive'
            }
            type='submit'
          >
            Create Account
          </button>
        </form>
        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    )
  }
}
