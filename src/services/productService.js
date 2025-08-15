const base =
  import.meta.env.VITE_BACKEND_URL
const API_BASE = `${base}/api/v1/products`;

//  GET all products (with filters and pagination)
export const productService = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  condition = "",
  isApproved = "",
}) => {
  let query = `?page=${page}&limit=${limit}`;

  if (search) query += `&search=${encodeURIComponent(search)}`;
  if (category) query += `&category=${encodeURIComponent(category)}`;
  if (condition) query += `&condition=${encodeURIComponent(condition)}`;
  if (isApproved) query += `&isApproved=${isApproved}`;

  const res = await fetch(`${API_BASE}${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch products");

  return data;
};

// //  CREATE a product
// export const createProduct = async (form) => {
//   const formData = new FormData();

//   for (let key in form) {
//     if (key === "images") {
//       form.images.forEach((file) => {
//         formData.append("images", file);
//       });
//     } else {
//       formData.append(key, form[key]);
//     }
//   }

//   const res = await fetch(`${API_BASE}`, {
//     method: "POST",
//     body: formData,
//     credentials: "include",
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to create product");

//   return data;
// };

// export const updateProduct = async (id, formData) => {
//   const res = await fetch(`${API_BASE}/${id}`, {
//     method: "PATCH",
//     credentials: "include",
//     body: formData, // No Content-Type header for FormData
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to update product");
//   return data;
// };

//  GET single product details
export const productDetailsService = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "GET",
    headers: { "Content-type": "application/json" },
    // credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch product");

  return data;
};

// //  APPROVE or DE-APPROVE product
// export const approvedProduct = async (id, isApproved) => {
//   const res = await fetch(`${API_BASE}/${id}/approve`, {
//     method: "PATCH",
//     headers: { "Content-type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ isApproved }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to approve product");

//   return data;
// };

// //  DELETE a product
// export const deleteProduct = async (id) => {
//   const res = await fetch(`${API_BASE}/${id}`, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to delete product");

//   return data;
// };

// //  FETCH product by ID
// export const fetchProduct = async (id) => {
//   const res = await fetch(`${API_BASE}/${id}`, {
//     method: "GET",
//     credentials: "include",
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to fetch product");

//   return data;
// };
