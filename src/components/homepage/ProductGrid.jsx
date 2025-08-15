import React from 'react';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FiMapPin,
  FiCheckCircle,
  FiEye,
  FiArrowRight,
  FiUser,
  FiStar,
  FiFilter,
  FiMeh,
  FiSearch
} from "react-icons/fi";
import { useProducts } from "../../context/productContext";

const Marketplace = () => {
  const {
    products,
    loading,
    error,
    pagination,
    updateFilters,
    fetchProducts,
    hasMore,
    filters
  } = useProducts();
  const navigate = useNavigate();

  // Categories data
  const [categories, setCategories] = useState([
    { name: "Phones", value: "phones", checked: false },
    { name: "Laptops", value: "laptops", checked: false },
    { name: "Accessories", value: "accessories", checked: false },
    { name: "Fashions", value: "fashions", checked: false },
    { name: "Electronics", value: "electronics", checked: false },
    { name: "Others", value: "others", checked: false },
  ]);

  const [activeFilters, setActiveFilters] = useState(false);

  // Check if we have active filters or search query
  const hasActiveSearchOrFilters = activeFilters || (filters.search && filters.search.trim() !== '');

  // Check if no products match filters or search
  const noProductsMatch = !loading && products.length === 0 && hasActiveSearchOrFilters;

  // Initialize categories based on current filters
  useEffect(() => {
    if (filters.category) {
      const activeCats = filters.category.split(',');
      const newCategories = categories.map(cat => ({
        ...cat,
        checked: activeCats.includes(cat.value)
      }));
      setCategories(newCategories);
      setActiveFilters(activeCats.length > 0);
    }
  }, [filters.category]);

  const toggleCategory = (index) => {
    const newCategories = [...categories];
    newCategories[index].checked = !newCategories[index].checked;
    setCategories(newCategories);

    // Check if any filters are active
    const hasActiveFilters = newCategories.some(cat => cat.checked);
    setActiveFilters(hasActiveFilters);

    // Get all checked categories
    const activeCategories = newCategories
      .filter(cat => cat.checked)
      .map(cat => cat.value)
      .join(',');

    updateFilters({ category: activeCategories, page: 1 }); // Reset to page 1 when filters change
  };

  const clearAllFilters = () => {
    setCategories(categories.map(cat => ({ ...cat, checked: false })));
    setActiveFilters(false);
    updateFilters({ category: '', search: '', page: 1 });
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      updateFilters({ page: pagination.page + 1 });
    }
  };

  // Format price with Ghanaian Cedis symbol
  const formatPrice = (price) => {
    return `₵${price?.toLocaleString() || '0'}`;
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <motion.div
      variants={item}
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="relative h-56 w-full bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse mt-4"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Categories Section */}
      <section className="px-4 py-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Browse Categories
                </h2>
                <p className="text-gray-600">
                  Select categories to filter products
                </p>
              </div>
              {hasActiveSearchOrFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiFilter className="mr-1" /> Clear all
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-3"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  id={`category-${index}`}
                  checked={category.checked}
                  onChange={() => toggleCategory(index)}
                  className="hidden"
                />
                <label
                  htmlFor={`category-${index}`}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    category.checked
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  {category.name}
                </label>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 py-8" id="products-section">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              {filters.search ? `Search results for "${filters.search}"` : 'Featured Products'}
            </h2>
            {products.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {products.length} of {pagination.total} products
              </div>
            )}
          </motion.div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {noProductsMatch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center mb-6"
            >
              <div className="flex flex-col items-center justify-center">
                <FiSearch className="text-4xl text-gray-400 mb-3" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.search 
                    ? `We couldn't find any products matching "${filters.search}"`
                    : "No products match your current filters"}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear search & filters
                </button>
              </div>
            </motion.div>
          )}

          {!noProductsMatch && (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {loading && pagination.page === 1 ? (
                  Array(6).fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                      {renderSkeleton()}
                    </React.Fragment>
                  ))
                ) : (
                  products.map((product) => (
                    <motion.div
                      key={product._id}
                      variants={item}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                    >
                      {/* Product Image */}
                      <div className="relative h-56 w-full overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Condition Badge */}
                        <span
                          className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold ${
                            product.condition === "new"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {product.condition === "new" ? "New" : "pre-owned"}
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-1 font-poppins">
                            {product.title}
                          </h3>
                          <div className="flex items-center">
                            <span className="font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                            {product.user?.isTrustedSeller && (
                              <FiStar className="ml-2 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 font-inter">
                          {product.description}
                        </p>

                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <FiMapPin className="mr-1 text-blue-500" size={14} />
                          <span>{product.location}</span>
                        </div>

                       <div className="flex items-center text-sm text-gray-500 mb-4">
  <FiUser className="mr-1 text-blue-500" size={14} />
  <span className="flex items-center">
    {product.user ? product.user.fullName : "Seller"}
    {product.user?.isTrustedSeller && (
      <FiCheckCircle 
        className="ml-1 text-blue-500" 
        size={14}
        title="Verified Seller"
      />
    )}
  </span>
</div>

                        <button 
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          onClick={() => navigate(`/product/${product._id}/${product.slug}`)}
                        >
                          <FiEye className="inline mr-2" />
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>

              {/* Pagination Controls */}
              <div className="mt-8 flex flex-col items-center">
                {/* Desktop Pagination */}
                <div className="hidden md:flex space-x-2">
                  {pagination.totalPages > 1 && Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateFilters({ page: pageNum })}
                        className={`px-4 py-2 rounded-md ${
                          pagination.page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile "Load More" */}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="md:hidden mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                )}

                {/* Show when all products are loaded */}
                {!hasMore && products.length > 0 && (
                  <p className="text-gray-500 mt-4">
                    You've reached the end of products
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
