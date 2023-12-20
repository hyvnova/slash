import { c as create_ssr_component, d as add_attribute, a as each, v as validate_component, m as missing_component, e as escape, b as subscribe } from "../../../../../chunks/ssr.js";
import { a as FileLoadState, S as Status, R as Routes } from "../../../../../chunks/types.js";
import { F as Fa } from "../../../../../chunks/fa.js";
import { faSpinner, faExclamationTriangle, faCopy, faDownload, faFile, faPaperclip, faPaperPlane, faArrowLeft, faCertificate } from "@fortawesome/free-solid-svg-icons";
import { c as cached_images, A as AvatarImage } from "../../../../../chunks/AvatarImage.js";
import { w as writable } from "../../../../../chunks/index2.js";
import "../../../../../chunks/websocket.js";
import { Lexer } from "marked";
import Slugger from "github-slugger";
import { b as bytes_to_size } from "../../../../../chunks/index3.js";
import { N as Notification } from "../../../../../chunks/Notification.js";
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
function joinUrlPaths(...paths) {
  return "/" + paths.flatMap((path) => path.split("/")).filter((path) => !!path).join("/");
}
function isRelative(url) {
  return url.startsWith("/") || url.startsWith("#");
}
function generatePathSegment(name, slugger) {
  return slugger.slug(name).replace(/--+/g, "-");
}
const MarkdownHeading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  let { options } = $$props;
  const renderers = void 0;
  let id;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  id = generatePathSegment(token.text, options.slugger);
  return `${((tag) => {
    return tag ? `<${`h${token.depth}`}${add_attribute("id", id, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(`h${token.depth}`)}`;
});
const MarkdownBloquote = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<blockquote>${slots.default ? slots.default({}) : ``}</blockquote>`;
});
const MarkdownTokens = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tokens } = $$props;
  let { renderers } = $$props;
  let { options } = $$props;
  if ($$props.tokens === void 0 && $$bindings.tokens && tokens !== void 0)
    $$bindings.tokens(tokens);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  return `${tokens ? `${each(tokens, (token) => {
    return `${validate_component(MarkdownToken, "MarkdownToken").$$render($$result, { token, renderers, options }, {}, {})}`;
  })}` : ``}`;
});
const MarkdownToken = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  let { renderers } = $$props;
  let { options } = $$props;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  return `${renderers[token.type] ? `${validate_component(renderers[token.type] || missing_component, "svelte:component").$$render($$result, { token, options, renderers }, {}, {
    default: () => {
      return `${"tokens" in token && token["tokens"] ? `${validate_component(MarkdownTokens, "MarkdownTokens").$$render(
        $$result,
        {
          tokens: token["tokens"],
          renderers,
          options
        },
        {},
        {}
      )}` : `${escape(token.raw)}`}`;
    }
  })}` : ``}`;
});
const MarkdownList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  let { options } = $$props;
  let { renderers } = $$props;
  let component;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  component = token.ordered ? "ol" : "ul";
  return `${((tag) => {
    return tag ? `<${component}${add_attribute("start", token.start || 1, 0)}>${is_void(tag) ? "" : `${each(token.items, (item) => {
      return `${validate_component(MarkdownToken, "MarkdownToken").$$render($$result, { token: { ...item }, options, renderers }, {}, {})}`;
    })}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(component)}`;
});
const MarkdownListItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<li>${slots.default ? slots.default({}) : ``}</li>`;
});
const MarkdownBr = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<br>`;
});
const MarkdownCode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<pre><code${add_attribute("class", `lang-${token.lang}`, 0)}>${escape(token.text)}</code></pre>`;
});
const MarkdownCodeSpan = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<code>${escape(token.raw.slice(1, token.raw.length - 1))}</code>`;
});
const MarkdownTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  let { options } = $$props;
  let { renderers } = $$props;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<table><thead><tr>${each(token.header, (item) => {
    return `<th scope="col">${validate_component(MarkdownTokens, "MarkdownTokens").$$render($$result, { tokens: item.tokens, options, renderers }, {}, {})} </th>`;
  })}</tr></thead> <tbody>${each(token.rows, (row) => {
    return `<tr>${each(row, (col) => {
      return `<td>${validate_component(MarkdownTokens, "MarkdownTokens").$$render($$result, { tokens: col.tokens, options, renderers }, {}, {})} </td>`;
    })} </tr>`;
  })}</tbody></table>`;
});
const MarkdownHtml = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<!-- HTML_TAG_START -->${token.text}<!-- HTML_TAG_END -->`;
});
const MarkdownParagraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<p>${slots.default ? slots.default({}) : ``}</p>`;
});
const MarkdownLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  let { options } = $$props;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<a${add_attribute(
    "href",
    isRelative(token.href) ? joinUrlPaths(options.baseUrl, token.href) : token.href,
    0
  )}${add_attribute("title", token.title, 0)}>${slots.default ? slots.default({}) : ``}</a>`;
});
const MarkdownText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `${slots.default ? slots.default({}) : ``}`;
});
const MarkdownDfn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<dfn>${slots.default ? slots.default({}) : ``}</dfn>`;
});
const MarkdownDel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<del>${slots.default ? slots.default({}) : ``}</del>`;
});
const MarkdownEm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<em>${slots.default ? slots.default({}) : ``}</em>`;
});
const MarkdownHr = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<hr>`;
});
const MarkdownStrong = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `<strong>${slots.default ? slots.default({}) : ``}</strong>`;
});
const css$4 = {
  code: ".markdown-image.svelte-z38cge{max-width:100%}",
  map: null
};
const MarkdownImage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { token } = $$props;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  $$result.css.add(css$4);
  return `<img${add_attribute("src", token.href, 0)}${add_attribute("title", token.title, 0)}${add_attribute("alt", token.text, 0)} class="markdown-image svelte-z38cge">`;
});
const MarkdownSpace = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const token = void 0;
  const options = void 0;
  const renderers = void 0;
  if ($$props.token === void 0 && $$bindings.token && token !== void 0)
    $$bindings.token(token);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  return `${slots.default ? slots.default({}) : ``}`;
});
function parse(src) {
  const lexer = new Lexer();
  return lexer.lex(src);
}
const defaultRenderers = () => ({
  heading: MarkdownHeading,
  blockquote: MarkdownBloquote,
  list: MarkdownList,
  list_item: MarkdownListItem,
  br: MarkdownBr,
  code: MarkdownCode,
  codespan: MarkdownCodeSpan,
  table: MarkdownTable,
  html: MarkdownHtml,
  paragraph: MarkdownParagraph,
  link: MarkdownLink,
  text: MarkdownText,
  def: MarkdownDfn,
  del: MarkdownDel,
  em: MarkdownEm,
  hr: MarkdownHr,
  strong: MarkdownStrong,
  image: MarkdownImage,
  space: MarkdownSpace,
  escape: MarkdownSpace
});
const defaultOptions = () => ({
  baseUrl: "/",
  slugger: new Slugger()
});
function suppressWarnings() {
  const origWarn = console.warn;
  console.warn = (message) => {
    if (message.includes("unknown prop"))
      return;
    if (message.includes("unexpected slot"))
      return;
    origWarn(message);
  };
}
const Markdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  suppressWarnings();
  let { source } = $$props;
  let { options = {} } = $$props;
  let { renderers = {} } = $$props;
  let tokens;
  let actualRenderers;
  let actualOptions;
  if ($$props.source === void 0 && $$bindings.source && source !== void 0)
    $$bindings.source(source);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.renderers === void 0 && $$bindings.renderers && renderers !== void 0)
    $$bindings.renderers(renderers);
  {
    {
      tokens = parse(source);
      actualRenderers = { ...defaultRenderers(), ...renderers };
      actualOptions = { ...defaultOptions(), ...options };
    }
  }
  return `${validate_component(MarkdownTokens, "MarkdownTokens").$$render(
    $$result,
    {
      tokens,
      renderers: actualRenderers,
      options: actualOptions
    },
    {},
    {}
  )}`;
});
const scroll_to_bottom = writable(() => {
});
const FileLoadStates = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $state, $$unsubscribe_state;
  let { state } = $$props;
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  $$unsubscribe_state();
  return `${$state == FileLoadState.LOADING ? `<div class="flex items-center justify-center h-full">${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faSpinner,
      class: "text-gray-300 animate-spin mr-2"
    },
    {},
    {}
  )} <span class="text-sm text-gray-300" data-svelte-h="svelte-1c29fwm">Loading file...</span></div>` : `${$state == FileLoadState.FAILED ? `<div class="flex items-center justify-center h-full">${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faExclamationTriangle,
      class: "text-yellow-500 mr-2"
    },
    {},
    {}
  )} <span class="text-sm text-gray-300" data-svelte-h="svelte-1e4nany">Failed to load file</span></div>` : `${slots.default ? slots.default({}) : ``}`}`}`;
});
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_cached_images;
  let $$unsubscribe_scroll_to_bottom;
  $$unsubscribe_cached_images = subscribe(cached_images, (value) => value);
  $$unsubscribe_scroll_to_bottom = subscribe(scroll_to_bottom, (value) => value);
  let { attachment } = $$props;
  let { use_cache = false } = $$props;
  let url = `/file/${attachment.id}`;
  const state = writable(FileLoadState.LOADING);
  if ($$props.attachment === void 0 && $$bindings.attachment && attachment !== void 0)
    $$bindings.attachment(attachment);
  if ($$props.use_cache === void 0 && $$bindings.use_cache && use_cache !== void 0)
    $$bindings.use_cache(use_cache);
  $$unsubscribe_cached_images();
  $$unsubscribe_scroll_to_bottom();
  return `<div class="container h-auto max-w-[50vw] border border-gray-500 rounded-md m-1 p-1">${validate_component(FileLoadStates, "FileLoadStates").$$render($$result, { state }, {}, {
    default: () => {
      return `<img${add_attribute("src", url, 0)} alt="${escape(attachment.name, true) + " - " + escape(attachment.type, true) + " - " + escape(attachment.size, true) + " bytes"}" class="rounded-md w-autp h-auto" loading="lazy">`;
    }
  })}</div>`;
});
const css$3 = {
  code: "pre.svelte-1f0egjz{padding:0px !important}",
  map: null
};
const CodeBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { language } = $$props;
  let { code } = $$props;
  if ($$props.language === void 0 && $$bindings.language && language !== void 0)
    $$bindings.language(language);
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  $$result.css.add(css$3);
  return `${$$result.head += `<!-- HEAD_svelte-d61zyz_START --><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Fira+Code:400,700" type="text/css"><link rel="stylesheet" href="https://tutsplus.github.io/syntax-highlighter-demos/highlighters/Prism/prism_okaidia.css"><!-- HEAD_svelte-d61zyz_END -->`, ""} <pre class="m-0 p-0 flex flex-grow items-center justify-center  svelte-1f0egjz">    <code class="${"language-" + escape(language, true) + " h-full w-full"}">${escape(code)}</code>
