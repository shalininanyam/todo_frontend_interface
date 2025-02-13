import React from 'react';
import './App.css';
import Header from './components/Header';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="app-container">
      <Header />
      <TaskList />
    </div>
  );
}

export default App;