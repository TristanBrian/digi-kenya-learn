import { Calendar, Users, UserCheck } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: "15+",
    label: "Years of Service"
  },
  {
    icon: UserCheck,
    value: "25+",
    label: "Qualified Teachers"
  },
  {
    icon: Users,
    value: "1:20",
    label: "Student-Teacher Ratio"
  }
];

export function StatisticsBar() {
  return (
    <section className="py-12 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full mb-4">
                <stat.icon className="h-6 w-6 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}