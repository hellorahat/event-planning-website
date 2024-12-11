import { useMediaQuery } from "react-responsive";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase.js";
import "../styles/productpage.css";

function Productpages() {
  const { productId } = useParams(); // Retrieve productId from the route
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(firestore, "marketplace", productId); // Reference to the Firestore document
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data()); // Set product data to state
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading product details...</div>;
  }
  if (!product) {
    return <div>No product available</div>;
  }
  return (
    <div>
      <Grid container spacing={0}>
        <Grid sx={{ pl: 5, mb: 3 }} size={8}>
          <Card sx={{ minWidth: 275 }}>
            {/* Display single product image */}
            <div className="carousel">
              <img
                className="d-block w-100"
                src={product.photo} // Single image from product
                alt={product.productName} // Product name as alt text
              />
            </div>
          </Card>
        </Grid>

        <Grid sx={{ px: 5, mb: 3 }} size={4}>
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
              <button
                type="submit"
                className="btn btn-primary mb-2"
                onClick={() => handleFavorite(product.id)}
              >
                Add to cart
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => handleCart(product.id)}
              >
                Add to favorites
              </button>
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
