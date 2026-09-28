import { NextResponse } from "next/server";
import { fetchPublishedProjects } from "@/server/services/project.service";

export async function GET() {
  try {
    const projects = await fetchPublishedProjects();

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}