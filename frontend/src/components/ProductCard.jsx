import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="card">
      <div className="thumb">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            width="100%"
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <span className="stock">No image</span>
        )}
      </div>

      <h3>{product.name}</h3>
      <p className="part-no">Part: {product.part_name}</p>
      <p className="part-no">Part Number: {product.part_number}</p>
      <p className="price">₹{product.price}</p>
      <p className="stock">Stock: {product.stock}</p>

      <Link to={`/products/${product.id}`}>
        View Product
      </Link>
    </div>
  );
}

export default ProductCard;