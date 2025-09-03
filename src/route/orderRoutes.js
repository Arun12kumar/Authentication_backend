import express from 'express';
import { createOrder, deleteAllOrder, deleteOrderById, getAllOrder, getOrderById } from '../controller/orderController.js';


const orderRoute = express.Router();

orderRoute.post('/',createOrder)
orderRoute.get("/", getAllOrder);
orderRoute.get("/:id", getOrderById);
orderRoute.delete("/:id", deleteOrderById);
orderRoute.delete("/", deleteAllOrder);

export default orderRoute;