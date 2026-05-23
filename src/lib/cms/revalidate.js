import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

const PUBLIC_PATHS = ["/", "/services", "/portfolio", "/blog", "/contact", "/robots.txt"];

export function revalidatePublicSite() {
  // Root layout drives favicon, header, footer, and shared metadata.
  revalidatePath("/", "layout");

  PUBLIC_PATHS.forEach((path) => {
    revalidatePath(path);
    revalidatePath(path, "layout");
  });

  // Revalidate dynamic detail routes to avoid stale 404s after slug/content updates.
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/portfolio/[slug]", "page");
  revalidatePath("/blog/[slug]", "page");

  revalidateTag("cms-settings");
  revalidateTag("site-data");
}

