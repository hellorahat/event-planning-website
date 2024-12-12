import { useState, useEffect } from "react";
import { useUser } from "../utility/UserContext";
import { firestore, auth, storage } from "../../firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";

function AddProduct() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/account");
    }
  }, [user, loading, navigate]);

  const [formData, setFormData] = useState({
    color: "",
    condition: "",
    description: "",
    price: "",
    productName: "",
    sellerName: user ? user.name : "",
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
      let imagePath = null;
      let imageUrl = null;

      // Add the product to the "marketplace" collection
      const productId = doc(collection(firestore, "marketplace")).id;

      if (image) {
        imagePath = `images/${productId}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = await setDoc(doc(firestore, "marketplace", productId), {
        color: formData.color,
        condition: formData.condition,
        description: formData.description,
        price: formData.price,
        productName: formData.productName,
        sellerName: formData.sellerName,
        type: formData.type,
        brand: formData.brand,
        photo: imageUrl,
        url: imagePath,
        userId: auth.currentUser.uid,
      });
      console.log("Product created.");

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
      navigate("/marketplace");
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
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Seller's Username
          </label>
          <input
            type="text"
            className="form-control"
            id="host"
            name="host"
            value={formData.sellerName}
            onChange={handleInputChange}
            disabled
          />
        </div>
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
            required
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
            required
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
            required
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
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Category
          </label>
          <input
            type="text"
            className="form-control"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
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
            required
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
            required
          />
        </div>

        <div className="addproductbtn">
          <div className="col-auto">
            <button type="submit" className="add-product btn-primary mb-3">
              Add Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
