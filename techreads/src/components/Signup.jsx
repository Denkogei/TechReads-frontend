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
    <>
      <div>Signup</div>
    </>
  );
}

export default Signup;
