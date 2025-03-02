import React from "react";
import { useNavigate } from "react-router-dom";

const featuredBooks = [
  {
    id: 1,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*zBRkcBbsjWzcPjtcxqhb3Q.jpeg",
    description: "A deep dive into JavaScript's best practices and patterns.",
  },
  {
    id: 2,
    title: "Road to React",
    author: "Robin Wieruch",
    image: "https://miro.medium.com/v2/resize:fit:400/format:webp/1*_wVXJsXuzy42m3nyQVRoeQ.jpeg",
    description: "A hands-on guide to mastering React with real-world examples.",
  },
  {
    id: 3,
    title: "Python Flask for Beginners",
    author: "A.J. García",
    image: "https://d2sofvawe08yqg.cloudfront.net/python-flask-for-beginners/s_hero2x?1620648083",
    description: "Learn Flask and build powerful web applications.",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  // Check if the user is authenticated by checking for a token in localStorage
  const isAuthenticated = !!localStorage.getItem("token"); // Returns true if token exists

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="w-[95%] max-w-6xl bg-blue-600 text-white py-10 px-12 rounded-xl shadow-md text-center mx-auto mt-10">
        <h1 className="text-4xl font-bold">Welcome to TechReads</h1>
        <p className="text-lg mt-2 opacity-90">Empowering Kenyan Minds with Knowledge</p>
        <button
          className="mt-6 bg-white text-blue-600 font-semibold px-6 py-2 rounded-md hover:bg-gray-200 transition"
          onClick={() => navigate(isAuthenticated ? "/all-books" : "/signup")}
        >
          Browse Books
        </button>
      </div>

      {/* Featured Books Section (Visible to all users) */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Featured Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredBooks.map((book) => (
            <div key={book.id} className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition">
              <img src={book.image} alt={book.title} className="w-full h-56 object-contain rounded-md mb-4" />
              <h3 className="text-2xl font-semibold">{book.title}</h3>
              <p className="text-gray-500 text-md">by {book.author}</p>
              <p className="text-gray-600 text-md mt-3">{book.description}</p>
            </div>
          ))}
        </div>
        {!isAuthenticated && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign Up to Explore More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;