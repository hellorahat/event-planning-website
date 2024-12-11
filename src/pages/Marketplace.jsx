import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { Link } from "react-router-dom"; // Import Link for navigation
import Sidebar from "./Sidebar.jsx";
import "../styles/Marketplace.css";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(firestore, "marketplace"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID as the product ID
        ...doc.data(), // Spread the document data into the product object
      }));

      setProducts(productsData);
      setFilteredProducts(productsData); // Initially display all products
    };

    fetchProducts();
  }, []);

  const filterOptions = [
    {
      label: "Category",
      filterKey: "category",
      values: ["Electronics", "Furniture", "Clothing"],
    },
    {
      label: "Brand",
      filterKey: "brand",
      values: ["Samsung", "Apple", "Nike", "Adidas", "IKEA"],
    },
    {
      label: "Price Range",
      filterKey: "priceRange",
      values: ["$0-$50", "$50-$100", "$100-$500", "$500+"],
    },
  ];

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);

    const applyFilters = (product) => {
      if (
        filters.category?.length &&
        !filters.category.includes(product.category)
      ) {
        return false;
      }

      if (filters.brand?.length && !filters.brand.includes(product.brand)) {
        return false;
      }

      if (filters.priceRange?.length) {
        const priceRangeMatch = filters.priceRange.some((range) => {
          if (range === "$0-$50") return product.price <= 50;
          if (range === "$50-$100")
            return product.price > 50 && product.price <= 100;
          if (range === "$100-$500")
            return product.price > 100 && product.price <= 500;
          if (range === "$500+") return product.price > 500;
          return false;
        });
        if (!priceRangeMatch) {
          return false;
        }
      }

      return true;
    };

    setFilteredProducts(products.filter(applyFilters));
  };

  return (
    <div className="marketplace-container">
      <Sidebar
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      <div className="product-listing">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div
                onClick={() => handleCardClick(product.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.photo} // Assuming product.photo contains the image URL
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-title">{product.productName}</h3>
                <p className="product-category">{product.type}</p>
                <p className="product-brand">{product.brand}</p>
                <p className="product-price">${product.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products match your filters.</p>
        )}
      </div>

      {/* Add Product Button */}
      <Link to="/add-product">
        <button className="add-product-btn">
          <span className="plus-icon">+</span> Add Product
        </button>
      </Link>
    </div>
  );
}

export default Marketplace;
