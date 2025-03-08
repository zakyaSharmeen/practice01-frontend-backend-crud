import React, { useEffect, useState } from "react";
import "./App.css"

const API_URL = "http://localhost:5000/items";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch items from API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Add Item
  const handleAdd = async () => {
    const itemData = { name, price };
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      setName("");
      setPrice("");
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Update Item
  const handleUpdate = async () => {
    const itemData = { name, price };
    try {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      setEditingId(null);
      setName("");
      setPrice("");
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Edit Item
  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setEditingId(item._id);
  };

  return (
    <div style={{  margin: "50px auto", textAlign: "center"}}>
     <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
     <h2  style={{ marginBottom: "20px"}}>CRUD App</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px"}}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"} Item</button>
      </form>
      
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
     </div>
    </div>
  );
}

export default App;
