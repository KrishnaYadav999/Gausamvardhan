import React, { useState } from "react";

export default function PrivacyPolicy() {
  const [showAll, setShowAll] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        
        {/* HEADER */}
        <header className="p-8 border-b">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Privacy Policy
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Last updated on <strong>Nov 17th, 2025</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:shadow-sm"
              >
                Print
              </button>

              <button
                onClick={() => setShowAll((s) => !s)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:opacity-95"
              >
                {showAll ? "Collapse" : "Expand"}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-8 prose prose-slate max-w-none">
          <article className={`${showAll ? "" : "line-clamp-[50]"}`}>

            {/* INTRO */}
            <section>
              <h2>Introduction to Privacy Policy</h2>
              <p>
                This privacy policy (the "Privacy Policy") applies to your use of
                the website of Razorpay hosted at razorpay.com, the Services and
                Razorpay applications, but does not apply to any third party
                websites linked to them.
              </p>
              <p>
                The terms "we", "our" and "us" refer to Razorpay and the terms
                "you", "your" and "User" refer to you as a user of Razorpay.
              </p>
              <p>
                By visiting this Website, you agree to be bound by this Privacy
                Policy. If you do not agree, do not use the Website.
              </p>
            </section>

            {/* INFORMATION WE COLLECT */}
            <section>
              <h3>Information We Collect and How We Use It</h3>
              <p>
                We collect, receive and store your Personal Information. If you
                provide your third-party account credentials, you understand that
                some content may be transmitted to your account with us.
              </p>
            </section>

            {/* MERCHANT ACCOUNT INFO */}
            <section>
              <h3>Account Information of Merchants</h3>
              <p>
                When you create an account, we collect Personal Information such
                as your name, email, and phone number. We may also store your KYC
                documents.
              </p>
            </section>

            {/* CUSTOMER INFORMATION */}
            <section>
              <h3>Customer Information</h3>
              <p>
                We store customer information such as address, mobile number,
                email, and card details when payments are made through Razorpay
                checkout.
              </p>
            </section>

            {/* ACTIVITY */}
            <section>
              <h3>Activity</h3>
              <p>
                We record your usage information, including IP, searches, pages
                viewed, and timestamps for security and analytics.
              </p>
            </section>

            {/* INTELLECTUAL PROPERTY */}
            <section>
              <h3>Intellectual Property</h3>
              <p>
                All intellectual property associated with the Website belongs to
                Razorpay. No rights are transferred by viewing or downloading
                content.
              </p>
            </section>

            {/* COOKIES */}
            <section>
              <h3>Cookies</h3>
              <p>
                We use cookies to uniquely identify your browser and improve our
                service. You may disable cookies but some services may not work.
              </p>
            </section>

            {/* ENFORCEMENT */}
            <section>
              <h3>Enforcement</h3>
              <p>
                We may use your information to investigate, enforce, and apply
                our terms and conditions and Privacy Policy.
              </p>
            </section>

            {/* TRANSFER OF INFORMATION */}
            <section>
              <h3>Transfer of Information</h3>
              <p>
                We do not share your Personal Information with any third party
                except as required with financial institutions, regulatory bodies,
                or service providers.
              </p>
            </section>

            {/* 🔥 NEW SECTIONS YOU ADDED BELOW 🔥 */}
            <section>
              <h3>Links</h3>
              <p>
                References to any names, marks, products or services of third
                parties or hyperlinks to third party websites are provided solely
                for convenience. We do not endorse or take responsibility for such
                sites.
              </p>
            </section>

            <section>
              <h3>User Access of Personal Information</h3>
              <p>
                As a registered User, you can modify your Personal Information by
                accessing the "Account" section of the Website.
              </p>
            </section>

            <section>
              <h3>Security</h3>
              <p>
                Your account is password-protected. We use industry-standard
                security practices. However, Razorpay is not responsible for any
                intercepted information sent via the internet.
              </p>
            </section>

            <section>
              <h3>Terms and Modifications to This Privacy Policy</h3>
              <p>
                Our Privacy Policy may change at any time without notice. Please
                review periodically.
              </p>
            </section>

            <section>
              <h3>Applicable Law</h3>
              <p>
                The Privacy Policy is governed by Indian law. Any disputes shall
                be under Bengaluru court jurisdiction.
              </p>
            </section>

            <section>
              <h3>Complaints and Grievance Redressal</h3>
              <p>For complaints or concerns, contact:</p>
              <p>
                <strong>DPO:</strong> Mr. SHASHANK KARINCHETI <br />
                Razorpay Software Private Limited <br />
                Address: No. 22, 1st Floor, SJR Cyber, Laskar - Hosur Road,
                Adugodi, Bangalore - 560030 <br />
                Phone: 080-46669555 <br />
                Email: dpo@razorpay.com <br />
                Grievances portal: https://razorpay.com/grievances/
              </p>
            </section>

            {/* ACCEPTANCE DETAILS */}
            <section>
              <h3>Acceptance Details</h3>
              <p><strong>Owner Id:</strong> RgIz4AQu2p8lGN</p>
              <p><strong>Owner Name:</strong> SIDDHARTH MEP PRIVATE LIMITED</p>
              <p><strong>IP Address:</strong> 10.26.127.14</p>
              <p><strong>Date Of Acceptance:</strong> 2025-11-16 12:27:29 IST</p>
              <p><strong>Signatory Name:</strong> MANGESH GOUND</p>
              <p><strong>Contact Number:</strong> +918097675222</p>
              <p><strong>Email:</strong> info.siddharthmep@gmail.com</p>
            </section>

            <footer className="mt-8 pt-6 border-t">
              <p className="text-sm text-slate-600">
                If you have questions about this Privacy Policy, please contact
                us through our support channels.
              </p>
            </footer>
          </article>
        </main>
      </div>
    </div>
  );
}
