import { createClient } from "src/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get URL and search params
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

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
    .range(from, to);

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

// // Sample data based on the screenshot
// const leadsData = [
//   {
//     id: 1,
//     name: "Emma Blake",
//     email: "emma.blake@flux.com",
//     company: "Flux Technologies Ltd.",
//     stage: 2,
//     engaged: false,
//     lastContacted: "23 Jan, 2025",
//     initials: "EB",
//   },
//   {
//     id: 2,
//     name: "Aria Frost",
//     email: "aria.frost@prism.com",
//     company: "Prism Tech Pvt. Ltd.",
//     stage: 2,
//     engaged: false,
//     lastContacted: "23 Jan, 2025",
//     initials: "AF",
//   },
//   {
//     id: 3,
//     name: "Noah Chen",
//     email: "noah.chen@apex.com",
//     company: "Apex Technologies",
//     stage: 3,
//     engaged: false,
//     lastContacted: "-",
//     initials: "NC",
//   },
//   {
//     id: 4,
//     name: "Zara West",
//     email: "zara.west@cube.com",
//     company: "Cube",
//     stage: 3,
//     engaged: false,
//     lastContacted: "-",
//     initials: "ZW",
//   },
//   {
//     id: 5,
//     name: "Felix Gray",
//     email: "felix.gray@nova.com",
//     company: "Nova Corporation",
//     stage: 2,
//     engaged: false,
//     lastContacted: "16 Jan, 2025",
//     initials: "FG",
//   },
//   {
//     id: 6,
//     name: "Milo Park",
//     email: "milo.park@echo.com",
//     company: "Echo",
//     stage: 2,
//     engaged: true,
//     lastContacted: "16 Jan, 2025",
//     initials: "MP",
//   },
//   {
//     id: 7,
//     name: "Ruby Shaw",
//     email: "ruby.shaw@wave.com",
//     company: "Wave Technologies",
//     stage: 3,
//     engaged: false,
//     lastContacted: "-",
//     initials: "RS",
//   },
//   {
//     id: 8,
//     name: "Leo Walsh",
//     email: "leo.walsh@peak.com",
//     company: "Peak Systems",
//     stage: 2,
//     engaged: true,
//     lastContacted: "4 Jan, 2025",
//     initials: "LW",
//   },
//   {
//     id: 9,
//     name: "Iris Cole",
//     email: "iris.cole@drift.com",
//     company: "Drift Analytics",
//     stage: 4,
//     engaged: true,
//     lastContacted: "4 Jan, 2025",
//     initials: "IC",
//   },
//   {
//     id: 10,
//     name: "Finn Hayes",
//     email: "finn.hayes@core.com",
//     company: "Core Innovations",
//     stage: 3,
//     engaged: true,
//     lastContacted: "4 Jan, 2025",
//     initials: "FH",
//   },

