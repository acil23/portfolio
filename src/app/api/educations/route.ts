import { NextResponse } from "next/server";
import { fetchEducations } from "@/server/services/education.service";

export async function GET() {
  try {
    const educations = await fetchEducations();
    return NextResponse.json(educations, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch educations:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}