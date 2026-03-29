import React, { useState } from 'react';

function AddDoctorForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    dob: '',
    gender: 'male',
    designation: '',
    department: '',
    address: '',
    biography: '',
  });
  const [doctors, setDoctors] = useState([]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.department) {
      return;
    }
    setDoctors((prev) => [
      ...prev,
      { id: Date.now(), ...form },
    ]);
    setForm({
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      password: '',
      dob: '',
      gender: 'male',
      designation: '',
      department: '',
      address: '',
      biography: '',
    });
  };

  const handleExport = () => {
    const data = JSON.stringify(doctors, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'doctors-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Doctor Details</h2>
          <p className="text-sm text-gray-500">Add / Edit doctor records.</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Export
        </button>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" name="firstName" value={form.firstName} onChange={handleInput} placeholder="First Name" />
        <input className="input" name="lastName" value={form.lastName} onChange={handleInput} placeholder="Last Name" />
        <input className="input" name="mobile" value={form.mobile} onChange={handleInput} placeholder="Mobile" />
        <input className="input" name="email" type="email" value={form.email} onChange={handleInput} placeholder="Email" />
        <input className="input" name="password" type="password" value={form.password} onChange={handleInput} placeholder="Password" />
        <input className="input" name="dob" type="date" value={form.dob} onChange={handleInput} />
        <select className="input" name="gender" value={form.gender} onChange={handleInput}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input className="input" name="designation" value={form.designation} onChange={handleInput} placeholder="Designation" />
        <input className="input" name="department" value={form.department} onChange={handleInput} placeholder="Department" />
        <input className="input" name="address" value={form.address} onChange={handleInput} placeholder="Address" />

        <textarea
          className="col-span-1 md:col-span-2 input h-28"
          name="biography"
          value={form.biography}
          onChange={handleInput}
          placeholder="Start Biography"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Doctor
        </button>
      </form>

      {doctors.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Added Doctor Records ({doctors.length})</h3>
          <ul className="space-y-2 text-sm">
            {doctors.map((item) => (
              <li key={item.id} className="p-3 border rounded-lg bg-gray-50">
                {item.firstName} {item.lastName} - {item.department}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddDoctorForm;
