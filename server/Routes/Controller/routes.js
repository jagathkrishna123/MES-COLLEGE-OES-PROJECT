import express from 'express';
const router = express.Router();
import { verifyToken } from '../../Middleware/verifyToken.js';
import { CreateController, ControllerLogin } from '../../Controller/Controller/login&signup/login&signup.js';
import { createDepartment } from '../../Controller/Controller/Department/createDepartmen.js';
import { getDepartment } from '../../Controller/Controller/Department/getDepartment.js';
import { deleteDepartment } from '../../Controller/Controller/Department/deleteDepartment.js';

import { addFilesMiddleware } from "../../Middleware/exammulter.js"
import { createExam, getAllExams, evaluateExam, publishExam, unpublishExam } from "../../Controller/Controller/Exam/createExam.js"

import { createNotification, deleteNotification, } from '../../Controller/Controller/Notification/createNotification.js';
import { getNotification, updateNotification, updateAllNotification } from '../../Controller/Controller/Notification/getNotification.js';
import { updateTeacherStatus, deleteTeacher } from '../../Controller/Controller/Update&DeleteTeachers/update&delete.js';
import { getControllerDashboardData } from '../../Controller/Controller/Department/getControllerDashboardData.js';
import { getAnalyticsData } from '../../Controller/Controller/Department/getAnalyticsData.js';

// Dashboard Route
router.get("/getDashboardData", verifyToken, getControllerDashboardData);
router.get("/getAnalyticsData", verifyToken, getAnalyticsData);

// Notification Routes
router.post("/createNotification", verifyToken, createNotification);
router.get("/getNotifications", verifyToken, getNotification);
router.put("/updateNotification/:id", verifyToken, updateNotification)
router.put("/updateAllNotification", verifyToken, updateAllNotification)
router.delete("/deleteNotification/:id", verifyToken, deleteNotification);

//Auth Routes
router.post("/createController", CreateController)
router.post("/controllerlogin", ControllerLogin)


// Department Route
router.post("/createDepartment", verifyToken, createDepartment)
router.get("/getDepartment", verifyToken, getDepartment)
router.delete("/deleteDepartment/:id", verifyToken, deleteDepartment)


//Exams Routes
router.post(
  "/createExam",
  verifyToken,
  addFilesMiddleware([
    { name: "questionPaper", maxCount: 1 },
    { name: "answerKey", maxCount: 1 },
    { name: "studentsFiles", maxCount: 50 },
  ]),
  createExam
);
router.get("/getExams", verifyToken, getAllExams)
router.post("/evaluateExam", verifyToken, evaluateExam)
// router.put("/updateExam/:id",verifyToken,updateExam)
router.put("/publishexam/:id", verifyToken, publishExam)
router.put("/unpublishexam/:id", verifyToken, unpublishExam)

//Updae & Delete Teachers
router.put("/updateTeacherStatus/:id", verifyToken, updateTeacherStatus);
router.delete("/deleteTeacher/:id", verifyToken, deleteTeacher);

export default router