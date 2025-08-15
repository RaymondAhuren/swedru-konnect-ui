import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { NavLink } from "react-router";

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false); // Set to false since we're using mock data
  const [error, setError] = useState(null);

  // Mock data
  const mockAds = [
    {
      _id: "68991e6cb976e74b1784218e",
      title: "Testing",
      description: "testing",
      price: 1374,
      images: [
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754865393/products/file_psmw8u.png",
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754865396/products/file_oev7hz.png",
      ],
      condition: "used",
      category: "others",
      location: "Agona Nyankrom",
      isApproved: true,
      isSold: false,
      createdAt: "2025-08-10T22:34:20.590Z",
    },
    {
      _id: "6897e76db98759bb62f0f8f1",
      title: "HP Pavilion 15",
      description: "Stylish laptop, original, very clean",
      price: 750,
      images: [
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754785775/products/file_fo4dyk.jpg",
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754785777/products/file_zrbfdx.jpg",
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754785778/products/file_qslylt.jpg",
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754785779/products/file_kos2fe.jpg",
      ],
      condition: "new",
      category: "accessories",
      location: "Tema",
      isApproved: true,
      isSold: false,
      createdAt: "2025-08-10T00:27:25.958Z",
    },
    {
      _id: "689606530306cfd54403df50",
      title: "HP Pavilion 15",
      description: "Stylish laptop, original, very clean",
      price: 750,
      images: [
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754662603/products/file_ksn4zk.jpg",
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754786676/products/file_h4kq8x.jpg",
        "https://res.cloudinary.com/dkihpbxkq/image/upload/v1754786696/products/file_vhsgvp.jpg",
      ],
      condition: "new",
      category: "accessories",
      location: "Tema",
      isApproved: true,
      isSold: false,
      createdAt: "2025-08-08T14:14:43.791Z",
    },
  ];

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    try {
      // In a real app, you would fetch from API here
      // For demo, we're using mock data immediately
      setAds(mockAds);
    } catch (err) {
      setError("Failed to load ads data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = (adId) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    setAds(ads.filter((ad) => ad._id !== adId));
    alert("Ad deleted (simulated)"); // In real app, you would call API here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
        <h2 className="text-xl font-semibold text-white">
          My Ads ({ads.length})
        </h2>
      </div>

      {ads.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't posted any ads yet.</p>
          <NavLink
            to="/create-listing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Ad
          </NavLink>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {ads.map((ad) => (
            <motion.div
              key={ad._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {ad.images?.length > 0 ? (
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiMapPin size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="font-medium text-lg text-gray-900 truncate">
                        {ad.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {ad.description}
                      </p>
                    </div>
                    <div className="text-right pl-2">
                      <p className="font-bold text-blue-600 whitespace-nowrap">
                        {formatPrice(ad.price)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                        {formatDate(ad.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {ad.condition}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {ad.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {ad.location}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ad.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ad.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <NavLink
                  to={`/edit-listing/${ad._id}`}
                  className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors"
                >
                  <FiEdit className="mr-1" size={14} /> Edit
                </NavLink>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition-colors"
                >
                  <FiTrash2 className="mr-1" size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAds;
