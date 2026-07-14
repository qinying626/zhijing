import { useAuthStore } from './stores/authStore';
import { Login } from './pages/Login';
import { WorldMap } from './pages/WorldMap';
import { Admin } from './pages/Admin';
import { useState } from 'react';

export default function App() {
  const { token } = useAuthStore();
  const [page, setPage] = useState<'game' | 'admin'>('game');

  if (!token) return <Login />;

  return (
    <div>
      <nav className="bg-gray-900 p-2 flex gap-4">
        <button onClick={() => setPage('game')} className={`text-sm ${page === 'game' ? 'text-blue-400' : 'text-gray-400'}`}>游戏</button>
        <button onClick={() => setPage('admin')} className={`text-sm ${page === 'admin' ? 'text-blue-400' : 'text-gray-400'}`}>管理</button>
      </nav>
      {page === 'game' ? <WorldMap /> : <Admin />}
    </div>
  );
}
