import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const partId = searchParams.get("part");

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (partId) {
          params.append("part", partId);
        }

        if (search) {
          params.append("search", search);
        }

        const response = await api.get(
          `/products/?${params.toString()}`
        );

        setProducts(response.data);
      } catch (error) {
        console.log(error.response?.data);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [partId, search]);

  if (loading) {
    return (
      <div className="page">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>
        {partId ? "Compatible Products" : "Products"}
      </h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search spare parts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;