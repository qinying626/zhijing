const API = process.env.API_URL || 'http://localhost:3000/api/content';

const knowledgePoints = [
  { knowledgePointId: 'math-func-concept', title: '函数的概念', summary: '函数是一种特殊的映射，定义域中每个元素在值域中有唯一对应元素', details: '设A、B是非空的数集，如果按某个确定的对应关系f，使对于集合A中的任意一个数x，在集合B中都有唯一确定的数f(x)和它对应，那么就称f:A→B为从集合A到集合B的一个函数。', examples: ['f(x) = 2x + 1', 'f(x) = x²'], subject: 'math' },
  { knowledgePointId: 'math-func-property', title: '函数的性质', summary: '函数的单调性、奇偶性、周期性', details: '单调性：增函数和减函数；奇偶性：f(-x)=f(x)为偶函数，f(-x)=-f(x)为奇函数；周期性：f(x+T)=f(x)。', examples: ['f(x)=x²是偶函数', 'f(x)=x³是奇函数'], subject: 'math' },
  { knowledgePointId: 'math-triangle', title: '三角函数', summary: '正弦、余弦、正切函数的定义与性质', details: 'sinα = 对边/斜边，cosα = 邻边/斜边，tanα = 对边/邻边。基本关系：sin²α + cos²α = 1', examples: ['sin30° = 1/2', 'cos60° = 1/2'], subject: 'math' },
  { knowledgePointId: 'math-derivative', title: '导数', summary: '导数的概念与运算', details: 'f\'(x) = lim(Δx→0) [f(x+Δx)-f(x)]/Δx。常见导数：(xⁿ)\'=nxⁿ⁻¹，(sinx)\'=cosx，(eˣ)\'=eˣ', examples: ['(x³)\'=3x²', '(2x+1)\'=2'], subject: 'math' },
  { knowledgePointId: 'math-probability', title: '概率与统计', summary: '随机事件的概率、古典概型、统计', details: 'P(A) = A包含的基本事件数 / 基本事件总数。互斥事件：P(A∪B) = P(A) + P(B)。独立事件：P(AB) = P(A)·P(B)', examples: ['掷骰子得6的概率=1/6', '抛硬币正面的概率=1/2'], subject: 'math' },
];

const questions = [
  {
    subject: 'math', knowledgePointId: 'math-func-concept', type: 'choice', difficulty: 'basic',
    content: '下列哪个是函数？', options: ['y = ±√x', 'y = x + 1', 'x = 5', 'y² = x'],
    answer: 'y = x + 1', explanation: '函数要求一个x对应唯一一个y，y=x+1满足此条件。y=±√x一个x对应两个y，不是函数。'
  },
  {
    subject: 'math', knowledgePointId: 'math-func-property', type: 'choice', difficulty: 'basic',
    content: 'f(x) = x² 是什么函数？', options: ['奇函数', '偶函数', '非奇非偶函数', '既奇又偶函数'],
    answer: '偶函数', explanation: 'f(-x) = (-x)² = x² = f(x)，所以f(x)=x²是偶函数。'
  },
  {
    subject: 'math', knowledgePointId: 'math-triangle', type: 'choice', difficulty: 'basic',
    content: 'sin30° 的值是？', options: ['1/2', '√2/2', '√3/2', '1'],
    answer: '1/2', explanation: 'sin30° = 1/2 是特殊角的三角函数值。'
  },
  {
    subject: 'math', knowledgePointId: 'math-derivative', type: 'choice', difficulty: 'advanced',
    content: 'f(x) = 3x² + 2x，则 f\'(x) = ？', options: ['6x + 2', '3x + 2', '6x', '6x² + 2'],
    answer: '6x + 2', explanation: '根据幂函数求导法则 (xⁿ)\'=nxⁿ⁻¹，(3x²)\'=6x，(2x)\'=2，所以f\'(x)=6x+2。'
  },
  {
    subject: 'math', knowledgePointId: 'math-probability', type: 'choice', difficulty: 'challenge',
    content: '掷两枚骰子，点数之和为7的概率是？', options: ['1/6', '5/36', '7/36', '1/4'],
    answer: '1/6', explanation: '总情况36种，和为7的情况有(1,6)(2,5)(3,4)(4,3)(5,2)(6,1)共6种，P=6/36=1/6。'
  },
  {
    subject: 'math', knowledgePointId: 'math-func-concept', type: 'choice', difficulty: 'challenge',
    content: '[2020全国卷I] 已知函数f(x)=eˣ-x-a，若f(x)≥0恒成立，则a的取值范围是？', options: ['a≤1', 'a≥1', 'a≤e', 'a≥e'],
    answer: 'a≤1', explanation: 'f\'(x)=eˣ-1，令f\'(x)=0得x=0。f(0)=1-a为最小值，要f(x)≥0，则1-a≥0，即a≤1。',
    source: '2020全国卷I', year: 2020, province: '全国I卷'
  },
];

async function seed() {
  const res = await fetch(`${API}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ knowledgePoints, examPapers: [] }),
  });
  console.log('Knowledge cards import:', await res.json());

  // Import questions to subject service
  const subjectRes = await fetch(`${API.replace('content', 'subject')}/questions/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions }),
  });
  console.log('Questions import:', await subjectRes.json());
}

seed().catch(console.error);
