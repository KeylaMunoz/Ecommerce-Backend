import { UserDTO } from "../dto/user.dto.js";
import express from 'express';

const app = express();

export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/home');
    }
};    
export const currentUser = (req, res) => {
    try {
        if (req.session.user) {
            const userDTO = new UserDTO(req.session.user); 
            res.render('current', { user: userDTO });
        } 
    } catch (error) {
        res.status(500).send({ error: "Error para mostrar current " + error });
    
    }
}

export const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); 
    }
    return res.status(403).send({ error: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
};

export const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next(); 
    }
    return res.status(403).send({ error: 'Solo usuarios pueden realizar esta acción.' });
};