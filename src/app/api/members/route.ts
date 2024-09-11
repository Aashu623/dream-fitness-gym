// /app/api/member/route.js
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const members = await db.collection("members").find({}).toArray();
    return new Response(JSON.stringify(members), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching members" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const memberData = await req.json();

    const result = await db.collection("members").insertOne(memberData);

    // Return the inserted member data along with the insertedId
    return new Response(
      JSON.stringify({ ...memberData, _id: result.insertedId }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating member" }), {
      status: 500,
    });
  }
}
