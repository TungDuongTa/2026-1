"use client";

import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react";

export default function BookEvent({
  eventId,
  slug,
}: {
  eventId: string;
  slug: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, error } = await createBooking({ eventId, slug, email });
    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", { eventId, slug, email });
    } else {
      console.error("Booking submission failed", error);
      posthog.captureException(error);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm"> Thank you for signing up </p>
      ) : (
        <form>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="button-submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
