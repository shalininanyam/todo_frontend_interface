import React, { useState, useEffect } from 'react';
import './TaskForm.css';

const TaskForm = ({ onAdd, editingTask, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium'); // Default priority

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority || 'Medium'); // Default to Medium 
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please fill in the Title and Due Date.');
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
      priority,
    };

    try {
      let response;
      let savedTask;

      if (editingTask) {
        // *Update Task (PUT request)*
        response = await fetch(`http://localhost:8080/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error('Failed to update task');
        savedTask = await response.json();
        onUpdate(savedTask);
      } else {
        // *Create New Task (POST request)*
        response = await fetch('http://localhost:8080/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error('Failed to add task');
        savedTask = await response.json();
        onAdd(savedTask);
      }

      console.log(editingTask ? 'Task updated' : 'Task added', savedTask);

      // Clear form fields after successful submission
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      {/* Priority Dropdown */}
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;

