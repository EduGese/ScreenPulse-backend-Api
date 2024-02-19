import { Favorites } from "../../interfaces/favorites.interface";
import favoritesSchema from "../../models/favorites";
import userSchema from "../../models/user";

class FavoritesService {
  async createFavorite(userId: string, movie: Favorites): Promise<any> {
    const user = await userSchema.findById(userId); //Comprobacion si existe el usuario
    if (!user) {
      throw new Error("User not found");
    }

    let favorite;

    // Verificar si el favorito ya existe en la colección
    const existingFavorite = await favoritesSchema.findOne({
      imdbID: movie.imdbID,
    });

    if (!existingFavorite) {
      // Si el favorito no existe, lo creamos y lo añadimos a la lista de favoritos del usuario
      movie.user = userId;
      favorite = await favoritesSchema.create(movie);
      user.favorites.push(favorite._id);
    } else {
      // Si el favorito ya existe, verificamos si está en la lista de favoritos del usuario
      if (user.favorites.includes(existingFavorite._id)) {
        throw new Error("Favorite already exists for this user");
      }
      // Si no está en la lista de favoritos del usuario, lo añadimos
      user.favorites.push(existingFavorite._id);
      favorite = existingFavorite;
      existingFavorite.user.push(userId);//Actualiza el array de referencias de favorites con el id del usuario
      await existingFavorite.save();
    }

    await user.save();
    return favorite;
  }
  async getFavorites(userId: string): Promise<any> {
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    
    const favorites = await favoritesSchema.find({ user: userId });
    if (!favorites || favorites.length === 0) {
      throw new Error("Favorites not found for this user");
    }
    console.log('Usuario:', userId)
    console.log(favorites);
    return favorites;
  }
  // async getFavoriteById(id: string): Promise<any> {
  //   const favorite = await favoritesSchema.findById(id);
  //   if (!favorite) {
  //     throw new Error("Favorite not found");
  //   }
  //   return favorite;
  // }
  async deleteFavorite(id: string): Promise<any> {
    const result = await favoritesSchema.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Element could not be deleted because not found");
    }
  }
  async updateFavorite(id: string, description: string): Promise<any> {
    const result = await favoritesSchema.updateOne(
      { _id: id },
      { description: description }
    );
    if (result.modifiedCount === 0) {
      throw new Error("Element not found or not modified");
    }
  }
}

export default new FavoritesService();
