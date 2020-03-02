import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { Switch, Route, Redirect } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import { Users } from 'features/Users'
import { Admins } from 'features/Admins'
import { Buildings } from 'features/Buildings'
import { Login } from './Login'
import { Assignments } from './Assignments'
import { Statistics } from './Statistics'
import { Campaigns } from './Campaigns'
import { MyAssignments } from './My-Assignments'
import { UserContext } from 'contexts'
import { register as registerFetch } from 'utils'

function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const localUser = localStorage.getItem('user')
    if (!token || !localUser) {
      return
    }
    registerFetch(token)
    setUser(JSON.parse(localUser))
  }, [])

  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Layout>
              <Switch>
                {!user && (
                  <Route
                    render={({ location }) => (
                      <Redirect
                        to={{
                          pathname: '/login',
                          state: { from: location },
                        }}
                      />
                    )}
                  />
                )}
                {user && user.is_admin ? (
                  <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/users" component={Users} />
                    {user && user.is_superadmin && (
                      <Route exact path="/admins" component={Admins} />
                    )}
                    <Route exact path="/buildings" component={Buildings} />
                    <Route exact path="/assignments" component={Assignments} />
                    <Route exact path="/statistics" component={Statistics} />
                    <Route exact path="/campaigns" component={Campaigns} />
                    <Route component={() => <h1>404 no encontrado</h1>} />
                  </Switch>
                ) : (
                  <Switch>
                    <Route exact path="/my-assignments" component={MyAssignments} />
                    <Route component={() => <h1>404 no encontrado</h1>} />
                  </Switch>
                )}
              </Switch>
            </Layout>
          </Switch>
        </Router>
      </UserContext.Provider>
    </>
  )
}

export default process.env.NODE_ENV === 'development' ? hot(module)(App) : App
