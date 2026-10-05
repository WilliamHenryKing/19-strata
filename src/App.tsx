import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from "react";
import { type MaterialId, materials, type Project, process, projects } from "./data";
import { Icon } from "./Icon";
import { MaterialScene } from "./MaterialScene";
import { materialShots, useMaterialJourney } from "./useMaterialJourney";
import { WorldGallery } from "./WorldGallery";

gsap.registerPlugin(useGSAP);
const getRoute = () => window.location.hash.replace(/^#/, "") || "/";
const Arrow = () => <Icon name="arrow" />;

function Picture({
  kind,
  alt,
  priority = false,
  className = "",
}: {
  kind: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const filename =
    kind === "elevation"
      ? "strata-gather"
      : kind === "board"
        ? "strata-workspace"
        : "strata-interior";
  return (
    <picture className={`project-picture ${className}`}>
      <source media="(max-width: 680px)" srcSet={`/images/${filename}-mobile.webp`} />
      <img
        src={`/images/${filename}.webp`}
        alt={alt}
        width="1536"
        height="1024"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}

function MaterialSelector({
  selected,
  onSelect,
  light = false,
}: {
  selected: MaterialId;
  onSelect: (id: MaterialId) => void;
  light?: boolean;
}) {
  return (
    <div className={`material-selector ${light ? "on-light" : ""}`}>
      <p className="selector-label">
        Choose a finish <Icon name="down" />
      </p>
      <fieldset className="material-options" aria-label="Choose a material">
        {materials.map((material) => (
          <button
            type="button"
            key={material.id}
            className={`material-option ${selected === material.id ? "selected" : ""}`}
            aria-pressed={selected === material.id}
            onClick={() => onSelect(material.id)}
            aria-label={`Explore ${material.name}`}
          >
            <span className={`sample surface-${material.id}`} />
            <span className="sample-name">
              {material.name}
              {selected === material.id && <Icon name="check" />}
            </span>
          </button>
        ))}
      </fieldset>
    </div>
  );
}

function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <a href={`#/work/${project.slug}`} className={`project-card project-card-${index}`}>
      <div className="project-image">
        <Picture
          kind={project.image}
          alt={
            project.image === "board"
              ? "Generated concept of a creative workspace with natural stone, walnut storage and brushed metal details"
              : `Generated concept visual for ${project.name}`
          }
        />
        <span className="image-open">
          <Arrow />
        </span>
        <span className="image-tag">{project.year}</span>
      </div>
      <div className="project-card-info">
        <div>
          <h3>{project.name}</h3>
          <p className="project-kind">{project.kind}</p>
        </div>
        <Icon name="arrow" className="card-arrow" />
      </div>
    </a>
  );
}

function Home({
  selected,
  setSelected,
  motion,
}: {
  selected: MaterialId;
  setSelected: (id: MaterialId) => void;
  motion: boolean;
}) {
  const material = materials.find((item) => item.id === selected) ?? materials[0];
  const projectHeading = useRef<HTMLHeadingElement>(null);
  const journey = useMaterialJourney(motion, projectHeading);
  return (
    <>
      <div className="material-journey" ref={journey.root}>
        <section
          className="hero has-camera-tour"
          style={{ "--hero-tone": material.tone } as CSSProperties}
        >
          <div className="hero-copy" data-camera-caption>
            <h1 className="entrance">
              Good spaces.
              <br />
              Great surfaces<span className="hero-period">.</span>
            </h1>
            <p className="hero-intro">
              Thoughtful spaces, expressive materials. Considered from the ground up. Felt in every
              finish.
            </p>
            <a href="#/work" className="text-link">
              Explore our work <Arrow />
            </a>
          </div>
          <div
            className="journey-caption"
            data-camera-caption
            aria-hidden={journey.activeShot !== 1}
          >
            <h2>A curve with character.</h2>
            <p>Move around the form. See how a single edge changes the light.</p>
          </div>
          <div
            className="journey-caption"
            data-camera-caption
            aria-hidden={journey.activeShot !== 2}
          >
            <h2>
              Every grain.
              <br />
              Every edge.
            </h2>
            <p>Come closer. Warm timber, quiet stone and the glint of metal.</p>
          </div>
          <div className="hero-object">
            <MaterialScene selected={selected} motion={motion} travel={journey.travel} />
          </div>
          <div className="hero-bottom">
            <MaterialSelector selected={selected} onSelect={setSelected} />
            <div className="journey-navigation">
              <div className="journey-meta">
                <p>
                  {!journey.available
                    ? "Still material study"
                    : journey.scrollLinked
                      ? "Scroll to move closer"
                      : "Choose your viewpoint"}
                </p>
                <button type="button" className="journey-skip" onClick={journey.skip}>
                  Skip to projects <Icon name="down" />
                </button>
              </div>
              <nav aria-label="Material camera views" className="journey-views">
                {materialShots.map((shot, index) => (
                  <button
                    key={shot.name}
                    type="button"
                    disabled={!journey.available}
                    aria-current={journey.activeShot === index ? "step" : undefined}
                    onClick={() => journey.jump(index)}
                  >
                    {shot.name}
                  </button>
                ))}
              </nav>
              <div className="journey-progress" aria-hidden="true">
                <span className="journey-progress-fill" />
              </div>
              <p className="sr-only" aria-live="polite">
                {journey.announcement}
              </p>
            </div>
          </div>
        </section>
      </div>
      <section className="intro-section section-padding">
        <div>
          <h2>
            Beautiful is a beginning.
            <br />
            <span className="muted">How it feels is everything.</span>
          </h2>
          <div className="intro-detail">
            <p>
              We see architecture, interiors and finishing as one continuous conversation. From the
              shape of a room to the grain of a surface, every layer has a part to play.
            </p>
            <p>
              STRATA is an imagined design atelier exploring spaces with warmth, character and a
              quietly exacting attention to detail.
            </p>
            <a href="#/studio" className="text-link">
              Inside the studio <Arrow />
            </a>
          </div>
        </div>
      </section>
      <section className="selected-work section-padding">
        <div className="section-heading">
          <div>
            <h2 ref={projectHeading} tabIndex={-1}>
              Spaces with substance.
            </h2>
          </div>
          <a href="#/work" className="text-link">
            All projects <Arrow />
          </a>
        </div>
        <div className="home-projects">
          {projects.slice(0, 2).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>
      <section className="material-manifesto">
        <div className="manifesto-copy">
          <h2>
            Less gloss.
            <br />
            More <em>grain.</em>
          </h2>
          <p>
            The soft drag of plaster. The irregular rhythm of stone. The warmth of timber. Materials
            are more than a palette. They are how we experience a space.
          </p>
          <a href="#/materials" className="text-link">
            Enter the material library <Arrow />
          </a>
        </div>
        <WorldGallery />
      </section>
      <Invitation />
    </>
  );
}

function Work() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Residential", "Hospitality", "Workplace"];
  const visible = projects.filter((project) => filter === "All" || project.kind.startsWith(filter));
  return (
    <section className="work-page section-padding">
      <div className="page-intro">
        <h1 className="entrance">
          Built on
          <br />
          <span className="muted">good ideas.</span>
        </h1>
        <p>
          Three imagined spaces. One belief: the best interiors bring feeling and function together,
          all the way to the final layer.
        </p>
      </div>
      <div className="work-toolbar">
        <fieldset className="filter-list" aria-label="Filter projects">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </fieldset>
        <span className="result-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "study" : "studies"}
        </span>
      </div>
      <div className="work-grid">
        {visible.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
      <p className="concept-note">
        All projects are fictional design concepts. Imagery is AI-generated; the finishing studies
        describe design intent, not completed commissions.
      </p>
    </section>
  );
}

function ProjectPage({ project }: { project: Project }) {
  const next =
    projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length] ??
    projects[0];
  return (
    <>
      <section className="project-title section-padding">
        <a href="#/work" className="back-link">
          <Icon name="back" /> Project index
        </a>
        <div className="project-title-row">
          <div>
            <h1 className="entrance">{project.name}</h1>
            <p className="project-kind">{project.kind}</p>
          </div>
          <p>{project.tagline}</p>
        </div>
        <div className="project-meta">
          <span>{project.location}</span>
          <span>{project.year}</span>
          <span>Architecture + interiors + finishes</span>
        </div>
      </section>
      <div className="project-banner">
        <Picture
          kind={project.image}
          alt={`AI-generated interior concept illustrating ${project.name}`}
          priority
        />
        <span className="image-tag">Concept visual / AI-generated</span>
      </div>
      <section className="project-story section-padding">
        <div>
          <h2>{project.tagline}</h2>
          <p className="large-copy">{project.intro}</p>
        </div>
        <div className="scope-list">
          <h3>Scope of the study</h3>
          {project.scope.map((item) => (
            <div key={item}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="project-development section-padding">
        <div>
          <h3>The question</h3>
          <p>{project.challenge}</p>
        </div>
        <div>
          <h3>The response</h3>
          <p>{project.response}</p>
        </div>
      </section>
      <section className="project-palette section-padding">
        <div className="section-heading">
          <div>
            <h2>A considered combination.</h2>
          </div>
          <a href="#/materials" className="text-link">
            The library <Arrow />
          </a>
        </div>
        <div className="palette-grid">
          {project.palette.map((id) => {
            const material = materials.find((m) => m.id === id) ?? materials[0];
            return (
              <a href={`#/materials/${id}`} className="palette-item" key={id}>
                <span className={`palette-surface surface-${id}`} />
                <div>
                  <h3>{material.name}</h3>
                  <span>{material.finish}</span>
                </div>
                <Arrow />
              </a>
            );
          })}
        </div>
      </section>
      <a href={`#/work/${next.slug}`} className="next-project section-padding">
        <h2>{next.name}</h2>
        <span className="next-project-label">Explore the next study</span>
        <Arrow />
      </a>
    </>
  );
}

function MaterialsPage({
  selected,
  setSelected,
  motion,
}: {
  selected: MaterialId;
  setSelected: (id: MaterialId) => void;
  motion: boolean;
}) {
  const material = materials.find((item) => item.id === selected) ?? materials[0];
  const detail = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.fromTo(
        ".material-detail-copy",
        { opacity: 0.55 },
        { opacity: 1, duration: motion ? 0.24 : 0.12, clearProps: "opacity" },
      );
    },
    { scope: detail, dependencies: [selected, motion], revertOnUpdate: true },
  );
  return (
    <>
      <section className="materials-intro section-padding">
        <div>
          <h1 className="entrance">
            Feel the
            <br />
            <span className="muted">difference.</span>
          </h1>
        </div>
        <p>
          A space starts to come alive when its materials speak to each other. Choose a finish.
          Explore its character. Build a more interesting conversation.
        </p>
      </section>
      <section
        className="material-explorer"
        style={{ "--hero-tone": material.tone } as CSSProperties}
      >
        <div className="explorer-stage">
          <MaterialScene selected={selected} motion={motion} compact />
          <span className="explorer-label">Interactive material study</span>
        </div>
        <div className="explorer-details" ref={detail}>
          <MaterialSelector selected={selected} onSelect={setSelected} light />
          <div className="material-detail-copy" aria-live="polite">
            <h2>{material.name}</h2>
            <p className="material-finish">
              {material.family} / {material.finish}
            </p>
            <h3>{material.character}</h3>
            <p>{material.description}</p>
            <dl>
              <div>
                <dt>Where it belongs</dt>
                <dd>{material.uses}</dd>
              </div>
              <div>
                <dt>In the detail</dt>
                <dd>{material.consideration}</dd>
              </div>
            </dl>
            <a href={`#/brief?material=${material.id}`} className="text-link">
              Start with this material <Arrow />
            </a>
          </div>
        </div>
      </section>
      <section className="material-footnote section-padding">
        <h3>Start with a real sample.</h3>
        <p>
          Digital surfaces suggest a feeling. Real samples tell the full story. Colour, grain,
          suitability and installation details should always be assessed in the actual space, with
          the relevant specialist.
        </p>
      </section>
      <Invitation />
    </>
  );
}

function Studio() {
  return (
    <>
      <section className="studio-intro section-padding">
        <h1 className="entrance">
          The finish
          <br />
          is the <em>feeling.</em>
        </h1>
        <div className="studio-intro-bottom">
          <p>
            STRATA is a concept atelier for architecture, interiors and finishes. A place to explore
            how thoughtful spaces and tactile materials can make everyday life feel a little better.
          </p>
        </div>
      </section>
      <section className="studio-values section-padding">
        <div>
          <h2>
            Big picture.
            <br />
            Small details.
            <br />
            <span className="muted">Equal care.</span>
          </h2>
          <p>
            A room is more than a collection of beautiful things. It is the proportion between them,
            the way light moves, the meeting of two surfaces. We believe finishing belongs at the
            beginning of the design conversation.
          </p>
          <p>
            This portfolio brings that approach to life through original digital material studies
            and imagined residential, hospitality and workplace projects.
          </p>
        </div>
      </section>
      <section className="process-section section-padding">
        <div className="section-heading">
          <div>
            <h2>A considered process.</h2>
          </div>
        </div>
        <div className="process-grid">
          {process.map((item) => (
            <article key={item.number}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-image">
        <Picture
          kind="interior"
          alt="Generated study of a richly textured terracotta interior with a stone table and walnut detailing"
        />
        <div>
          <h2>
            Spaces to live in.
            <br />
            Surfaces to love.
          </h2>
        </div>
      </section>
      <Invitation />
    </>
  );
}

function Invitation() {
  return (
    <section className="invitation section-padding">
      <div>
        <h2>
          Something
          <br />
          in mind?
        </h2>
        <a href="#/brief" className="round-cta">
          <span>Build your project brief</span>
          <Arrow />
        </a>
      </div>
      <p>A few thoughtful questions. A clearer starting point.</p>
    </section>
  );
}

function Brief({ initialMaterial }: { initialMaterial: MaterialId }) {
  const [service, setService] = useState("");
  const [space, setSpace] = useState("");
  const [area, setArea] = useState("");
  const [timing, setTiming] = useState("Exploring possibilities");
  const [priorities, setPriorities] = useState("");
  const [chosen, setChosen] = useState<MaterialId[]>([initialMaterial]);
  const [summary, setSummary] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  function toggle(id: MaterialId) {
    setChosen((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
  }
  function build(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = `STRATA / PROJECT STARTING POINT\n\nProject type: ${space}\nFocus: ${service}\nApproximate floor area: ${area ? `${area} m²` : "To be established"}\nTiming: ${timing}\nMaterials to explore: ${chosen.map((id) => materials.find((m) => m.id === id)?.name).join(", ") || "Open to suggestions"}\n\nWhat matters most\n${priorities.trim() || "To be discussed"}\n\nNext steps\n1. Gather a floor plan and reference images.\n2. Establish a working budget and priorities.\n3. Review material samples in the actual space.\n\nCreated locally in the STRATA concept portfolio. This is a personal planning document, not a quote or a submitted enquiry. No information was sent or saved to a server.\n`;
    setSummary(text);
    setDownloaded(false);
    window.setTimeout(() => {
      preview.current?.focus();
      preview.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }, 30);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "strata-project-brief.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return (
    <section className="brief-page section-padding">
      <div className="brief-intro">
        <h1 className="entrance">
          Let's give it
          <br />
          <span className="muted">some shape.</span>
        </h1>
        <p>
          A good brief makes room for good ideas. Use this small planning tool to gather your
          thoughts, then take the result with you.
        </p>
        <div className="local-note">
          <Icon name="download" />
          <p>
            <strong>Yours to keep.</strong> This concept site creates a text brief on your device.
            It sends nothing, collects no contact details and does not submit an enquiry.
          </p>
        </div>
      </div>
      <form className="brief-form" onSubmit={build}>
        <fieldset>
          <legend>What are you imagining?</legend>
          <label htmlFor="space">
            Kind of space <span>(required)</span>
          </label>
          <select
            id="space"
            value={space}
            onChange={(event) => {
              setSpace(event.target.value);
              setSummary("");
            }}
            required
          >
            <option value="">Choose a space</option>
            <option>Residential</option>
            <option>Hospitality</option>
            <option>Workplace</option>
            <option>Something else</option>
          </select>
          <label htmlFor="service">
            Where would you like to focus? <span>(required)</span>
          </label>
          <select
            id="service"
            value={service}
            onChange={(event) => {
              setService(event.target.value);
              setSummary("");
            }}
            required
          >
            <option value="">Choose a focus</option>
            <option>Architecture & spatial concept</option>
            <option>Complete interior direction</option>
            <option>Materials & finishing</option>
            <option>Bespoke joinery & details</option>
          </select>
          <div className="field-row">
            <div>
              <label htmlFor="area">
                Approximate area <span>(m², optional)</span>
              </label>
              <input
                id="area"
                type="number"
                min="1"
                max="100000"
                step="1"
                inputMode="numeric"
                placeholder="e.g. 120"
                value={area}
                onChange={(event) => {
                  setArea(event.target.value);
                  setSummary("");
                }}
              />
            </div>
            <div>
              <label htmlFor="timing">Where are you in the process?</label>
              <select
                id="timing"
                value={timing}
                onChange={(event) => {
                  setTiming(event.target.value);
                  setSummary("");
                }}
              >
                <option>Exploring possibilities</option>
                <option>Developing a concept</option>
                <option>Planning the details</option>
                <option>Ready to refine finishes</option>
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>What speaks to you?</legend>
          <p className="field-hint">Choose any materials you would like to explore.</p>
          <div className="brief-materials">
            {materials.map((material) => (
              <label className="brief-material" key={material.id}>
                <input
                  type="checkbox"
                  checked={chosen.includes(material.id)}
                  onChange={() => {
                    toggle(material.id);
                    setSummary("");
                  }}
                />
                <span className={`sample surface-${material.id}`} />
                <span>{material.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>What matters most?</legend>
          <label htmlFor="priorities">
            Your priorities <span>(optional, up to 800 characters)</span>
          </label>
          <textarea
            id="priorities"
            rows={4}
            maxLength={800}
            placeholder="A quieter space, warmer light, natural materials, room to gather…"
            value={priorities}
            onChange={(event) => {
              setPriorities(event.target.value);
              setSummary("");
            }}
            aria-describedby="privacy-hint"
          />
          <p className="field-hint" id="privacy-hint">
            Keep it about the project. Please leave out names, contact details and addresses.
          </p>
        </fieldset>
        <button type="submit" className="solid-button">
          Create my brief <Arrow />
        </button>
        <p className="field-hint">Preview it first. Download it when you are ready.</p>
        {summary && (
          <div className="brief-preview" ref={preview} tabIndex={-1}>
            <h2>Your brief is ready.</h2>
            <pre>{summary}</pre>
            <button type="button" className="solid-button" onClick={download}>
              Download text brief <Icon name="download" />
            </button>
            <p role="status">
              {downloaded
                ? "Download started. Your brief was not sent anywhere."
                : "Nothing has been sent. This preview exists only in this page."}
            </p>
          </div>
        )}
      </form>
    </section>
  );
}

function Footer() {
  const scrollHome = () => {
    if (getRoute() === "/") window.scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <footer className="site-footer section-padding">
      <div className="footer-top">
        <p>
          Architecture. Interiors. Finishes.
          <br />
          Every layer, considered.
        </p>
        <div>
          <a href="#/work">Projects</a>
          <a href="#/materials">Materials</a>
          <a href="#/studio">Studio</a>
          <a href="#/brief">Project brief</a>
        </div>
        {/* biome-ignore lint/a11y/useValidAnchor: Navigates the home hash route and resets an already-active home page. */}
        <a href="#/" className="back-top" onClick={scrollHome}>
          Back to the beginning <Arrow />
        </a>
      </div>
      {/* biome-ignore lint/a11y/useValidAnchor: Navigates the home hash route and resets an already-active home page. */}
      <a className="footer-wordmark" href="#/" aria-label="STRATA home" onClick={scrollHome}>
        STRATA
      </a>
      <div className="footer-bottom">
        <span>© 2026 STRATA — an independent portfolio concept.</span>
        <span>Fictional studio & projects. Original digital studies. AI-generated interiors.</span>
      </div>
    </footer>
  );
}

export function App() {
  const [route, setRoute] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<MaterialId>("travertine");
  const [motion, setMotion] = useState(() => {
    try {
      const saved = localStorage.getItem("strata-motion");
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && saved !== "off";
    } catch {
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  });
  const main = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstRoute = useRef(true);
  const motionToggle = useRef<HTMLButtonElement>(null);
  const [tucked, setTucked] = useState(false);
  const path = route.split("?")[0] ?? "/";

  // The fixed motion switch never sits on another control: the hero's finishes and views at the
  // fold, the gallery's view buttons, any link or field. While it would cover one it steps
  // aside (still focusable, shown on focus) and returns once the control has passed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: a route swaps its controls without scrolling, so re-measure.
  useEffect(() => {
    const pill = motionToggle.current;
    if (!pill) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const a = pill.getBoundingClientRect();
      const controls = document.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
      );
      let covered = false;
      for (const control of controls) {
        if (control === pill || pill.contains(control)) continue;
        const b = control.getBoundingClientRect();
        // Compact controls only: large linked project cards stay usable around the switch.
        if (!b.width || !b.height || b.height > 160) continue;
        if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
          covered = true;
          break;
        }
      }
      setTucked(covered);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [path]);
  const briefRequestedMaterial = new URLSearchParams(route.split("?")[1]).get("material");
  const briefInitialMaterial =
    materials.find((item) => item.id === briefRequestedMaterial)?.id ?? selected;
  const project = projects.find((item) => path === `/work/${item.slug}`);
  const isMaterials = path === "/materials" || path.startsWith("/materials/");
  const routeTitle =
    path === "/"
      ? "Good spaces. Great surfaces."
      : project
        ? project.name
        : isMaterials
          ? "The material library"
          : path === "/work"
            ? "Selected projects"
            : path === "/studio"
              ? "The studio"
              : path === "/brief"
                ? "Build your project brief"
                : "Page not found";
  useEffect(() => {
    const listener = () => setRoute(getRoute());
    const onHeaderNavigation = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>(".site-header a");
      if (!link) return;
      setMenuOpen(false);
      if (link.hash === window.location.hash) main.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", listener);
    document.addEventListener("click", onHeaderNavigation);
    return () => {
      window.removeEventListener("hashchange", listener);
      document.removeEventListener("click", onHeaderNavigation);
    };
  }, []);
  useEffect(() => {
    document.title = `STRATA — ${routeTitle}`;
    setMenuOpen(false);
    const requestedMaterial = path.startsWith("/materials/")
      ? path.split("/")[2]
      : new URLSearchParams(route.split("?")[1]).get("material");
    if (materials.some((item) => item.id === requestedMaterial))
      setSelected(requestedMaterial as MaterialId);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!firstRoute.current) {
      const timer = window.setTimeout(() => main.current?.focus({ preventScroll: true }), 50);
      return () => window.clearTimeout(timer);
    }
    firstRoute.current = false;
  }, [route, routeTitle, path]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (query.matches) setMotion(false);
    };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
    try {
      localStorage.setItem("strata-motion", motion ? "on" : "off");
    } catch {
      /* Motion remains usable if storage is unavailable. */
    }
  }, [motion]);
  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menuOpen]);
  useGSAP(
    () => {
      if (!motion || path !== "/") return;
      gsap.fromTo(
        ".hero-copy h1",
        { clipPath: "inset(0 0 20% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.7,
          ease: "expo.out",
          clearProps: "clipPath",
        },
      );
    },
    { scope: main, dependencies: [route, motion], revertOnUpdate: true },
  );
  return (
    <>
      <button
        type="button"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </button>
      <header
        className={`site-header ${path === "/" ? "on-hero" : ""}`}
        style={
          path === "/"
            ? ({
                "--hero-tone": (materials.find((item) => item.id === selected) ?? materials[0])
                  .tone,
              } as CSSProperties)
            : undefined
        }
      >
        <a href="#/" className="wordmark" aria-label="STRATA home">
          STRATA
        </a>
        <span className="header-descriptor">
          Architecture, interiors
          <br />& finishes.
        </span>
        <button
          type="button"
          className="menu-button"
          ref={menuButton}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <nav
          id="primary-navigation"
          className={menuOpen ? "is-open" : ""}
          aria-label="Main navigation"
        >
          <a href="#/work" aria-current={path.startsWith("/work") ? "page" : undefined}>
            Projects
          </a>
          <a href="#/materials" aria-current={isMaterials ? "page" : undefined}>
            Materials
          </a>
          <a href="#/studio" aria-current={path === "/studio" ? "page" : undefined}>
            Studio
          </a>
          <a
            href="#/brief"
            className="header-cta"
            aria-current={path === "/brief" ? "page" : undefined}
          >
            Project brief <Arrow />
          </a>
        </nav>
      </header>
      <button
        type="button"
        className="motion-toggle"
        ref={motionToggle}
        data-tucked={tucked}
        onClick={() => setMotion(!motion)}
        aria-pressed={motion}
      >
        <Icon name={motion ? "pause" : "play"} />
        {/* A constant name with aria-pressed; the visible state word is not announced twice. */}
        <span>
          Motion <span aria-hidden="true">{motion ? "on" : "off"}</span>
        </span>
      </button>
      <main id="main" ref={main} tabIndex={-1}>
        {path === "/" ? (
          <Home selected={selected} setSelected={setSelected} motion={motion} />
        ) : path === "/work" ? (
          <Work />
        ) : project ? (
          <ProjectPage project={project} />
        ) : isMaterials ? (
          <MaterialsPage selected={selected} setSelected={setSelected} motion={motion} />
        ) : path === "/studio" ? (
          <Studio />
        ) : path === "/brief" ? (
          <Brief key={route} initialMaterial={briefInitialMaterial} />
        ) : (
          <section className="not-found section-padding">
            <h1>
              This space
              <br />
              is still a sketch.
            </h1>
            <a href="#/" className="text-link">
              Return to STRATA <Arrow />
            </a>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
