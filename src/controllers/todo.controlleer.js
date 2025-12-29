import { Todo } from "../models/todo.model.js";  // adjust path as needed

// Create a new Todo
export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, subTodos } = req.body;
    const user = req.user._id;

    const todo = await Todo.create({
      title,
      description,
      dueDate: dueDate || null,
      user,
      subTodos: subTodos || [],
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Todos for a user
export const getTodos = async (req, res) => {
  try {
    const userId = req.user._id;
    const todos = await Todo.find({ user: userId }).populate("user");

    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single Todo by ID
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).populate("user");

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a Todo
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a Todo
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.status(200).json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle completion status
export const toggleTodoCompletion = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    todo.isCompleted = !todo.isCompleted;
    await todo.save();

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a subTodo
export const addSubTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    todo.subTodos.push({ title });
    await todo.save();

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Toggle subTodo completion
export const toggleSubTodoCompletion = async (req, res) => {
  try {
    const { subTodoId } = req.params;
    const todo = await Todo.findOne({ "subTodos._id": subTodoId });

    if (!todo) {
      return res.status(404).json({ success: false, message: "SubTodo not found" });
    }

    const subTodo = todo.subTodos.id(subTodoId);
    subTodo.completed = !subTodo.completed;
    await todo.save();

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a subTodo
export const deleteSubTodo = async (req, res) => {
  try {
    const { subTodoId } = req.params;
    const todo = await Todo.findOne({ "subTodos._id": subTodoId });

    if (!todo) {
      return res.status(404).json({ success: false, message: "SubTodo not found" });
    }

    todo.subTodos.pull({ _id: subTodoId });

    await todo.save();

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};