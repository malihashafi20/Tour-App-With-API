// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import regEmailTest from '../utils/regEmailTest';
import charLength from '../utils/charLength';
import sanitizeLight from '../utils/sanitizeLight';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    const emailSan = sanitizeLight(form.email);
    const pass = form.password;

    if (!regEmailTest(emailSan)) errs.email = 'Enter a valid email';
    if (!charLength(pass, 6, 100)) errs.password = 'Password must be at least 6 characters';

    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setServerMsg('');

    try {
      const res = await api.post('/login', {
        email: sanitizeLight(form.email),
        password: form.password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('dashboardData', JSON.stringify(res.data.data));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setServerMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {serverMsg && <p className="mt-4 text-center text-sm text-gray-700">{serverMsg}</p>}
      </div>
    </div>
  );
}
