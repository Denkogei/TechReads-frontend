import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="px-6 py-10">
      <div className="bg-blue-600 text-white rounded-2xl py-12 px-10 max-w-7xl mx-auto w-full flex flex-col items-start">
        <h1 className="text-3xl font-bold">Welcome to TechReads</h1>
        <p className="mt-2 text-base">Empowering Kenyan Minds</p>
        <Link to="/books">
          <button className="mt-4 bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100">
            Browse Collection
          </button>
        </Link>
      </div>

     
      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold">Categories</h2>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {["Programming", "Software Architecture", "Web Development", "Data Science", "Artificial Intelligence", "Cybersecurity", "DevOps"].map((category) => (
            <button key={category} className="px-5 py-2 border rounded-full shadow-sm bg-white text-black hover:bg-gray-100">
              {category}
            </button>
          ))}
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mt-12">Featured Books</h2>
    </div>
  );
};

export default Home;
