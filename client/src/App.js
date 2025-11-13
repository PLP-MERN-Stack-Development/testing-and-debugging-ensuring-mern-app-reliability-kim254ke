// src/App.js

// 1. IMPORT YOUR CSS FILE HERE
import './App.css'; 

import React from 'react';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className="App">
      {/* 2. ADD THE CORRECT CLASS NAME TO THE HEADER */}
      <header className="App-header">
        <h1>MERN Todo App</h1>
        <p>Testing and Debugging Assignment</p>
      </header>
      <main>
        <TodoApp />
      </main>
    </div>
  );
}

export default App;