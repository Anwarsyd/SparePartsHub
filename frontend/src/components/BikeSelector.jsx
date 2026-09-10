import { useEffect, useState } from "react";
import api from "../api/axios";

function BikeSelector({ onPartsFound }) {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    const getBrands = async () => {
      const response = await api.get("/compatibility/brands/");
      setBrands(response.data);
    };

    getBrands();
  }, []);

  const handleBrandChange = async (e) => {
    const brandId = e.target.value;

    setSelectedBrand(brandId);
    setSelectedModel("");
    setModels([]);
    onPartsFound([]);

    if (!brandId) return;

    const response = await api.get(
      `/compatibility/models/?brand=${brandId}`
    );

    setModels(response.data);
  };

  const handleModelChange = async (e) => {
    const modelId = e.target.value;

    setSelectedModel(modelId);

    if (!modelId) return;

    const response = await api.get(
      `/compatibility/parts/?bike_model=${modelId}`
    );

    onPartsFound(response.data);
  };

  return (
    <>
      <h2>Find Parts for Your Bike</h2>

      <div className="field">
        <label htmlFor="brand">Brand</label>
        <select id="brand" value={selectedBrand} onChange={handleBrandChange}>
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="model">Model</label>
        <select
          id="model"
          value={selectedModel}
          onChange={handleModelChange}
          disabled={!selectedBrand}
        >
          <option value="">Select Model</option>

          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.year_from}-{model.year_to})
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default BikeSelector;