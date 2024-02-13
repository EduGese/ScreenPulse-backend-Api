import { Favorites } from "../../interfaces/favorites.interface";
import favoritesSchema from "../../models/favorites";

class FavoritesService {
  async createFavorite(query: Favorites):Promise<any> {
        const  {imdbID}  = query;
        const existingFavorite = await favoritesSchema.findOne({ imdbID });

        if (existingFavorite) {
         throw new Error('Element already exists');
        
        }
        const newFavorite = await favoritesSchema.create(query);
        return newFavorite;
  }
  async getFavorites():Promise<any> {
    const favorites = await favoritesSchema.find();
    if (!favorites || favorites.length === 0) {
      throw new Error('Favorites not found');
    }
    return favorites;
  }
  async getFavoriteById(id: string):Promise<any> {
    const favorite = await favoritesSchema.findById(id);
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    return favorite;
  }
  async deleteFavorite(id: string):Promise<any> {
     const result = await favoritesSchema.findByIdAndDelete(id);
     if (!result) {
      throw new Error('Element could not be deleted because not found');
     }
  
  }
  async updateFavorite(id: string, description: string):Promise<any> {
    const result = await favoritesSchema.updateOne({ _id: id }, {description: description});
    if(result.modifiedCount === 0) {
      throw new Error('Element not found or not modified');
    }
  }
}

export default new FavoritesService();
