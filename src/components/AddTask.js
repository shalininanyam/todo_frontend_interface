import React, { useState, useEffect } from 'react';
import './AddTask.css';

const AddTaskForm = ({ onAdd, editingTask }) => {
  const [title, setTitle] = useState(editingTask ? editingTask.title : '');
  const [description, setDescription] = useState(editingTask ? editingTask.description : '');
  const [dueDate, setDueDate] = useState(editingTask ? editingTask.dueDate : '');
  const [priority, setPriority] = useState(editingTask ? editingTask.priority : 'low'); // Default value

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !dueDate.trim()) {
      alert("Please fill all fields!");
      return;
    }

    const newTask = {
      id: editingTask ? editingTask.id : Date.now(), // Use editing task ID if available
      title,
      description,
      dueDate,
      priority, // Ensure priority is being stored
      completed: editingTask ? editingTask.completed : false,
    };

    console.log("Task Created/Updated:", newTask); // Debugging

    onAdd(newTask);  // Calls onAdd with new/updated task
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('low'); // Reset to default after submitting
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input 
        type="text" 
        placeholder="Task Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Task Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      <input 
        type="date" 
        value={dueDate} 
        onChange={(e) => setDueDate(e.target.value)} 
      />
      
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value)} 
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default AddTaskForm;

