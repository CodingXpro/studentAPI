import express from 'express';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent
} from '../controllers/studentController.js';

const router = express.Router();

// Correct usage: pass the function, do not invoke it
router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
