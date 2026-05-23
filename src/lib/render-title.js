import { createElement, Fragment } from "react";

/** Split a title and emphasize one word/phrase (used in headings across the site). */
export function renderTitle(title, emphasis, EmphasisTag = "em") {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  const className =
    EmphasisTag === "span"
      ? "title-emphasis text-neon italic font-light"
      : "title-emphasis font-light text-neon";

  return createElement(
    Fragment,
    null,
    before,
    createElement(EmphasisTag, { className }, emphasis),
    rest.join(emphasis)
  );
}
