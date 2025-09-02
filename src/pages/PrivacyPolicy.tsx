import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              How we protect and use your information
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Data Collection and Usage
              </h2>
              <p className="text-muted-foreground mb-6">
                DigiSchool collects personal information for admissions, payments, and communication purposes only. 
                We store student names, contact details, academic records, and payment information securely in our 
                encrypted database systems.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Information Security
              </h2>
              <p className="text-muted-foreground mb-6">
                All data is stored securely using industry-standard encryption. Payment information is processed 
                through secure M-Pesa integrations and is not stored on our servers. Access to student information 
                is restricted to authorized school staff only.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Parent Rights
              </h2>
              <p className="text-muted-foreground mb-6">
                Parents have the right to view, update, or request deletion of their child's information. 
                You may contact us at any time to exercise these rights or ask questions about data usage.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Communication
              </h2>
              <p className="text-muted-foreground mb-6">
                We use contact information to send important school updates, payment confirmations, and 
                academic progress reports. You may opt out of non-essential communications at any time.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Data Retention
              </h2>
              <p className="text-muted-foreground mb-6">
                Student records are retained for 7 years after graduation as required by educational regulations. 
                Payment records are kept for 5 years for accounting purposes.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact for Privacy Concerns
              </h2>
              <p className="text-muted-foreground mb-6">
                For any privacy-related questions or concerns, please contact us at [SCHOOL_EMAIL] or 
                call [SCHOOL_PHONE]. We are committed to addressing your concerns promptly and transparently.
              </p>

              <p className="text-sm text-muted-foreground mt-8 p-4 bg-muted/30 rounded-lg">
                This privacy policy complies with Kenya's Data Protection Act 2019. Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;