import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Edit2, Check, X, Trash2 } from "lucide-react";
import ImageCropperModal from "../components/ImageCropperModal";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
import { getUserProfile, createUserProfile, updateUserProfile } from "../services/apiHelpers";
import toast from "react-hot-toast";

const Profile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/120");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    altPhoneNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: ""
  });

  // Track initial state to enable "Save Changes" only when changes are made
  const [initialFormData, setInitialFormData] = useState(formData);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await getUserProfile(userId);
        if (response.data) {
          const {
            firstName, lastName, phoneNumber, email, profileImg,
            altPhoneNumber, addressLine1, addressLine2, city, state, pincode, country
          } = response.data;

          const fetchedData = {
            firstName: firstName || "",
            lastName: lastName || "",
            phoneNumber: phoneNumber || "",
            altPhoneNumber: altPhoneNumber || "",
            email: email || "",
            addressLine1: addressLine1 || "",
            addressLine2: addressLine2 || "",
            city: city || "",
            state: state || "",
            pincode: pincode || "",
            country: country || ""
          };

          setFormData(fetchedData);
          setInitialFormData(fetchedData);

          if (profileImg) setProfileImage(profileImg);

          setIsNewProfile(false);
        } else {
          setIsNewProfile(true);
          setIsEditing(true); // Auto-edit for new profiles
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsNewProfile(true);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (img: string) => {
    setProfileImage(img);

    // Convert cropped Base64 → File for upload
    fetch(img)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
      });
  };

  const handleRemovePhoto = () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      setProfileImage("https://via.placeholder.com/120");
      setSelectedFile(null);
      // Logic to tell backend to delete file could be here, or handled by sending null file
    }
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData) || selectedFile !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges()) return;

    setLoading(true);

    try {
      if (!userId) {
        toast.error("User ID missing. Please log in.");
        return;
      }

      const dataPayload = {
        ...formData,
        file: selectedFile
      };

      if (isNewProfile) {
        await createUserProfile(userId, dataPayload);
        toast.success("Profile created successfully!");
        setIsNewProfile(false);
      } else {
        await updateUserProfile(userId, dataPayload);
        toast.success("Profile updated successfully!");
      }
      setInitialFormData(formData);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to send this message?")) {
      toast.success("Message sent successfully!");
    }
  };

  // Initial loading spinner
  if (loading && !formData.firstName && !isNewProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-300 py-16">
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden relative">

        {/* Hidden Upload Input */}
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          className="hidden"
          onChange={handleImageSelect}
          disabled={!isEditing}
        />

        {/* Banner */}
        <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 h-32 relative">

          {isEditing && !isNewProfile && (
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition"
              title="Cancel Edit"
            >
              <X size={20} />
            </button>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm transition text-sm font-medium"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          )}

          {/* Clickable Profile Image */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 group">
            <div
              className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
              onClick={() => isEditing && document.getElementById("profile-upload")?.click()}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 
                text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition">
                  Change
                </div>
              )}
            </div>

            {isEditing && profileImage !== "https://via.placeholder.com/120" && (
              <button
                onClick={handleRemovePhoto}
                className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition transform translate-x-1/3 translate-y-1/3"
                title="Remove Photo"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="mt-20 px-10 pb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Profile</h1>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left" onSubmit={handleSubmit}>

            {/* ------------ Personal Information ------------ */}
            <div className="sm:col-span-2 text-lg font-medium text-emerald-800 border-b pb-2 mb-2">
              Personal Information
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="John"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="Doe"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="+91 98765 43210"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Alternative Phone Number</label>
              <input
                type="tel"
                name="altPhoneNumber"
                value={formData.altPhoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+91 98765 43210"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-gray-600 text-sm font-medium">E-mail Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="john.doe@example.com"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            {/* ------------ Address Information ------------ */}
            <div className="sm:col-span-2 text-lg font-medium text-emerald-800 border-b pb-2 mb-2 mt-4">
              Detailed Address
            </div>

            <div className="sm:col-span-2">
              <label className="text-gray-600 text-sm font-medium">Address Line 1 (House No, Street) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="123 Main St"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-gray-600 text-sm font-medium">Address Line 2 (Area, Landmark)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Near Central Park"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="City"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">State <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="State"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">PIN Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="123456"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Country <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                placeholder="Country"
                className={`mt-1.5 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none transition
                  ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="sm:col-span-2 flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading || !hasChanges()}
                  className="flex items-center gap-2 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
                  text-white px-8 py-2.5 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">

        {/* Left Side - Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Love to hear from you</h2>
          <p className="text-gray-500 text-sm mb-6">Reach out to us anytime — we’re here to help.</p>

          <form className="space-y-4" onSubmit={handleSubmitContact}>
            {/* Removed Name, Email, Phone Number fields as per request */}
            <textarea
              placeholder="Write a message..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 
              focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full py-2 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
              text-white rounded-lg font-medium shadow-md hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Side - Contact Info */}
        <div className="space-y-6">

          <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <MapPin className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Our Location</h3>
              <p className="text-sm">Belgian Street, Town</p>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <Mail className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Send us mail</h3>
              <p className="text-sm">support@benjour.com</p>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <Phone className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Call us</h3>
              <p className="text-sm">+91 00000 00001</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          onClose={() => setShowCropper(false)}
          onSave={handleCropSave}
        />
      )}

      {/* Logout Button */}
      <div className="mt-20 mb-10 flex justify-center">
        <button
          onClick={(): void => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
          }}
          className="px-10 py-3 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-lg shadow-md hover:opacity-90 transition font-medium"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Profile;
