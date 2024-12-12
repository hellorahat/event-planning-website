"use client";

import { Box, Stack, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useAlerts } from "../utility/AlertContext.jsx";
import { firestore, auth } from "../../firebase.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayRemove,
  setDoc,
  arrayUnion,
} from "firebase/firestore";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const { addAlert } = useAlerts();

  const fetchFavorites = async (userId) => {
    try {
      const userRef = doc(firestore, "favorites", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoriteIds = userData.productIds || [];
        const productQuery = collection(firestore, "marketplace");
        const productSnapshot = await getDocs(productQuery);
        const productMap = {};

        productSnapshot.forEach((doc) => {
          const product = doc.data();
          productMap[doc.id] = {
            photo: product.photo,
            productName: product.productName,
            sellerName: product.sellerName,
            price: product.price,
          };
        });

        const favoriteProducts = favoriteIds.map((id) => ({
          id,
          ...productMap[id],
        }));

        setFavorites(favoriteProducts);
      }
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    }
  };

  const removeFavorite = async (productId) => {
    if (!user) return;

    try {
      const userRef = doc(firestore, "favorites", user);

      await updateDoc(userRef, {
        productIds: arrayRemove(productId),
      });

      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== productId)
      );
    } catch (error) {
      console.error("Error removing favorite: ", error);
    }
  };

  useEffect(() => {
    const userId = auth.currentUser.uid;
    setUser(userId);
    if (userId) {
      fetchFavorites(userId);
    }
  }, [user]);

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

      removeFavorite(productId);
      addAlert(
        "Product has been added to the cart and removed from favorites."
      );
    } catch (error) {
      console.error("Error adding product to cart: ", error);
    }
  };

  return (
    <Box
      width="100vw"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Box width="80%" mb={4}>
        <Typography variant="h3" textAlign="center" color="#333">
          Favorites
          <hr style={{ marginTop: "20px", marginBottom: "-30px" }} />
        </Typography>
      </Box>
      {favorites.length > 0 ? (
        <Stack width="80%" spacing={3}>
          {favorites.map(({ id, photo, productName, sellerName, price }) => (
            <Box
              key={id}
              display="flex"
              height={225}
              justifyContent="space-between"
              alignItems="center"
              border="1px solid #ddd"
              padding={3}
              paddingBottom={5.5}
              backgroundColor="white"
              borderTop={0}
              borderLeft={0}
              borderRight={0}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <img
                  src={photo}
                  alt={productName}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Box>
                  <Typography variant="h5" color="#007bff">
                    {productName}
                  </Typography>
                  <Typography variant="subtitle1" color="#666">
                    Seller: {sellerName}
                  </Typography>
                  <Typography variant="subtitle2" color="#999">
                    Price: {price}
                  </Typography>
                </Box>
              </Box>
              <div className="d-flex flex-column justify-content-center">
                <Button
                  className="mb-3 outline-success"
                  variant="contained"
                  style={{ backgroundColor: "#007bff", color: "#fff" }}
                  onClick={() => handleCart(id)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeFavorite(id)}
                >
                  Remove from Favorites
                </Button>
              </div>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="h6" color="#666">
          You have no favorite products yet.
        </Typography>
      )}
    </Box>
  );
};

export default Favorites;
