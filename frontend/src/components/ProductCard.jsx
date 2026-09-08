function ProductCard({ product }) {
  return (
    <div>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          width="200"
        />
      )}

      <h3>{product.name}</h3>
      <p>Part: {product.part_name}</p>
      <p>₹{product.price}</p>
      <p>Stock: {product.stock}</p>

      <button>View Product</button>
    </div>
  );
}

export default ProductCard;