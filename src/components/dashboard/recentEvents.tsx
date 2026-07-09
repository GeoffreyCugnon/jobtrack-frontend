// src/components/dashboard/RecentEvents.tsx
interface EventItem {
  id: number;
  text: string;
}

interface RecentEventsProps {
  events: EventItem[];
}

export function RecentEvents({ events }: RecentEventsProps) {
  return (
    <>
      <h2 className="text-sm uppercase tracking-wide text-gray-600 mb-3">
        Derniers Événements
      </h2>
      
      {/* Remplacement par les classes card de daisyUI */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-4 space-y-2 text-sm">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-2">
              <span className="text-base-content/40">•</span>
              <span className="text-base-content/80">{event.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}