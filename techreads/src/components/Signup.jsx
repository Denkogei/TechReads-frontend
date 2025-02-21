import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaUserCircle } from "react-icons/fa";

function Signup() {
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
      .catch((err) => alert(err));

    setSubmitting(false);
  };

  return (
    <div className="w-96 mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-bold mt-2">TECHREADS</h2>
      <p className="text-center text-gray-500">Empowering Kenyan minds</p>
      <br />
      <div className="flex justify-center">
        <FaUserCircle className="w-16 h-16 text-gray-600" />
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="mt-4">
            <div className="mb-3">
              <label className="block text-sm font-medium">Name:</label>
              <Field
                type="text"
                name="name"
                className="w-full p-2 border rounded"
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Email:</label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 border rounded"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Password:</label>
              <Field
                type="password"
                name="password"
                className="w-full p-2 border rounded"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-2 rounded mt-3"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
