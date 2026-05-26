import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import { useToast } from './Toast';

const TaskFormModal = ({ isOpen, onClose, taskToEdit }) => {
  const { createTask, updateTask } = useContext(TaskContext);
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Hydrate fields if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      // Format due date to YYYY-MM-DD for date input
      const dateObj = new Date(taskToEdit.dueDate);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDueDate(`${year}-${month}-${day}`);
    } else {
      // Clear fields for fresh task creation
      setTitle('');
      setDescription('');
      setPriority('Medium');
      // Default due date to today
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDueDate(`${year}-${month}-${day}`);
    }
    setValidationError('');
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Task title is required');
      return;
    }
    if (!dueDate) {
      setValidationError('Due date is required');
      return;
    }

    setLoading(true);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate
    };

    let res;
    if (taskToEdit) {
      res = await updateTask(taskToEdit._id, taskData);
    } else {
      res = await createTask(taskData);
    }

    setLoading(false);

    if (res.success) {
      showToast(
        taskToEdit ? 'Task updated successfully!' : 'Task created successfully! ⚡',
        'success'
      );
      onClose();
    } else {
      showToast(res.error || 'Operation failed.', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="glass-panel max-w-lg w-full rounded-3xl p-6 lg:p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-dark-800 text-dark-400 hover:text-white border border-dark-750 hover:bg-dark-750 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-white mb-6 pr-8 bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
              {taskToEdit ? 'Edit Task Details' : 'Launch New Task'}
            </h2>

            {/* Forms validation warning */}
            {validationError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
                  Task Title <span className="text-primary-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Finish chemistry project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="w-full bg-dark-800/60 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all placeholder-dark-500"
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Detail the instructions or notes for this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-dark-800/60 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all placeholder-dark-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Task Priority */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
                    Priority Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-dark-800/40 p-1 rounded-xl border border-dark-805">
                    {['Low', 'Medium', 'High'].map((p) => {
                      const isActive = priority === p;
                      const activeColors = {
                        Low: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
                        Medium: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
                        High: 'bg-rose-600/20 text-rose-400 border-rose-500/30'
                      };
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 rounded-lg text-xs font-bold border tracking-wide uppercase transition-all duration-200 ${
                            isActive
                              ? activeColors[p]
                              : 'bg-transparent border-transparent text-dark-400 hover:text-dark-200'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
                    Due Date <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-dark-800/60 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all select-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-dark-800/60 pt-6 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-dark-800 text-dark-300 hover:text-white border border-dark-750 hover:bg-dark-750 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-primary-500/15 transition-all disabled:opacity-50 flex items-center gap-2 hover:scale-[1.01]"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : null}
                  <span>{taskToEdit ? 'Save Changes' : 'Launch Task'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
