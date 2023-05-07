var __create = Object.create;
var __descs = Object.getOwnPropertyDescriptors;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/highlight.js/styles/base16/gruvbox-dark-hard.css
var require_gruvbox_dark_hard = __commonJS(() => {
  var head = document.head;
  var style = document.createElement("style");
  head.appendChild(style);
  style.type = "text/css";
  style.appendChild(document.createTextNode(`/*!
  Theme: Gruvbox dark, hard
  Author: Dawid Kurek (dawikur@gmail.com), morhetz (https://github.com/morhetz/gruvbox)
  License: ~ MIT (or more permissive) [via base16-schemes-source]
  Maintainer: @highlightjs/core-team
  Version: 2021.09.0
*/pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{color:#d5c4a1;background:#1d2021}.hljs ::selection,.hljs::selection{background-color:#504945;color:#d5c4a1}.hljs-comment{color:#665c54}.hljs-tag{color:#bdae93}.hljs-operator,.hljs-punctuation,.hljs-subst{color:#d5c4a1}.hljs-operator{opacity:.7}.hljs-bullet,.hljs-deletion,.hljs-name,.hljs-selector-tag,.hljs-template-variable,.hljs-variable{color:#fb4934}.hljs-attr,.hljs-link,.hljs-literal,.hljs-number,.hljs-symbol,.hljs-variable.constant_{color:#fe8019}.hljs-class .hljs-title,.hljs-title,.hljs-title.class_{color:#fabd2f}.hljs-strong{font-weight:700;color:#fabd2f}.hljs-addition,.hljs-code,.hljs-string,.hljs-title.class_.inherited__{color:#b8bb26}.hljs-built_in,.hljs-doctag,.hljs-keyword.hljs-atrule,.hljs-quote,.hljs-regexp{color:#8ec07c}.hljs-attribute,.hljs-function .hljs-title,.hljs-section,.hljs-title.function_,.ruby .hljs-property{color:#83a598}.diff .hljs-meta,.hljs-keyword,.hljs-template-tag,.hljs-type{color:#d3869b}.hljs-emphasis{color:#d3869b;font-style:italic}.hljs-meta,.hljs-meta .hljs-keyword,.hljs-meta .hljs-string{color:#d65d0e}.hljs-meta .hljs-keyword,.hljs-meta-keyword{font-weight:700}`));
});
// node_modules/svelte/internal/index.mjs
var noop = function() {
};
var run = function(fn) {
  return fn();
};
var blank_object = function() {
  return Object.create(null);
};
var run_all = function(fns) {
  fns.forEach(run);
};
var is_function = function(thing) {
  return typeof thing === "function";
};
var safe_not_equal = function(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
};
var is_empty = function(obj) {
  return Object.keys(obj).length === 0;
};
var start_hydrating = function() {
  is_hydrating = true;
};
var end_hydrating = function() {
  is_hydrating = false;
};
var upper_bound = function(low, high, key, value) {
  while (low < high) {
    const mid = low + (high - low >> 1);
    if (key(mid) <= value)
      low = mid + 1;
    else
      high = mid;
  }
  return low;
};
var init_hydrate = function(target) {
  if (target.hydrate_init)
    return;
  target.hydrate_init = true;
  let children = target.childNodes;
  if (target.nodeName === "HEAD") {
    const myChildren = [];
    for (let i = 0;i < children.length; i++) {
      const node = children[i];
      if (node.claim_order !== undefined)
        myChildren.push(node);
    }
    children = myChildren;
  }
  const m = new Int32Array(children.length + 1);
  const p = new Int32Array(children.length);
  m[0] = -1;
  let longest = 0;
  for (let i = 0;i < children.length; i++) {
    const current = children[i].claim_order;
    const seqLen = (longest > 0 && children[m[longest]].claim_order <= current ? longest + 1 : upper_bound(1, longest, (idx) => children[m[idx]].claim_order, current)) - 1;
    p[i] = m[seqLen] + 1;
    const newLen = seqLen + 1;
    m[newLen] = i;
    longest = Math.max(newLen, longest);
  }
  const lis = [];
  const toMove = [];
  let last = children.length - 1;
  for (let cur = m[longest] + 1;cur != 0; cur = p[cur - 1]) {
    lis.push(children[cur - 1]);
    for (;last >= cur; last--)
      toMove.push(children[last]);
    last--;
  }
  for (;last >= 0; last--)
    toMove.push(children[last]);
  lis.reverse();
  toMove.sort((a, b) => a.claim_order - b.claim_order);
  for (let i = 0, j = 0;i < toMove.length; i++) {
    while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order)
      j++;
    const anchor = j < lis.length ? lis[j] : null;
    target.insertBefore(toMove[i], anchor);
  }
};
var append = function(target, node) {
  target.appendChild(node);
};
var append_styles = function(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
};
var get_root_for_style = function(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host)
    return root;
  return node.ownerDocument;
};
var append_stylesheet = function(node, style) {
  append(node.head || node, style);
};
var append_hydration = function(target, node) {
  if (is_hydrating) {
    init_hydrate(target);
    if (target.actual_end_child === undefined || target.actual_end_child !== null && target.actual_end_child.parentElement !== target)
      target.actual_end_child = target.firstChild;
    while (target.actual_end_child !== null && target.actual_end_child.claim_order === undefined)
      target.actual_end_child = target.actual_end_child.nextSibling;
    if (node !== target.actual_end_child) {
      if (node.claim_order !== undefined || node.parentNode !== target)
        target.insertBefore(node, target.actual_end_child);
    } else
      target.actual_end_child = node.nextSibling;
  } else if (node.parentNode !== target || node.nextSibling !== null)
    target.appendChild(node);
};
var insert_hydration = function(target, node, anchor) {
  if (is_hydrating && !anchor)
    append_hydration(target, node);
  else if (node.parentNode !== target || node.nextSibling != anchor)
    target.insertBefore(node, anchor || null);
};
var detach = function(node) {
  node.parentNode.removeChild(node);
};
var destroy_each = function(iterations, detaching) {
  for (let i = 0;i < iterations.length; i += 1)
    if (iterations[i])
      iterations[i].d(detaching);
};
var element = function(name) {
  return document.createElement(name);
};
var text = function(data) {
  return document.createTextNode(data);
};
var space = function() {
  return text(" ");
};
var listen = function(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
};
var attr = function(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
};
var children = function(element2) {
  return Array.from(element2.childNodes);
};
var init_claim_info = function(nodes) {
  if (nodes.claim_info === undefined)
    nodes.claim_info = { last_index: 0, total_claimed: 0 };
};
var claim_node = function(nodes, predicate, processNode, createNode, dontUpdateLastIndex = false) {
  init_claim_info(nodes);
  const resultNode = (() => {
    for (let i = nodes.claim_info.last_index;i < nodes.length; i++) {
      const node = nodes[i];
      if (predicate(node)) {
        const replacement = processNode(node);
        if (replacement === undefined)
          nodes.splice(i, 1);
        else
          nodes[i] = replacement;
        if (!dontUpdateLastIndex)
          nodes.claim_info.last_index = i;
        return node;
      }
    }
    for (let i = nodes.claim_info.last_index - 1;i >= 0; i--) {
      const node = nodes[i];
      if (predicate(node)) {
        const replacement = processNode(node);
        if (replacement === undefined)
          nodes.splice(i, 1);
        else
          nodes[i] = replacement;
        if (!dontUpdateLastIndex)
          nodes.claim_info.last_index = i;
        else if (replacement === undefined)
          nodes.claim_info.last_index--;
        return node;
      }
    }
    return createNode();
  })();
  resultNode.claim_order = nodes.claim_info.total_claimed;
  nodes.claim_info.total_claimed += 1;
  return resultNode;
};
var claim_element_base = function(nodes, name, attributes, create_element) {
  return claim_node(nodes, (node) => node.nodeName === name, (node) => {
    const remove = [];
    for (let j = 0;j < node.attributes.length; j++) {
      const attribute = node.attributes[j];
      if (!attributes[attribute.name])
        remove.push(attribute.name);
    }
    remove.forEach((v) => node.removeAttribute(v));
    return;
  }, () => create_element(name));
};
var claim_element = function(nodes, name, attributes) {
  return claim_element_base(nodes, name, attributes, element);
};
var claim_text = function(nodes, data) {
  return claim_node(nodes, (node) => node.nodeType === 3, (node) => {
    const dataStr = "" + data;
    if (node.data.startsWith(dataStr)) {
      if (node.data.length !== dataStr.length)
        return node.splitText(dataStr.length);
    } else
      node.data = dataStr;
  }, () => text(data), true);
};
var claim_space = function(nodes) {
  return claim_text(nodes, " ");
};
var set_data = function(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
};
var set_style = function(node, key, value, important) {
  if (value === null)
    node.style.removeProperty(key);
  else
    node.style.setProperty(key, value, important ? "important" : "");
};
var set_current_component = function(component) {
  current_component = component;
};
var schedule_update = function() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
};
var add_render_callback = function(fn) {
  render_callbacks.push(fn);
};
var flush = function() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0;i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length)
    flush_callbacks.pop()();
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
};
var update = function($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
};
var transition_in = function(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
};
var transition_out = function(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
};
var create_component = function(block) {
  block && block.c();
};
var claim_component = function(block, parent_nodes) {
  block && block.l(parent_nodes);
};
var mount_component = function(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement)
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy)
        on_destroy.push(...new_on_destroy);
      else
        run_all(new_on_destroy);
      component.$$.on_mount = [];
    });
  after_update.forEach(add_render_callback);
};
var destroy_component = function(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
};
var make_dirty = function(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
};
var init = function(component, options, instance, create_fragment, not_equal, props, append_styles2, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance ? instance(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else
      $$.fragment && $$.fragment.c();
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
};
var tasks = new Set;
var is_hydrating = false;
var managed_styles = new Map;
var current_component;
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
var seen_callbacks = new Set;
var flushidx = 0;
var outroing = new Set;
var outros;
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var SvelteElement;
if (typeof HTMLElement === "function")
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted)
        this.appendChild(this.$$.slotted[key]);
    }
    attributeChangedCallback(attr2, _oldValue, newValue) {
      this[attr2] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}

