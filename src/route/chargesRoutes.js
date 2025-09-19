// routes/chargesRoutes.js
import express from "express";
import { getCharges, updateCharges } from "../controller/chargesController.js";

const chargeRouter = express.Router();

// GET charges (for user, order creation)
chargeRouter.get("/", getCharges);

// PUT charges (for admin dashboard)
chargeRouter.put("/", updateCharges);

export default chargeRouter;