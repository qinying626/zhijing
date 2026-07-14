import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function Login() {
  const { setAuth } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', characterName: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const url = isRegister ? `${API}/user/auth/register` : `${API}/user/auth/login`;
      const body = isRegister
        ? { username: form.username, email: form.email, password: form.password, characterName: form.characterName || form.username }
        : { username: form.username, password: form.password };

      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.code === 0) {
        setAuth(data.data.token, data.data.userId);
      } else {
        alert(data.message || '操作失败');
      }
    } catch {
      // 后端不可用时，使用演示模式
      alert('后端服务未连接，已进入演示模式');
      setAuth('demo-token-' + Date.now(), 'demo-user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <form onSubmit={submit} className="bg-gray-900 p-8 rounded-lg w-96 space-y-4">
        <h1 className="text-2xl text-white font-bold text-center">{isRegister ? '注册求索者' : '登录知境'}</h1>
        <input className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 outline-none" placeholder="用户名" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        {isRegister && (
          <>
            <input className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 outline-none" placeholder="邮箱" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 outline-none" placeholder="角色名" value={form.characterName} onChange={(e) => setForm({ ...form, characterName: e.target.value })} />
          </>
        )}
        <input className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 outline-none" type="password" placeholder="密码" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? '处理中...' : isRegister ? '注册' : '登录'}
        </button>
        <p className="text-gray-400 text-center text-sm cursor-pointer hover:text-blue-400" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '已有账号？登录' : '没有账号？注册'}
        </p>
      </form>
    </div>
  );
}
