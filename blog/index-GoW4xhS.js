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

// /home/jani/devel/web/personal/.buchta/output/blog/index-GoW4xhS.js
var add_css2 = function(target) {
  append_styles(target, "svelte-195cznv", "@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@500;700&display=swap');:root{--bg_h:#1d2021;--bg:#282828;--bg_s:#32302f;--bg1:#3c3836;--bg2:#504945;--bg3:#665c54;--bg4:#7c6f64;--fg:#fbf1c7;--fg1:#ebdbb2;--fg2:#d5c4a1;--fg3:#bdae93;--fg4:#a89984;--red:#fb4934;--green:#b8bb26;--yellow:#fabd2f;--blue:#83a598;--purple:#d3869b;--aqua:#8ec07c;--gray:#928374;--orange:#fe8019;--red-dim:#cc2412;--green-dim:#98971a;--yellow-dim:#d79921;--blue-dim:#458588;--purple-dim:#b16286;--aqua-dim:#689d6a;--gray-dim:#a89984;--orange-dim:#d65d0e}body{margin:0;padding:0;width:100vw;height:100vh;background-color:var(--bg_h)}.svelte-195cznv{color:var(--fg);font-family:'Nunito Sans', sans-serif}main.svelte-195cznv{display:flex;flex-direction:column;overflow-wrap:break-word;max-width:90vw;margin:auto;margin-top:50px}.blog.svelte-195cznv{padding:7px;border-radius:7px;background-color:var(--bg);transition:all 150ms;cursor:pointer}.blog.svelte-195cznv:hover{box-shadow:rgba(99, 99, 99, 0.2) 0px 2px 8px 0px}");
};
var get_each_context2 = function(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  return child_ctx;
};
var create_each_block2 = function(ctx) {
  let div;
  let h2;
  let t0_value = ctx[3].t + "";
  let t0;
  let t1;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[2](ctx[3]);
  }
  return {
    c() {
      div = element("div");
      h2 = element("h2");
      t0 = text(t0_value);
      t1 = space();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      h2 = claim_element(div_nodes, "H2", { class: true });
      var h2_nodes = children(h2);
      t0 = claim_text(h2_nodes, t0_value);
      h2_nodes.forEach(detach);
      t1 = claim_space(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(h2, "class", "svelte-195cznv");
      attr(div, "class", "blog svelte-195cznv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, h2);
      append_hydration(h2, t0);
      append_hydration(div, t1);
      if (!mounted) {
        dispose = listen(div, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      dispose();
    }
  };
};
var create_fragment2 = function(ctx) {
  let div;
  let navbar;
  let t;
  let main;
  let current;
  navbar = new navbar_pSFyCoc_default({ props: { pages: ctx[0] } });
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0;i < each_value.length; i += 1)
    each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
  return {
    c() {
      div = element("div");
      create_component(navbar.$$.fragment);
      t = space();
      main = element("main");
      for (let i = 0;i < each_blocks.length; i += 1)
        each_blocks[i].c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(navbar.$$.fragment, div_nodes);
      t = claim_space(div_nodes);
      main = claim_element(div_nodes, "MAIN", { class: true });
      var main_nodes = children(main);
      for (let i = 0;i < each_blocks.length; i += 1)
        each_blocks[i].l(main_nodes);
      main_nodes.forEach(detach);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(main, "class", "svelte-195cznv");
      attr(div, "class", "svelte-195cznv");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(navbar, div, null);
      append_hydration(div, t);
      append_hydration(div, main);
      for (let i = 0;i < each_blocks.length; i += 1)
        if (each_blocks[i])
          each_blocks[i].m(main, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 2) {
        each_value = ctx2[1];
        let i;
        for (i = 0;i < each_value.length; i += 1) {
          const child_ctx = get_each_context2(ctx2, each_value, i);
          if (each_blocks[i])
            each_blocks[i].p(child_ctx, dirty);
          else {
            each_blocks[i] = create_each_block2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(main, null);
          }
        }
        for (;i < each_blocks.length; i += 1)
          each_blocks[i].d(1);
        each_blocks.length = each_value.length;
      }
    },
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
        detach(div);
      destroy_component(navbar);
      destroy_each(each_blocks, detaching);
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
  const blogs = [
    {
      t: "My First Blog",
      u: "/blog/my-first-blog/"
    }
  ];
  const click_handler = (blog) => location.href = blog.u;
  return [pages, blogs, click_handler];
};

class Component2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, {}, add_css2);
  }
}
var index_GoW4xhS_default = Component2;
new Component2({ target: document.body, hydrate: true });
export {
  index_GoW4xhS_default as default
};
