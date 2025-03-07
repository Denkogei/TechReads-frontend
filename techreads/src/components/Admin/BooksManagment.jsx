import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image_url: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cloudinary config
    const cloudinaryConfig = {
        cloudName: 'your-cloud-name',
        uploadPreset: 'your-upload-preset'
    };

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [booksRes, categoriesRes] = await Promise.all([
                    fetch('http://localhost:5000/books', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/categories', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                
                const booksData = await booksRes.json();
                const categoriesData = await categoriesRes.json();
                
                setBooks(booksData);
                setCategories(categoriesData);
            } catch (err) {
                handleError('Failed to load data');
            }
        };
        
        fetchData();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle image upload
    const handleImageUpload = () => {
        window.cloudinary.openUploadWidget(cloudinaryConfig, (error, result) => {
            if (!error && result.event === 'success') {
                setFormData({
                    ...formData,
                    image_url: result.info.secure_url
                });
            }
        });
    };

    // Validate form
    const validateForm = () => {
        const required = ['title', 'author', 'price', 'stock', 'category_id', 'image_url'];
        const errors = [];
        
        required.forEach(field => {
            if (!formData[field]) errors.push(`${field} is required`);
        });
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            validateForm();
            const token = localStorage.getItem('token');
            const method = editingBook ? 'PATCH' : 'POST';
            const url = editingBook 
                ? `http://localhost:5000/books/${editingBook.id}`
                : 'http://localhost:5000/books';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    category_id: parseInt(formData.category_id)
                })
            });

            if (!response.ok) throw new Error('Request failed');
            
            const updatedBook = await response.json();
            
            setBooks(prev => editingBook
                ? prev.map(book => book.id === editingBook.id ? updatedBook : book)
                : [...prev, updatedBook]
            );
            
            resetForm();
        } catch (err) {
            handleError(err.message);
        }
    };

    // Delete book
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/books/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(prev => prev.filter(book => book.id !== id));
        } catch (err) {
            handleError('Delete failed');
        }
    };

    // Edit book
    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            description: book.description || '',
            price: book.price.toString(),
            stock: book.stock.toString(),
            category_id: book.category_id.toString(),
            image_url: book.image_url
        });
        setShowForm(true);
    };

    // Reset form
    const resetForm = () => {
        setShowForm(false);
        setEditingBook(null);
        setFormData({
            title: '',
            author: '',
            description: '',
            price: '',
            stock: '',
            category_id: '',
            image_url: ''
        });
    };

    // Error handling
    const handleError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 5000);
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FaPlus /> Add Book
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border-red-400 text-red-700 p-4 mb-6 rounded">
                    {error.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            )}

            {/* Book Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingBook ? 'Edit Book' : 'Add New Book'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-2">Book Cover</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleImageUpload}
                                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-200"
                                    >
                                        <FaCloudUploadAlt /> Upload Image
                                    </button>
                                    {formData.image_url && (
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded h-32"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Form Actions */}
                            <div className="col-span-2 flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingBook ? 'Save Changes' : 'Add Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Books Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left">Cover</th>
                            <th className="px-6 py-4 text-left">Title</th>
                            <th className="px-6 py-4 text-left">Author</th>
                            <th className="px-6 py-4 text-left">Price</th>
                            <th className="px-6 py-4 text-left">Stock</th>
                            <th className="px-6 py-4 text-left">Category</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => {
                            const category = categories.find(c => c.id === book.category_id);
                            return (
                                <tr key={book.id} className="hover:bg-gray-50 border-t">
                                    <td className="px-6 py-4">
                                        <img
                                            src={book.image_url}
                                            alt={book.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium">{book.title}</td>
                                    <td className="px-6 py-4">{book.author}</td>
                                    <td className="px-6 py-4">${book.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">{book.stock}</td>
                                    <td className="px-6 py-4">{category?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 flex justify-center gap-3">
                                        <button
                                            onClick={() => handleEdit(book)}
                                            className="text-blue-600 hover:text-blue-800 p-2"
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookManagement;