import express from 'express';
import { createOrder, deleteOrderById,  getAllOrders, getOrderById, updateOrderById } from '../controller/orderController.js';


const orderRoute = express.Router();

orderRoute.post('/',createOrder)
orderRoute.get("/", getAllOrders);
orderRoute.get("/:id", getOrderById);
orderRoute.delete("/:id", deleteOrderById);
orderRoute.put("/:id", updateOrderById);


export default orderRoute;