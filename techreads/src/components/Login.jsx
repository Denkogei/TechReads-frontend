import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse error response
          throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user info

        // Check if the logged-in user is the admin
        if (data.user.email === 'admin@gmail.com') {
          navigate("/admin");  // Redirect to admin panel
        } else {
          navigate("/");  // Redirect to user dashboard
        }

        window.location.reload(); // Optional: To make sure the app reloads after login
      } catch (error) {
        console.error("Login failed:", error);
        setErrors({ email: "Invalid email or password" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center mt-[50px]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 text-[#213BA7] text-4xl">📖</div>
        </div>
        <h2 className="text-2xl font-bold text-center mt-2">Login to TechReads</h2>
        <p className="text-center text-gray-600">
          Or <Link to="/signup" className="text-[#213BA7] hover:underline">sign up</Link>
        </p>

        <form className="mt-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-gray-700">Email address</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
              <FaEnvelope className="text-gray-500" size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full bg-gray-100 outline-none ml-2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
              <FaLock className="text-gray-500" size={18} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full bg-gray-100 outline-none ml-2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-[#213BA7] hover:underline">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full mt-6 py-2 rounded-lg font-medium transition ${
              formik.isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-[#1A2D86]"
            }`}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;