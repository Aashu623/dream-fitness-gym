// /app/api/member/[id]/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { id } = params;

    const member = await db
      .collection("members")
      .findOne({ _id: new ObjectId(id) });
    if (!member) {
      return new Response(JSON.stringify({ error: "Member not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(member), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching member" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { id } = params;

    // Ensure id is valid
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }

    // Parse request body as JSON
    const memberData = await req.json();

    // Remove _id field from memberData if present
    const { _id, ...updateData } = memberData;

    console.log("Updating member with id:", id);
    console.log("Update data:", updateData);

    const result = await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "No changes made" }), {
        status: 304,
      });
    }

    return new Response(
      JSON.stringify({ message: "Member updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating member:", error);
    return new Response(JSON.stringify({ error: "Error updating member" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { id } = params;

    const result = await db
      .collection("members")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Member not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Member deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting member" }), {
      status: 500,
    });
  }
}
