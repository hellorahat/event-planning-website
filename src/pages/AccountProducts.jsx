import { Box, Stack, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useAlerts } from "../utility/AlertContext.jsx";
import { firestore, auth, storage } from "../../firebase.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const AccountProducts = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const { addAlert } = useAlerts();

  const fetchProducts = async (userId) => {
    try {
      const userRef = doc(firestore, "registered-products", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const productIds = userData.productIds || [];

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

        const userProducts = productIds.map((id) => ({
          id,
          ...productMap[id],
        }));

        setProducts(userProducts);
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  // Function to remove a product from the user's registered products and marketplace
  const handleRemoveProduct = async (productId) => {
    if (!user) return;

    try {
      // Delete product image from Firebase Storage
      const productRef = doc(firestore, "marketplace", productId);
      const productSnap = await getDoc(productRef);
      const productData = productSnap.data();
      if (productData && productData.photo) {
        const imageRef = ref(storage, productData.photo);
        await deleteObject(imageRef);
        console.log("Image deleted from Firebase Storage");
      }

      // Delete product document from the marketplace collection
      await deleteDoc(productRef);
      console.log("Product deleted from 'marketplace' collection");

      // Remove productId from the "registered-products" collection
      const registeredProductsRef = doc(firestore, "registered-products", user);
      const registeredProductsSnap = await getDoc(registeredProductsRef);
      if (registeredProductsSnap.exists()) {
        await updateDoc(registeredProductsRef, {
          productIds: arrayRemove(productId),
        });
        console.log("Product removed from 'registered-products'");
      }

      // Remove productId from favorites and cart (if exists)
      const favoritesRef = doc(firestore, "favorites", user);
      const favoritesSnap = await getDoc(favoritesRef);
      if (favoritesSnap.exists()) {
        await updateDoc(favoritesRef, {
          productIds: arrayRemove(productId),
        });
        console.log("Product removed from 'favorites'");
      }

      const cartRef = doc(firestore, "cart", user);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        await updateDoc(cartRef, {
          productIds: arrayRemove(productId),
        });
        console.log("Product removed from 'cart'");
      }

      addAlert("Product successfully removed.");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error removing product: ", error);
      addAlert("An error occurred while removing the product.");
    }
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    setUser(userId);
    if (userId) {
      fetchProducts(userId);
    }
  }, [user]);

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
          Your Products
          <hr style={{ marginTop: "20px", marginBottom: "-30px" }} />
        </Typography>
      </Box>
      {products.length > 0 ? (
        <Stack width="80%" spacing={3}>
          {products.map(({ id, photo, productName, sellerName, price }) => (
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
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRemoveProduct(id)}
              >
                Remove Product
              </Button>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="h6" color="#666">
          You have no products listed yet.
        </Typography>
      )}
    </Box>
  );
};

export default AccountProducts;
