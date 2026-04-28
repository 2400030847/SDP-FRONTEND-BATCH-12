import { useState } from "react";

const UserForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "borrower"
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    const exists = users.find((u) => u.email === form.email);
    if (exists) {
      alert("User already exists!");
      return;
    }

    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));

    alert("User added successfully!");

    // Clear form
    setForm({
      email: "",
      password: "",
      role: "borrower"
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="User Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
      />

      <select
        value={form.role}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="borrower">Borrower</option>
        <option value="lender">Lender</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;