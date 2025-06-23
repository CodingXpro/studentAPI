// === Fully Updated StudentList.js with CSS Adjustments for Filter, Pagination, Search ===
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    const res = await axios.get(`http://localhost:5000/students?page=${page}&limit=${limit}`);
    setStudents(res.data.students);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchStudents();
  }, [page, limit]);

  useEffect(() => {
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/students/${editingId}`, form);
        Swal.fire('Updated', 'Student updated successfully', 'success');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/students', form);
        Swal.fire('Created', 'Student added successfully', 'success');
      }
      setForm({ name: '', email: '', age: '' });
      fetchStudents();
      const closeModal = Modal.getInstance(document.getElementById('studentModal'));
      closeModal?.hide();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Something went wrong', 'error');
    }
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, email: student.email, age: student.age });
    setEditingId(student.id);
    const modal = new Modal(document.getElementById('studentModal'));
    modal.show();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This student will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/students/${id}`);
        fetchStudents();
        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
      }
    });
  };

  const totalPages = Math.ceil(total / limit);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="container-fluid mt-4 vw-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-2">
        <h2 className="mb-0">Student List</h2>
        <div className="d-flex gap-2 align-items-center ms-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#studentModal"
            onClick={() => {
              setForm({ name: '', email: '', age: '' });
              setEditingId(null);
            }}
          >
            Add New Student
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center w-100">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.age}</td>
                <td>
                  <button onClick={() => handleEdit(s)} className="btn btn-sm btn-info me-2">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
        <div className="">
          <select
            className="form-select w-auto"
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              className={`btn ${page === num ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="studentModal" tabIndex="-1" aria-labelledby="studentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="studentModalLabel">{editingId ? 'Edit Student' : 'Add Student'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}