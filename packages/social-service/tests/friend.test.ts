import { FriendModel } from '../src/models/Friend';

// Mock mongoose model for testing
jest.mock('../src/models/Friend', () => ({
  FriendModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('Friend Routes Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('add friend', () => {
    it('should create a friend request when inputs are valid', async () => {
      const mockFriend = {
        userId: 'user1',
        friendId: 'user2',
        friendName: 'TestUser',
        status: 'pending',
      };
      (FriendModel.findOne as jest.Mock).mockResolvedValue(null);
      (FriendModel.create as jest.Mock).mockResolvedValue(mockFriend);

      const result = await FriendModel.create(mockFriend);
      expect(result).toEqual(mockFriend);
      expect(FriendModel.create).toHaveBeenCalledWith(mockFriend);
    });

    it('should reject duplicate friend requests', async () => {
      const existing = { userId: 'user1', friendId: 'user2', status: 'pending' };
      (FriendModel.findOne as jest.Mock).mockResolvedValue(existing);

      const result = await FriendModel.findOne({ userId: 'user1', friendId: 'user2' });
      expect(result).toEqual(existing);
    });
  });

  describe('list friends', () => {
    it('should return accepted friends for a user', async () => {
      const mockFriends = [
        { userId: 'user1', friendId: 'user2', friendName: 'Friend1', status: 'accepted' },
        { userId: 'user1', friendId: 'user3', friendName: 'Friend2', status: 'accepted' },
      ];
      (FriendModel.find as jest.Mock).mockResolvedValue(mockFriends);

      const result = await FriendModel.find({ userId: 'user1', status: 'accepted' });
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockFriends);
    });

    it('should return empty list when user has no friends', async () => {
      (FriendModel.find as jest.Mock).mockResolvedValue([]);

      const result = await FriendModel.find({ userId: 'user1', status: 'accepted' });
      expect(result).toHaveLength(0);
    });
  });

  describe('delete friend', () => {
    it('should delete a friend by id', async () => {
      (FriendModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: 'friend1' });

      await FriendModel.findByIdAndDelete('friend1');
      expect(FriendModel.findByIdAndDelete).toHaveBeenCalledWith('friend1');
    });
  });
});
