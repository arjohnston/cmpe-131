import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      queryUsername: '',
      username: '',
      weight: '',
      gender: 'selectGender',
      name: '',
      message: '',
      profileSetupProgress: 1,
      usernameAvailable: null,
      popupOpen: null,
      deleteAccountUsername: '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
      deleteAccountMessage: '',
      changePasswordMessage: '',
      passwordStrength: 'Too short',
      passwordStrengthScore: 0,
      passwordMeterColor: 'red',
      passwordMeterProgress: '25%',
      nameSetup: false,
      genderSetup: false,
      weightSetup: false,
      entriesSetup: false,
      showSetupProgress: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmitEntry = this.handleSubmitEntry.bind(this)
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this)
    this.handleShowChangePasswordForm = this.handleShowChangePasswordForm.bind(
      this
    )
    this.handleCheckIfUserExists = this.handleCheckIfUserExists.bind(this)
    this.handleClosePopup = this.handleClosePopup.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleChangePasswordSubmit = this.handleChangePasswordSubmit.bind(this)
    this.handleDeleteAccountSubmit = this.handleDeleteAccountSubmit.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    this.setState(
      {
        token: token
      },
      () => this.getProfile(true)
    )
  }

  getProfile (componentJustMounted = false) {
    axios
      .post('/api/dailyEntry/getEntries', { token: this.state.token })
      .then(result => {
        const entriesSetup = result.data.length > 0

        axios
          .post('/api/auth/getUser', { token: this.state.token })
          .then(res => {
            let genderSetup = false
            let nameSetup = false
            let weightSetup = false
            let progress = 1

            // Entries
            if (entriesSetup) progress += 1

            if (
              res.data.name !== '' &&
              res.data.name !== undefined &&
              res.data.name !== null
            ) {
              nameSetup = true
              progress += 1
            }
            if (
              res.data.gender !== 'selectGender' &&
              res.data.gender !== '' &&
              res.data.gender !== undefined
            ) {
              genderSetup = true
              progress += 1
            }
            if (
              res.data.weight !== '' &&
              res.data.weight !== undefined &&
              res.data.weight !== null
            ) {
              weightSetup = true
              progress += 1
            }

            this.setState({
              username: res.data.username || '',
              queryUsername: res.data.username,
              name: res.data.name || '',
              weight: res.data.weight || '',
              gender: res.data.gender || '',
              profileSetupProgress: progress,
              genderSetup: genderSetup,
              nameSetup: nameSetup,
              weightSetup: weightSetup,
              entriesSetup: entriesSetup,
              showSetupProgress: !componentJustMounted || progress !== 5
            })
          })
      })
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

  handleCheckIfUserExists () {
    if (!this.state.username) return

    if (this.state.username === this.state.queryUsername) {
      return this.setState({
        usernameAvailable: null
      })
    }

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
            usernameAvailable: true
          })
        }
      })
      .catch(() => {
        this.setState({
          usernameAvailable: false
        })
      })
  }

  handleClick (e) {
    if (e.target.classList.contains('popup-wrapper')) {
      this.handleClosePopup()
    }
  }

  handleSubmitEntry (e) {
    e.preventDefault()

    if (
      (this.state.username !== this.state.queryUsername &&
        this.state.usernameAvailable) ||
      this.state.username === this.state.queryUsername
    ) {
      const data = {
        token: this.state.token,
        queryUsername: this.state.queryUsername,
        name: this.state.name,
        weight: this.state.weight,
        username: this.state.username,
        gender: this.state.gender
      }

      axios
        .post('/api/auth/edit', data)
        .then(res => {
          this.setState({
            message: 'Successfully updated.',
            queryUsername: this.state.username // update the username in case it was updated
          })

          this.getProfile()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  handleSelect (e) {
    this.setState({
      gender: e.target.value
    })
  }

  handleChange (e) {
    const state = Object.assign({}, { ...this.state }, null)
    state[e.target.name] = e.target.value
    state.message = ''
    this.setState(state)

    if (e.target.name === 'password') {
      this.scorePassword(e.target.value)
    }
  }

  handleDeleteAccount () {
    this.setState({
      popupOpen: 'delete-account'
    })
  }

  handleShowChangePasswordForm () {
    this.setState({
      popupOpen: 'change-password'
    })
  }

  handleClosePopup () {
    this.setState({
      popupOpen: null,
      deleteAccountUsername: '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
      deleteAccountMessage: '',
      changePasswordMessage: ''
    })
  }

  handleDeleteAccountSubmit (e) {
    e.preventDefault()

    const { deleteAccountUsername, queryUsername } = this.state

    if (!deleteAccountUsername) {
      this.setState({
        deleteAccountMessage: 'Account name missing'
      })

      return
    }

    if (deleteAccountUsername !== queryUsername) {
      this.setState({
        deleteAccountMessage: "Account doesn't match your username"
      })

      return
    }

    axios
      .post('/api/dailyEntry/deleteAll', { token: this.state.token })
      .catch(error => {
        console.log(error)
      })

    axios
      .post('/api/doctorVisit/deleteAll', { token: this.state.token })
      .catch(error => {
        console.log(error)
      })

    axios
      .post('/api/notification/deleteAll', { token: this.state.token })
      .catch(error => {
        console.log(error)
      })

    axios
      .post('/api/auth/deleteUser', { token: this.state.token })
      .then(() => {
        // log out
        window.localStorage.removeItem('jwtToken')
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleChangePasswordSubmit (e) {
    e.preventDefault()

    const {
      queryUsername,
      currentPassword,
      password,
      confirmPassword
    } = this.state

    if (!password || !confirmPassword || !currentPassword) {
      this.setState({
        changePasswordMessage: 'Password missing'
      })

      return
    }

    if (password !== confirmPassword) {
      this.setState({
        changePasswordMessage: 'Passwords do not match'
      })

      return
    }

    if (currentPassword === password) {
      this.setState({
        changePasswordMessage: 'Current and new passwords match'
      })

      return
    }

    axios
      .post('/api/auth/login', {
        username: queryUsername,
        password: currentPassword
      })
      .then(() => {
        const data = {
          token: this.state.token,
          queryUsername: queryUsername,
          password: password
        }

        axios
          .post('/api/auth/updatePassword', { ...data })
          .then(() => {
            this.handleClosePopup()
          })
          .catch(error => {
            this.setState({
              changePasswordMessage: error.response.data.message
            })
          })
      })
      .catch(error => {
        this.setState({
          changePasswordMessage: error.response.data.message
        })
      })
  }

  render () {
    const {
      name,
      // formGender,
      weight,
      username,
      message,
      profileSetupProgress,
      currentPassword,
      password,
      confirmPassword,
      deleteAccountMessage,
      changePasswordMessage,
      deleteAccountUsername
    } = this.state

    return (
      <div className='dashboard-page'>
        <h2>Your profile</h2>
        <span style={{ marginBottom: '24px' }}>{message}</span>
        <div
          style={{
            display: this.state.showSetupProgress ? 'flex' : 'none',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '500px'
          }}
        >
          Profile setup progress
          <div style={{ display: 'flex', width: '100%', margin: '6px 0' }}>
            <div className='progress-bar-wrapper'>
              <div
                style={{ width: `${profileSetupProgress * 20}%` }}
                className='progress-bar'
              />
            </div>
            <span style={{ fontSize: '0.8em' }}>
              {profileSetupProgress} / 5
            </span>
          </div>
          <ul className='progress-list'>
            <li className='completed'>
              <svg viewBox='0 0 24 24'>
                <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
              </svg>
              Create account
            </li>
            <li className={this.state.nameSetup ? 'completed' : ''}>
              <svg viewBox='0 0 24 24'>
                <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
              </svg>
              Add your name
            </li>
            <li className={this.state.genderSetup ? 'completed' : ''}>
              <svg viewBox='0 0 24 24'>
                <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
              </svg>
              Select your gender
            </li>
            <li className={this.state.weightSetup ? 'completed' : ''}>
              <svg viewBox='0 0 24 24'>
                <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
              </svg>
              Enter your current weight
            </li>
            <li className={this.state.entriesSetup ? 'completed' : ''}>
              <svg viewBox='0 0 24 24'>
                <path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
              </svg>
              <Link
                to='/daily-entry'
                style={{ textDecoration: 'none', color: '#515151' }}
              >
                Create your first daily entry
              </Link>
            </li>
          </ul>
        </div>

        <div className='profile-wrapper'>
          <div className='profile-form-wrapper'>
            <form onSubmit={this.handleSubmitEntry}>
              <div className='form-input-wrapper'>
                <label htmlFor='name'>Full Name</label>
                <input
                  type='input'
                  name='name'
                  id='name'
                  value={name}
                  placeholder='Joe Schmoe'
                  onChange={this.handleChange}
                />
              </div>

              <div className='form-input-wrapper'>
                <label htmlFor='gender'>Gender</label>
                <select
                  style={{ fontSize: '1.2em' }}
                  onChange={this.handleSelect.bind(this)}
                  value={this.state.gender}
                >
                  <option value='selectGender'>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
                <svg viewBox='0 0 24 24' className='menu-down'>
                  <path d='M7,10L12,15L17,10H7Z' />
                </svg>
              </div>

              <div className='form-input-wrapper'>
                <label htmlFor='weight'>Weight</label>
                <input
                  type='input'
                  name='weight'
                  id='weight'
                  value={weight}
                  placeholder='100'
                  onChange={this.handleChange}
                />
              </div>

              <div className='form-input-wrapper'>
                <label htmlFor='username'>Username</label>
                <input
                  type='input'
                  name='username'
                  id='username'
                  value={username}
                  placeholder='example@abc.com'
                  onChange={this.handleChange}
                  onBlur={this.handleCheckIfUserExists}
                  required
                />
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

              <div className='button-wrapper'>
                <button type='submit' style={{ padding: '12px 36px' }}>
                  <svg viewBox='0 0 24 24'>
                    <path d='M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z' />
                  </svg>
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className='avatar'>
            <svg
              viewBox='0 0 24 24'
              style={{
                backgroundColor: 'DDD',
                fill: 'white',
                marginBottom: '24px'
              }}
            >
              <path d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' />
            </svg>

            <button onClick={this.handleShowChangePasswordForm}>
              <svg viewBox='0 0 24 24'>
                <path d='M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z' />
              </svg>
              Change Password
            </button>

            <button
              onClick={this.handleDeleteAccount}
              className='button-secondary'
            >
              <svg viewBox='0 0 24 24'>
                <path d='M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z' />
              </svg>
              Delete Account
            </button>
          </div>
        </div>

        <div
          className={`popup-wrapper${
            this.state.popupOpen !== null ? ' is-open' : ''
          }`}
          onMouseDown={this.handleClick}
        >
          <div
            className={`popup${
              this.state.popupOpen === 'change-password' ? ' is-open' : ''
            }`}
          >
            <h2>Change Password</h2>
            {changePasswordMessage !== '' && (
              <span>{changePasswordMessage}</span>
            )}
            <div className='popup-close-button' onClick={this.handleClosePopup}>
              <svg viewBox='0 0 24 24'>
                <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
              </svg>
            </div>

            <form
              onSubmit={this.handleChangePasswordSubmit}
              className='profile-form-wrapper'
            >
              <label htmlFor='currentPassword'>Current Password</label>
              <div className='form-input-wrapper'>
                <input
                  type='password'
                  name='currentPassword'
                  id='currentPassword'
                  value={currentPassword}
                  onChange={this.handleChange}
                  style={{ padding: '12px 12px 12px 36px' }}
                  required
                />
                <svg viewBox='0 0 24 24'>
                  <path d='M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z' />
                </svg>
              </div>

              <label htmlFor='password'>Password</label>
              <div className='form-input-wrapper'>
                <input
                  type='password'
                  name='password'
                  id='password'
                  value={password}
                  onChange={this.handleChange}
                  style={{ padding: '12px 12px 12px 36px' }}
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
                  style={{ padding: '12px 12px 12px 36px' }}
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

              <div className='button-wrapper'>
                <button type='submit' style={{ padding: '12px 36px' }}>
                  <svg viewBox='0 0 24 24'>
                    <path d='M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z' />
                  </svg>
                  Save
                </button>
              </div>
            </form>
          </div>

          <div
            className={`popup${
              this.state.popupOpen === 'delete-account' ? ' is-open' : ''
            }`}
          >
            <h2>Delete Account</h2>
            {deleteAccountMessage !== '' && <span>{deleteAccountMessage}</span>}
            <p>Enter your email to delete the account</p>
            <div className='popup-close-button' onClick={this.handleClosePopup}>
              <svg viewBox='0 0 24 24'>
                <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
              </svg>
            </div>

            <form
              onSubmit={this.handleDeleteAccountSubmit}
              className='profile-form-wrapper'
            >
              <div className='form-input-wrapper'>
                <input
                  type='email'
                  name='deleteAccountUsername'
                  id='deleteAccountUsername'
                  placeholder={username}
                  value={deleteAccountUsername}
                  onChange={this.handleChange}
                  style={{ padding: '12px 12px 12px 36px' }}
                  required
                />
                <svg viewBox='0 0 24 24'>
                  <path d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' />
                </svg>
              </div>

              <div className='button-wrapper'>
                <button
                  type='submit'
                  style={{ padding: '12px 36px', backgroundColor: '#c32a2a' }}
                >
                  <svg viewBox='0 0 24 24'>
                    <path d='M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z' />
                  </svg>
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
