import React, { useEffect, useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import './TaskItem.css';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // 1 day before due date

    if (today.toDateString() === reminderDate.toDateString() && !task.completed) {
      setShowReminder(true);
    }
  }, [task.dueDate, task.completed]);

  // Debugging: Check if priority is received correctly
  console.log("Task Data:", task);
  console.log("Priority Value:", task.priority);

  const getPriorityColor = (priority) => {
    if (!priority || typeof priority !== 'string') return '#d9d9d9'; // Default gray if priority is missing
  
    switch (priority.toLowerCase().trim()) { // Ensure case-insensitive matching
      case 'high':
        return '#ff4d4f'; // Red
      case 'medium':
        return '#faad14'; // Orange
      case 'low':
        return '#52c41a'; // Green
      default:
        return '#d9d9d9'; // Default gray
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-info">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p><strong>Due Date:</strong> {task.dueDate}</p>
          <p>
            <strong>Status:</strong> 
            {task.completed ? ' ✅ Completed' : new Date(task.dueDate) < new Date() ? ' ❌ Overdue' : ' ⏳ Not Completed'}
          </p>

          {showReminder && <p className="reminder">⏰ Reminder: Due Tomorrow!</p>}

          {/* ✅ FIX: Show priority only if it's set */}
          {task.priority && (
            <div 
              className="priority-badge" 
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </div>
          )}
        </div>

        <div className="task-actions">
          <button onClick={() => onToggle(task.id)} className="action-btn">
            {task.completed ? <XCircle color="orange" size={30} /> : <CheckCircle color="green" size={30} />}
          </button>
          <button onClick={() => onEdit(task)} className="action-btn">
            <Edit color="blue" size={30} />
          </button>
          <button onClick={() => onDelete(task.id)} className="action-btn">
            <Trash2 color="red" size={30} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;



