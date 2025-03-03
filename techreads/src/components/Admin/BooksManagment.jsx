import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch books from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("http://localhost:5000/books", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle book deletion
  const handleDeleteBook = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        throw new Error(errorData.error || "Failed to delete book");
      }

      // Remove the deleted book from the state
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <button
            className="text-blue-900 text-xl p-2 rounded-md focus:outline-none hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">Book Management</h2>
        </div>

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
                <th className="p-4 text-left text-gray-700">Description</th>
                <th className="p-4 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
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
                  <td className="p-4 border-b text-gray-800">{book.category}</td>
                  <td className="p-4 border-b text-gray-800">{book.stock}</td>
                  <td className="p-4 border-b text-gray-800">{book.description}</td>
                  <td className="p-4 border-b flex justify-center space-x-3">
                    <button
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                      onClick={() => console.log("Edit book:", book.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                      onClick={() => handleDeleteBook(book.id)}
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