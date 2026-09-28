import { NextResponse } from "next/server";
import { fetchSiteProfile } from "@/server/services/site-profile.service";

export async function GET() {
  try {
    const siteProfile = await fetchSiteProfile();

    if (!siteProfile) {
      return NextResponse.json(
        { message: "Site profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(siteProfile, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch site profile:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}