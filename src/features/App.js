import React from "react"
import Layout from "../components/Drawer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"
import { Switch, Route } from "react-router"
import { BrowserRouter as Router } from "react-router-dom"
import { hot } from "react-hot-loader"

import { Users } from "features/Users"
import { Admins } from "features/Admins"
import { Buildings } from "features/Buildings"

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Users} />
            <Route exact path="/admins" component={Admins} />
            <Route exact path="/buildings" component={Buildings} />
            <Route
              exact
              path="/assignments"
              component={() => <h1>Asignaciones</h1>}
            />
          </Switch>
        </Layout>
      </Router>
    </>
  )
}

export default hot(module)(App)
