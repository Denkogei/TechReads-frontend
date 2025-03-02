import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar"; // Import Sidebar component

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", category: "", stock: 0, image: "" });
  const [categories, setCategories] = useState([]); // New state for categories
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch categories and books on component mount
  useEffect(() => {
    // Fetch books from the API
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));

    // Fetch categories from the API (ensure you have a route for categories)
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleAddBook = () => {
    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("category", newBook.category);
    formData.append("stock", newBook.stock);
    formData.append("image", newBook.image);

    // Send request to add a new book
    fetch("/api/books", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks([...books, data]);
        setNewBook({ title: "", category: "", stock: 0, image: "" });
      });
  };

  const handleDeleteBook = (id) => {
    fetch(`/api/books/${id}`, { method: "DELETE" })
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      });
  };

  const handleEditBook = (id) => {
    // Implement logic to edit book (show a form with book details and update it)
  };

  const handleImageChange = (e) => {
    setNewBook({ ...newBook, image: e.target.files[0] });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Navbar */}
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <button
            className="text-blue-900 text-xl p-2 rounded-md focus:outline-none hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">Book Management</h2>
        </div>

        {/* Add Book */}
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Book</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock"
              value={newBook.stock}
              onChange={(e) => setNewBook({ ...newBook, stock: Number(e.target.value) })}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            onClick={handleAddBook}
            className="bg-blue-600 text-white p-3 rounded-lg mt-4 w-full md:w-auto flex items-center justify-center hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" /> Add Book
          </button>
        </div>

        {/* Book List */}
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Book List</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 text-left text-gray-700">Title</th>
                <th className="p-4 text-left text-gray-700">Category</th>
                <th className="p-4 text-left text-gray-700">Stock</th>
                <th className="p-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out"
                >
                  <td className="p-4 border-b text-gray-800">{book.title}</td>
                  <td className="p-4 border-b text-gray-800">{book.category}</td>
                  <td className="p-4 border-b text-gray-800">{book.stock}</td>
                  <td className="p-4 border-b flex justify-center space-x-3">
                    <button
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                      onClick={() => handleEditBook(book.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;
