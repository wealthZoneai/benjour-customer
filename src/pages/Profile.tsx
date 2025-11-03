import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import ImageCropperModal from "../components/ImageCropperModal"; // you’ll create this file next

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/120");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-16">
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden relative">
        {/* Hidden Upload Input */}
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Banner */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 h-32 relative">
          {/* Clickable Profile Image */}
          <div
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 cursor-pointer group"
            onClick={() => document.getElementById("profile-upload")?.click()}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover group-hover:opacity-80 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition">
              Change
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mt-20 px-10 pb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Profile</h1>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            <div>
              <label className="text-gray-600 text-sm font-medium">First Name</label>
              <input
                type="text"
                placeholder="John"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium">E-mail Address</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-gray-600 text-sm font-medium">Location</label>
              <input
                type="text"
                placeholder="New Delhi, India"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </form>

          <button
            type="submit"
            className="mt-8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white px-8 py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
        {/* Left Side - Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Love to hear from you
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Reach out to us anytime — we’ll be happy to assist you.
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <textarea
              placeholder="Write a message..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            ></textarea>
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-lg font-medium shadow-md hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Side - Contact Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <MapPin className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Our Location</h3>
              <p className="text-sm">Belgian Street, Town</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <Mail className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Send us mail</h3>
              <p className="text-sm">support@benjour.com</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <Phone className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Call us</h3>
              <p className="text-sm">+91 00000 00001</p>
            </div>
          </div>
        </div>
      </div>

      {showCropper && selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          onClose={() => setShowCropper(false)}
          onSave={(img) => setProfileImage(img)}
        />
      )}
    </div>
  );
};

export default Profile;