// /home/jani/devel/web/personal/.buchta/output/components/navbar-pSFyCoc.js
var add_css = function(target) {
  append_styles(target, "svelte-6hhjeo", "nav.svelte-6hhjeo{display:flex;background-color:var(--aqua-dim)}p.svelte-6hhjeo{margin:0;padding:7px;background-color:var(--bg_s);font-weight:bold;cursor:pointer}");
};
var get_each_context = function(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i];
  return child_ctx;
};
var create_each_block = function(ctx) {
  let p;
  let t_value = ctx[2].t + "";
  let t;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[1](ctx[2]);
  }
  return {
    c() {
      p = element("p");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      p = claim_element(nodes, "P", { class: true });
      var p_nodes = children(p);
      t = claim_text(p_nodes, t_value);
      p_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(p, "class", "svelte-6hhjeo");
    },
    m(target, anchor) {
      insert_hydration(target, p, anchor);
      append_hydration(p, t);
      if (!mounted) {
        dispose = listen(p, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t_value !== (t_value = ctx[2].t + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(p);
      mounted = false;
      dispose();
    }
  };
};
var create_fragment = function(ctx) {
  let nav;
  let t0;
  let div;
  let t1;
  let p;
  let t2;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0;i < each_value.length; i += 1)
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  return {
    c() {
      nav = element("nav");
      for (let i = 0;i < each_blocks.length; i += 1)
        each_blocks[i].c();
      t0 = space();
      div = element("div");
      t1 = space();
      p = element("p");
      t2 = text("J\xE1n Gajdo\u0161");
      this.h();
    },
    l(nodes) {
      nav = claim_element(nodes, "NAV", { class: true });
      var nav_nodes = children(nav);
      for (let i = 0;i < each_blocks.length; i += 1)
        each_blocks[i].l(nav_nodes);
      t0 = claim_space(nav_nodes);
      div = claim_element(nav_nodes, "DIV", { style: true });
      children(div).forEach(detach);
      t1 = claim_space(nav_nodes);
      p = claim_element(nav_nodes, "P", { class: true });
      var p_nodes = children(p);
      t2 = claim_text(p_nodes, "J\xE1n Gajdo\u0161");
      p_nodes.forEach(detach);
      nav_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_style(div, "flex-grow", "1");
      attr(p, "class", "svelte-6hhjeo");
      attr(nav, "class", "svelte-6hhjeo");
    },
    m(target, anchor) {
      insert_hydration(target, nav, anchor);
      for (let i = 0;i < each_blocks.length; i += 1)
        if (each_blocks[i])
          each_blocks[i].m(nav, null);
      append_hydration(nav, t0);
      append_hydration(nav, div);
      append_hydration(nav, t1);
      append_hydration(nav, p);
      append_hydration(p, t2);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        each_value = ctx2[0];
        let i;
        for (i = 0;i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i])
            each_blocks[i].p(child_ctx, dirty);
          else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(nav, t0);
          }
        }
        for (;i < each_blocks.length; i += 1)
          each_blocks[i].d(1);
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(nav);
      destroy_each(each_blocks, detaching);
    }
  };
};
var instance = function($$self, $$props, $$invalidate) {
  let { pages = [] } = $$props;
  const click_handler = (page) => {
    if (typeof page.s == "string")
      location.href = page.s;
    else
      page.s();
  };
  $$self.$$set = ($$props2) => {
    if ("pages" in $$props2)
      $$invalidate(0, pages = $$props2.pages);
  };
  return [pages, click_handler];
};

