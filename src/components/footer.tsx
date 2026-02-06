import { Link } from "react-router-dom";
import { GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const footerLinks = {
  school: [
    { name: "About Us", href: "/about" },
    { name: "Academics", href: "/academics" },
    { name: "Admissions", href: "/admissions" },
    { name: "News & Events", href: "/news" },
  ],
  portals: [
    { name: "Student Portal", href: "/student" },
    { name: "Fee Structure", href: "/fees" },
    { name: "Photo Gallery", href: "/gallery" },
    { name: "Contact Us", href: "/contact" },
  ],
  contact: [
    { icon: Phone, text: "+254 700 123 456" },
    { icon: Mail, text: "info@digischool.co.ke" },
    { icon: MapPin, text: "Karen, Nairobi, Kenya" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-accent" />
              <span className="font-display text-xl font-semibold">
                DigiSchool
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Empowering the next generation through excellence in education, 
              character development, and digital innovation.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          {/* School Links */}
          <div>
            <h3 className="font-semibold mb-4">School</h3>
            <ul className="space-y-3">
              {footerLinks.school.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-accent text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.portals.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-accent text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <li key={index} className="flex items-center">
                    <IconComponent className="h-4 w-4 text-accent mr-3 flex-shrink-0" />
                    <span className="text-primary-foreground/80 text-sm">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 DigiSchool. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}