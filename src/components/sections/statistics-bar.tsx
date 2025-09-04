import { Calendar, Users, UserCheck, Award, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const stats = [
  {
    icon: Calendar,
    value: 17,
    suffix: "+",
    label: "Years of Excellence",
    description: "Serving Kenya's education needs"
  },
  {
    icon: UserCheck,
    value: 25,
    suffix: "+",
    label: "Expert Teachers",
    description: "Highly qualified educators"
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Happy Students",
    description: "Growing learner community"
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Success Rate",
    description: "Academic achievement"
  },
  {
    icon: TrendingUp,
    value: 95,
    suffix: "%",
    label: "Parent Satisfaction",
    description: "Family trust rating"
  }
];

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(value * easeOutQuart));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
      {count}{suffix}
    </div>
  );
}

export function StatisticsBar() {
  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow/20 to-primary opacity-50" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent-light to-accent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Our Achievements Speak
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Building excellence through measurable results
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 backdrop-blur-sm rounded-full mb-4 group-hover:scale-110 transition-all duration-300 group-hover:shadow-accent">
                <stat.icon className="h-8 w-8 text-accent group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="text-primary-foreground font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-primary-foreground/70 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}