import express from 'express';
const router = express.Router();

import { verifyToken } from '../../Middleware/verifyToken.js';
import { createStudent, editStudent, deleteStudent } from '../../Controller/Teacher/CreateStudent.js';
import { Teachersignup, LoginTeacher } from '../../Controller/Teacher/login&signup.js';
import { getDepartment } from '../../Controller/Controller/Department/getDepartment.js';
import { GetTeacher, GetAllTeachers } from "../../Controller/Teacher/GetTeacher.js"
import { getTeacherDashboardData } from '../../Controller/Teacher/getDashBoardData.js';
import { getTeacherAnalyticsData } from '../../Controller/Teacher/getAnalyticsData.js';


router.get("/TeacherDashboardData", verifyToken, getTeacherDashboardData);
router.get("/getTeacherAnalyticsData", verifyToken, getTeacherAnalyticsData);

router.post('/teachersignup', Teachersignup);

router.post('/loginTeacher', LoginTeacher);

router.get("/getTeacher", verifyToken, GetTeacher);
router.get("/getAllTeachers", verifyToken, GetAllTeachers);


router.post('/createStudent', verifyToken, createStudent)
router.put('/editStudent/:id', verifyToken, editStudent)
router.delete('/deleteStudent/:id', verifyToken, deleteStudent)

router.get("/getTeacherDepartment", getDepartment)
router.get("/getTeacherDepartment", getDepartment)

export default router