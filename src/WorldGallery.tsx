import { useState } from "react";

export function WorldGallery() {
  const [detail, setDetail] = useState(false);
  const src = detail ? "/images/strata-material-study" : "/images/strata-world";
  return (
    <figure className="world-gallery">
      <div className="world-image">
        <picture>
          <source media="(max-width: 680px)" srcSet={`${src}-mobile.webp`} />
          <img
            src={`${src}.webp`}
            width="3200"
            height="2000"
            loading="lazy"
            decoding="async"
            alt={
              detail
                ? "Close material composition of fluted wood, mineral stone and handmade ceramic"
                : "A clay and stone atelier opens through tall arches into a planted courtyard"
            }
          />
        </picture>
      </div>
      <figcaption>
        <span>{detail ? "The character is in the finish." : "Inside the material atelier."}</span>
        <fieldset className="world-view-controls" aria-label="Architectural render view">
          <button type="button" aria-pressed={!detail} onClick={() => setDetail(false)}>
            The space
          </button>
          <button type="button" aria-pressed={detail} onClick={() => setDetail(true)}>
            The detail
          </button>
        </fieldset>
      </figcaption>
    </figure>
  );
}
