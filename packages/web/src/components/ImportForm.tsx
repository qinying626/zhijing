import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function ImportForm() {
  const [json, setJson] = useState('');
  const [result, setResult] = useState<string>('');

  const handleImport = async () => {
    try {
      const data = JSON.parse(json);
      const res = await fetch(`${API}/content/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setResult(`导入成功: 知识卡片 ${result.data?.knowledgeCards || 0}，试卷 ${result.data?.examPapers || 0}`);
    } catch (e) {
      setResult(`错误: ${(e as Error).message}`);
    }
  };

  return (
    <div>
      <textarea
        className="w-full h-64 bg-gray-900 text-white p-4 rounded border border-gray-700 font-mono text-sm"
        placeholder='粘贴 JSON 数据，格式: { "knowledgePoints": [...], "examPapers": [...] }'
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <button onClick={handleImport} className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        导入
      </button>
      {result && <p className="mt-4 text-gray-300">{result}</p>}
    </div>
  );
}
