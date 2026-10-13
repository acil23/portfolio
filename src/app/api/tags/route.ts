import { fetchTags } from "@/server/services/tag.service";
import { internalError, success } from "@/lib/api/response";

export async function GET() {
  try {
    const tags = await fetchTags();
    return success(tags);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return internalError();
  }
}
