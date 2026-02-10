import { Link } from "react-router-dom";
import { Car, Bike, Zap, ArrowRight } from "lucide-react";

const categories = [
  {
    type: "car",
    label: "Cars",
    description: "Sedans, SUVs, and luxury vehicles for every journey.",
    icon: Car,
    count: 5,
    from: "250 MAD",
  },
  {
    type: "moto",
    label: "Motorcycles",
    description: "Feel the wind on coastal roads and mountain passes.",
    icon: Bike,
    count: 2,
    from: "350 MAD",
  },
  {
    type: "trottinette",
    label: "Electric Scooters",
    description: "Eco-friendly urban mobility for city exploration.",
    icon: Zap,
    count: 2,
    from: "80 MAD",
  },
];

export function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-10 max-w-lg">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Choose your ride
        </h2>
        <p className="mt-2 text-muted-foreground">
          From luxury cars to eco-friendly scooters, we have the perfect vehicle for your trip.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.type}
              to={`/vehicles?type=${cat.type}`}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">{cat.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  From <span className="font-semibold text-primary">{cat.from}</span>/day
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
