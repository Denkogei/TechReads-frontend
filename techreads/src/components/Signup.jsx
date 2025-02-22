import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    fetch("http://127.0.0.1:5555/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.error || "Something went wrong");
        }
        alert("Signup successful!");
        resetForm();
      })
      .catch((err) => alert(err))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="flex items-center justify-center mt-[50px]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 text-[#213BA7] text-4xl">📖</div>
        </div>

        <h2 className="text-2xl font-bold text-center mt-2">
          Sign Up for TechReads
        </h2>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#213BA7] hover:underline">
            Login
          </Link>
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="mt-6">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
                  <FaUser className="text-gray-500" size={18} />
                  <Field
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full bg-gray-100 outline-none ml-2"
                  />
                </div>
                {errors.name && touched.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Email Address</label>
                <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
                  <FaEnvelope className="text-gray-500" size={18} />
                  <Field
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full bg-gray-100 outline-none ml-2"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Password</label>
                <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
                  <FaLock className="text-gray-500" size={18} />
                  <Field
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-100 outline-none ml-2"
                  />
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-[#1A2D86] transition"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
