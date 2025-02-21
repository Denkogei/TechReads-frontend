import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

function Signup() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
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
    <div className="signup-container">
      <h2>TECHREADS</h2>
      <p>Empowering Kenyan minds</p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div>
              <label>Username:</label>
              <Field type="text" name="username" />
              {errors.username && touched.username && (
                <div className="error">{errors.username}</div>
              )}
            </div>

            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              {errors.email && touched.email && (
                <div className="error">{errors.email}</div>
              )}
            </div>

            <div>
              <label>Password:</label>
              <Field type="password" name="password" />
              {errors.password && touched.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
