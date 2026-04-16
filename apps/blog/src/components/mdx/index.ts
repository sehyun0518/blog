import type { MDXComponents } from "mdx/types";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { ImageWithCaption } from "./image-with-caption";

export { Callout } from "./callout";
export type { CalloutType } from "./callout";
export { CopyButton } from "./copy-button";
export { CodeBlock } from "./code-block";
export { ImageWithCaption } from "./image-with-caption";

export const mdxComponents: MDXComponents = {
  pre: CodeBlock as MDXComponents["pre"],
  img: ImageWithCaption as MDXComponents["img"],
  Callout,
};
