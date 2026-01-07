"use client";

import Image from "next/image";
import posthog from "posthog-js";

export default function ExploreBtn() {
  return (
    <div>
      <div>
        <button onClick={() => posthog.capture("test_event")}>
          Click me for an event
        </button>
      </div>

      <button
        type="button"
        id="explore-btn"
        className="mt-7 mx-auto"
        onClick={() => posthog.capture("my event", { property: "value" })}
      >
        <a href="#events">
          Explore Events
          <Image
            src="/icons/arrow-down.svg"
            alt="arrow-down"
            width={24}
            height={24}
          />
        </a>
      </button>
    </div>
  );
}
