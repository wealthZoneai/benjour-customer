import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import  { useRef, useState } from "react";

const Register = () => {
const navigate = useNavigate();
const formRef = useRef<HTMLDivElement>(null);
const [isFlipping, setIsFlipping] = useState(false);

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

const handleSubmit = () => {
// console.log("Form Data:", values);
alert("Registered Successfully!");
};

// 🔹 Flip animation handler
const handleFlipToLogin = () => {
if (isFlipping) return;


setIsFlipping(true);

// Start first half of the flip
if (formRef.current) {
  formRef.current.style.transition = "transform 0.3s ease-in-out";
  formRef.current.style.transform = "rotateY(90deg)";
}

// After half flip, navigate to login and reset flip
setTimeout(() => {
  navigate("/");

  setTimeout(() => {
    if (formRef.current) {
      formRef.current.style.transform = "rotateY(0deg)";
    }

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.style.transition = "";
      }
      setIsFlipping(false);
    }, 300);
  }, 50);
}, 300);


};

return (
<div
className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
style={{
backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')`,
}}
>
{/* 🔹 Dark Overlay */} 
<div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/75 to-black/90"></div>


  {/* 🔹 Register Card with flip animation */}
  <div
    ref={formRef}
    className="relative z-10 w-full max-w-md mx-4 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white"
    style={{
      transformStyle: "preserve-3d",
      transformOrigin: "center",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: "rotateY(0deg)",
    }}
  >
    <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
    <p className="text-center text-gray-300 mb-6 text-sm">
      Join us and start your journey today!
    </p>

    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ touched, errors }) => (
        <Form className="space-y-5">
          {/* Name Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <div
              className={`flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2 ${
                touched.name && errors.name ? "border-red-500" : ""
              }`}
            >
              <FaRegUser className="text-gray-400 mr-2" />
              <Field
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
              />
            </div>
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-400 text-xs mt-1"
            />
          </div>

          {/* Email Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <div
              className={`flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2 ${
                touched.email && errors.email ? "border-red-500" : ""
              }`}
            >
              <FaEnvelope className="text-gray-400 mr-2" />
              <Field
                name="email"
                type="email"
                placeholder="example@email.com"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
              />
            </div>
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-400 text-xs mt-1"
            />
          </div>

          {/* Password Field */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div
              className={`flex items-center border border-white/20 bg-white/10 rounded-lg px-3 py-2 ${
                touched.password && errors.password ? "border-red-500" : ""
              }`}
            >
              <FaLock className="text-gray-400 mr-2" />
              <Field
                name="password"
                type="password"
                placeholder="At least 8 characters"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
              />
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-400 text-xs mt-1"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-300"
          >
            Register
          </button>
        </Form>
      )}
    </Formik>

    {/* Divider */}
    <div className="flex items-center my-5">
      <hr className="flex-1 border-gray-600" />
      <span className="mx-3 text-xs text-gray-400">OR</span>
      <hr className="flex-1 border-gray-600" />
    </div>

    {/* Login Link with Flip Animation */}
    <p className="text-center text-sm text-gray-300">
      Already have an account?{" "}
      <button
        onClick={handleFlipToLogin}
        className="text-sky-400 font-medium hover:underline focus:outline-none"
        type="button"
      >
        Login
      </button>
    </p>
  </div>
</div>


);
};

export default Register;
