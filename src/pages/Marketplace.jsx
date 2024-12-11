import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { firestore, auth } from "../../firebase.js";
import { Link } from "react-router-dom"; // Import Link for navigation
import Sidebar from "./Sidebar.jsx";
import iconFavorite from "../assets/favorite.svg";
import "../styles/Marketplace.css";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFavorited, setIsFavorited] = useState({}); // State to manage favorites

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

  // Handle favorite click
  const handleFavorite = async (productId) => {
    const userId = auth.currentUser.uid; // Replace with the actual logged-in user's ID, e.g., from Firebase Authentication

    try {
      const favoriteDocRef = doc(firestore, "favorites", userId); // Use userId as the document name
      const favoriteDoc = await getDoc(favoriteDocRef);

      if (favoriteDoc.exists()) {
        // If the document exists, update the productIds array by adding the new productId
        await updateDoc(favoriteDocRef, {
          productIds: arrayUnion(productId), // Add the productId to the array
        });
      } else {
        // If the document doesn't exist, create a new document with an array containing the first productId
        await setDoc(favoriteDocRef, {
          productIds: [productId], // Initialize with an array of the first productId
        });
      }

      // Update local state to show the favorite button as "favorited"
      setIsFavorited((prev) => ({ ...prev, [productId]: true }));
      alert("Product has been favorited.");
    } catch (error) {
      console.error("Error adding favorite: ", error);
    }
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

              {/* Favorite Button */}
              <button
                className="favorite-btn"
                onClick={() => handleFavorite(product.id)}
                aria-label="Add to Favorites"
              >
                <img
                  src={iconFavorite}
                  alt="Favorite"
                  className={`favorite-icon ${
                    isFavorited[product.id] ? "favorited" : ""
                  }`}
                />
              </button>
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