//   {
//     id: 11,
//     name: "Olivia Martinez",
//     email: "olivia.martinez@stellar.com",
//     company: "Stellar Systems",
//     stage: 1,
//     engaged: false,
//     lastContacted: "2 Jan, 2025",
//     initials: "OM",
//   },
//   {
//     id: 12,
//     name: "Ethan Johnson",
//     email: "ethan.johnson@quantum.com",
//     company: "Quantum Solutions",
//     stage: 2,
//     engaged: true,
//     lastContacted: "5 Jan, 2025",
//     initials: "EJ",
//   },
//   {
//     id: 13,
//     name: "Sophia Lee",
//     email: "sophia.lee@vertex.com",
//     company: "Vertex Inc.",
//     stage: 3,
//     engaged: false,
//     lastContacted: "8 Jan, 2025",
//     initials: "SL",
//   },
//   {
//     id: 14,
//     name: "William Brown",
//     email: "william.brown@nexus.com",
//     company: "Nexus Technologies",
//     stage: 4,
//     engaged: true,
//     lastContacted: "10 Jan, 2025",
//     initials: "WB",
//   },
//   {
//     id: 15,
//     name: "Ava Wilson",
//     email: "ava.wilson@pulse.com",
//     company: "Pulse Digital",
//     stage: 1,
//     engaged: false,
//     lastContacted: "12 Jan, 2025",
//     initials: "AW",
//   },
//   {
//     id: 16,
//     name: "James Taylor",
//     email: "james.taylor@orbit.com",
//     company: "Orbit Systems",
//     stage: 2,
//     engaged: true,
//     lastContacted: "15 Jan, 2025",
//     initials: "JT",
//   },
//   {
//     id: 17,
//     name: "Charlotte Davis",
//     email: "charlotte.davis@horizon.com",
//     company: "Horizon Tech",
//     stage: 3,
//     engaged: false,
//     lastContacted: "18 Jan, 2025",
//     initials: "CD",
//   },
//   {
//     id: 18,
//     name: "Benjamin Miller",
//     email: "benjamin.miller@spark.com",
//     company: "Spark Innovations",
//     stage: 4,
//     engaged: true,
//     lastContacted: "20 Jan, 2025",
//     initials: "BM",
//   },
//   {
//     id: 19,
//     name: "Amelia Garcia",
//     email: "amelia.garcia@fusion.com",
//     company: "Fusion Labs",
//     stage: 1,
//     engaged: false,
//     lastContacted: "22 Jan, 2025",
//     initials: "AG",
//   },
//   {
//     id: 20,
//     name: "Lucas Rodriguez",
//     email: "lucas.rodriguez@atlas.com",
//     company: "Atlas Corporation",
//     stage: 2,
//     engaged: true,
//     lastContacted: "24 Jan, 2025",
//     initials: "LR",
//   },
//   {
//     id: 21,
//     name: "Harper Thompson",
//     email: "harper.thompson@zenith.com",
//     company: "Zenith Solutions",
//     stage: 3,
//     engaged: false,
//     lastContacted: "26 Jan, 2025",
//     initials: "HT",
//   },
//   {
//     id: 22,
//     name: "Mason White",
//     email: "mason.white@vortex.com",
//     company: "Vortex Systems",
//     stage: 4,
//     engaged: true,
//     lastContacted: "28 Jan, 2025",
//     initials: "MW",
//   },
//   {
//     id: 23,
//     name: "Evelyn Clark",
//     email: "evelyn.clark@aurora.com",
//     company: "Aurora Tech",
//     stage: 1,
//     engaged: false,
//     lastContacted: "30 Jan, 2025",
//     initials: "EC",
//   },
//   {
//     id: 24,
//     name: "Logan Lewis",
//     email: "logan.lewis@summit.com",
//     company: "Summit Innovations",
//     stage: 2,
//     engaged: true,
//     lastContacted: "1 Feb, 2025",
//     initials: "LL",
//   },
//   {
//     id: 25,
//     name: "Abigail Walker",
//     email: "abigail.walker@nebula.com",
//     company: "Nebula Systems",
//     stage: 3,
//     engaged: false,
//     lastContacted: "3 Feb, 2025",
//     initials: "AW",
//   },
//   {
//     id: 26,
//     name: "Jackson Hall",
//     email: "jackson.hall@polaris.com",
//     company: "Polaris Technologies",
//     stage: 4,
//     engaged: true,
//     lastContacted: "5 Feb, 2025",
//     initials: "JH",
//   },
//   {
//     id: 27,
//     name: "Scarlett Young",
//     email: "scarlett.young@eclipse.com",
//     company: "Eclipse Solutions",
//     stage: 1,
//     engaged: false,
//     lastContacted: "7 Feb, 2025",
//     initials: "SY",
//   },
//   {
//     id: 28,
//     name: "Aiden King",
//     email: "aiden.king@cosmos.com",
//     company: "Cosmos Digital",
//     stage: 2,
//     engaged: true,
//     lastContacted: "9 Feb, 2025",
//     initials: "AK",
//   },
// ];
// GET handler to fetch all contacts
