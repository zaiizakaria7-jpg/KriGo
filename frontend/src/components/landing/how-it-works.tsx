import { Search, CalendarDays, CreditCard, Car } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Choose",
    description: "Explore our fleet and find the vehicle that matches your needs and budget.",
  },
  {
    icon: CalendarDays,
    title: "Pick Your Dates",
    description: "Select your rental period. We show real-time availability so you never miss out.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay with credit card, PayPal, or choose cash on delivery. Your choice.",
  },
  {
    icon: Car,
    title: "Hit the Road",
    description: "Pick up your vehicle and start your Moroccan adventure. It is that easy.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          How it works
        </h2>
        <p className="mt-2 text-muted-foreground">
          Four simple steps to get you on the road.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="text-center">
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
