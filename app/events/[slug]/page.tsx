import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

function EventDetailItem({
  icon,
  alt,
  lable,
}: {
  icon: string;
  alt: string;
  lable: string;
}) {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{lable}</p>
    </div>
  );
}

function EventAgenda({ agendaItems }: { agendaItems: string[] }) {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function EventTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>
          {tag}
        </div>
      ))}
    </div>
  );
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {
    event: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      organizer,
    },
  } = await request.json();
  if (!description) {
    return notFound();
  }

  const bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/*left side- event content*/}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              lable={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" lable={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" lable={location} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              lable={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/*right side- booking form*/}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book your Spot</h2>
            {bookings > 0 ? (
              <p>Join {bookings} people who have already booked their spot!</p>
            ) : (
              <p className="text-sm">Be the first to book your spot! </p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
}
