import { useState, useEffect } from "react";
import { useAlerts } from "../utility/AlertContext.jsx";
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
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import iconFavorite from "../assets/favorite.svg";
import iconCart from "../assets/cart.svg";
import "../styles/Marketplace.css";

function Marketplace() {
  const { addAlert } = useAlerts();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFavorited, setIsFavorited] = useState({});
  const [isInCart, setIsInCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(firestore, "marketplace"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productsData);
      setFilteredProducts(productsData);
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
    {
      label: "Color",
      filterKey: "color",
      values: ["Red", "Blue", "Green", "Black", "White"],
    },
    {
      label: "Condition",
      filterKey: "condition",
      values: ["New", "Used", "Refurbished"],
    },
    {
      label: "Description",
      filterKey: "description",
      values: ["Sale", "Limited Edition", "Exclusive", "Clearance"],
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

      if (filters.color?.length && !filters.color.includes(product.color)) {
        return false;
      }

      if (
        filters.condition?.length &&
        !filters.condition.includes(product.condition)
      ) {
        return false;
      }

      if (filters.description?.length && !filters.description.includes(product.description)) {
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

  const handleFavorite = async (productId) => {
    const userId = auth.currentUser.uid;

    try {
      const favoriteDocRef = doc(firestore, "favorites", userId);
      const favoriteDoc = await getDoc(favoriteDocRef);

      if (favoriteDoc.exists()) {
        await updateDoc(favoriteDocRef, {
          productIds: arrayUnion(productId),
        });
      } else {
        await setDoc(favoriteDocRef, {
          productIds: [productId],
        });
      }

      setIsFavorited((prev) => ({ ...prev, [productId]: true }));
      addAlert("Product has been favorited.");
    } catch (error) {
      console.error("Error adding favorite: ", error);
    }
  };

  const handleCart = async (productId) => {
    const userId = auth.currentUser.uid;

    try {
      const cartDocRef = doc(firestore, "cart", userId);
      const cartDoc = await getDoc(cartDocRef);

      if (cartDoc.exists()) {
        await updateDoc(cartDocRef, {
          productIds: arrayUnion(productId),
        });
      } else {
        await setDoc(cartDocRef, {
          productIds: [productId],
        });
      }

      setIsInCart((prev) => ({ ...prev, [productId]: true }));
      addAlert("Product has been added to the cart.");
    } catch (error) {
      console.error("Error adding product to cart: ", error);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
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
                  src={product.photo}
                  alt={product.productName}
                  className="product-image"
                />
                <h3 className="product-title">{product.productName}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-brand">{product.brand}</p>
                <p className="product-color">{product.color}</p>
                <p className="product-condition">{product.condition}</p>
                <p className="product-description">{product.description}</p>
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

              {/* Cart Button */}
              <button
                className="cart-btn"
                onClick={() => handleCart(product.id)}
                aria-label="Add to Cart"
              >
                <img
                  src={iconCart}
                  alt="Cart"
                  className={`cart-icon ${
                    isInCart[product.id] ? "in-cart" : ""
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
