import React, { useState } from "react";


const LocationForm = () => {
    const [formData, setFormData] = useState({
      warehouse_id: "",
      parent_id: "",
      level: "area",
      name: "",
      status: "active",
    });
  
    const [parentOptions, setParentOptions] = useState({
      area: [],
      zone: [],
      aisle: [],
      rack: [],
      shelve: [],
      bin: [],
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Create the new location object
      const newLocation = {
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID
        name: formData.name,
        level: formData.level,
      };
  
      // Add the new location to the parent options for the next level
      if (formData.level !== "bin") {
        const nextLevel = getNextLevel(formData.level);
        setParentOptions((prev) => ({
          ...prev,
          [nextLevel]: [...prev[nextLevel], newLocation],
        }));
      }
  
      alert(`Location "${formData.name}" created successfully!`);
      setFormData({
        warehouse_id: "",
        parent_id: "",
        level: "area",
        name: "",
        status: "active",
      });
    };
  
    const getNextLevel = (currentLevel) => {
      const levels = ["area", "zone", "aisle", "rack", "shelve", "bin"];
      const currentIndex = levels.indexOf(currentLevel);
      return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
    };
  
    return (
      <div>
        <h2>Create Location</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Warehouse ID:</label>
            <input
              type="text"
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              required
            />
          </div>
  
          <div>
            <label>Level:</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              {["area", "zone", "aisle", "rack", "shelve", "bin"].map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
  
          {formData.level !== "area" && (
            <div>
              <label>Parent Location:</label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Parent</option>
                {parentOptions[formData.level].map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
  
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="retired">Retired</option>
            </select>
          </div>
  
          <button type="submit">Create Location</button>
        </form>
      </div>
    );
  };
  
  export default LocationForm;
  