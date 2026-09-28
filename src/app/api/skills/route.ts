import { NextResponse } from "next/server";
import { fetchSkills } from "@/server/services/skill.service";

export async function GET() {
  try {
    const skills = await fetchSkills();
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch skills:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}