import { Box, Stack, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { firestore, auth } from "../../firebase.js"; // Assuming firebase.js is configured and exported
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import CheckoutForm from "../components/CheckoutForm.jsx";
import PaymentRequestButton from "../components/PaymentRequestButton";
import ExpressCheckout from "../components/ExpressCheckout.jsx";
import "../styles/Cart.css";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [user, setUser] = useState(null); // Assume you have some way of setting the current user's ID
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Function to fetch user cart data from Firestore
  const fetchCartData = async (userId) => {
    try {
      // Get the user's cart document from the "cart" collection
      const cartRef = doc(firestore, "cart", userId); // Reference to the user's document in "cart" collection
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const productIds = cartData.productIds || []; // Assuming "productIds" is an array of product IDs

        // Fetch product details from the "marketplace" collection using productIds
        const productQuery = collection(firestore, "marketplace");
        const productSnapshot = await getDocs(productQuery);
        const productMap = {};

        productSnapshot.forEach((doc) => {
          const product = doc.data();
          productMap[doc.id] = {
            photo: product.photo, // Assuming photo is the field name for the product image
            productName: product.productName, // Assuming productName is the field name
            sellerName: product.sellerName, // Assuming sellerName is the field name
            price: product.price, // Assuming price is the field name
          };
        });

        // Get all products in the cart using the IDs and only the relevant fields
        const cartItems = productIds.map((id) => ({
          id,
          ...productMap[id],
        }));

        setCartProducts(cartItems);

        // Calculate the total price of the cart
        const total = cartItems.reduce(
          (acc, product) => acc + parseFloat(product.price),
          0
        );
        setTotalPrice(total.toFixed(2));
      }
    } catch (error) {
      console.error("Error fetching cart data: ", error);
    }
  };

  // Function to remove a product from cart and update total price
  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const cartRef = doc(firestore, "cart", user);
      // Update the user's cart document by removing the product ID from "productIds"
      await updateDoc(cartRef, {
        productIds: arrayRemove(productId),
      });

      // After removing from Firestore, update the local state to reflect the changes
      setCartProducts((prevCart) => {
        const updatedCart = prevCart.filter(
          (cartItem) => cartItem.id !== productId
        );

        // Recalculate the total price after removal
        const newTotal = updatedCart.reduce(
          (acc, product) => acc + parseFloat(product.price),
          0
        );
        setTotalPrice(newTotal.toFixed(2)); // Update the total price state

        return updatedCart;
      });
    } catch (error) {
      console.error("Error removing from cart: ", error);
    }
  };

  useEffect(() => {
    // Replace with actual method of getting the current user ID
    const userId = auth.currentUser.uid; // Replace with dynamic user ID
    setUser(userId);
    if (userId) {
      fetchCartData(userId); // Fetch cart data for the user
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
          Cart
          <hr style={{ marginTop: "20px", marginBottom: "-30px" }} />
        </Typography>
      </Box>
      {cartProducts.length > 0 ? (
        <Stack width="80%" spacing={3}>
          {cartProducts.map(({ id, photo, productName, sellerName, price }) => (
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
                  width="200px"
                  height="200px"
                  style={{ borderRadius: "10px" }}
                />
                <Box>
                  <Typography variant="h5" color="#007bff">
                    {productName}
                  </Typography>
                  <Typography variant="subtitle1" color="#666">
                    Seller: {sellerName}
                  </Typography>
                  <Typography variant="subtitle2" color="#999">
                    Price: ${price}
                  </Typography>
                </Box>
              </Box>
              <div className="d-flex flex-column justify-content-center">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeFromCart(id)}
                >
                  Remove from Cart
                </Button>
              </div>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="h6" color="#666">
          Your cart is empty.
        </Typography>
      )}
      {cartProducts.length > 0 && (
        <Box width="80%" mt={5}>
          <Typography variant="h5" textAlign="right" mb={2}>
            Total: ${totalPrice}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className="checkout-button"
            onClick={handleCheckout}
          >
            Continue
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
