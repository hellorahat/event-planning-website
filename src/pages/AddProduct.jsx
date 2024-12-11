import { useState, useEffect } from "react";
import { useUser } from "../utility/UserContext"; // Adjust the path based on your project structure
import { firestore, auth, storage } from "../../firebase.js"; // Include storage
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";

function AddProduct() {
  const { user, loading } = useUser(); // Get user from context
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    if (!loading && !user) {
      navigate("/account");
    }
  }, [user, loading, navigate]);

  const [formData, setFormData] = useState({
    color: "",
    condition: "",
    description: "",
    location: "",
    price: "",
    productName: "",
    sellerName: user ? user.name : "", // Autofill seller name from context if available
    type: "",
    brand: "",
    url: "",
    photo: "",
  });

  const [image, setImage] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  async function addProduct(e) {
    e.preventDefault();
    try {
      // Step 1: Upload the image if provided
      let imagePath = null; // This will hold the image path
      let imageUrl = null;
      if (image) {
        imagePath = `images/${image.name}`; // Define the storage path (you can modify this as needed)
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, image); // Upload the image
        imageUrl = await getDownloadURL(imageRef);
      }

      // Step 2: Add the product to the "marketplace" collection
      const productId = doc(collection(firestore, "marketplace")).id; // Use a document ID from Firestore as productId
      const docRef = await setDoc(doc(firestore, "marketplace", productId), {
        color: formData.color,
        condition: formData.condition,
        description: formData.description,
        location: formData.location,
        price: formData.price,
        productName: formData.productName,
        sellerName: formData.sellerName,
        type: formData.type,
        brand: formData.brand,
        photo: imageUrl, // Store image paths
        url: imagePath,
      });
      console.log("Product created.");

      // Step 3: Update the "registered-products" collection (optional)
      const userId = auth.currentUser.uid;
      const registeredProductsRef = collection(
        firestore,
        "registered-products"
      );
      const userDocRef = doc(registeredProductsRef, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          productIds: arrayUnion(productId),
        });
      } else {
        await setDoc(userDocRef, {
          productIds: [productId],
        });
      }
      console.log("Product added to registered-products collection");

      // Step 4: Redirect to the marketplace page
      navigate("/marketplace"); // Redirect to the marketplace page
    } catch (e) {
      console.error("Error adding product: ", e);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="addproductpage">
      <h1 className="addproducttitle">Add Product</h1>
      <form onSubmit={addProduct} className="addproduct">
        {/* Product input fields */}
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="color" className="form-label">
            Color
          </label>
          <input
            type="text"
            className="form-control"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="condition" className="form-label">
            Condition
          </label>
          <input
            type="text"
            className="form-control"
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Type
          </label>
          <input
            type="text"
            className="form-control"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Brand
          </label>
          <input
            type="text"
            className="form-control"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload Images
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <div className="addproductbtn">
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-3">
              Add Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
