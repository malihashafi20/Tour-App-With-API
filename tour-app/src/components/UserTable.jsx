 
 //src/components/usertable.js
import axios from 'axios';

export default function UserTable({ users, setUsers, token }) {
  const headers = { Authorization: `Bearer ${token}` };
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = async (id) => {
    const newName = prompt('Enter new name:');
    if (!newName) return;
    try {
      await axios.put(
        `${API}/users/${id}`,
        { name: newName },
        { headers }
      );
      setUsers(users.map((u) => (u._id === id ? { ...u, name: newName } : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <table className="w-full mt-6">
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-left">Email</th>
          <th className="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td className="space-x-2">
              <button className="btn-outline" onClick={() => handleEdit(u._id)}>Edit</button>
              <button className="btn-outline" onClick={() => handleDelete(u._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
