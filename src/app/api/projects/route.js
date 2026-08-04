import { NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "project-plan-finder";
const COLLECTION = "project";

// GET /api/projects -> devuelve todos los proyectos
export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db(DB_NAME);
    const projects = await db
      .collection(COLLECTION)
      .find({})
      .toArray();

    // Mongo agrega _id (ObjectId), lo convertimos a string para que el
    // frontend lo pueda serializar sin problemas.
    const safe = projects.map((p) => ({ ...p, _id: p._id.toString() }));

    return NextResponse.json(safe);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "No se pudieron cargar los proyectos" },
      { status: 500 }
    );
  }
}

// PUT /api/projects -> reemplaza toda la lista de proyectos
export async function PUT(request) {
  try {
    const projects = await request.json();

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Se esperaba un arreglo de proyectos" },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Estrategia simple: borrar todo y volver a insertar.
    await collection.deleteMany({});

    if (projects.length > 0) {
      // Quitamos cualquier _id viejo para que Mongo genere uno nuevo
      const toInsert = projects.map(({ _id, ...rest }) => rest);
      await collection.insertMany(toInsert);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "No se pudo guardar la lista de proyectos" },
      { status: 500 }
    );
  }
}