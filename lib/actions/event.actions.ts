"use server";

import { Event, IEvent } from "@/database";
import connectDB from "../mongodb";

export async function getSimilarEventBySlug(slug: string): Promise<IEvent[]> {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });
    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean<IEvent[]>();
  } catch {
    return [];
  }
}
