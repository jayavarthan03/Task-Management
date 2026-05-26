import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    progress: 0,
    priorityStats: { low: 0, medium: 0, high: 0 },
    upcomingTasks: []
  });
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt'
  });

  // Fetch all tasks using query filters
  const fetchTasks = async () => {
    if (!token) return;
    try {
      setLoadingTasks(true);
      const { search, status, priority, sortBy } = filters;
      const res = await api.get('/tasks', {
        params: { search, status, priority, sortBy }
      });
      if (res.data && res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Fetch tasks failed:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Fetch stats for dashboard
  const fetchStats = async () => {
    if (!token) return;
    try {
      setLoadingStats(true);
      const res = await api.get('/tasks/stats');
      if (res.data && res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Fetch stats failed:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch automatically when token or filters change
  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchStats();
    } else {
      setTasks([]);
    }
  }, [token, filters]);

  // Create task
  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      if (res.data && res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      return { success: false, error: message };
    }
  };

  // Update task details
  const updateTask = async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      if (res.data && res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      return { success: false, error: message };
    }
  };

  // Toggle completion status
  const toggleTaskCompletion = async (id, completed) => {
    try {
      const res = await api.put(`/tasks/${id}`, { completed });
      if (res.data && res.data.success) {
        // Optimize UI state update instantly
        setTasks((prev) =>
          prev.map((task) => (task._id === id ? { ...task, completed } : task))
        );
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to toggle completion:', err);
      return { success: false };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.data && res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task';
      return { success: false, error: message };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        filters,
        setFilters,
        loadingTasks,
        loadingStats,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
