// controllers/contactController.js

const Contact = require('../models/contactModel');

// Create a new contact
exports.createContact = async (req, res) => {
    console.log('*********createContact*********')
    console.log('*********req.body*********',req.body)
    try {
        const { name, phone, address } = req.body;
        const userId = req.user._id; // user from JWT
        console.log('*********req.body*********',req.body)

        const newContact = new Contact({
            userId,
            name,
            phone,
            address
        });

        await newContact.save();
        res.status(201).json({ message: 'Contact created successfully!', contact: newContact });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create contact', error: error.message });
    }
};

// controllers/contactController.js

// Get all contacts for a specific user
exports.getContacts = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from JWT

        // Find all contacts for this user
        const contacts = await Contact.find({ userId });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve contacts', error: error.message });
    }
};

// Get a specific contact by ID
exports.getContactById = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from JWT
        const { contactId } = req.params; // Contact ID from URL

        const contact = await Contact.findOne({ _id: contactId, userId });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve contact', error: error.message });
    }
};


// Update a specific contact
exports.updateContact = async (req, res) => {
    try {
        const { contactId } = req.params; // Contact ID from URL
        const { name, phone, address } = req.body; // New contact data
        const userId = req.user._id; // Get user ID from JWT

        // Find the contact by ID and ensure it belongs to the authenticated user
        const contact = await Contact.findOneAndUpdate(
            { _id: contactId, userId },
            { name, phone, address },
            { new: true } // Return the updated document
        );

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found or unauthorized' });
        }

        res.status(200).json({ message: 'Contact updated successfully!', contact });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update contact', error: error.message });
    }
};


// Delete a specific contact
exports.deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params; // Contact ID from URL
        const userId = req.user._id; // Get user ID from JWT

        // Find the contact by ID and ensure it belongs to the authenticated user
        const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found or unauthorized' });
        }

        res.status(200).json({ message: 'Contact deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete contact', error: error.message });
    }
};
