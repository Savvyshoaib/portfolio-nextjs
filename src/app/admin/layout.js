import { getAdminNoIndexMetadata } from "@/lib/cms/public";

export const metadata = getAdminNoIndexMetadata();

export default function AdminRootLayout({ children }) {
  return children;
}

