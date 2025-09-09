import express from 'express';
import { searchAllProduct } from '../controller/searchController.js';


const searchRoute = express.Router();


searchRoute.get("/", searchAllProduct);


export default searchRoute;