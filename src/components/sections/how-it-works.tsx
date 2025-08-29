import { ArrowRight, FileText, MapPin, CreditCard, BookOpen } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Apply Online",
    description: "Complete our simple online application form"
  },
  {
    icon: MapPin,
    title: "Visit School",
    description: "Schedule a tour to see our facilities"
  },
  {
    icon: CreditCard,
    title: "Pay Fees via M-Pesa",
    description: "Convenient mobile payment with instant receipts"
  },
  {
    icon: BookOpen,
    title: "Start Class",
    description: "Begin your child's educational journey with us"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple steps to join our school community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <step.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-2 transform translate-x-full">
                  <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}