import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CMS_AUTH_COOKIES } from "@/lib/cms/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(CMS_AUTH_COOKIES.accessToken)?.value;

  if (!accessToken) {
    redirect("/admin/login");
  }

  const supabase = createSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser(accessToken);
    if (!data?.user) {
      redirect("/admin/login");
    }
  }

  // User is authenticated, show dashboard
  redirect("/admin/dashboard");
}
