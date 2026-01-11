import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type routeParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: routeParams) {
  try {
    await connectDB();

    const { slug } = await params;
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid slug parameter" },
        { status: 400 }
      );
    }
    const sanitizedSlug = slug.trim().toLowerCase();
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes("MONGODB_URI")) {
        return NextResponse.json(
          {
            message:
              "Database connection error. Please check your MONGODB_URI.",
          },
          { status: 500 }
        );
      }
    }
  }
}
