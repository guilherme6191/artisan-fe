import { createClient } from "src/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get URL and search params
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") ?? "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: leads,
    error,
    count,
  } = await supabase
    .from("leads")
    .select("*", { count: "exact" })
    .range(from, to)
    .ilike("name", `%${search}%`);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return the paginated leads data
  return NextResponse.json({
    leads: leads,
    count: count,
  });
}
