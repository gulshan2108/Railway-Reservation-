import React, { useEffect, useState } from 'react'
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css';
import {Redirect, BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Registration from './components/Registration';
import Login from './components/Login';
import MainContainer from './components/MainContainer'
import Journey from './components/Journey'
import Dashboard from './components/Dashboard';
import PageTitle from './components/PageTitle';

function App() {

  const [state,setState]=useState({
    isAuth: true,
    adminLogin:false,
  })

  useEffect(()=>{
    isAuth()
  },[])

  const isAuth = () => {
    if(localStorage.getItem("admin"))
      {
        setState({...state,
          adminLogin: true,
          isAuth:false
        })
      }
    else if(localStorage.getItem("user"))
      {
        setState({...state,
        isAuth: true,
        adminLogin:false
        })
      }
    else{
        if(window.location.pathname!=='/'){
        window.location = '/';
      }
    }
  }

  const PrivateRoute=({component: Component, authed, ...rest})=>{
    return <Route
        {...rest}
        component={() =>
          authed===true && state.adminLogin===false ? 
          (
              <Component />
          ) 
          :
          authed===false && state.adminLogin===true && Component===Dashboard ?
          (
            <Component />
          )
          :
          (
              <Redirect to="/" />
          )
      }
      />
    }


  return (
    <div className="App">
      <Router>
        <Switch> 
            <Route exact path="/" component={Login} />
            <Route path="/registration" component={Registration} />
            <PageTitle>
              <MainContainer>
                <PrivateRoute authed={state.isAuth} path="/dashboard" component={Dashboard} />
                <PrivateRoute authed={state.isAuth} path="/journey" component={Journey} />
              </MainContainer>
            </PageTitle>
            
        </Switch>
      </Router>
    </div>
  );
}

export default App;
