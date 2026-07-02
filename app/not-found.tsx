import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <main className="pageShell">
      <SiteHeader />

      <section className="heroSection notFoundHero">
        <div className="heroCopy">
          <div className="heroRibbon">
            <p className="eyebrow">404</p>
            <span className="heroSpark">Page not found</span>
          </div>
          <h1>That page does not exist.</h1>
          <p className="heroText">
            The link may be wrong, outdated, or just not here. The rest of the
            site is still standing.
          </p>
          <div className="resumeActions">
            <a className="button" href="/">
              Go Home
            </a>
          </div>
        </div>

        <aside className="heroPanel">
          <div>
            <div className="heroPanelBadge">Navigation</div>
            <p className="panelResult">
              Use the header or the button below to get back to the main page.
            </p>
          </div>
          <div className="heroOutcomeList">
            <span>Home</span>
            <span>Resume</span>
            <span>Privacy</span>
            <span>Contact</span>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}
