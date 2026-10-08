import { NextResponse } from "next/server";
import Plant from "@/backend/models/Plant";
import { connectDB } from "@/lib/mongodb";

// Get a specific plant
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const plant = await Plant.findById(id);
    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }
    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plant" }, { status: 500 });
  }
}

// Edit a specific plant
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    const updatedPlant = await Plant.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedPlant);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// Delete a specific plant
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await params;
    
    await Plant.findByIdAndDelete(id);
    return NextResponse.json({ message: "Plant deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
