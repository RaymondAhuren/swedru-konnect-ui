import {
  FiMapPin,
  FiCheckCircle,
  FiChevronLeft,
  FiPhone,
  FiStar,
  FiShield,
  FiCpu,
  FiHardDrive,
  FiBattery,
  FiEye,
  FiEyeOff,
  FiUser
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { productDetailsService } from "../services/productService";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const productData = await productDetailsService(id);
        setProduct(productData.data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price) => `₵${price?.toLocaleString() || '0'}`;
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) : "";

  const isPhoneOrLaptop = ['phones', 'laptops'].includes(product?.category);

  const togglePhoneNumber = () => {
    setShowPhoneNumber(!showPhoneNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FiShield className="mx-auto text-gray-400" size={48} />
          <h2 className="text-xl font-semibold mt-4">Product Not Found</h2>
          <p className="text-gray-600 mt-2">{error || "The product you're looking for doesn't exist or may have been removed."}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Ensure images array exists and has at least one item
  const mainImage = product.images?.[0] || "https://via.placeholder.com/600x400?text=No+Image";
  const thumbnailImages = product.images?.length ? product.images : [mainImage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Professional Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiChevronLeft className="text-gray-600" size={20} />
              </button>
              <div className="ml-4 flex items-center">
                <div className="bg-blue-600 text-white font-bold text-lg w-8 h-8 flex items-center justify-center rounded-lg">
                  SK
                </div>
                <h1 className="ml-2 text-lg font-bold text-gray-800 hidden sm:block">
                  Swedru Konnect
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="lg:w-[60%]">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square w-full">
                <img
                  src={thumbnailImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-2 overflow-x-auto py-2">
                  {thumbnailImages.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-[40%] space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  {isPhoneOrLaptop && product.model && (
                    <p className="text-gray-600 mb-2 font-medium">{product.brand} {product.model}</p>
                  )}
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiMapPin className="mr-1" size={14} />
                    <span>{product.location}</span>
                    <span className="mx-2">•</span>
                    <span>Posted {formatDate(product.createdAt)}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.condition === "new"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {product.condition === "new" ? "NEW" : "USED"}
                </span>
              </div>

              <div className="my-6 flex items-center">
                <span className="text-3xl lg:text-4xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.user?.isTrustedSeller && (
                  <div className="ml-4 flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <FiStar className="text-yellow-500 fill-yellow-500 mr-1" size={14} />
                    <span className="text-xs font-medium text-blue-700">TRUSTED SELLER</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Professional Technical Specifications Section */}
              {isPhoneOrLaptop && (
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Specifications
                  </h2>
                  <div className="space-y-3">
                    {product.brand && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Brand</span>
                        <span className="text-sm font-medium">{product.brand}</span>
                      </div>
                    )}
                    {product.model && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Model</span>
                        <span className="text-sm font-medium">{product.model}</span>
                      </div>
                    )}
                    {product.ram && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">RAM</span>
                        <span className="text-sm font-medium">{product.ram}</span>
                      </div>
                    )}
                    {product.storage && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Storage</span>
                        <span className="text-sm font-medium">{product.storage}</span>
                      </div>
                    )}
                    {product.batteryHealth && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Battery Health</span>
                        <span className="text-sm font-medium">{product.batteryHealth.trim()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Seller Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Seller Information
              </h2>
              {product.user ? (
                <>
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <img
                        src={product.user.photo || "https://via.placeholder.com/150"}
                        alt={product.user.fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                      />
                      {product.user.isTrustedSeller && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <FiCheckCircle className="text-white" size={14} />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="font-medium">
                          {product.user.fullName}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-500">
                        Member since {product.user.joinDate ? new Date(product.user.joinDate).getFullYear() : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Contact Number</span>
                      <button 
                        onClick={togglePhoneNumber}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        {showPhoneNumber ? (
                          <>
                            <FiEyeOff className="mr-1" size={14} />
                            Hide
                          </>
                        ) : (
                          <>
                            <FiEye className="mr-1" size={14} />
                            Show
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {showPhoneNumber ? (
                        <span className="font-medium">{product.user.phoneNumber}</span>
                      ) : (
                        <span className="text-gray-500">Click "Show" to reveal number</span>
                      )}
                    </div>
                  </div>

                  <a
                    href={`tel:${product.user.phoneNumber}`}
                    className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <FiPhone className="mr-2" size={16} />
                    Call Seller
                  </a>
                </>
              ) : (
                <div className="text-center py-4">
                  <FiUser className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-600 mb-4">Seller information not available</p>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm"
                  >
                    Back to Products
                  </button>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <h3 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
                <FiCheckCircle className="mr-2 text-blue-500" size={16} />
                Safety Tips
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Meet in public places</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Inspect items before payment</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Never share financial information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;