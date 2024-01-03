import express from 'express';
import favoritesSchema from '../models/favorites';

const _router= express.Router();

//Create 
_router.post('/favorites', async (req, res) =>{
    try {
        const favorites = await favoritesSchema.create(req.body);
        favorites.save()
        .then((data) => res.json(data));
    } catch (error: any) {
        throw new Error(error);
    }
});
//Get all
_router.get('/favorites', async (req, res) =>{
    try {
        const favorites = await favoritesSchema.find();
        res.send(favorites);
    } catch (error: any) {
        throw new Error(error);
    }
});
//Get by Id
_router.get('/favorites/:id', async (req, res) =>{
    try {
        const favorites = await favoritesSchema.findById(req.params.id);
        res.send(favorites);
    } catch (error: any) {
        throw new Error(error);
    }
});
//Delete by Id
_router.delete('/favorites/:id', async (req, res) =>{
    try {
        const favorites = await favoritesSchema.findByIdAndDelete(req.params.id);
        res.send(favorites);
    } catch (error: any) {
        throw new Error(error);
    }
});
//Update by Id
_router.put('/favorites/:id', async (req, res) =>{
    try {
        const favorites = await favoritesSchema.findByIdAndUpdate(req.params.id, req.body);
        res.send(favorites);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const router = _router;

