import { NextResponse } from "next/server";
import Plant from "@/backend/models/Plant";
import { connectDB } from "@/lib/mongodb";

// Get all plants
export async function GET() {
  try {
    await connectDB();
    const plants = await Plant.find();
    return NextResponse.json(plants);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plants" }, { status: 500 });
  }
}

// Create a new plant
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const plant = await Plant.create(body);
    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create plant" }, { status: 500 });
  }
}