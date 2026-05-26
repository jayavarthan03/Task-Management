const Task = require('../models/Task');

// @desc    Get all tasks for logged in user (with searching, filtering, and sorting)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy } = req.query;
    
    // Base query to retrieve tasks created by this user
    let query = { createdBy: req.user._id };

    // Search filter (title or description match)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter (completed vs pending)
    if (status !== undefined && status !== '' && status !== 'all') {
      query.completed = status === 'completed';
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Configure Sorting
    let sortOptions = { createdAt: -1 }; // default sorting: newest first
    if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1 }; // earliest due date first
    } else if (sortBy === 'dueDateDesc') {
      sortOptions = { dueDate: -1 };
    } else if (sortBy === 'createdAtAsc') {
      sortOptions = { createdAt: 1 }; // oldest first
    } else if (sortBy === 'priorityHigh') {
      // Custom priority sort can be handled programmatically or mapped.
      // We will sort by priority ranking if requested, but standard is fine.
    }

    const tasks = await Task.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Please add a task title');
    }

    if (!dueDate) {
      res.status(400);
      throw new Error('Please add a due date');
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (e.g. title, priority, due date, status)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check task ownership
    if (task.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this task');
    }

    // Update fields
    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (priority !== undefined) updatedFields.priority = priority;
    if (dueDate !== undefined) updatedFields.dueDate = dueDate;
    if (completed !== undefined) updatedFields.completed = completed;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check task ownership
    if (task.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this task');
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics for the Dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run parallel counts to optimize performance
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      lowPriorityCount,
      mediumPriorityCount,
      highPriorityCount
    ] = await Promise.all([
      Task.countDocuments({ createdBy: userId }),
      Task.countDocuments({ createdBy: userId, completed: true }),
      Task.countDocuments({ createdBy: userId, completed: false }),
      Task.countDocuments({ createdBy: userId, priority: 'Low' }),
      Task.countDocuments({ createdBy: userId, priority: 'Medium' }),
      Task.countDocuments({ createdBy: userId, priority: 'High' })
    ]);

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Fetch recent 5 pending tasks as a convenient quick action widget
    const upcomingTasks = await Task.find({
      createdBy: userId,
      completed: false
    })
      .sort({ dueDate: 1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        progress,
        priorityStats: {
          low: lowPriorityCount,
          medium: mediumPriorityCount,
          high: highPriorityCount
        },
        upcomingTasks
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
