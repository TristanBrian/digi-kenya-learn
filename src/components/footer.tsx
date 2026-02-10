import { Link } from "react-router-dom";
import { GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  university: [
    { name: "About Us", href: "/about" },
    { name: "Academics", href: "/academics" },
    { name: "Admissions", href: "/admissions" },
    { name: "News & Events", href: "/news" },
  ],
  portals: [
    { name: "Student Portal", href: "/student" },
    { name: "Admin Dashboard", href: "/admin" },
    { name: "Fee Structure", href: "/fees" },
    { name: "Photo Gallery", href: "/gallery" },
  ],
  resources: [
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Sign In", href: "/auth" },
  ],
  contact: [
    { icon: Phone, text: "+254 700 123 456" },
    { icon: Mail, text: "info@digiuniversity.ac.ke" },
    { icon: MapPin, text: "Karen, Nairobi, Kenya" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-accent" />
              <span className="font-display text-xl font-semibold">DigiUniversity</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering the next generation through excellence in higher education, research, and digital innovation across Kenya and East Africa.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">University</h3>
            <ul className="space-y-3">
              {footerLinks.university.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Portals</h3>
            <ul className="space-y-3">
              {footerLinks.portals.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((item, i) => (
                <li key={i} className="flex items-center">
                  <item.icon className="h-4 w-4 text-accent mr-3 flex-shrink-0" />
                  <span className="text-primary-foreground/80 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">© {new Date().getFullYear()} DigiUniversity. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footerLinks.resources.map((link) => (
              <Link key={link.name} to={link.href} className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">{link.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
