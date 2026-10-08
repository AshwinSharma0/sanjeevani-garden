import { NextResponse } from "next/server";
import Doctor from "@/backend/models/Doctor";
import { connectDB } from "@/lib/mongodb";

// Get a specific doctor
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });
  }
}

// Update a specific doctor
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    return NextResponse.json({ message: "Updated", doctor: updatedDoctor });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// Delete a specific doctor
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    await Doctor.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
