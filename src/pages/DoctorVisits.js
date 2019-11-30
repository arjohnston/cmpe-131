import React, { Component } from 'react'
import axios from 'axios'

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      entries: [],
      addEntryFormShown: false,
      formDate: new Date(),
      formNotes: '',
      message: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmitEntry = this.handleSubmitEntry.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    this.setState(
      {
        token: token
      },
      () => this.getEntries()
    )
  }

  getEntries () {
    axios
      .post('/api/doctorVisit/getEntries', { token: this.state.token })
      .then(res => {
        res.data.forEach(e => {
          delete e.user
          delete e._id
          delete e.__v
        })
        this.setState({
          entries: res.data.reverse()
        })
      })
  }

  renderEntries () {
    if (!this.state.entries) return

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]

    const entries = this.state.entries.map((entry, index) => (
      <li key={index} className='entry'>
        <div style={{ maxWidth: '100px', width: '100%', border: 'none' }}>
          <span>Date: </span>
          {`${months[new Date(entry.date).getMonth()]} ${new Date(
            entry.date
          ).getDate()}, ${new Date(entry.date).getFullYear()}`}
        </div>
        <div style={{ maxWidth: '100%', textAlign: 'left' }}>
          <span>Notes: </span>
          {entry.notes}
        </div>
      </li>
    ))

    return (
      <ul className='data-row'>
        <li className='data-header'>
          <div style={{ maxWidth: '100px', width: '100%' }}>Date</div>
          <div>Notes</div>
        </li>
        {entries}
      </ul>
    )
  }

  handleShowEntryForm () {
    this.setState({
      addEntryFormShown: true
    })
  }

  handleSubmitEntry (e) {
    e.preventDefault()

    const data = {
      token: this.state.token,
      date: this.state.formDate,
      notes: this.state.formNotes
    }

    axios
      .post('/api/doctorVisit/submit', data)
      .then(res => {
        this.setState({
          addEntryFormShown: false, // close the form
          formDate: new Date(), // reset the date
          formNotes: '',
          message: ''
        })

        this.getEntries() // reload the data
        this.createNotification()
      })
      .catch(error => {
        this.setState({
          message: `There was a problem: ${error}`
        })
      })
  }

  createNotification () {
    const data = {
      token: this.state.token,
      type: 'doctorVisit',
      message: `Doctor Visit note created at ${new Date()}`,
      isRead: true
    }

    axios.post('/api/notification/create', data)
  }

  handleChange (e) {
    const state = Object.assign({}, { ...this.state }, null)
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  render () {
    const { formDate, formNotes, message } = this.state

    let date = formDate

    if (date.getMonth) {
      date = date.toJSON().slice(0, 10)
    }

    return (
      <div className='dashboard-page'>
        <div className='entry-form-wrapper'>
          <button
            onClick={this.handleShowEntryForm.bind(this)}
            className='entry-form-cta'
          >
            Add Entry
          </button>

          {this.state.addEntryFormShown && (
            <form onSubmit={this.handleSubmitEntry}>
              {message !== '' && <span>{message}</span>}

              <div className='form-input-wrapper'>
                <label htmlFor='formDate'>Date</label>
                <input
                  type='date'
                  name='formDate'
                  id='formDate'
                  value={date}
                  onChange={this.handleChange}
                  required
                  style={{ padding: '9px 12px' }}
                />
              </div>

              <div className='form-input-wrapper' style={{ width: '100%' }}>
                <label htmlFor='formNotes'>Notes</label>
                <textarea
                  name='formNotes'
                  id='formNotes'
                  value={formNotes}
                  placeholder='Your notes here'
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className='button-wrapper'>
                <button type='submit'>
                  <svg viewBox='0 0 24 24'>
                    <path d='M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z' />
                  </svg>
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
        {this.renderEntries()}
      </div>
    )
  }
}
