import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDateNewest');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        const tasksWithPriority = data.map(task => ({
          ...task,
          priority: task.priority || 'low'
        }));
        setTasks(tasksWithPriority);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      let response;
      let savedTask;

      if (editingTask) {
        // Update task if editing
        response = await fetch(`http://localhost:8080/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });

        if (!response.ok) throw new Error("Failed to update task");
        savedTask = await response.json();
        setTasks(tasks.map((t) =>
          t.id === editingTask.id ? savedTask : t
        ));
        setEditingTask(null); // Reset editing task
      } else {
        // Add new task
        response = await fetch("http://localhost:8080/api/tasks", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });

        if (!response.ok) throw new Error("Failed to add task");
        savedTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, savedTask]);
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'completed' && task.completed) ||
      (filter === 'incomplete' && !task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDateNewest') {
      return new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sortBy === 'dueDateOldest') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === 'titleAZ') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'titleZA') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="task-list-container">
      <TaskForm onAdd={addTask} editingTask={editingTask} />

      <div className="filter-container">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="completed">Completed Tasks</option>
          <option value="incomplete">Incomplete Tasks</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dueDateNewest">Newest Due Date</option>
          <option value="dueDateOldest">Oldest Due Date</option>
          <option value="titleAZ">Title A–Z</option>
          <option value="titleZA">Title Z–A</option>
        </select>
      </div>

      <ul className="task-list">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleComplete}
              onDelete={deleteTask}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>

      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;

