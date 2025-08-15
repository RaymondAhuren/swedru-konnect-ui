import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiShield,
  FiEdit,
  FiClock,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import CreateListingForm from "../components/users/CreateListingForm";
import { NavLink } from "react-router";
import { motion } from "framer-motion";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: "Demo",
    lastName: "Account",
    email: "demo@gmail.com",
    phoneNumber: "+233245678901",
  });

  // User data from your API
  const user = {
    _id: "6895ec71d1b26c5fb8bda5fc",
    firstName: "Demo",
    lastName: "Account",
    isOnline: true,
    email: "demo@gmail.com",
    phoneNumber: "+233245678901",
    isActive: true,
    role: "user",
    isTrustedSeller: false,
    photo: "no-image.png",
    lastActive: "2025-08-13T08:36:39.435Z",
    createdAt: "2025-08-08T12:24:17.745Z",
    updatedAt: "2025-08-13T08:36:39.437Z",
    slug: "demo-account-113e2e",
    fullName: "Demo Account",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update user data here
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get last active time
  const getLastActive = (dateString) => {
    const now = new Date();
    const lastActive = new Date(dateString);
    const diffHours = Math.floor((now - lastActive) / (1000 * 60 * 60));

    if (diffHours < 1) return "Active now";
    if (diffHours < 24)
      return `Active ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `Active on ${formatDate(dateString)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 py-4">
            <NavLink to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-lg group-hover:shadow-md transition-all"
              >
                SK
              </motion.div>
              <div className="hidden sm:block">
                <p className="text-base font-bold text-gray-800 tracking-tight">
                  Swedru Konnect
                </p>
                <p className="text-xs text-gray-600">Local Marketplace</p>
              </div>
            </NavLink>

            <motion.div whileHover={{ scale: 1.05 }}>
              <NavLink
                to="/my-ads"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>My Ads</span>
                <FiMapPin className="inline" />
              </NavLink>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:w-1/3">
            <motion.div
              className="bg-white rounded-lg border p-6"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.photo === "no-image.png" ? (
                      <FiUser className="text-gray-400" size={48} />
                    ) : (
                      <img
                        src={user.photo}
                        alt={user.fullName}
                        className="w-full h-full rounded-full object-cover border-4 border-blue-100"
                      />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
                      <FiEdit size={16} />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1 text-left">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={editedUser.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1 text-left">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={editedUser.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user.fullName}
                    </h2>
                    <div
                      className={`flex items-center mt-1 text-sm ${
                        user.isOnline ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          user.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                      {user.isOnline ? "Online" : "Offline"}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editedUser.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <FiPhone className="text-gray-500 mr-3" />
                      <span>{user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="text-gray-500 mr-3" />
                      <span>{user.email}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <FiClock className="text-gray-500 mr-3" />
                  <span>{getLastActive(user.lastActive)}</span>
                </div>
                {user.isTrustedSeller && (
                  <div className="flex items-center text-blue-600">
                    <FiShield className="mr-2" />
                    <span className="text-sm">Verified Seller</span>
                  </div>
                )}
                <div className="pt-4 border-t text-sm text-gray-500">
                  Member since {formatDate(user.createdAt)}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    isEditing
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </motion.button>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(false)}
                    className="w-full py-2 px-4 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center gap-2"
                  >
                    <FiX /> Cancel
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="bg-white rounded-lg border p-6 mt-6"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Account Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-500">Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-500">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">New</div>
                  <div className="text-sm text-gray-500">Member</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.isActive ? "Active" : "Inactive"}
                  </div>
                  <div className="text-sm text-gray-500">Status</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Listings */}
          <div className="lg:w-2/3">
            <CreateListingForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
