import { Router } from 'express';
import { successRes } from '@zhijing/shared';

const router = Router();

const zones = [
  { id: 'math-hall', name: '数理殿', subject: 'math', description: '逻辑与秩序之域', requiredLevel: 1 },
  { id: 'literature-pavilion', name: '文心阁', subject: 'chinese', description: '文字与意境之域', requiredLevel: 1 },
  { id: 'spirit-forest', name: '灵语林', subject: 'english', description: '跨语言沟通之域', requiredLevel: 1 },
  { id: 'world-map', name: '天地图', subject: 'geography', description: '山川与文明之域', requiredLevel: 1 },
  { id: 'phenomena-court', name: '万象庭', subject: 'physics', description: '自然法则之域', requiredLevel: 1 },
  { id: 'plaza', name: '知行广场', subject: 'social', description: '社交与交易枢纽', requiredLevel: 1 },
];

router.get('/', (_req, res) => {
  res.json(successRes(zones));
});

export default router;
