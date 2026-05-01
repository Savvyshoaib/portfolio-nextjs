import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/cms/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request) {
  const auth = await requireAdminApiUser(request);
  if (auth.response) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // 'logo' or 'favicon'

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!type || !["logo", "favicon"].includes(type)) {
      return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = {
      logo: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
      favicon: ["image/x-icon", "image/png", "image/svg+xml"]
    };

    if (!allowedTypes[type].includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type for ${type}. Allowed types: ${allowedTypes[type].join(", ")}` 
      }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 5MB." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient({ useServiceRole: true });
    if (!supabase) {
      return NextResponse.json({ error: "Supabase configuration error." }, { status: 500 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    const filePath = `site-assets/${fileName}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("assets")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("assets")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    return NextResponse.json({ 
      ok: true, 
      url: publicUrl,
      path: filePath 
    });

  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
