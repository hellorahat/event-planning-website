import { useState } from "react";
import Sidebar from "./Sidebar.jsx";


function Marketplace() {
  const products = [
    { id: 1, name: "Smartphone", category: "Electronics", brand: "Samsung", price: 999 },
    { id: 2, name: "Laptop", category: "Electronics", brand: "Apple", price: 1299 },
    { id: 3, name: "Sofa", category: "Furniture", brand: "IKEA", price: 499 },
    { id: 4, name: "Running Shoes", category: "Clothing", brand: "Nike", price: 120 },
    { id: 5, name: "T-Shirt", category: "Clothing", brand: "Adidas", price: 35 },
    { id: 6, name: "Coffee Table", category: "Furniture", brand: "IKEA", price: 150 },
  ];

  const filterOptions = [
    { label: "Category", filterKey: "category", values: ["Electronics", "Furniture", "Clothing"] },
    { label: "Brand", filterKey: "brand", values: ["Samsung", "Apple", "Nike", "Adidas", "IKEA"] },
    { label: "Price Range", filterKey: "priceRange", values: ["$0-$50", "$50-$100", "$100-$500", "$500+"] },
  ];

  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);

    const applyFilters = (product) => {
      if (filters.category?.length && !filters.category.includes(product.category)) {
        return false;
      }

      if (filters.brand?.length && !filters.brand.includes(product.brand)) {
        return false;
      }

      if (filters.priceRange?.length) {
        const priceRangeMatch = filters.priceRange.some((range) => {
          if (range === "$0-$50") return product.price <= 50;
          if (range === "$50-$100") return product.price > 50 && product.price <= 100;
          if (range === "$100-$500") return product.price > 100 && product.price <= 500;
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

  return (
    <div className="marketplace-container">
      <FilterSidebar filterOptions={filterOptions} onFilterChange={handleFilterChange} />
      <div className="product-listing">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Brand: {product.brand}</p>
              <p>Price: ${product.price}</p>
            </div>
          ))
        ) : (
          <p className="no-products">No products match your filters.</p>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
