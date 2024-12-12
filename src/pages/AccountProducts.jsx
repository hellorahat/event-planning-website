import { Box, Stack, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useAlerts } from "../utility/AlertContext.jsx";
import { firestore, auth } from "../../firebase.js"; // Assuming firebase.js is configured and exported
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

function AccountProducts() {
  const [accountProducts, setAccountProducts] = useState([]);
  const [user, setUser] = useState(null); // Assume you have some way of setting the current user's ID
  const { addAlert } = useAlerts();

  // Function to fetch user registered products from Firestore
  const fetchAccountProducts = async (userId) => {
    try {
      // Get the user's registered products document from the "registered-products" collection
      const userRef = doc(firestore, "registered-products", userId); // Reference to the user's document in "registered-products"
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const registeredProductIds = userData.productIds || []; // Assuming "productIds" is an array of product IDs

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

        // Get all registered products using the IDs and only the relevant fields
        const registeredProducts = registeredProductIds.map((id) => ({
          id,
          ...productMap[id],
        }));

        setAccountProducts(registeredProducts);
      }
    } catch (error) {
      console.error("Error fetching registered products: ", error);
    }
  };

  useEffect(() => {
    // Replace with actual method of getting the current user ID
    const userId = auth.currentUser.uid; // Replace with dynamic user ID
    setUser(userId);
    if (userId) {
      fetchAccountProducts(userId);
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
          Your Registered Products
          <hr style={{ marginTop: "20px", marginBottom: "-30px" }} />
        </Typography>
      </Box>
      {accountProducts.length > 0 ? (
        <Stack width="80%" spacing={3}>
          {accountProducts.map(
            ({ id, photo, productName, sellerName, price }) => (
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
                      Price: {price}
                    </Typography>
                  </Box>
                </Box>
                <div className="d-flex flex-column justify-content-center">
                  <Button
                    variant="contained"
                    color="error"
                    // Add additional functionality for removing or editing the product here
                  >
                    Remove Product
                  </Button>
                </div>
              </Box>
            )
          )}
        </Stack>
      ) : (
        <Typography variant="h6" color="#666">
          You have not registered any products yet.
        </Typography>
      )}
    </Box>
  );
}

export default AccountProducts;
