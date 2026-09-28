import { NextResponse } from "next/server";
import { fetchExperiences } from "@/server/services/experience.service";

export async function GET() {
  try {
    const experiences = await fetchExperiences();
    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch experiences:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}