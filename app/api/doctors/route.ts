import { NextResponse } from "next/server";
import Doctor from "@/backend/models/Doctor";
import { connectDB } from "@/lib/mongodb";

// Get all doctors
export async function GET() {
  try {
    await connectDB();
    const doctors = await Doctor.find();
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

// Create a new doctor
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const doctor = await Doctor.create(body);
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}