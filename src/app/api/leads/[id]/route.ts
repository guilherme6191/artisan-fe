import { createClient } from "src/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    if (id.includes(",")) {
      const ids = id.split(",");
      const { error } = await supabase.from("leads").delete().in("id", ids);

      if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        { message: `${ids.length} leads deleted successfully` },
        { status: 200 }
      );
    } else {
      const { error } = await supabase.from("leads").delete().eq("id", id);

      if (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        { message: "Lead deleted successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const leadData = await request.json();

    // Update the lead
    const { data, error } = await supabase
      .from("leads")
      .update(leadData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lead:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in PATCH /api/leads/${await params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
