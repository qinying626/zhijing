import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function AnswerPanel() {
  const { battleState } = useGameStore();
  const [question, setQuestion] = useState<{ content: string; options?: string[] } | null>(null);
  const [selected, setSelected] = useState<string>('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const fetchQuestion = async () => {
    const res = await fetch(`${API}/subject/questions?subject=math&limit=1`);
    const data = await res.json();
    if (data.data?.[0]) {
      setQuestion(data.data[0]);
      setSelected('');
      setResult(null);
    }
  };

  const submitAnswer = async () => {
    if (!selected || !question) return;
    const res = await fetch(`${API}/subject/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: (question as Record<string, unknown>)._id,
        userAnswer: selected,
        userId: localStorage.getItem('userId'),
      }),
    });
    const data = await res.json();
    setResult(data.data.correct ? 'correct' : 'wrong');
  };

  if (battleState !== 'fighting') return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 p-4 border-t border-gray-700">
      {!question ? (
        <button onClick={fetchQuestion} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          获取题目
        </button>
      ) : (
        <div>
          <p className="text-white mb-3">{question.content}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {question.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(opt)}
                className={`p-2 rounded border ${selected === opt ? 'border-blue-500 bg-blue-900/50' : 'border-gray-600'} text-white text-left`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={submitAnswer} disabled={!selected} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              提交答案
            </button>
            {result === 'correct' && <span className="text-green-400 self-center">回答正确!</span>}
            {result === 'wrong' && <span className="text-red-400 self-center">回答错误</span>}
          </div>
        </div>
      )}
    </div>
  );
}