class Component extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { pages: 0 }, add_css);
  }
}
var navbar_pSFyCoc_default = Component;

// /home/jani/devel/web/personal/.buchta/output/blog/my-first-blog/index-q0aQ226.js
var gruvbox_dark_hard = __toESM(require_gruvbox_dark_hard());
var add_css2 = function(target) {
  append_styles(target, "svelte-dxywd4", "@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@500;700&display=swap');:root{--bg_h:#1d2021;--bg:#282828;--bg_s:#32302f;--bg1:#3c3836;--bg2:#504945;--bg3:#665c54;--bg4:#7c6f64;--fg:#fbf1c7;--fg1:#ebdbb2;--fg2:#d5c4a1;--fg3:#bdae93;--fg4:#a89984;--red:#fb4934;--green:#b8bb26;--yellow:#fabd2f;--blue:#83a598;--purple:#d3869b;--aqua:#8ec07c;--gray:#928374;--orange:#fe8019;--red-dim:#cc2412;--green-dim:#98971a;--yellow-dim:#d79921;--blue-dim:#458588;--purple-dim:#b16286;--aqua-dim:#689d6a;--gray-dim:#a89984;--orange-dim:#d65d0e}body{margin:0;padding:0;width:100vw;height:100vh;background-color:var(--bg_h)}.svelte-dxywd4.svelte-dxywd4:not(pre > *, a){color:var(--fg);font-family:'Nunito Sans', sans-serif}a.svelte-dxywd4.svelte-dxywd4{color:var(--blue);text-decoration:none}main.svelte-dxywd4.svelte-dxywd4{display:flex;flex-direction:column;overflow-wrap:break-word;max-width:90vw;margin:auto;margin-top:50px;gap:25px}main.svelte-dxywd4>div.svelte-dxywd4{padding:7px;border-radius:7px;background-color:var(--bg);flex-grow:1;transition:all 150ms}.ql-syntax{background-color:var(--bg_h);padding:7px;border-radius:7px}");
};
var create_fragment2 = function(ctx) {
  let div1;
  let navbar;
  let t0;
  let main;
  let div0;
  let h10;
  let t1;
  let p0;
  let t2;
  let p1;
  let s;
  let t3;
  let p2;
  let u0;
  let t4;
  let p3;
  let em0;
  let t5;
  let p4;
  let strong0;
  let t6;
  let h11;
  let t7;
  let h2;
  let t8;
  let p5;
  let a;
  let t9;
  let p6;
  let strong1;
  let em1;
  let u1;
  let t10;
  let pre;
  let span0;
  let t11;
  let t12;
  let span1;
  let t13;
  let t14;
  let span2;
  let t15;
  let t16;
  let span3;
  let t17;
  let t18;
  let span4;
  let t19;
  let t20;
  let current;
  navbar = new navbar_pSFyCoc_default({ props: { pages: ctx[0] } });
  return {
    c() {
      div1 = element("div");
      create_component(navbar.$$.fragment);
      t0 = space();
      main = element("main");
      div0 = element("div");
      h10 = element("h1");
      t1 = text("Hello, This is my first blog");
      p0 = element("p");
      t2 = text("I wrote this one just for a test, Nothing special");
      p1 = element("p");
      s = element("s");
      t3 = text("This should be strikethrough");
      p2 = element("p");
      u0 = element("u");
      t4 = text("This should be underlined");
      p3 = element("p");
      em0 = element("em");
      t5 = text("This should be italic");
      p4 = element("p");
      strong0 = element("strong");
      t6 = text("And this bold");
      h11 = element("h1");
      t7 = text("Header1");
      h2 = element("h2");
      t8 = text("Header2");
      p5 = element("p");
      a = element("a");
      t9 = text("Buchta's website");
      p6 = element("p");
      strong1 = element("strong");
      em1 = element("em");
      u1 = element("u");
      t10 = text("Just a codeblock yeah?");
      pre = element("pre");
      span0 = element("span");
      t11 = text("console");
      t12 = text(".");
      span1 = element("span");
      t13 = text("log");
      t14 = text("(");
      span2 = element("span");
      t15 = text("\"js\"");
      t16 = text(")\n\n");
      span3 = element("span");
      t17 = text("alert");
      t18 = text("(");
      span4 = element("span");
      t19 = text("\"This is simple codeblock\"");
      t20 = text(");\n");
      this.h();
    },
    l(nodes) {
      div1 = claim_element(nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      claim_component(navbar.$$.fragment, div1_nodes);
      t0 = claim_space(div1_nodes);
      main = claim_element(div1_nodes, "MAIN", { class: true });
      var main_nodes = children(main);
      div0 = claim_element(main_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      h10 = claim_element(div0_nodes, "H1", { class: true });
      var h10_nodes = children(h10);
      t1 = claim_text(h10_nodes, "Hello, This is my first blog");
      h10_nodes.forEach(detach);
      p0 = claim_element(div0_nodes, "P", { class: true });
      var p0_nodes = children(p0);
      t2 = claim_text(p0_nodes, "I wrote this one just for a test, Nothing special");
      p0_nodes.forEach(detach);
      p1 = claim_element(div0_nodes, "P", { class: true });
      var p1_nodes = children(p1);
      s = claim_element(p1_nodes, "S", { class: true });
      var s_nodes = children(s);
      t3 = claim_text(s_nodes, "This should be strikethrough");
      s_nodes.forEach(detach);
      p1_nodes.forEach(detach);
      p2 = claim_element(div0_nodes, "P", { class: true });
      var p2_nodes = children(p2);
      u0 = claim_element(p2_nodes, "U", { class: true });
      var u0_nodes = children(u0);
      t4 = claim_text(u0_nodes, "This should be underlined");
      u0_nodes.forEach(detach);
      p2_nodes.forEach(detach);
      p3 = claim_element(div0_nodes, "P", { class: true });
      var p3_nodes = children(p3);
      em0 = claim_element(p3_nodes, "EM", { class: true });
      var em0_nodes = children(em0);
      t5 = claim_text(em0_nodes, "This should be italic");
      em0_nodes.forEach(detach);
      p3_nodes.forEach(detach);
      p4 = claim_element(div0_nodes, "P", { class: true });
      var p4_nodes = children(p4);
      strong0 = claim_element(p4_nodes, "STRONG", { class: true });
      var strong0_nodes = children(strong0);
      t6 = claim_text(strong0_nodes, "And this bold");
      strong0_nodes.forEach(detach);
      p4_nodes.forEach(detach);
      h11 = claim_element(div0_nodes, "H1", { class: true });
      var h11_nodes = children(h11);
      t7 = claim_text(h11_nodes, "Header1");
      h11_nodes.forEach(detach);
      h2 = claim_element(div0_nodes, "H2", { class: true });
      var h2_nodes = children(h2);
      t8 = claim_text(h2_nodes, "Header2");
      h2_nodes.forEach(detach);
      p5 = claim_element(div0_nodes, "P", { class: true });
      var p5_nodes = children(p5);
      a = claim_element(p5_nodes, "A", {
        href: true,
        rel: true,
        target: true,
        class: true
      });
      var a_nodes = children(a);
      t9 = claim_text(a_nodes, "Buchta's website");
      a_nodes.forEach(detach);
      p5_nodes.forEach(detach);
      p6 = claim_element(div0_nodes, "P", { class: true });
      var p6_nodes = children(p6);
      strong1 = claim_element(p6_nodes, "STRONG", { class: true });
      var strong1_nodes = children(strong1);
      em1 = claim_element(strong1_nodes, "EM", { class: true });
      var em1_nodes = children(em1);
      u1 = claim_element(em1_nodes, "U", { class: true });
      var u1_nodes = children(u1);
      t10 = claim_text(u1_nodes, "Just a codeblock yeah?");
      u1_nodes.forEach(detach);
      em1_nodes.forEach(detach);
      strong1_nodes.forEach(detach);
      p6_nodes.forEach(detach);
      pre = claim_element(div0_nodes, "PRE", { class: true, spellcheck: true });
      var pre_nodes = children(pre);
      span0 = claim_element(pre_nodes, "SPAN", { class: true });
      var span0_nodes = children(span0);
      t11 = claim_text(span0_nodes, "console");
      span0_nodes.forEach(detach);
      t12 = claim_text(pre_nodes, ".");
      span1 = claim_element(pre_nodes, "SPAN", { class: true });
      var span1_nodes = children(span1);
      t13 = claim_text(span1_nodes, "log");
      span1_nodes.forEach(detach);
      t14 = claim_text(pre_nodes, "(");
      span2 = claim_element(pre_nodes, "SPAN", { class: true });
      var span2_nodes = children(span2);
      t15 = claim_text(span2_nodes, "\"js\"");
      span2_nodes.forEach(detach);
      t16 = claim_text(pre_nodes, ")\n\n");
      span3 = claim_element(pre_nodes, "SPAN", { class: true });
      var span3_nodes = children(span3);
      t17 = claim_text(span3_nodes, "alert");
      span3_nodes.forEach(detach);
      t18 = claim_text(pre_nodes, "(");
      span4 = claim_element(pre_nodes, "SPAN", { class: true });
      var span4_nodes = children(span4);
      t19 = claim_text(span4_nodes, "\"This is simple codeblock\"");
      span4_nodes.forEach(detach);
      t20 = claim_text(pre_nodes, ");\n");
      pre_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      main_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(h10, "class", "svelte-dxywd4");
      attr(p0, "class", "svelte-dxywd4");
      attr(s, "class", "svelte-dxywd4");
      attr(p1, "class", "svelte-dxywd4");
      attr(u0, "class", "svelte-dxywd4");
      attr(p2, "class", "svelte-dxywd4");
      attr(em0, "class", "svelte-dxywd4");
      attr(p3, "class", "svelte-dxywd4");
      attr(strong0, "class", "svelte-dxywd4");
      attr(p4, "class", "svelte-dxywd4");
      attr(h11, "class", "svelte-dxywd4");
      attr(h2, "class", "svelte-dxywd4");
      attr(a, "href", "https://buchtajs.com");
      attr(a, "rel", "noopener noreferrer");
      attr(a, "target", "_blank");
      attr(a, "class", "svelte-dxywd4");
      attr(p5, "class", "svelte-dxywd4");
      attr(u1, "class", "svelte-dxywd4");
      attr(em1, "class", "svelte-dxywd4");
      attr(strong1, "class", "svelte-dxywd4");
      attr(p6, "class", "svelte-dxywd4");
      attr(span0, "class", "hljs-variable language_ svelte-dxywd4");
      attr(span1, "class", "hljs-title function_ svelte-dxywd4");
      attr(span2, "class", "hljs-string svelte-dxywd4");
      attr(span3, "class", "hljs-title function_ svelte-dxywd4");
      attr(span4, "class", "hljs-string svelte-dxywd4");
      attr(pre, "class", "ql-syntax svelte-dxywd4");
      attr(pre, "spellcheck", "false");
      attr(div0, "class", "svelte-dxywd4");
      attr(main, "class", "svelte-dxywd4");
      attr(div1, "class", "svelte-dxywd4");
    },
    m(target, anchor) {
      insert_hydration(target, div1, anchor);
      mount_component(navbar, div1, null);
      append_hydration(div1, t0);
      append_hydration(div1, main);
      append_hydration(main, div0);
      append_hydration(div0, h10);
      append_hydration(h10, t1);
      append_hydration(div0, p0);
      append_hydration(p0, t2);
      append_hydration(div0, p1);
      append_hydration(p1, s);
      append_hydration(s, t3);
      append_hydration(div0, p2);
      append_hydration(p2, u0);
      append_hydration(u0, t4);
      append_hydration(div0, p3);
      append_hydration(p3, em0);
      append_hydration(em0, t5);
      append_hydration(div0, p4);
      append_hydration(p4, strong0);
      append_hydration(strong0, t6);
      append_hydration(div0, h11);
      append_hydration(h11, t7);
      append_hydration(div0, h2);
      append_hydration(h2, t8);
      append_hydration(div0, p5);
      append_hydration(p5, a);
      append_hydration(a, t9);
      append_hydration(div0, p6);
      append_hydration(p6, strong1);
      append_hydration(strong1, em1);
      append_hydration(em1, u1);
      append_hydration(u1, t10);
      append_hydration(div0, pre);
      append_hydration(pre, span0);
      append_hydration(span0, t11);
      append_hydration(pre, t12);
      append_hydration(pre, span1);
      append_hydration(span1, t13);
      append_hydration(pre, t14);
      append_hydration(pre, span2);
      append_hydration(span2, t15);
      append_hydration(pre, t16);
      append_hydration(pre, span3);
      append_hydration(span3, t17);
      append_hydration(pre, t18);
      append_hydration(pre, span4);
      append_hydration(span4, t19);
      append_hydration(pre, t20);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(navbar.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(navbar.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_component(navbar);
    }
  };
};
var instance2 = function($$self) {
  const pages = [
    { t: "Home", s: "/" },
    { t: "Blog", s: "/blog/" },
    {
      t: "Socials",
      s: () => {
        console.log("Hello");
      }
    }
  ];
  return [pages];
};

class Component2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, {}, add_css2);
  }
}
var index_q0aQ226_default = Component2;
new Component2({ target: document.body, hydrate: true });
export {
  index_q0aQ226_default as default
};
