const Task = require('../models/Task');
const Category = require('../models/Category');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.params.id },
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'color_code']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.createTask = async (req, res) => {
  const { title, description, deadline, category_id } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      deadline,
      category_id,
      user_id: req.params.id
    });

    res.status(201).json({ success: true, message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, category_id } = req.body;

  try {
    const task = await Task.findOne({ where: { id } });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.deadline = deadline || task.deadline;
    task.category_id = category_id || task.category_id;

    await task.save();

    res.status(200).json({ success: true, message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ where: { id } });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.destroy();

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body;

  try {
    const task = await Task.findOne({ where: { id } });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.is_completed = !!is_completed;
    await task.save();

    res.status(200).json({ success: true, message: `Task marked as ${task.is_completed ? 'complete' : 'incomplete'}`, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
