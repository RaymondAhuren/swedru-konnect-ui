import { motion } from "framer-motion";
import {
  FiSmartphone,
  FiLaptop,
  FiHeadphones,
  FiWatch,
  FiCpu,
  FiGrid,
} from "react-icons/fi";

const CategoriesSection = () => {
  const categories = [
    {
      name: "Phones",
      icon: <FiSmartphone size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Laptops",
      icon: <FiLaptop size={24} />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Accessories",
      icon: <FiHeadphones size={24} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Fashions",
      icon: <FiWatch size={24} />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Electronics",
      icon: <FiCpu size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Others",
      icon: <FiGrid size={24} />,
      color: "bg-gray-100 text-gray-600",
    },
  ];

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

  return (
    <section className="px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Categories
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Discover products in popular categories from local sellers
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                y: -5,
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
            >
              <div
                className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {category.icon}
              </div>
              <h3 className="text-center font-medium text-gray-800">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm"
          >
            View All Categories
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
