import { useState } from "react";
import BikeSelector from "../components/BikeSelector";

function Home() {
  const [parts, setParts] = useState([]);

  return (
    <div>
      <h1>SparePartsHub</h1>

      <p>
        Find spare parts compatible with your bike.
      </p>

      <BikeSelector onPartsFound={setParts} />

      <h2>Compatible Parts</h2>

      {parts.length === 0 ? (
        <p>Select your bike to find compatible parts.</p>
      ) : (
        <ul>
          {parts.map((part) => (
            <li key={part.id}>
              {part.name} - {part.part_number}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;