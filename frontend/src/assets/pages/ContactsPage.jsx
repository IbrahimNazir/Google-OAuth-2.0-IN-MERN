import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';  

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', phone: '', address: '' });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('user-info')); // Assuming JWT is stored in local storage
    const token = userInfo["token"] 
    const serverURL = 'http://localhost:8080/contacts'
    // Fetch contacts when the component mounts
    useEffect(() => {
        // console.log(token)
        axios.get(`${serverURL}/contacts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => setContacts(response.data))
        .catch((error) => console.log(error));
    }, [newContact]);

    // Create new contact
    const handleCreateContact = () => {
        axios.post(`${serverURL}/create-contact`, newContact, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            setContacts([...contacts, response.data]);
            setShowCreateModal(false);
            setNewContact({ name: '', phone: '', address: '' });
        })
        .catch((error) => console.log(error));
    };

    // Edit existing contact
    const handleEditContact = () => {
        axios.put(`${serverURL}/contact/${selectedContact._id}`, selectedContact, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setContacts(contacts.map(contact => contact._id === selectedContact._id ? selectedContact : contact));
            setShowEditModal(false);
        })
        .catch((error) => console.log(error));
    };

    // Delete a contact
    const handleDeleteContact = (contactId) => {
        axios.delete(`${serverURL}/contact/${contactId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            setContacts(contacts.filter(contact => contact._id !== contactId));
        })
        .catch((error) => console.log(error));
    };
    const loggout = () => {
        localStorage.clear('user-info');
        navigate('/login');  
    }

    return (
        <div className="container mt-5 center">
            <div class="d-flex flex-column justify-content-center align-items-center" >  

                <h2 className='center'>Welcome {userInfo.name}!</h2>

                <Button variant="danger" onClick={loggout}>Sign-out</Button>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center" >  

                <h2 className='center'>My Contacts</h2>

                <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create New Contact</Button>
            </div>
            {/* Contacts Table */}
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact._id}>
                            <td>{contact.name}</td>
                            <td>{contact.phone}</td>
                            <td>{contact.address}</td>
                            <td>
                                <Button variant="warning" onClick={() => {
                                    setSelectedContact(contact);
                                    setShowEditModal(true);
                                }}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => handleDeleteContact(contact._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create Contact Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" value={newContact.address} onChange={(e) => setNewContact({ ...newContact, address: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleCreateContact}>Save Contact</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Contact Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedContact && (
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={selectedContact.name} onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="text" value={selectedContact.phone} onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" value={selectedContact.address} onChange={(e) => setSelectedContact({ ...selectedContact, address: e.target.value })} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEditContact}>Update Contact</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContactsPage;
