"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPlant() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    price: "",
    // Add other fields here...
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Write this logic manually to understand the API interaction
    const res = await fetch("/api/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin/plants"); // Redirect after success
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-2xl mb-4">Add New Plant</h1>
      <input 
        placeholder="Plant Name" 
        className="border p-2 w-full mb-2"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      {/* Add other inputs following the same pattern */}
      <button type="submit" className="bg-green-600 text-white p-2 mt-4">
        Save Plant
      </button>
    </form>
  );
}