import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaRegUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import bgImage from "../assets/login.jpeg";

const Register = () => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values: any) => {
    console.log("Form Data:", values);
    alert("Registered Successfully!");
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >

      <div className="backdrop-blur-sm bg-white/30 shadow-xl rounded-2xl max-w-md w-full p-8 text-gray-800">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Sign Up
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Today is a new day. It’s your day. You shape it.
          <br />
          Sign in.
        </p>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <div
                  className={`flex items-center border rounded-md px-3 py-2 bg-white/70 ${
                    touched.name && errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <FaRegUser className="text-gray-500 mr-2" />
                  <Field
                    name="name"
                    type="text"
                    placeholder="Full name"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div
                  className={`flex items-center border rounded-md px-3 py-2 bg-white/70 ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Example@email.com"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div
                  className={`flex items-center border rounded-md px-3 py-2 bg-white/70 ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <FaLock className="text-gray-500 mr-2" />
                  <Field
                    name="password"
                    type="password"
                    placeholder="at least 8 characters"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md mt-4 font-medium transition-all"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm mt-4 text-gray-800">
          Already have an account?{" "}
          <Link to="/" className="text-sky-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
