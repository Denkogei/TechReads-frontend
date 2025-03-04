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
  const [showAddForm, setShowAddForm] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const [booksRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:5000/books", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/categories", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (!booksRes.ok) throw new Error("Failed to fetch books");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

        const [booksData, categoriesData] = await Promise.all([
          booksRes.json(),
          categoriesRes.json()
        ]);

        setBooks(booksData);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = () => {
    setUploadingImage(true);
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ['local', 'url'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1,
        showPoweredBy: false,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1"
          }
        }
      },
      (error, result) => {
        setUploadingImage(false);
        if (!error && result?.event === "success") {
          setFormData(prev => ({
            ...prev,
            image_url: result.info.secure_url
          }));
        } else if (error) {
          setError("Image upload failed. Please try again.");
          setTimeout(() => setError(null), 5000);
        }
      }
    );
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.author.trim()) errors.push("Author is required");
    if (!formData.price || isNaN(formData.price)) errors.push("Valid price is required");
    if (isNaN(formData.stock) || formData.stock < 0) errors.push("Valid stock quantity is required");
    if (!formData.category_id) errors.push("Category is required");
    if (!formData.image_url) errors.push("Book cover image is required");

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      validateForm();

      const response = await fetch("http://localhost:5000/books", {
        method: "POST",
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

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add book");
      }

      setBooks([...books, responseData]);
      setShowAddForm(false);
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image_url: ''
      });
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete book");
      }

      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 p-6 overflow-y-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error.split("\n").map((line, index) => (
              <p key={index} className="mb-1 last:mb-0">• {line}</p>
            ))}
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <button
            className="text-blue-900 text-xl p-2 rounded-md hover:bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Book Management</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaPlus /> Add Book
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Book</h3>
              <form onSubmit={handleAddBook}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Book Cover *</label>
                    <div className="mt-1 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                          uploadingImage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'
                        }`}
                        disabled={uploadingImage}
                      >
                        <FaCloudUploadAlt />
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </button>
                      {formData.image_url && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {!formData.image_url && (
                      <p className="text-red-500 text-sm mt-2">Please upload a book cover image</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title *</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Author *</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Math.max(0, parseFloat(e.target.value) || 0).toFixed(2)})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: Math.max(0, parseInt(e.target.value) || 0)})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Adding...' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Book List</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 text-left text-gray-700">Image</th>
                <th className="p-4 text-left text-gray-700">Title</th>
                <th className="p-4 text-left text-gray-700">Author</th>
                <th className="p-4 text-left text-gray-700">Category</th>
                <th className="p-4 text-left text-gray-700">Stock</th>
                <th className="p-4 text-left text-gray-700">Price</th>
                <th className="p-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const category = categories.find(c => c.id === book.category_id);
                return (
                  <tr key={book.id} className="bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out">
                    <td className="p-4 border-b">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={book.image_url || "https://via.placeholder.com/100"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4 border-b text-gray-800">{book.title}</td>
                    <td className="p-4 border-b text-gray-800">{book.author}</td>
                    <td className="p-4 border-b text-gray-800">{category?.name || 'N/A'}</td>
                    <td className="p-4 border-b text-gray-800">{book.stock}</td>
                    <td className="p-4 border-b text-gray-800">${typeof book.price === 'number' ? book.price.toFixed(2) : '0.00'}</td>
                    <td className="p-4 border-b flex justify-center space-x-3">
                      <button
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                        onClick={() => console.log("Edit book:", book.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                )}
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;