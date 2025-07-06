import './App.css';
import { useEffect } from 'react';
import {Switch,Route} from 'react-router-dom';
import Login from './Components/login';
import Myaccount from './Components/myAccount';
import Error from './Components/error';
import Register from './Components/register';
import Verify from './Components/verify';
import PrivateRoute from './Components/private';
import ManageTasks from './Components/manageTasks';
import ManageCategories from './Components/manageCategories';

function App() {
  useEffect(()=>{
    document.body.style.overflowX="hidden";
  },[])
  return (
    <div className="App">
     <Switch>
      <Route exact path="/" component={Login}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/verify" component={Verify}/>
      <PrivateRoute path="/home" component={ManageTasks}/>
      <PrivateRoute path="/category" component={ManageCategories}/>
      <PrivateRoute path="/my-accounts" component={Myaccount}/>
      <Route path="/404" component={Error}/>
     </Switch>
    </div>
  );
}

export default App;
