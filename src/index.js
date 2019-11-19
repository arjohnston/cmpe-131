import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import axios from 'axios'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './components/Dashboard/Dashboard'
import Overview from './pages/Overview'
import DailyEntry from './pages/DailyEntry'
import WaterIntake from './pages/WaterIntake'
import DoctorVisits from './pages/DoctorVisits'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Error from './pages/Error'

import 'normalize.css'
import './index.css'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      unreadNotificationCount: 0
    }

    this.getNotifications = this.getNotifications.bind(this)
  }

  componentDidMount () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    if (token) {
      this.setState(
        {
          token: token
        },
        () => {
          // console.log('T1: ', this.state.token)
          this.getNotifications()
          if (this.props.history) this.props.history.push('/')
        }
      )
    }
  }

  getNotifications () {
    const token = window.localStorage
      ? window.localStorage.getItem('jwtToken')
      : ''

    if (token) {
      axios
        .post('/api/notification/getNotifications', { token: token })
        .then(res => {
          let unreadNotificationCount = 0

          res.data.forEach(e => {
            if (e.isUnread) unreadNotificationCount += 1
          })

          this.setState({
            unreadNotificationCount: unreadNotificationCount
          })
        })
        .catch(err => console.log('err...: ', err))
    }
  }

  render () {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path='/(|daily-entry|water-intake|doctor-visits|profile|notifications)'
              render={() => (
                <Dashboard
                  unreadNotificationCount={this.state.unreadNotificationCount}
                  renderNotificationBadge={() => this.getNotifications()}
                >
                  <Route exact path='/' render={() => <Overview />} />
                  <Route path='/daily-entry' render={() => <DailyEntry />} />
                  <Route path='/water-intake' render={() => <WaterIntake />} />
                  <Route
                    path='/doctor-visits'
                    render={() => <DoctorVisits />}
                  />
                  <Route path='/profile' render={() => <Profile />} />
                  <Route
                    path='/notifications'
                    render={() => (
                      <Notifications
                        renderNotificationBadge={() => this.getNotifications()}
                      />
                    )}
                  />
                </Dashboard>
              )}
            />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/forgot-password' component={ForgotPassword} />
            <Route
              render={function () {
                return <Error />
              }}
            />
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
