const topics = [
  "React 19 (234)",

  "Remote Jobs (189)",

  "TypeScript (156)",

  "Côte d'Azur Tech (89)",
];

export default function TrendingTopics() {
  return (
    <div className="card bg-base-100 shadow border">
      <div className="card-body">
        <h2 className="text-sm font-bold">📈 SUJETS TENDANCE</h2>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <div key={topic} className="badge badge-primary badge-outline p-4">
              #{topic}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
