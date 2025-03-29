const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT'); // JWT Middleware
const contactController = require('../controllers/contactController');



const Router = express.Router();
// Protected routes - Require authentication
Router.post('/create-contact', authenticateJWT, contactController.createContact);
Router.get('/contacts', authenticateJWT, contactController.getContacts);  // Get all contacts
Router.get('/contact/:contactId', authenticateJWT, contactController.getContactById); // Get single contact
Router.put('/contact/:contactId', authenticateJWT, contactController.updateContact); // Update contact
Router.delete('/contact/:contactId', authenticateJWT, contactController.deleteContact); // Delete contact

module.exports = Router;