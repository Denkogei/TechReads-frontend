import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

const SignIn = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 text-[#213BA7] text-4xl">📖</div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mt-2">Sign in to TechReads</h2>
        <p className="text-center text-gray-600">
          Or <Link to="/register" className="text-[#213BA7] hover:underline">create a new account</Link>
        </p>

        {/* Form */}
        <form className="mt-6" onSubmit={formik.handleSubmit}>
          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-[#213BA7] hover:underline">
              Forgot your password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-[#213BA7] text-white py-2 rounded-lg font-medium hover:bg-[#1A2D86] transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
