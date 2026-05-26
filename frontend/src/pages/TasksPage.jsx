import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal,
  FolderKanban,
  CheckCircle,
  Clock,
  ListTodo
} from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';

const TasksPage = () => {
  const { tasks, filters, setFilters, loadingTasks } = useContext(TaskContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Manage Local Input Search State for responsiveness
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Trigger search update to global context
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: localSearch }));
  };

  // Immediate filter updates
  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handlePriorityChange = (e) => {
    const priority = e.target.value;
    setFilters((prev) => ({ ...prev, priority }));
  };

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  // Open edit modal
  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Close modal reset edit task target
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 mt-16 lg:mt-0 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-400">
            Task Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Your Task Board
          </h1>
          <p className="text-sm text-dark-400">
            Create, filter, update, and sort your active operations cleanly.
          </p>
        </div>

        {/* Launch Task Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-primary-500/15 transition-all hover:scale-[1.02] shrink-0 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Launch Task</span>
        </button>
      </div>

      {/* Control panel containing Search, filters and sorting */}
      <div className="glass-panel p-5 rounded-3xl border border-dark-850 mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          
          {/* Real-time search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-500">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="Search tasks instantly by keyword..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  // Dynamic real-time update also triggered as you type
                  if (e.target.value === '') {
                    setFilters((prev) => ({ ...prev, search: '' }));
                  }
                }}
                className="w-full bg-dark-800/40 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-2xl pl-12 pr-24 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all placeholder-dark-500"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow shadow-primary-500/10"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick status filters toggler */}
          <div className="flex items-center gap-1.5 bg-dark-800/30 p-1 rounded-2xl border border-dark-805 shrink-0 self-start lg:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Tasks', icon: <ListTodo className="w-4 h-4" /> },
              { id: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
              { id: 'completed', label: 'Completed', icon: <CheckCircle className="w-4 h-4" /> }
            ].map((statusTab) => {
              const isActive = filters.status === statusTab.id;
              return (
                <button
                  key={statusTab.id}
                  onClick={() => handleStatusChange(statusTab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20'
                      : 'bg-transparent border border-transparent text-dark-400 hover:text-dark-200'
                  }`}
                >
                  {statusTab.icon}
                  <span>{statusTab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority & Sorting Select dropdowns */}
        <div className="flex flex-wrap items-center gap-4 pt-3.5 border-t border-dark-800/50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-500" />
            <span className="text-xs font-bold text-dark-400">Filters</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Priority selection dropdown */}
            <div className="relative">
              <select
                value={filters.priority}
                onChange={handlePriorityChange}
                className="bg-dark-800/40 hover:bg-dark-800 border border-dark-750 focus:border-primary-500 rounded-xl px-4 py-2.5 text-xs text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all appearance-none cursor-pointer pr-8 font-semibold"
              >
                <option value="all">Priority: All Levels</option>
                <option value="Low">Priority: Low</option>
                <option value="Medium">Priority: Medium</option>
                <option value="High">Priority: High</option>
              </select>
              <div className="absolute right-3.5 top-3.5 w-1.5 h-1.5 border-r border-b border-dark-400 rotate-45 pointer-events-none" />
            </div>

            {/* Sorting selection dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="bg-dark-800/40 hover:bg-dark-800 border border-dark-750 focus:border-primary-500 rounded-xl px-4 py-2.5 text-xs text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all appearance-none cursor-pointer pr-8 font-semibold"
              >
                <option value="createdAt">Sort: Created (Newest)</option>
                <option value="createdAtAsc">Sort: Created (Oldest)</option>
                <option value="dueDate">Sort: Due Date (Earliest)</option>
                <option value="dueDateDesc">Sort: Due Date (Latest)</option>
              </select>
              <div className="absolute right-3.5 top-3.5 w-1.5 h-1.5 border-r border-b border-dark-400 rotate-45 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Task List Cards Grid Layout */}
      {loadingTasks ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4" />
          <p className="text-xs text-dark-400 font-semibold tracking-wide">Syncing tasks database...</p>
        </div>
      ) : tasks && tasks.length > 0 ? (
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-16 text-center rounded-3xl border border-dark-850 flex flex-col items-center justify-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-800 flex items-center justify-center text-dark-500 mb-5 shadow-inner">
            <FolderKanban className="w-8 h-8 text-dark-500" />
          </div>
          <h3 className="font-extrabold text-lg text-white">No active tasks found</h3>
          <p className="text-xs text-dark-450 mt-1 max-w-[280px] leading-relaxed">
            No items matches your active filter criteria. Clear your search or launch a new task to get started!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-xs mt-6 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </motion.div>
      )}

      {/* Launch/Edit form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default TasksPage;
