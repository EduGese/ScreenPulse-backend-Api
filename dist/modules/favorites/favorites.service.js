"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favorites_1 = __importDefault(require("../../models/favorites"));
const user_1 = __importDefault(require("../../models/user"));
const description_1 = __importDefault(require("../../models/description"));
//import { is } from 'typescript-is';
class FavoritesService {
    createFavorite(userId, movie) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== 'string')
                throw new Error("Invalid input type");
            //if(!is<Favorites>(movie)) throw new Error("Invalid input type");INVESTIGAR-->https://github.com/samchon/typia?tab=readme-ov-file
            const user = yield user_1.default.findById(userId); //Comprobacion si existe el usuario
            if (!user) {
                throw new Error("User not found");
            }
            let favorite;
            // Verificar si el favorito ya existe en la colección
            const existingFavorite = yield favorites_1.default.findOne({
                imdbID: movie.imdbID,
            });
            const userIdObjectId = new mongoose_1.Types.ObjectId(userId); //Conversion a type ObjectId
            if (!existingFavorite) {
                // Si el favorito no existe, lo creamos y lo añadimos a la lista de favoritos del usuario
                movie.user = [userIdObjectId]; //Se añade el id del usuario al array de user que todavia no existe en este objeto
                favorite = yield favorites_1.default.create(movie);
                user.favorites.push(favorite._id);
            }
            else {
                // Si el favorito ya existe, verificamos si está en la lista de favoritos del usuario
                if (user.favorites.includes(existingFavorite._id)) {
                    throw new Error("Favorite already exists for this user");
                }
                // Si no está en la lista de favoritos del usuario, lo añadimos
                user.favorites.push(existingFavorite._id);
                favorite = existingFavorite;
                existingFavorite.user.push(userIdObjectId); //Actualiza el array de referencias de favorites con el id del usuario
                yield existingFavorite.save();
            }
            yield user.save();
            return favorite;
        });
    }
    getFavorites(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== 'string')
                throw new Error("Invalid input type");
            const user = yield user_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const favorites = yield favorites_1.default.find({ user: userId });
            if (!favorites || favorites.length === 0) {
                throw new Error("Not favorites saved");
            }
            // Para cada favorito, encontrar su descripción asociada y agregarla al objeto favorito
            for (const favorite of favorites) {
                const description = yield description_1.default.findOne({ userId, favoriteId: favorite._id });
                if (description) {
                    favorite.description = description.description;
                }
                else {
                    favorite.description = ''; // Opcional: si no hay descripción, establecerla como cadena vacía
                }
            }
            return favorites;
        });
    }
    deleteFavorite(movieId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof movieId !== 'string' || typeof userId !== 'string')
                throw new Error("Invalid input type");
            const user = yield user_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            /*Eliminar movie del array de favorites del usuario y actualizar*/
            const favoritesArray = user.favorites.filter(favorite => favorite.toString() !== movieId);
            user.favorites = favoritesArray;
            yield user.save();
            const favorite = yield favorites_1.default.findById(movieId);
            if (!favorite) {
                throw new Error("Server error.Favorite not found");
            }
            /*Eliminar el id del usuario del array de id's de la movie y actualizar */
            const usersArray = favorite.user.filter((user) => user.toString() !== userId);
            favorite.user = usersArray;
            yield favorite.save();
            /* Eliminar el favorito de la coleccion favorites, si no es favorito de ningun usuario mas*/
            const favoriteUsers = favorite.user.length;
            if (favoriteUsers === 0) {
                yield favorites_1.default.findByIdAndDelete(movieId);
            }
        });
    }
    updateFavorite(movieId, userId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('description', description);
            if (typeof movieId !== 'string' || typeof userId !== 'string' || typeof description !== 'string')
                throw new Error("Invalid input type");
            if (description.length > 200)
                throw new Error("Description is too long");
            // Buscar o crear la descripción para el usuario y la película específicos
            let existingDescription = yield description_1.default.findOne({ userId, favoriteId: movieId });
            if (!existingDescription) {
                existingDescription = yield description_1.default.create({
                    userId: new mongoose_1.Types.ObjectId(userId),
                    favoriteId: new mongoose_1.Types.ObjectId(movieId),
                    description: description,
                });
            }
            else {
                // Si la descripción ya existe, actualizar su valor
                existingDescription.description = description;
                yield existingDescription.save();
            }
            // Agregar la referencia de la descripción al array 'descriptions' en el documento de la película favorita
            const updatedResult = yield favorites_1.default.findByIdAndUpdate(movieId, { $addToSet: { descriptions: existingDescription._id } });
            if (!updatedResult) {
                throw new Error("Failed to update favorite");
            }
            return updatedResult;
        });
    }
    getDescriptions(userId, favoriteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptions = yield description_1.default.find({ userId, favoriteId });
            return descriptions; // Devolver las descripciones encontradas o una lista vacía si no hay ninguna.
        });
    }
}
exports.default = new FavoritesService();
