import { createClient } from "src/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const engaged = searchParams.get("engaged");
  const stage = searchParams.get("stage");
  const sortBy = searchParams.get("sortBy") || "name";
  const search = searchParams.get("search") ?? "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase.from("leads").select("*", { count: "exact" });

  // filters
  if (search) {
    query = query.or(
      `name.ilike.%${search}%, email.ilike.%${search}%, company.ilike.%${search}%`
    );
  }
  if (stage) {
    query = query.eq("stage", stage);
  }
  if (engaged === "true" || engaged === "false") {
    query = query.eq("engaged", engaged === "true");
  }

  // sorting
  query = query.order(sortBy, { ascending: true });
  // pagination
  query = query.range(from, to);

  // execute query
  const { data: leads, error, count } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    leads: leads,
    count: count,
  });
}

/**
 * Generate a random ID for the lead to workaround issue with supabase auto-incrementing ID
  code: '23505',
  details: 'Key (id)=(5) already exists.',
  hint: null,
  message: 'duplicate key value violates unique constraint "leads_pkey"'
 */
function generateRandomId() {
  return Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const leadData = await request.json();

    if (!leadData.name || !leadData.email || !leadData.company) {
      return NextResponse.json(
        { error: "Name, email, and company are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          id: generateRandomId(),
          ...leadData,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/leads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
