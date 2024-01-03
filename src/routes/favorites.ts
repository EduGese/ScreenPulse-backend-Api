import express from 'express';

const _router= express.Router();
_router.get('/favorites', (req, res) =>{
    res.send('create user');
})

export const router = _router;

