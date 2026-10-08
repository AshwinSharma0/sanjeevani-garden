"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddDoctor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    fees: "",
    hospital: "",
    email: "",
    phone: "",
    availableDays: "", // Will be converted to array
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data
    const payload = {
      ...formData,
      experience: Number(formData.experience),
      fees: Number(formData.fees),
      availableDays: formData.availableDays.split(",").map((day) => day.trim()),
    };

    const res = await fetch("/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/doctors"); // Redirect after success
    } else {
      alert("Failed to add doctor");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Doctor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Doctor Name" 
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          placeholder="Specialization" 
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, specialization: e.target.value})} 
        />
        <input 
          placeholder="Experience (years)" type="number"
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, experience: e.target.value})} 
        />
        <input 
          placeholder="Fees" type="number"
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, fees: e.target.value})} 
        />
        <input 
          placeholder="Hospital" 
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, hospital: e.target.value})} 
        />
        <input 
          placeholder="Email" type="email"
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          placeholder="Phone" type="tel"
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
        />
        <input 
          placeholder="Available Days (comma separated: Mon, Wed, Fri)" 
          className="border p-2 w-full"
          onChange={(e) => setFormData({...formData, availableDays: e.target.value})} 
        />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Add Doctor
        </button>
      </form>
    </div>
  );
}

