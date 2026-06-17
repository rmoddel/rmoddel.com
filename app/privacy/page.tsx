import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Breaze Commerce Importer Chrome extension, published by Reuben Moddel.",
  alternates: {
    canonical: "/privacy"
  }
};

const lastUpdated = "June 17, 2026";

export default function PrivacyPage() {
  return (
    <main className="pageShell">
      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Privacy Policy</p>
          <h1>Breaze Commerce Importer</h1>
        </div>

        <p className="sectionIntro">
          This Privacy Policy applies to the Breaze Commerce Importer Chrome
          extension. The extension is developed and published by Reuben Moddel
          and this website serves as its public policy and contact point.
        </p>

        <div className="twoColumn">
          <div className="contentCard">
            <p className="microLabel">Developer</p>
            <h3>Owner and publisher</h3>
            <p>
              Reuben Moddel is the developer and publisher of Breaze Commerce
              Importer. If you have privacy questions, use the contact form on
              this website at <a href="/#contact">rmoddel.com</a>.
            </p>
          </div>

          <div className="contentCard">
            <p className="microLabel">Last Updated</p>
            <h3>{lastUpdated}</h3>
            <p>
              This policy is intended to satisfy Chrome Web Store disclosure
              requirements for the extension.
            </p>
          </div>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">What The Extension Does</p>
          <h2>Single-purpose data handling</h2>
        </div>
        <p className="sectionIntro">
          Breaze Commerce Importer reads order details from supported retailer
          order pages and sends that information to the user&apos;s configured
          Breaze server so the order can be imported without manual OCR entry.
        </p>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Data Collection</p>
          <h2>What is collected and stored</h2>
        </div>

        <div className="grid twoGrid">
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
            <h3>No third-party sale or profiling</h3>
            <p>
              The extension does not sell personal information, build advertising
              profiles, or use collected data for unrelated analytics.
            </p>
          </article>

          <article className="contentCard">
            <h3>No remote credential sharing</h3>
            <p>
              Credentials are used only to authenticate with the user&apos;s chosen
              Breaze server and are not shared with unrelated third parties.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Data Use</p>
          <h2>How data is used</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>Import processing</h3>
            <p>
              Order data is sent only to the Breaze API server specified by the
              user so the selected order can be imported into Breaze Commerce.
            </p>
          </article>

          <article className="contentCard">
            <h3>Nothing beyond the stated purpose</h3>
            <p>
              Data is used only for extracting, reviewing, and importing order
              details into Breaze Commerce at the user&apos;s direction.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Data Sharing</p>
          <h2>Who receives the data</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>User-specified Breaze server</h3>
            <p>
              Imported order data is transmitted only to the API endpoint the
              user configures for their Breaze deployment.
            </p>
          </article>

          <article className="contentCard">
            <h3>No unrelated third parties</h3>
            <p>
              Reuben Moddel does not share extension-collected data with data
              brokers, advertisers, or unrelated external services.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Permissions Context</p>
          <h2>Why the extension needs access</h2>
        </div>
        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>Retailer page access</h3>
            <p>
              Host access and active tab permissions are used to read supported
              retailer order pages so the extension can extract order details.
            </p>
          </article>

          <article className="contentCard">
            <h3>Storage and scripting</h3>
            <p>
              Storage is used for local settings. Scripting is used to run the
              extraction logic on supported pages when the user initiates a scan.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Contact</p>
          <h2>Questions or requests</h2>
        </div>
        <p className="sectionIntro">
          For privacy questions about Breaze Commerce Importer, contact Reuben
          Moddel through the website contact form at <a href="/#contact">rmoddel.com</a>.
        </p>
      </section>
    </main>
  );
}
