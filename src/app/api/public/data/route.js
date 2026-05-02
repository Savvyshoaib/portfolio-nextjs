import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    // Fetch all content items
    const { data: contentItems, error: contentError } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (contentError) {
      console.error("Content fetch error:", contentError);
      return NextResponse.json({ error: "Failed to fetch content." }, { status: 500 });
    }

    // Group content by type
    const groupedContent = {
      portfolio: [],
      services: [],
      blogPosts: [],
      other: []
    };

    contentItems?.forEach(item => {
      switch (item.type) {
        case 'portfolio':
          groupedContent.portfolio.push(item);
          break;
        case 'services':
          groupedContent.services.push(item);
          break;
        case 'blog':
          groupedContent.blogPosts.push(item);
          break;
        default:
          groupedContent.other.push(item);
      }
    });

    return NextResponse.json(groupedContent);

  } catch (error) {
    console.error("Public data API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
