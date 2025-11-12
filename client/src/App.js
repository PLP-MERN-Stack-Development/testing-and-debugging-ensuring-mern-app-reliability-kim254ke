// src/App.js
import React from 'react';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className="App">
      <header>
        <h1>MERN Todo App</h1>
        <p>Testing and Debugging Assignment</p>
      </header>
      <main>
        <TodoApp />
      </main>
    </div>
  );
}

export default App; // Make sure this is a default export