</pre>`;
});
const Txt = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_scroll_to_bottom;
  $$unsubscribe_scroll_to_bottom = subscribe(scroll_to_bottom, (value) => value);
  let { attachment } = $$props;
  const size = bytes_to_size(attachment.size);
  let content = "";
  const state = writable(FileLoadState.LOADING);
  if ($$props.attachment === void 0 && $$bindings.attachment && attachment !== void 0)
    $$bindings.attachment(attachment);
  $$unsubscribe_scroll_to_bottom();
  return `<div class="container overflow-x-hidden border border-gray-500 h-auto max-w-[75vw] rounded-md m-1 p-1 "> <div class="flex flex-wrap items-center justify-center border-b border-gray-500 p-1"><p class="text-sm text-gray-300 text-ellipsis">${escape(attachment.name)}</p> <span class="text-sm text-gray-500 mx-1" data-svelte-h="svelte-175tc95">|</span> <p class="text-sm text-gray-400">${escape(size)}</p> <span class="text-sm text-gray-500 mx-1" data-svelte-h="svelte-175tc95">|</span> <p class="text-sm text-gray-400">${escape(attachment.type)}</p> <span class="text-sm text-gray-500 mx-1" data-svelte-h="svelte-175tc95">|</span>  <button class="border border-gray-500 rounded-md p-1 m-1 w-auto" title="Copy to clipboard">${validate_component(Fa, "Fa").$$render($$result, { icon: faCopy, class: "text-gray-100" }, {}, {})}</button>  <a href="${"/file/$" + escape(attachment.id, true)}" target="_blank" class="border border-gray-500 rounded-md p-1 m-1 w-auto" title="Download">${validate_component(Fa, "Fa").$$render($$result, { icon: faDownload, class: "text-gray-100" }, {}, {})}</a></div> ${validate_component(FileLoadStates, "FileLoadStates").$$render($$result, { state }, {}, {
    default: () => {
      return ` ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          language: attachment.type.split("/")[1],
          code: content
        },
        {},
        {}
      )}`;
    }
  })}</div>`;
});
const Attachment = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { attachment } = $$props;
  const type = attachment.type.split("/")[0];
  const size = bytes_to_size(attachment.size);
  if ($$props.attachment === void 0 && $$bindings.attachment && attachment !== void 0)
    $$bindings.attachment(attachment);
  return `${type == "image" ? `${validate_component(Image, "Image").$$render($$result, { attachment }, {}, {})}` : `${type == "text" ? `${validate_component(Txt, "Txt").$$render($$result, { attachment }, {}, {})} ` : ` <a href="${"/file/" + escape(attachment.id, true)}" target="_blank"><div class="flex items-center space-x-2 border border-gray-500 rounded-md p-1 m-1">${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faFile,
      class: "text-gray-400 text-3xl mx-1"
    },
    {},
    {}
  )} <div class="flex flex-col"><span class="text-sm text-gray-300">${escape(attachment.name)}</span> <div class="flex flex-grow"><span class="text-sm text-gray-400">${escape(size)}</span> <span class="text-sm text-gray-500 mx-1" data-svelte-h="svelte-175tc95">|</span> <span class="text-sm text-gray-400">${escape(type)}</span></div></div></div></a>`}`}`;
});
const MessageTimestamp = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { timestamp } = $$props;
  let time = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if ($$props.timestamp === void 0 && $$bindings.timestamp && timestamp !== void 0)
    $$bindings.timestamp(timestamp);
  return ` <div class="mx-3" title="${"Message timestamp: " + escape(timestamp, true)}"><div class="flex justify-between items-center"><p class="text-gray-400 text-xs">${escape(time)}</p></div></div>`;
});
const css$2 = {
  code: ".bubble.svelte-gfmtgj{border:2px solid #374151;border-bottom-left-radius:0}.left.svelte-gfmtgj{align-self:flex-start}.right.svelte-gfmtgj{align-self:flex-end}.owned.svelte-gfmtgj{background-color:#374151;border:2px solid #374151;border-bottom-left-radius:0.75em;border-bottom-right-radius:0}.owned.svelte-gfmtgj:hover{background-color:#1f2937}.other.svelte-gfmtgj{border:2px solid #374151;border-bottom-left-radius:0;border-bottom-right-radius:0.75em}.other.svelte-gfmtgj:hover{background-color:#1f2937}.timestamp.svelte-gfmtgj{opacity:0;transition:opacity 0.15s ease-in}.timestamp.svelte-gfmtgj:hover{opacity:1}",
  map: null
};
const Message = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { username } = $$props;
  let { message } = $$props;
  const owned = username === message.author;
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  $$result.css.add(css$2);
  return `<div class="${"flex flex-col " + escape(owned ? "right" : "left", true) + " mb-2 svelte-gfmtgj"}"> <div class="${"flex " + escape(owned ? "flex-row-reverse right" : "flex-row left", true) + " items-center transition-all duration-300 min-h-fit w-full svelte-gfmtgj"}"> ${message.content ? `<div class="${"bubble " + escape(owned ? "owned" : "other", true) + " flex flex-col items-start break-words rounded-xl p-2 w-auto svelte-gfmtgj"}"><div class="flex flex-col items-start text-gray-200 text-base w-max ">${validate_component(Markdown, "Markdown").$$render($$result, { source: message.content }, {}, {})}</div></div>` : ``}  <div class="timestamp flex flex-col items-center justify-center w-full h-full svelte-gfmtgj">${validate_component(MessageTimestamp, "MessageTimestamp").$$render($$result, { timestamp: message.timestamp }, {}, {})}</div></div>  <class class="flex flex-col items-center justify-center w-full h-full">${each(message.attachments, (attachment) => {
    return `${validate_component(Attachment, "Attachment").$$render($$result, { attachment }, {}, {})}`;
  })}</class></div>  `;
});
const ChatContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_scroll_to_bottom;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_scroll_to_bottom = subscribe(scroll_to_bottom, (value) => value);
  let { messages } = $$props;
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  let { username } = $$props;
  let container;
  scroll_to_bottom.set(() => {
    container.scrollTo(0, container.scrollHeight + 200);
  });
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  $$unsubscribe_scroll_to_bottom();
  $$unsubscribe_messages();
  return `<div class="flex flex-col overflow-y-auto w-full min-h-full px-2 scroll-smooth transition-all duration-300 "${add_attribute("this", container, 0)}>${each($messages, (message) => {
    return `${validate_component(Message, "Message").$$render($$result, { username, message }, {}, {})}`;
  })}</div>`;
});
const default_value = {};
const initial_value = default_value;
const messsage_drafts = writable(initial_value);
messsage_drafts.subscribe((value) => {
});
const css$1 = {
  code: ".blink-bg.svelte-ir4ah9{animation:svelte-ir4ah9-blink-bg 2s infinite ease-in-out}@keyframes svelte-ir4ah9-blink-bg{25%{filter:brightness(0.75)}75%{filter:brightness(1.25)}}",
  map: null
};
const ChatInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $message, $$unsubscribe_message;
  let $files, $$unsubscribe_files;
  let $messsage_drafts, $$unsubscribe_messsage_drafts;
  $$unsubscribe_messsage_drafts = subscribe(messsage_drafts, (value) => $messsage_drafts = value);
  let { username } = $$props;
  let { chat_id } = $$props;
  let message = writable($messsage_drafts[chat_id] || "");
  $$unsubscribe_message = subscribe(message, (value) => $message = value);
  let files = writable(null);
  $$unsubscribe_files = subscribe(files, (value) => $files = value);
  message.subscribe((val) => {
    messsage_drafts.update((drafts) => {
      drafts[chat_id] = val;
      return drafts;
    });
  });
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.chat_id === void 0 && $$bindings.chat_id && chat_id !== void 0)
    $$bindings.chat_id(chat_id);
  $$result.css.add(css$1);
  $$unsubscribe_message();
  $$unsubscribe_files();
  $$unsubscribe_messsage_drafts();
  return `<div class="flex flex-grow justify-center items-center p-0 container max-h-[2.75rem] mx-auto rounded-lg mb-2 mt-1 transition-all duration-300 max-w-2xl "> <button class="${"flex justify-center items-center w-12 h-full rounded-l-lg border-gray-600 bg-gray-900 hover:bg-gray-300 text-gray-200 hover:text-black transition-all duration-300 " + escape($files ? "blink-bg" : "", true) + " svelte-ir4ah9"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faPaperclip, class: "mb-1" }, {}, {})}  <span class="${"" + escape($files ? "opacity-100 ml-1 mt-2" : "opacity-0", true)}" title=" files selected">${escape($files ? $files.length : "")}</span></button> <form class="m-0 p-0 h-full w-10/12 max-h-full flex justify-between items-center outline-none bg-gray-800 "> <input type="file" multiple class="hidden" accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt" name="file">  <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="w-full h-full p-1 m-0 outline-none border-none resize-y overflow-y-auto bg-transparent text-gray-100 " placeholder="Type a message...">${escape($message || "")}</textarea>  <button class="${escape(
    $message || $files ? "opacity-100 w-12" : "w-0 opacity-0",
    true
  ) + " flex justify-center items-center h-full rounded-r-lg border-gray-600 bg-gray-900 hover:bg-gray-300 text-gray-200 hover:text-black transition-all duration-300"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faPaperPlane }, {}, {})}</button></form> </div>`;
});
const css = {
  code: ".layout.svelte-17rkisa{display:grid;grid-template-columns:1;grid-template-rows:auto 1fr auto;min-height:100vh;max-height:100vh}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $friend_status, $$unsubscribe_friend_status;
  let { data } = $$props;
  let { container } = $$props;
  let messages = writable(data.chat.messages);
  let friend_status = writable(Status.OFFLINE);
  $$unsubscribe_friend_status = subscribe(friend_status, (value) => $friend_status = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  $$result.css.add(css);
  $$unsubscribe_friend_status();
  return `${$$result.head += `<!-- HEAD_svelte-2hjwt8_START -->${$$result.title = `<title>Chat</title>`, ""}<meta name="description" content="Slash chat"><meta name="keywords" content="slash, chat, slashchat, slash chat"><!-- HEAD_svelte-2hjwt8_END -->`, ""} ${validate_component(Notification, "Notification").$$render($$result, {}, {}, {})} <main class="max-w-3xl mx-auto layout svelte-17rkisa"${add_attribute("this", container, 0)}> <nav class="my-1 flex justify-between items-center w-full p-1 border-b border-gray-700"><a${add_attribute("href", Routes.HOME, 0)} class="ml-1 rotate text-gray-400 hover:text-gray-100">${validate_component(Fa, "Fa").$$render($$result, { icon: faArrowLeft, class: "text-2xl" }, {}, {})}</a> <a href="${escape(Routes.PROFILE, true) + "/" + escape(data.other, true)}" class="flex justify-center items-center"><div class="flex justify-center items-center" title="Click to view profile">${validate_component(AvatarImage, "AvatarImage").$$render($$result, { username: data.other }, {}, {})} <div class="flex flex-col justify-center items-center"><h1 class="ml-2 text-gray-100 text-xl">${escape(data.other)}</h1> ${data.user.verified ? `${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faCertificate,
      class: "ml-1 text-purple-500"
    },
    {},
    {}
  )}` : ``}  <p class="${"text-gray-400 text-sm " + escape($friend_status, true) + " svelte-17rkisa"}">${escape($friend_status)}</p></div></div></a>  <div></div></nav>  ${validate_component(ChatContainer, "ChatContainer").$$render($$result, { username: data.user.username, messages }, {}, {})}  ${validate_component(ChatInput, "ChatInput").$$render(
    $$result,
    {
      username: data.user.username,
      chat_id: data.chat.id
    },
    {},
    {}
  )} </main>`;
});
export {
  Page as default
};
