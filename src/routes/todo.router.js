import express from "express";
import {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
    addSubTodo,
    toggleSubTodoCompletion,
    deleteSubTodo
} from "../controllers/todo.controlleer.js";
import { verfifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(verfifyJWT, createTodo).get(verfifyJWT, getTodos);
router.route("/:id").get(verfifyJWT, getTodoById).patch(verfifyJWT, updateTodo).delete(verfifyJWT, deleteTodo);
router.route("/:id/toggle").patch(verfifyJWT, toggleTodoCompletion);
router.route("/:id/subtodos").post(verfifyJWT, addSubTodo);
router.route("/:id/subtodos/:subTodoId/toggle").patch(verfifyJWT, toggleSubTodoCompletion);
router.route("/:id/subtodos/:subTodoId").delete(verfifyJWT, deleteSubTodo);

export default router;