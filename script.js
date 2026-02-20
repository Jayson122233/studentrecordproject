const studentForm = document.getElementById('studentForm');
const studentTable = document.getElementById('studentTable');
let editingId = null;

async function loadStudents() {
  try {
    const res = await fetch('/api/students');
    const students = await res.json();
    studentTable.innerHTML = '';

    students.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.idstudents ?? 'N/A'}</td>
        <td>${s.FirstName ?? ''}</td>
        <td>${s.LastName ?? ''}</td>
        <td>${s.Course ?? ''}</td>
        <td>${s.Age ?? ''}</td>
        <td>${s.Address ?? ''}</td>
        <td>
          <button onclick="editStudent(this)">Edit</button>
          <button onclick="deleteStudent(this)">Delete</button>
        </td>
      `;
      row.dataset.student = JSON.stringify(s);
      studentTable.appendChild(row);
    });
  } catch (err) {
    alert('Failed to load students: ' + err.message);
  }
}

studentForm.addEventListener('submit', async e => {
  e.preventDefault();

  const student = {
    idstudents: document.getElementById('StudentNo').value,
    FirstName: document.getElementById('FirstName').value,
    LastName: document.getElementById('LastName').value,
    Course: document.getElementById('Course').value,
    Age: document.getElementById('Age').value,
    Address: document.getElementById('Address').value
  };

  try {
    if (editingId) {
      const res = await fetch(`/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (!res.ok) throw new Error(await res.text());
      editingId = null;
      document.getElementById('StudentNo').disabled = false;
      document.querySelector('button[type="submit"]').textContent = 'Add Student';
    } else {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (!res.ok) throw new Error(await res.text());
    }

    studentForm.reset();
    loadStudents();
  } catch (err) {
    alert('Error saving student: ' + err.message);
  }
});

function editStudent(btn) {
  const row = btn.closest('tr');
  const s = JSON.parse(row.dataset.student);

  const id = s.idstudents;

  editingId = id;
  document.getElementById('StudentNo').value = id;
  document.getElementById('StudentNo').disabled = true;
  document.getElementById('FirstName').value = s.FirstName ?? '';
  document.getElementById('LastName').value = s.LastName ?? '';
  document.getElementById('Course').value = s.Course ?? '';
  document.getElementById('Age').value = s.Age ?? '';
  document.getElementById('Address').value = s.Address ?? '';
  document.querySelector('button[type="submit"]').textContent = 'Update Student';
}

async function deleteStudent(btn) {
  const row = btn.closest('tr');
  const s = JSON.parse(row.dataset.student);
  const id = s.idstudents;

  if (!confirm(`Delete student #${id}?`)) return;

  try {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    loadStudents();
  } catch (err) {
    alert('Error deleting student: ' + err.message);
  }
}

// ----- search / filter logic -----
const searchIdInput = document.getElementById('searchId');
const searchButton = document.getElementById('searchButton');
const clearSearchBtn = document.getElementById('clearSearch');

searchButton.addEventListener('click', async () => {
  const raw = searchIdInput.value.trim();
  if (!raw) return;

  const id = parseInt(raw, 10); // ✅ force integer to avoid type mismatch
  if (isNaN(id)) {
    alert('Please enter a valid Student No.');
    return;
  }

  try {
    const res = await fetch(`/api/students/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        studentTable.innerHTML = '';
        alert('Student not found');
        return;
      }
      throw new Error(await res.text());
    }
    const s = await res.json();
    studentTable.innerHTML = '';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${s.idstudents ?? 'N/A'}</td>
      <td>${s.FirstName ?? ''}</td>
      <td>${s.LastName ?? ''}</td>
      <td>${s.Course ?? ''}</td>
      <td>${s.Age ?? ''}</td>
      <td>${s.Address ?? ''}</td>
      <td>
        <button onclick="editStudent(this)">Edit</button>
        <button onclick="deleteStudent(this)">Delete</button>
      </td>
    `;
    row.dataset.student = JSON.stringify(s);
    studentTable.appendChild(row);
  } catch (err) {
    alert('Error searching student: ' + err.message);
  }
});

clearSearchBtn.addEventListener('click', () => {
  searchIdInput.value = '';
  loadStudents();
});

// initial load of all students
loadStudents();