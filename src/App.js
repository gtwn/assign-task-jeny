import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Route } from 'react-router-dom';
import './assets/main.css';
import Task from './components/Task'


function App() {
  return (
    <div >
      <Route path='/' component={Task} exact></Route>
    </div>
  )
  
  
}


export default App;
