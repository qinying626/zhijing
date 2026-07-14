import { Schema, model } from 'mongoose';

const friendSchema = new Schema({
  userId: { type: String, required: true, index: true },
  friendId: { type: String, required: true },
  friendName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export const FriendModel = model('Friend', friendSchema);
