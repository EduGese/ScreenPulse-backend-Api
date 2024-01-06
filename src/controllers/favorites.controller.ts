import { Request, Response, NextFunction } from "express";


import { Favorites } from "../interfaces/favorites.interface";
import favoritesSchema from "../models/favorites";

class FavoritesController {
    
  /**
     * @summary Create new document
     * @description Create and insert a new document in a collection.
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Array} with created document
     */
  async createFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {//Check that body is undefined or null, is an object type and not empty
        const error = new Error('A non-empty JSON body is mandatory.');
        return next(error);
      }
      const favorites: Favorites = await favoritesSchema.create(req.body);
      res.status(201).json({ message: 'Element saved succesfully', data: favorites });
    } catch (error) {
      next(error);
      return;
    }
  }

    /**
     * @summary Find documents from a collection 
     * @description Get documents
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Array} with all documents matching the conditions
     */
  async getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorites: Favorites[] = await favoritesSchema.find();
      res.status(200).json(favorites);
    } catch (error) {
      next(error);
      return;
    }
  }

    /**
     * @summary Find document by its id from a collection
     * @description Get document
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Array} with all documents matching the conditions
     */
  async getFavoriteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorite: any = await favoritesSchema.findById(req.params.id);
      res.status(200).json({ message: 'Element retrieved successfully', data: favorite });
    } catch (error) {
      next(error);
      return;
    }
  }

  /**
     * @summary Delete a document
     * @description Delete a document by id
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Object} Empty object if the operation went well
     */
  async deleteFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorites: any = await favoritesSchema.findByIdAndDelete(req.params.id);
      res.status(204).json({ message: 'Element deleted successfully', data: {} });
    } catch (error) {
      next(error);
      return;
    }
  }

  /**
     * @summary Update a document
     * @description Update a document by id
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Object} Empty object if the operation went well
     */
  async updateFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0){
        const error = new Error('A non-empty JSON body is mandatory.');
        return next(error);
      }
      const favorites = await favoritesSchema.findByIdAndUpdate( req.params.id,req.body );
      res.status(204).json({ message: 'Element updated successfully', data: {} });
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default new FavoritesController();
/*
El código general parece estar en buena forma. Sin embargo, aquí hay algunas sugerencias y observaciones que 
podrían ayudar a mejorar la implementación de tus rutas:

---Manejo de errores--
En lugar de lanzar un error directamente, sería mejor manejar los errores de manera más explícita 
y devolver una respuesta adecuada al cliente. Puedes usar el método next() con error para pasar los errores 
a un middleware de manejo de errores o simplemente enviar una respuesta con el código de estado y un mensaje descriptivo.

--Validación de datos--
Podrías agregar validaciones para asegurarte de que los datos proporcionados en las solicitudes sean correctos 
antes de realizar operaciones como create, update o delete.

--Mensajes de estado en las respuestas--
Sería útil proporcionar mensajes descriptivos en las respuestas, especialmente en las operaciones de create, 
update y delete, para informar al cliente sobre el estado de la operación realizada.

--Uso de try-catch en operaciones de base de datos--
En las operaciones de la base de datos, el uso de try-catch es una buena práctica. Asegúrate de manejar los
 errores de la base de datos correctamente y proporcionar una respuesta adecuada en caso de fallo.

--Seguridad y autenticación--
No se observa ningún control de acceso o autenticación en estas rutas. Si tu aplicación requiere autorización,
debes asegurarte de implementar métodos de autenticación antes de permitir el acceso a las operaciones de la base de datos.

*/
