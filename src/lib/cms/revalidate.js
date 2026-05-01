import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

const PUBLIC_PATHS = ["/", "/services", "/portfolio", "/blog", "/contact", "/robots.txt"];

export function revalidatePublicSite() {
  // Revalidate all public paths
  PUBLIC_PATHS.forEach((path) => {
    revalidatePath(path);
  });
  
  // Revalidate layout and metadata
  revalidatePath("/layout");
  revalidateTag("cms-settings");
  revalidateTag("site-data");
}

