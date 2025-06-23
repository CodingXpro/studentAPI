
import pool from '../db/index.js';

export const createStudent = async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO students (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [name, email, age]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("error :",err)
    res.status(500).json({ error: err.message });
  }
};

export const getAllStudents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const total = await pool.query('SELECT COUNT(*) FROM students');
    const result = await pool.query(
      'SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.json({
      total: parseInt(total.rows[0].count),
      page,
      limit,
      students: result.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    const marks = await pool.query('SELECT * FROM marks WHERE student_id = $1', [id]);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ ...student.rows[0], marks: marks.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(
      'UPDATE students SET name=$1, email=$2, age=$3 WHERE id=$4 RETURNING *',
      [name, email, age, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM students WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
