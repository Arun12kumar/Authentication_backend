import express from 'express';
import { createOrder} from '../controller/orderController.js';


const orderRoute = express.Router();

orderRoute.post('/',createOrder)



export default orderRoute;