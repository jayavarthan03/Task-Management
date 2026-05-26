import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  ListTodo, 
  Plus, 
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import TaskFormModal from '../components/TaskFormModal';
import TaskCard from '../components/TaskCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { stats, fetchStats, toggleTaskCompletion } = useContext(TaskContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    progress,
    priorityStats,
    upcomingTasks
  } = stats;

  // Chart 1: Priority Distribution Data
  const priorityData = [
    { name: 'Low', count: priorityStats.low, color: '#10b981' }, // Emerald
    { name: 'Medium', count: priorityStats.medium, color: '#f59e0b' }, // Amber
    { name: 'High', count: priorityStats.high, color: '#f43f5e' } // Rose
  ];

  // Chart 2: Status Split Pie Chart Data
  const statusData = [
    { name: 'Completed', value: completedTasks, color: '#3b82f6' }, // Primary Blue
    { name: 'Pending', value: pendingTasks, color: '#475569' } // Slate
  ];

  const statCards = [
    {
      title: 'Total Projects & Tasks',
      value: totalTasks,
      icon: <ListTodo className="w-6 h-6 text-primary-400" />,
      colorClass: 'text-primary-400',
      bgClass: 'bg-primary-600/10 border-primary-500/15',
      desc: 'Overall created items'
    },
    {
      title: 'Completed Actions',
      value: completedTasks,
      icon: <CheckSquare className="w-6 h-6 text-emerald-400" />,
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-600/10 border-emerald-500/15',
      desc: 'Successfully finalized'
    },
    {
      title: 'Awaiting Actions',
      value: pendingTasks,
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-600/10 border-amber-500/15',
      desc: 'Still remaining active'
    },
    {
      title: 'Execution Ratio',
      value: `${progress}%`,
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      colorClass: 'text-indigo-400',
      bgClass: 'bg-indigo-600/10 border-indigo-500/15',
      desc: 'Progress accomplishment'
    }
  ];

  return (
    <div className="flex-1 p-6 lg:p-8 mt-16 lg:mt-0 overflow-y-auto">
      {/* Dashboard Top welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-400">
              Workspace Overview
            </span>
            <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            Here's a breakdown of your operations and timeline milestones.
          </p>
        </div>

        {/* Create Task Floating Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-primary-500/15 transition-all hover:scale-[1.02] shrink-0 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Launch Task</span>
        </button>
      </div>

      {/* Grid of Stat widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`glass-panel border p-5 rounded-2xl flex items-center justify-between ${card.bgClass}`}
          >
            <div>
              <span className="block text-xs font-bold text-dark-400 uppercase tracking-wide">
                {card.title}
              </span>
              <h3 className="text-2xl font-black text-white mt-2 mb-1">{card.value}</h3>
              <span className="text-[10px] text-dark-500 font-medium">{card.desc}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-dark-900/50 border border-dark-800 shadow-inner">
              {card.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Priority split chart widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-3xl border border-dark-850 lg:col-span-2 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-extrabold text-base text-white">Priority Distribution</h3>
            <p className="text-xs text-dark-400 mt-1">
              Active milestones aggregated by Low, Medium, and High priorities.
            </p>
          </div>
          <div className="h-64 mt-6">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </div>
        </motion.div>

        {/* Completion status Pie Chart widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-panel p-6 rounded-3xl border border-dark-850 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-extrabold text-base text-white">Status Breakdown</h3>
            <p className="text-xs text-dark-400 mt-1">Ratio of completed vs pending objectives.</p>
          </div>
          <div className="h-64 mt-6 relative flex items-center justify-center">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-dark-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </div>
        </motion.div>
      </div>

      {/* Upcoming tasks panel & progress tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline upcoming panel */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-850 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-base text-white">Upcoming Deadlines</h3>
              <p className="text-xs text-dark-400 mt-1">
                Tasks due soon that require your prompt attention.
              </p>
            </div>
            <Link
              to="/tasks"
              className="flex items-center gap-1.5 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors bg-primary-500/5 hover:bg-primary-500/10 px-3.5 py-2 rounded-xl border border-primary-500/10"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {upcomingTasks && upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date().setHours(0,0,0,0);
                const priorityColors = {
                  High: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                };
                return (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-850/50 hover:bg-dark-850 border border-dark-800 transition-all select-none"
                  >
                    <div className="flex items-center gap-3 overflow-hidden pr-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <h4 className="font-semibold text-sm text-dark-100 truncate">
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-dark-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className={isOverdue ? 'text-rose-400 font-bold' : ''}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 rounded-2xl border border-dashed border-dark-800/80">
                <p className="text-xs text-dark-500">No upcoming tasks. You are all caught up! 🌴</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Completion Rate widget card */}
        <div className="glass-panel p-6 rounded-3xl border border-dark-850 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-white">Efficiency Summary</h3>
            <p className="text-xs text-dark-400 mt-1">Reviewing execution performance.</p>
          </div>

          <div className="my-6 flex flex-col items-center">
            {progress >= 70 ? (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-emerald-400">High Velocity Execution</h4>
                <p className="text-[11px] text-dark-400 mt-1 leading-relaxed">
                  You are completing tasks at an exceptional rate. Keep up the high efficiency!
                </p>
              </div>
            ) : progress > 0 ? (
              <div className="p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10 text-center">
                <TrendingUp className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-primary-400">Moderate Execution Velocity</h4>
                <p className="text-[11px] text-dark-400 mt-1 leading-relaxed">
                  You are making solid progress. Try completing a few more high priority items today.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-dark-800/40 border border-dark-800 text-center">
                <TrendingDown className="w-8 h-8 text-dark-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-dark-400">Zero Execution</h4>
                <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                  No active tasks have been marked as completed yet. Set a minor milestone to get started.
                </p>
              </div>
            )}
          </div>

          <div className="bg-dark-900/50 p-4 rounded-2xl border border-dark-800">
            <div className="flex items-center justify-between text-xs text-dark-400 font-semibold mb-2">
              <span>Accomplished ratio</span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-dark-850 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Launch Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={null}
      />
    </div>
  );
};

const EmptyChartState = () => (
  <div className="h-full w-full flex flex-col items-center justify-center select-none text-center">
    <ListTodo className="w-10 h-10 text-dark-600 mb-2.5" />
    <h4 className="text-xs font-bold text-dark-400">No metrics available</h4>
    <p className="text-[10px] text-dark-500 mt-1 max-w-[180px] mx-auto leading-relaxed">
      Create a few active tasks to generate charts and analytical splits.
    </p>
  </div>
);

export default Dashboard;
