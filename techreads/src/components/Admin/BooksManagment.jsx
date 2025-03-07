import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaBars, FaPlus, FaCloudUploadAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";

const CLOUD_NAME = 'dklgssxtk';
const UPLOAD_PRESET = 'techreads';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Unified form handling
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.author.trim()) errors.push("Author is required");
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) 
      errors.push("Valid price is required");
    if (isNaN(formData.stock) || parseInt(formData.stock) < 0) 
      errors.push("Valid stock quantity is required");
    if (!formData.category_id) errors.push("Category is required");
    if (!formData.image_url) errors.push("Book cover image is required");

    if (errors.length > 0) throw new Error(errors.join("\n"));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      validateForm();

      const url = formMode === 'add' 
        ? "http://localhost:5000/books" 
        : `http://localhost:5000/books/${currentBook.id}`;
      
      const method = formMode === 'add' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          category_id: parseInt(formData.category_id)
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Operation failed");

      setBooks(prev => formMode === 'add' 
        ? [...prev, data] 
        : prev.map(book => book.id === currentBook.id ? data : book)
      );
      closeForm();
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Image upload handler
  const handleImageUpload = () => {
    setUploadingImage(true);
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        cropping: true,
        multiple: false
      },
      (error, result) => {
        setUploadingImage(false);
        if (!error && result?.event === "success") {
          setFormData(prev => ({ ...prev, image_url: result.info.secure_url }));
        }
      }
    );
  };

  // Edit initialization
  const handleEditClick = (book) => {
    setFormMode('edit');
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price.toString(),
      stock: book.stock.toString(),
      category_id: book.category_id.toString(),
      image_url: book.image_url
    });
    setShowForm(true);
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Delete failed");
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Form reset
  const closeForm = () => {
    setShowForm(false);
    setFormMode('add');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [booksRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:5000/books", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/categories", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const [booksData, categoriesData] = await Promise.all([
          booksRes.json(),
          categoriesRes.json()
        ]);
        
        setBooks(booksData);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-blue-600 hover:text-blue-800">
            <FaBars size={24} />
          </button>
          <h1 className="text-2xl font-bold">Book Management</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Add Book
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                {formMode === 'add' ? 'Add New Book' : 'Edit Book'}
              </h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block mb-2 font-medium">Book Cover</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className={`flex items-center gap-2 px-4 py-2 rounded ${
                        uploadingImage ? 'bg-gray-300' : 'bg-blue-100 hover:bg-blue-200'
                      }`}
                      disabled={uploadingImage}
                    >
                      <FaCloudUploadAlt />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </button>
                    {formData.image_url && (
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Price</label>
                    <input
                      type="number"
                      step="any"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block mb-2 font-medium">Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={uploadingImage}
                  >
                    {formMode === 'add' ? 'Add Book' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Cover</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => {
                const category = categories.find(c => c.id === book.category_id);
                return (
                  <tr key={book.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img 
                        src={book.image_url} 
                        alt={book.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{book.title}</td>
                    <td className="px-4 py-3">{book.author}</td>
                    <td className="px-4 py-3">${parseFloat(book.price).toFixed(2)}</td>
                    <td className="px-4 py-3">{book.stock}</td>
                    <td className="px-4 py-3">{category?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;