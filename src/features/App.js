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
import { UserContext } from 'contexts'
import { register as registerFetch } from 'utils'

function App() {
  const [admin, setAdmin] = useState(undefined)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const localAdmin = localStorage.getItem('admin')
    if (!token || !localAdmin) {
      return
    }
    registerFetch(token)
    setAdmin(JSON.parse(localAdmin))
  }, [])

  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={{ admin, setAdmin }}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Layout>
              <Switch>
                {!admin && <Redirect to="/login" />}
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/admins" component={Admins} />
                <Route exact path="/buildings" component={Buildings} />
                <Route exact path="/assignments" component={() => <h1>Asignaciones</h1>} />
                <Route component={() => <h1>404 no encontrado</h1>} />
              </Switch>
            </Layout>
          </Switch>
        </Router>
      </UserContext.Provider>
    </>
  )
}

export default hot(module)(App)
