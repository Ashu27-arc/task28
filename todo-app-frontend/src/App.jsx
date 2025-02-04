import React, { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo, searchTodos } from "./services/api";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTodo = await createTodo({ title, description });
      setTodos([newTodo, ...todos]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const updatedTodo = await updateTodo(id, { status });
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await searchTodos(query);
        setTodos(results);
      } catch (err) {
        setError(err.message);
      }
    } else {
      fetchTodos();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Todo List</h1>
      
      <input
        type="text"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      <div className="todos-list">
        {todos.map((todo) => (
          <div key={todo._id} className="todo-item">
            <div className="todo-content">
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
            <div className="todo-actions">
              <select
                value={todo.status}
                onChange={(e) => handleStatusUpdate(todo._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
