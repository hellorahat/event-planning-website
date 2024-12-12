import * as React from "react";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { firestore, auth, storage } from "../../firebase.js";
import { ref, deleteObject } from "firebase/storage";
import { useUser } from "../utility/UserContext.jsx";
import { useAlerts } from "../utility/AlertContext.jsx";
import "../styles/productpage.css";

function Productpages() {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false); 
  const { user } = useUser();
  const { addAlert } = useAlerts();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(firestore, "marketplace", productId); 
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data()); 
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const checkIfSeller = async () => {
      if (product && user) {
        setIsSeller(product.userId === auth.currentUser.uid);
      }
    };

    checkIfSeller();
  }, [product, auth.currentUser.uid]);

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

      addAlert("Product has been favorited.");
    } catch (error) {
      console.error("Error adding favorite: ", error);
    }
  };

  const handleCart = async (productId) => {
    const userId = auth.currentUser.uid;
    try {
      const favoriteDocRef = doc(firestore, "favorites", userId);
      const cartDocRef = doc(firestore, "cart", userId);

      const favoriteDoc = await getDoc(favoriteDocRef);
      if (favoriteDoc.exists()) {
        await updateDoc(favoriteDocRef, {
          productIds: arrayRemove(productId),
        });
      }

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

      addAlert("Product has been added to the cart.");
    } catch (error) {
      console.error("Error adding product to cart: ", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const userId = auth.currentUser.uid;

    try {
      if (product.url) {
        const imageRef = ref(storage, product.url);
        await deleteObject(imageRef);
        console.log("Image deleted from Firebase Storage");
      }

      const productRef = doc(firestore, "marketplace", productId);
      await deleteDoc(productRef);
      console.log("Product deleted from 'marketplace' collection");

      const registeredProductsRef = doc(
        firestore,
        "registered-products",
        userId
      );
      const registeredProductsSnap = await getDoc(registeredProductsRef);

      if (registeredProductsSnap.exists()) {
        await updateDoc(registeredProductsRef, {
          productIds: arrayRemove(productId),
        });
        console.log("Product removed from 'registered-products'");
      }
      const favoritesRef = doc(firestore, "favorites", userId);
      const favoritesSnap = await getDoc(favoritesRef);

      if (favoritesSnap.exists()) {
        await updateDoc(favoritesRef, {
          productIds: arrayRemove(productId),
        });
        console.log("Product removed from 'favorites'");
      }

      const cartRef = doc(firestore, "cart", userId);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        await updateDoc(cartRef, {
          productIds: arrayRemove(productId),
        });
        console.log("Product removed from 'cart'");
      }

      addAlert("Product successfully deleted.");
    } catch (error) {
      console.error("Error deleting product:", error);
      addAlert("An error occurred while deleting the product.");
    }
    navigate("/marketplace");
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }
  if (!product) {
    return <div>No product available</div>;
  }
  return (
    <div>
      <Grid sx={{ mt:3 }} container spacing={0}>
        <Grid sx={{ pl: 5, mb: 3 }} size={{ xs: 12, sm: 8 }}>
          <Card sx={{ minWidth: 275 }}>
            {/* Display single product image */}
            <div className="imgcontainer">
              <img
                className="prdctimg"
                src={product.photo} 
                alt={product.productName} 
              />
            </div>
          </Card>
        </Grid>

        <Grid sx={{ px: 5, mb: 3 }} size={{ xs: 12, sm: 4 }}>
          <div className="description">
            <h2>{product.productName}</h2>
            <hr />
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Seller:</strong> {product.sellerName}
            </p>
            <p>
              <strong>Condition:</strong> {product.condition}
            </p>
            <hr />
            {/* Replaced Quantity field with product description */}
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <hr />
            <form>
              <div className="button-stack">
                {!isSeller && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary mb-2"
                      onClick={() => handleCart(productId)}
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary mb-2"
                      onClick={() => handleFavorite(productId)}
                    >
                      Add to favorites
                    </button>
                  </>
                )}
                {isSeller && (
                  <button
                    type="button"
                    className="btn btn-danger mb-2"
                    onClick={() => handleDeleteProduct(productId)}
                  >
                    Delete Product
                  </button>
                )}
              </div>
            </form>
            <hr />
          </div>
        </Grid>

        <Grid sx={{ px: 5, mb: 3 }} size={12}>
          <p>
            <strong>Full Description:</strong>
          </p>
          <p>{product.description}</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default Productpages;
