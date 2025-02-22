import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, loginWithPopup } = useAuth0();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await loginWithRedirect(); // Redirects to Auth0 login page (fix)
      } catch (error) {
        console.error("Login failed:", error);
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
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-[#1A2D86] transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          className="flex items-center justify-center w-full border py-2 rounded-lg text-gray-700 bg-white hover:bg-gray-100 shadow-sm"
          onClick={() => loginWithRedirect()} // Fix for Google Login
        >
          <FcGoogle className="text-xl mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
