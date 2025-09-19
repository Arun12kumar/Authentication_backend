import express from 'express';
import { createOrder, getAllorders} from '../controller/orderController.js';
import { authMiddleware } from '../middileware/authMiddleware.js';


const orderRoute = express.Router();

orderRoute.post('/',authMiddleware, createOrder);
orderRoute.get('/',getAllorders);



export default orderRoute;