import express from 'express';
const router = express.Router();


import { verifyToken } from '../../Middleware/verifyToken.js';
import {getStudents} from "../../Controller/Student/GetStuden.js"

router.get("/getstudents", verifyToken, getStudents);

export default router