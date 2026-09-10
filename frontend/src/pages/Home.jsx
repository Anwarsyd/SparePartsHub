import { useState } from "react";
import { Link } from "react-router-dom";

import BikeSelector from "../components/BikeSelector";

function Home() {
  const [parts, setParts] = useState([]);

  return (
    <div className="page">
      <div className="hero">
        <h1>SparePartsHub</h1>

        <p>
          Find spare parts compatible with your bike —
          select your model below to see exact matches.
        </p>

        <div className="bike-selector">
          <BikeSelector onPartsFound={setParts} />
        </div>
      </div>

      <div className="parts-section">
        <h2>Compatible Parts</h2>

        {parts.length === 0 ? (
          <p className="parts-empty">
            Select your bike to find compatible parts.
          </p>
        ) : (
          <ul className="parts-list">
            {parts.map((part) => (
              <li key={part.id}>
                <span>{part.name}</span>

                <span className="part-no">
                  {part.part_number}
                </span>

                <Link to={`/products?part=${part.id}`}>
                  View Products
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;