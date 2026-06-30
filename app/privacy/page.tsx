import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for rmoddel.com and related projects published by Reuben Moddel.",
  alternates: {
    canonical: "/privacy"
  }
};

const lastUpdated = "June 17, 2026";

export default function PrivacyPage() {
  return (
    <main className="pageShell">
      <SiteHeader />

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Privacy Policy</p>
          <h1>rmoddel.com and Related Projects</h1>
        </div>

        <p className="sectionIntro">
          This Privacy Policy applies to rmoddel.com, its contact forms, and
          related software projects, tools, and browser extensions published by
          Reuben Moddel. It is written to function as a general site policy
          while also preserving the current disclosures for the Breaze Commerce
          Importer Chrome extension.
        </p>

        <div className="twoColumn">
          <div className="contentCard">
            <p className="microLabel">Publisher</p>
            <h3>Owner and operator</h3>
            <p>
              Reuben Moddel owns and operates this website and may also publish
              related software tools, internal systems, client-facing utilities,
              and browser extensions. If you have privacy questions, use the
              contact form on <a href="/#contact">rmoddel.com</a>.
            </p>
          </div>

          <div className="contentCard">
            <p className="microLabel">Last Updated</p>
            <h3>{lastUpdated}</h3>
            <p>
              This policy is intended to be broad enough for general site use
              and specific enough to satisfy Chrome Web Store disclosure needs
              when the Breaze Commerce Importer extension is active or re-released.
            </p>
          </div>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Website Data</p>
          <h2>What this website may collect</h2>
        </div>
        <p className="sectionIntro">
          If you contact Reuben Moddel through this website, the site may
          collect the information you choose to submit, such as your name,
          email address, phone number, business context, project description,
          budget range, and timeline. That information is used only to review
          inquiries, respond to requests, and discuss potential work.
        </p>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Data Collection</p>
          <h2>What may be collected and stored</h2>
        </div>

        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>Contact and inquiry details</h3>
            <p>
              Information submitted through forms or direct communication may be
              retained so inquiries can be reviewed, answered, and followed up on.
            </p>
          </article>

          <article className="contentCard">
            <h3>Basic operational data</h3>
            <p>
              Hosting, email, analytics, form delivery, and security providers
              may process limited technical data such as IP address, browser
              information, timestamps, or request metadata as part of normal site operation.
            </p>
          </article>

          <article className="contentCard">
            <h3>No third-party sale or profiling</h3>
            <p>
              Personal information is not sold, rented, or used to build
              unrelated advertising profiles.
            </p>
          </article>

          <article className="contentCard">
            <h3>Project-specific tools may differ</h3>
            <p>
              If a separate software project, client system, or extension has
              more specific data handling behavior, that behavior may be
              documented here or in project-specific notices.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Data Use</p>
          <h2>How information may be used</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>Communication and service delivery</h3>
            <p>
              Information may be used to respond to inquiries, scope projects,
              provide services, troubleshoot issues, and maintain normal business communication.
            </p>
          </article>

          <article className="contentCard">
            <h3>Nothing beyond the stated purpose</h3>
            <p>
              Data is used only for the specific business, operational, or
              technical purpose for which it was provided or collected.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Data Sharing</p>
          <h2>Who may receive the data</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>Service providers</h3>
            <p>
              Information may be processed by hosting, form, email, analytics,
              or infrastructure providers only to the extent needed to operate
              the website or related project.
            </p>
          </article>

          <article className="contentCard">
            <h3>No unrelated third parties</h3>
            <p>
              Information is not shared with data brokers, advertisers, or
              unrelated outside parties except where required by law.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Extension-Specific Disclosure</p>
          <h2>Breaze Commerce Importer</h2>
        </div>
        <p className="sectionIntro">
          The following section preserves the current disclosures for the
          Breaze Commerce Importer Chrome extension so this page remains
          sufficient if that extension is re-released.
        </p>
        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>What the extension does</h3>
            <p>
              Breaze Commerce Importer reads order details from supported
              retailer order pages and sends that information to the
              user&apos;s configured Breaze server so the order can be imported
              without manual OCR entry.
            </p>
          </article>

          <article className="contentCard">
            <h3>Local settings</h3>
            <p>
              The extension stores the user&apos;s Breaze API URL and login token
              locally in Chrome storage so the user does not need to re-enter
              them each time.
            </p>
          </article>

          <article className="contentCard">
            <h3>Retailer page data</h3>
            <p>
              The extension reads order details from supported Amazon and Best
              Buy pages only when the user activates the extension for import.
            </p>
          </article>

          <article className="contentCard">
            <h3>Import processing</h3>
            <p>
              Order data is sent only to the Breaze API server specified by the
              user so the selected order can be imported into Breaze Commerce.
            </p>
          </article>

          <article className="contentCard">
            <h3>No third-party sale or profiling</h3>
            <p>
              The extension does not sell personal information, build
              advertising profiles, or use collected data for unrelated analytics.
            </p>
          </article>

          <article className="contentCard">
            <h3>Permissions context</h3>
            <p>
              Host access and active tab permissions are used to read supported
              retailer order pages. Storage is used for local settings, and
              scripting is used to run extraction logic when the user initiates a scan.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Contact</p>
          <h2>Questions, requests, or removal inquiries</h2>
        </div>
        <p className="sectionIntro">
          For privacy questions about this website or any related tool,
          extension, or project published by Reuben Moddel, use the contact
          form at <a href="/#contact">rmoddel.com</a>.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
