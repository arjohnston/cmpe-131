import React, { Component } from 'react'
import axios from 'axios'

// Form entry to POST info to DB:
// 1. Date (Date)
// 2. Notes (String)
// Thank you or submittal screen after submitted

// Probably want to display historical view of entries
// => when loading, get entries

// * Need model, route

// Add new entry button on the top right as the CTA color
// SHow historical view with Date : Notes
//    maxWidth 800px, 2 columns

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      entries: [],
      addEntryFormShown: false,
      formDate: new Date().toJSON().slice(0, 10),
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
        <div style={{ maxWidth: '100px', width: '100%' }}>{`${
          months[new Date(entry.date).getMonth()]
        } ${new Date(entry.date).getDate()}, ${new Date(
          entry.date
        ).getFullYear()}`}
        </div>
        {entry.notes}
      </li>
    ))

    return (
      <ul className='data-row'>
        <li>
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
          formDate: new Date().toJSON().slice(0, 10),
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

              <label htmlFor='formDate'>Date</label>
              <div className='form-input-wrapper'>
                <input
                  type='date'
                  name='formDate'
                  id='formDate'
                  value={formDate}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <label htmlFor='formNotes'>Notes</label>
              <div className='form-input-wrapper'>
                <textarea
                  name='formNotes'
                  id='formNotes'
                  value={formNotes}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <button type='submit'>
                <svg
                  style={{ width: '24px', height: '24px' }}
                  viewBox='0 0 24 24'
                >
                  <path d='M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z' />
                </svg>
                Submit
              </button>
            </form>
          )}
        </div>
        {this.renderEntries()}
      </div>
    )
  }
}
