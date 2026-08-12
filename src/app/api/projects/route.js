import { NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "project-plan-finder";
const COLLECTION = "project";

// GET /api/projects -> returns all projects
export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db(DB_NAME);
    const projects = await db
      .collection(COLLECTION)
      .find({})
      .toArray();

    // Mongo adds _id (ObjectId); convert it to a string so the
    // frontend can serialize it without issues.
    const safe = projects.map((p) => ({ ...p, _id: p._id.toString() }));

    return NextResponse.json(safe);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

// PUT /api/projects -> replaces the entire project list
export async function PUT(request) {
  try {
    const projects = await request.json();

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Expected an array of projects" },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Simple strategy: delete everything and re-insert.
    await collection.deleteMany({});

    if (projects.length > 0) {
      // Strip any old _id so Mongo generates a new one
      const toInsert = projects.map(({ _id, ...rest }) => rest);
      await collection.insertMany(toInsert);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save the project list" },
      { status: 500 }
    );
  }
}