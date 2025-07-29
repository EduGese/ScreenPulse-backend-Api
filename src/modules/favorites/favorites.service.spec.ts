import favoritesService from './favorites.service';
import favoritesSchema from '../../models/favorites';
import userSchema from '../../models/user';
import descriptionSchema from '../../models/description';
import { ApiError } from '../../errors/apiError';
import { Types } from 'mongoose';
import { MediaItemInput } from '../../interfaces/favorites.interface';

jest.mock('../../models/user');
jest.mock('../../models/favorites');
jest.mock('../../models/description');

// IDs válidos para Mongo
const validUserId = new Types.ObjectId().toHexString();
const anotherUserId = new Types.ObjectId().toHexString();
const validFavId = new Types.ObjectId();
;

describe('FavoritesService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFavorite', () => {
    it('should create a new favorite if it does not exist', async () => {
      const mockUser = { _id: validUserId, favorites: [], save: jest.fn() };
      const mockFavorite = { _id: validFavId, title: 'Matrix', year: '1999', imdbID: 'id1', type: 'movie', poster: 'img', user: [] };
      (userSchema.findById as jest.Mock).mockResolvedValue(mockUser);
      (favoritesSchema.findOne as jest.Mock).mockResolvedValue(null);
      (favoritesSchema.create as jest.Mock).mockResolvedValue(mockFavorite);

      const input: MediaItemInput = { title: 'Matrix', year: '1999', imdbID: 'id1', type: 'movie', poster: 'img' };
      const result = await favoritesService.createFavorite(validUserId, input);
      expect(userSchema.findById).toHaveBeenCalledWith(validUserId);
      expect(favoritesSchema.create).toHaveBeenCalled();
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toMatchObject({
        _id: mockFavorite._id,
        title: mockFavorite.title,
        imdbID: mockFavorite.imdbID
      });
    });

    it('should add to existing favorite and user favorites if it exists', async () => {
      const mockUser = { _id: validUserId, favorites: [], save: jest.fn() };
      const mockFavorite = { _id: validFavId, user: [], save: jest.fn() };
      (userSchema.findById as jest.Mock).mockResolvedValue(mockUser);
      (favoritesSchema.findOne as jest.Mock).mockResolvedValue(mockFavorite);

      const input: MediaItemInput = { title: 'Inception', year: '2010', imdbID: 'id2', type: 'movie', poster: 'img2' };
      const result = await favoritesService.createFavorite(validUserId, input);

      expect(mockFavorite.save).toHaveBeenCalled();
      expect(mockUser.save).toHaveBeenCalled();
      expect(result._id.toString()).toBe(validFavId.toString());
    });

    it('should throw 404 if user not found', async () => {
      (userSchema.findById as jest.Mock).mockResolvedValue(null);
      const input: MediaItemInput = { title: '', year: '', imdbID: 'x', type: '', poster: '' };
      await expect(favoritesService.createFavorite(validUserId, input))
        .rejects.toThrow(ApiError);
    });

    it('should throw 409 if favorite already exists for user', async () => {
      const mockUser = { _id: anotherUserId, favorites: [validFavId], save: jest.fn() };
      const mockFavorite = { _id: validFavId, user: [], save: jest.fn() };
      (userSchema.findById as jest.Mock).mockResolvedValue(mockUser);
      (favoritesSchema.findOne as jest.Mock).mockResolvedValue(mockFavorite);

      const input: MediaItemInput = { title: '', year: '', imdbID: 'x', type: '', poster: '' };
      await expect(
        favoritesService.createFavorite(anotherUserId, input)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getFavorites', () => {
    it('should return paginated favorites', async () => {
      const mockUser = { _id: validUserId };
      const mockFavorites = [
        { _id: validFavId, title: 'Matrix', toObject: jest.fn().mockReturnValue({ _id: validFavId, title: 'Matrix' }) }
      ];
      const mockDesc = { description: 'A sci-fi classic' };
      (userSchema.findById as jest.Mock).mockResolvedValue(mockUser);
      (favoritesSchema.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockFavorites)
      });
      (favoritesSchema.countDocuments as jest.Mock).mockResolvedValue(1);
      (descriptionSchema.findOne as jest.Mock).mockResolvedValue(mockDesc);

      const result = await favoritesService.getFavorites(validUserId, 1, 1, 'title', 1, 'movie', '');
      expect(result.favorites[0]).toMatchObject({ title: 'Matrix', description: mockDesc.description });
      expect(result.totalFavorites).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it('should throw 404 if user not found', async () => {
      (userSchema.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        favoritesService.getFavorites(anotherUserId, 1, 1, 'title', 1)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('deleteFavorite', () => {
    it('should remove favorite from user and favorite user list', async () => {
      const favId = new Types.ObjectId().toHexString();
      const userId = new Types.ObjectId().toHexString();
      const mockFavorite = { _id: favId, user: [userId], save: jest.fn() };
      const mockUser = { _id: userId, favorites: [favId], save: jest.fn() };
      (favoritesSchema.findById as jest.Mock).mockResolvedValue(mockFavorite);
      (userSchema.findById as jest.Mock).mockResolvedValue(mockUser);
      (descriptionSchema.deleteOne as jest.Mock).mockResolvedValue({});

      await favoritesService.deleteFavorite(favId, userId);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockFavorite.save).toHaveBeenCalled();
      expect(descriptionSchema.deleteOne).toHaveBeenCalledWith({
        userId,
        favoriteId: favId,
      });
    });

    it('should delete favorite document if last user', async () => {
      const favId = new Types.ObjectId().toHexString();
      const userId = new Types.ObjectId().toHexString();
      const mockFavorite = { _id: favId, user: [userId], save: jest.fn() };
      const mockUser = { _id: userId, favorites: [favId], save: jest.fn() };
      (favoritesSchema.findById as jest.Mock).mockResolvedValue(mockFavorite);
      (userSchema.findById as jest.Mock).mockResolvedValue(mockUser);
      (descriptionSchema.deleteOne as jest.Mock).mockResolvedValue({});
      (favoritesSchema.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      mockFavorite.user = [];

      await favoritesService.deleteFavorite(favId, userId);

      expect(favoritesSchema.findByIdAndDelete).toHaveBeenCalledWith(favId);
    });

    it('should throw 404 if favorite not found', async () => {
      (favoritesSchema.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        favoritesService.deleteFavorite(validFavId.toHexString(), validUserId)
      ).rejects.toThrow(ApiError);
    });

    it('should throw 404 if user not found', async () => {
      (favoritesSchema.findById as jest.Mock).mockResolvedValue({ _id: validFavId, user: [], save: jest.fn() });
      (userSchema.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        favoritesService.deleteFavorite(validFavId.toHexString(), anotherUserId)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('updateFavorite', () => {
    it('should create new description if it does not exist', async () => {
      const favId = new Types.ObjectId().toHexString();
      const userId = new Types.ObjectId().toHexString();
      const descObj = { _id: 'desc1', description: 'Nice' };

      (userSchema.findById as jest.Mock).mockResolvedValue({ _id: userId });
      (descriptionSchema.findOne as jest.Mock).mockResolvedValue(null);
      (descriptionSchema.create as jest.Mock).mockResolvedValue(descObj);
      (favoritesSchema.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: favId, title: 'Movie' })
      });

      const result = await favoritesService.updateFavorite(favId, userId, 'Nice');
      expect(result).toMatchObject({ description: 'Nice', title: 'Movie' });
    });

    it('should update existing description', async () => {
      const favId = new Types.ObjectId().toHexString();
      const userId = new Types.ObjectId().toHexString();
      const descObj = { _id: 'desc2', description: 'Updated', save: jest.fn() };

      (userSchema.findById as jest.Mock).mockResolvedValue({ _id: userId });
      (descriptionSchema.findOne as jest.Mock).mockResolvedValue(descObj);
      (favoritesSchema.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: favId, title: 'Movie2' })
      });

      const result = await favoritesService.updateFavorite(favId, userId, 'Updated');
      expect(descObj.save).toHaveBeenCalled();
      expect(result).toMatchObject({ title: 'Movie2', description: 'Updated' });
    });

    it('should throw 404 if user not found', async () => {
      (userSchema.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        favoritesService.updateFavorite(validFavId.toHexString(), anotherUserId, 'desc')
      ).rejects.toThrow(ApiError);
    });

    it('should throw 404 if favorite cannot be updated', async () => {
      (userSchema.findById as jest.Mock).mockResolvedValue({ _id: validUserId });
      (descriptionSchema.findOne as jest.Mock).mockResolvedValue({
        _id: 'desc3',
        description: 'Old',
        save: jest.fn().mockResolvedValue(true)
      });
      (favoritesSchema.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(undefined)
      });

      await expect(
        favoritesService.updateFavorite(validFavId.toHexString(), validUserId, 'desc')
      ).rejects.toThrow(ApiError);
    });
  });
});
