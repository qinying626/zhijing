import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ImportForm } from '../components/ImportForm';

export function Admin() {
  const { token } = useAuthStore();
  const [tab, setTab] = useState<'import' | 'stats'>('import');

  if (!token) return <div className="text-white p-8">请先登录</div>;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-2xl text-white font-bold mb-6">知境管理后台</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('import')} className={`px-4 py-2 rounded ${tab === 'import' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>内容导入</button>
        <button onClick={() => setTab('stats')} className={`px-4 py-2 rounded ${tab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>数据统计</button>
      </div>
      {tab === 'import' && <ImportForm />}
      {tab === 'stats' && <div className="text-gray-400">统计功能开发中...</div>}
    </div>
  );
}
