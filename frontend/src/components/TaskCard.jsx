import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Edit3, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import { useToast } from './Toast';

const TaskCard = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask } = useContext(TaskContext);
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const { _id, title, description, priority, dueDate, completed } = task;

  // Format Due date beautifully
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Overdue check
  const isOverdue = !completed && new Date(dueDate) < new Date().setHours(0,0,0,0);

  // Priority color tags
  const priorityStyles = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  const handleToggle = async () => {
    const nextState = !completed;
    const res = await toggleTaskCompletion(_id, nextState);
    if (res.success) {
      showToast(
        nextState ? 'Task marked as completed! 🎉' : 'Task marked as pending.', 
        nextState ? 'success' : 'info'
      );
    } else {
      showToast('Failed to update task state.', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      const res = await deleteTask(_id);
      if (res.success) {
        showToast('Task deleted successfully.', 'success');
      } else {
        showToast(res.error || 'Failed to delete task.', 'error');
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`glass-card p-5 rounded-2xl relative flex flex-col justify-between h-48 group overflow-hidden ${
        completed ? 'opacity-65 border-dark-800' : ''
      }`}
    >
      {/* Dynamic completed overlay */}
      {completed && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-600/5 to-transparent pointer-events-none rounded-bl-full" />
      )}

      {/* Task Details Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          {/* Completion toggle and title */}
          <div className="flex items-start gap-3 flex-1 overflow-hidden">
            <button
              onClick={handleToggle}
              className="text-dark-400 hover:text-primary-400 transition-colors shrink-0 mt-0.5"
            >
              {completed ? (
                <CheckCircle2 className="w-5.5 h-5.5 text-primary-500 fill-primary-600/10" />
              ) : (
                <Circle className="w-5.5 h-5.5 hover:scale-105 transition-transform" />
              )}
            </button>
            <h3
              className={`font-semibold text-base truncate select-none text-dark-100 group-hover:text-white transition-colors ${
                completed ? 'line-through text-dark-500 group-hover:text-dark-400' : ''
              }`}
            >
              {title}
            </h3>
          </div>

          {/* Priority Tag */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase shrink-0 ${priorityStyles[priority]}`}>
            {priority}
          </span>
        </div>

        {/* Task description */}
        <p className={`text-xs text-dark-400 line-clamp-3 select-none leading-relaxed break-words ${completed ? 'line-through text-dark-500' : ''}`}>
          {description || <em className="text-dark-600 italic">No description provided</em>}
        </p>
      </div>

      {/* Task Footer Card Actions */}
      <div className="flex items-center justify-between border-t border-dark-800/60 pt-4 mt-3 shrink-0">
        {/* Due Date display */}
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${isOverdue ? 'text-rose-400' : 'text-dark-500'}`} />
          <span className={`text-xs font-medium ${isOverdue ? 'text-rose-400 font-bold' : 'text-dark-400'}`}>
            {formattedDate}
          </span>
          {isOverdue && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">
              <AlertCircle className="w-3 h-3" /> Overdue
            </span>
          )}
        </div>

        {/* Action icons on hover */}
        <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            disabled={isDeleting}
            className="p-2 rounded-xl text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors border border-transparent hover:border-primary-500/10"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-xl text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/10"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
