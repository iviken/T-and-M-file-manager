/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray$1(a);
  bValidType = isArray$1(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray$1(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed = false) {
  sub.flags |= 8;
  if (isComputed) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail) tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  const dep = computed2.dep;
  computed2.flags |= 2;
  if (dep.version > 0 && !computed2.isSSR && computed2.deps && !isDirty(computed2)) {
    computed2.flags &= -3;
    return;
  }
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = Symbol(
  ""
);
const ARRAY_ITERATE_KEY = Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray$1(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function reactiveReadArray(array) {
  const raw = toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, toReactive);
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray$1(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toReactive(value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
  },
  find(fn, thisArg) {
    return apply(this, "find", fn, thisArg, toReactive, arguments);
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(this, "findLast", fn, thisArg, toReactive, arguments);
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", toReactive);
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (result.value) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toReactive(item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  let wrappedFn = fn;
  if (arr !== self2) {
    if (!isShallow(self2)) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, toReactive(item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  return arr[method](wrappedFn, ...args);
}
function searchProxy(self2, method, args) {
  const arr = toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && isProxy(args[0])) {
    args[0] = toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = toRaw(self2)[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver
    );
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger(target, "add", value, value);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !isShallow(value) && !isReadonly(value)) {
          value = toRaw(value);
        }
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
    newValue = useDirectValue ? newValue : toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
          oldValue = newValue;
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
/**
* @vue/runtime-core v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray$1(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex$1(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex$1(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? () => false : (key) => {
    return hasOwn(rawSetupState, key);
  };
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k) refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray$1(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && isReactive(source);
    let needsWrap = false;
    if (sourceIsReactiveArray) {
      needsWrap = !isShallow(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? toReactive(source[i]) : source[i],
        i,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions$1(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions$1(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app2._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app2._instance,
            16
          );
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray$1(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || key !== "_") {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce) {
            root.ce._injectChildStyle(type);
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.5.13";
/**
* @vue/runtime-dom v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = Symbol("_assign");
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing) return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el[assignKey](domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing) return;
    const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    if (document.activeElement === el && el.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign2 = el[assignKey];
      if (isArray$1(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  let checked;
  if (isArray$1(value)) {
    checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    checked = value.has(vnode.props.value);
  } else {
    if (value === oldValue) return;
    checked = looseEqual(value, getCheckboxValue(el, true));
  }
  if (el.checked !== checked) {
    el.checked = checked;
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props.value);
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el[assignKey](getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props.value);
    }
  }
};
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
    }
    return fn(event, ...args);
  });
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  const cache = fn._withKeys || (fn._withKeys = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some(
      (k) => k === eventKey || keyNames[k] === eventKey
    )) {
      return fn(event);
    }
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
/*!
  * vue-router v4.5.0
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof document !== "undefined";
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module" || // support CF with dynamic imports that do not
  // add the Module string tag
  obj.default && isRouteComponent(obj.default);
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const isArray = Array.isArray;
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash: decode(hash)
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  const lastToSegment = toSegments[toSegments.length - 1];
  if (lastToSegment === ".." || lastToSegment === ".") {
    toSegments.push("");
  }
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  // TODO: could we use a symbol in the future?
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
const START = "";
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.scrollX,
  top: window.scrollY
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
function createMemoryHistory(base = "") {
  let listeners = [];
  let queue2 = [START];
  let position = 0;
  base = normalizeBase(base);
  function setLocation(location2) {
    position++;
    if (position !== queue2.length) {
      queue2.splice(position);
    }
    queue2.push(location2);
  }
  function triggerListeners(to, from, { direction, delta }) {
    const info = {
      direction,
      delta,
      type: NavigationType.pop
    };
    for (const callback of listeners) {
      callback(to, from, info);
    }
  }
  const routerHistory = {
    // rewritten by Object.defineProperty
    location: START,
    // TODO: should be kept in queue
    state: {},
    base,
    createHref: createHref.bind(null, base),
    replace(to) {
      queue2.splice(position--, 1);
      setLocation(to);
    },
    push(to, data) {
      setLocation(to);
    },
    listen(callback) {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1)
          listeners.splice(index, 1);
      };
    },
    destroy() {
      listeners = [];
      queue2 = [START];
      position = 0;
    },
    go(delta, shouldTrigger = true) {
      const from = this.location;
      const direction = (
        // we are considering delta === 0 going forward, but in abstract mode
        // using 0 for the delta doesn't make sense like it does in html5 where
        // it reloads the page
        delta < 0 ? NavigationDirection.back : NavigationDirection.forward
      );
      position = Math.max(0, Math.min(position + delta, queue2.length - 1));
      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta
        });
      }
    }
  };
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => queue2[position]
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [
      90
      /* PathScore.Root */
    ];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
          // or /:p?-:p2
          optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict && !pattern.endsWith("/"))
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [mainNormalizedRecord];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(
          // we need to normalize again to ensure the `mods` property
          // being non enumerable
          normalizeRouteRecord(assign({}, mainNormalizedRecord, {
            // this allows us to hold a copy of the `components` option
            // so that async components cache is hold on the original record
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            // we might be the child of an alias
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
            // the aliases are always of the same kind as the original since they
            // are defined on the same record
          }))
        );
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher)) {
          removeRoute(record.name);
        }
      }
      if (isMatchable(matcher)) {
        insertMatcher(matcher);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    const index = findInsertionIndex(matcher, matchers);
    matchers.splice(index, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // only keep optional params coming from a parent record
          matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if (location2.path != null) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes.forEach((route) => addRoute(route));
  function clearRoutes() {
    matchers.length = 0;
    matcherMap.clear();
  }
  return {
    addRoute,
    resolve: resolve2,
    removeRoute,
    clearRoutes,
    getRoutes,
    getRecordMatcher
  };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  const normalized = {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: record.aliasOf,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    // must be declared afterwards
    // mods: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
  Object.defineProperty(normalized, "mods", {
    value: {}
  });
  return normalized;
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "object" ? props[name] : props;
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults2, partialOptions) {
  const options = {};
  for (const key in defaults2) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults2[key];
  }
  return options;
}
function findInsertionIndex(matcher, matchers) {
  let lower = 0;
  let upper = matchers.length;
  while (lower !== upper) {
    const mid = lower + upper >> 1;
    const sortOrder = comparePathParserScore(matcher, matchers[mid]);
    if (sortOrder < 0) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  const insertionAncestor = getInsertionAncestor(matcher);
  if (insertionAncestor) {
    upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
  }
  return upper;
}
function getInsertionAncestor(matcher) {
  let ancestor = matcher;
  while (ancestor = ancestor.parent) {
    if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) {
      return ancestor;
    }
  }
  return;
}
function isMatchable({ record }) {
  return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers.slice(),
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
  const enterCallbackArray = record && // name is defined if record is because of the function overload
  (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve2();
      }
    };
    const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            throw new Error(`Couldn't resolve component "${name}" at "${record.path}"`);
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.mods[name] = resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
        }));
      }
    }
  }
  return guards;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => {
    const to = unref(props.to);
    return router2.resolve(to);
  });
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (
      // we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
    );
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      const p2 = router2[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop);
      if (props.viewTransition && typeof document !== "undefined" && "startViewTransition" in document) {
        document.startViewTransition(() => p2);
      }
      return p2;
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
function preferSingleVNode(vnodes) {
  return vnodes.length === 1 ? vnodes[0] : vnodes;
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && preferSingleVNode(slots.default(link));
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && // if there is no instance but to and from are the same this might be
      // the first visit
      (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component, route }) || component
      );
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = (
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)
  );
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if (rawLocation.path != null) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(targetParams)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      )
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
          // force empty params
          { path: newTargetLocation }
        );
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        // avoid transferring params if the redirect has a path
        params: newTargetLocation.path != null ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
          force,
          replace: replace2
        }),
        // keep original redirectedFrom if it exists
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(
        from,
        from,
        // this is a push, the only way for it to be triggered from a
        // history.listen is with a redirect, which makes it become a push
        true,
        // This cannot be the first navigation because the initial location
        // cannot be manually navigated to
        false
      );
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
      // navigation redirects still mark the router as ready
      isNavigationFailure(
        error,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? error : markAsReady(error)
    ) : (
      // reject any unknown error
      triggerError(error, toLocation, from)
    )).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(
          failure2,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          return pushWithRedirect(
            // keep options
            assign({
              // preserve an existing replacement but allow the redirect to override it
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
              force
            }),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function runWithContext(fn) {
    const app2 = installedApps.values().next().value;
    return app2 && typeof app2.runWithContext === "function" ? app2.runWithContext(fn) : fn();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of enteringRecords) {
        if (record.beforeEnter) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(
      err,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true, force: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(
          error,
          4 | 8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        )) {
          return error;
        }
        if (isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          pushWithRedirect(
            assign(locationAsObject(error.to), {
              force: true
            }),
            toLocation
            // avoid an uncaught rejection, let push call triggerError
          ).then((failure) => {
            if (isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          // after navigation, all matched components are resolved
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
          // entry while a different route is displayed
          !isNavigationFailure(
            failure,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(
            failure,
            4 | 16
            /* ErrorTypes.NAVIGATION_DUPLICATED */
          )) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorListeners = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorListeners.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve22, reject) => {
      readyHandlers.add([resolve22, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve22, reject]) => err ? reject(err) : resolve22());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorListeners.add,
    isReady,
    install(app2) {
      const router22 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router22;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app2.provide(routerKey, router22);
      app2.provide(routeLocationKey, shallowReactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
  }
  return router2;
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$b = {
  components: {
    RouterLink
  },
  methods: {
    changeState(stateConst) {
      switch (stateConst) {
        case "CLOSE_PROJ":
          this.state.active = "BROWSER";
          this.state.atLeastOneProjectOpen = false;
          window.api.closeProject();
          break;
        case "GO_BROWS/PROJ":
          if (this.state.active == "PROJECTS") {
            this.$router.push({ name: "Browser-session" });
          }
          if (this.state.active == "BROWSER") {
            this.checkIfAtLeastOneProjectOpen();
            if (this.state.atLeastOneProjectOpen) {
              this.$router.push({ name: "Browser-projects" });
            } else {
              this.$router.push({ name: "ProjectsList" });
            }
          }
          this.state.active = this.state.active == "BROWSER" ? "PROJECTS" : "BROWSER";
          break;
      }
    },
    closeApp() {
      window.api.close();
    },
    minimizeApp() {
      window.api.minimize();
    },
    maximizeApp() {
      window.api.maximize();
    },
    getActualProjectName() {
      for (const key in this.fullData) {
        if (this.fullData[key].meta.status == "opened")
          return this.fullData[key].meta.name;
      }
    },
    checkIfAtLeastOneProjectOpen() {
      for (const key in this.fullData) {
        if (this.fullData[key].meta.status == "opened") {
          this.state.atLeastOneProjectOpen = true;
          break;
        }
      }
    }
  },
  beforeMount() {
    this.fullData = window.api.getProjectData();
    this.projectName = this.getActualProjectName();
    this.checkIfAtLeastOneProjectOpen();
    if (this.state.atLeastOneProjectOpen) {
      this.state.active = "PROJECTS";
    } else {
      this.state.active = "BROWSER";
    }
  },
  beforeUpdate() {
    this.projectName = this.getActualProjectName();
    this.checkIfAtLeastOneProjectOpen();
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", (e) => {
        if (window.outerWidth == window.screen.width) {
          this.state.windowIsMaximized = true;
        } else {
          this.state.windowIsMaximized = false;
        }
      });
    });
  },
  computed: {},
  data() {
    return {
      projectName: "project Name",
      fullData: null,
      state: {
        active: null,
        windowIsMaximized: true,
        atLeastOneProjectOpen: true
      }
    };
  }
};
const _hoisted_1$b = { class: "header w100 drag" };
const _hoisted_2$9 = { class: "header__box w100 h100" };
const _hoisted_3$8 = { class: "header__btns w100 on-row" };
const _hoisted_4$8 = { class: "header__btns-left on-row no-drag" };
const _hoisted_5$8 = { class: "header__name w100 text-center on-center" };
const _hoisted_6$8 = { class: "no-drag" };
const _hoisted_7$8 = {
  key: 0,
  class: "t-header uppercase text-nowrap"
};
const _hoisted_8$8 = {
  key: 1,
  class: "t-header uppercase text-nowrap"
};
const _hoisted_9$7 = { class: "header__btns-right on-row no-drag" };
const _hoisted_10$6 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  width: "18px",
  height: "18px"
};
const _hoisted_11$5 = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  width: "18px",
  height: "18px"
};
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", _hoisted_1$b, [
    createBaseVNode("div", _hoisted_2$9, [
      createBaseVNode("div", _hoisted_3$8, [
        createBaseVNode("div", _hoisted_4$8, [
          createBaseVNode("button", {
            class: "btn-logo btn-logo1 header__btn bold",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.changeState("GO_BROWS/PROJ"))
          }, "M&T"),
          $data.state.active == "PROJECTS" ? (openBlock(), createBlock(_component_RouterLink, {
            key: 0,
            to: { name: "ProjectsList" },
            "active-class": ""
          }, {
            default: withCtx(() => [
              createBaseVNode("button", {
                class: "header__btn header__btns-close-project",
                onClick: _cache[1] || (_cache[1] = ($event) => $options.changeState("CLOSE_PROJ"))
              }, _cache[5] || (_cache[5] = [
                createBaseVNode("title", null, "Close project", -1),
                createBaseVNode("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  height: "18px",
                  viewBox: "0 -960 960 960",
                  width: "18px",
                  fill: "#000000"
                }, [
                  createBaseVNode("path", { d: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" })
                ], -1)
              ]))
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(_component_RouterLink, {
            to: { name: "Help" },
            "active-class": ""
          }, {
            default: withCtx(() => _cache[6] || (_cache[6] = [
              createBaseVNode("button", { class: "header__btns-go-help header__btn bold" }, "F1", -1)
            ])),
            _: 1
          }),
          createVNode(_component_RouterLink, {
            to: { name: "Unsplash" },
            "active-class": ""
          }, {
            default: withCtx(() => _cache[7] || (_cache[7] = [
              createBaseVNode("button", { class: "header__btn-unsplash header__btn" }, [
                createBaseVNode("svg", {
                  fill: "#000000",
                  width: "18px",
                  height: "18px",
                  viewBox: "0 0 24 24",
                  role: "img",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  createBaseVNode("title", null, "Unsplash icon"),
                  createBaseVNode("path", { d: "M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z" })
                ])
              ], -1)
            ])),
            _: 1
          })
        ]),
        createBaseVNode("div", _hoisted_5$8, [
          createBaseVNode("div", _hoisted_6$8, [
            $data.state.active == "PROJECTS" ? (openBlock(), createElementBlock("span", _hoisted_7$8, toDisplayString($data.projectName), 1)) : createCommentVNode("", true),
            $data.state.active == "BROWSER" ? (openBlock(), createElementBlock("span", _hoisted_8$8, " BROWSE ")) : createCommentVNode("", true)
          ])
        ]),
        createBaseVNode("div", _hoisted_9$7, [
          createBaseVNode("button", {
            class: "header__btns-minimize header__btn",
            onClick: _cache[2] || (_cache[2] = ($event) => $options.minimizeApp())
          }, _cache[8] || (_cache[8] = [
            createBaseVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 48 48",
              width: "18px",
              height: "18px"
            }, [
              createBaseVNode("path", { d: "m 5.7298514,24.930294\n                        c -0.1570778,-0.409338 -0.1570778,-1.079165 0,-1.488503\n                        C 5.978912,22.79275 8.3624396,22.714048 24.361752,22.826584\n                        l 18.346304,0.129045\n                        v 1.230414 1.230413\n                        L 24.361752,25.545501\n                        C 8.3624396,25.658037 5.978912,25.579336 5.7298514,24.930294\n                        Z" })
            ], -1)
          ])),
          createBaseVNode("button", {
            class: "header__btns-resize header__btn",
            onClick: _cache[3] || (_cache[3] = ($event) => $options.maximizeApp())
          }, [
            !$data.state.windowIsMaximized ? (openBlock(), createElementBlock("svg", _hoisted_10$6, _cache[9] || (_cache[9] = [
              createBaseVNode("path", { d: "M 9.2094529,41.205509\n                                C 6.5094146,39.740484 6.35316,38.806775 6.35316,24.137547\n                                c 0,-14.7633639 0.1518753,-15.6410061 2.9577533,-17.0919821 2.1455297,-1.1094963 27.6266977,-1.1094963 29.7722267,0 2.805878,1.450976 2.957754,2.3286182 2.957754,17.0919821 0,14.763364 -0.151876,15.641007 -2.957754,17.091983 -2.118159,1.095342 -27.848833,1.074653 -29.8736871,-0.02402\n                                z\n                                \n                                M 38.288017,38.228537\n                                c 1.169901,-1.169901 1.169901,-27.012079 0,-28.18198 -1.169901,-1.1699007 -27.012079,-1.1699007 -28.18198,0 -1.1699012,1.169901 -1.1699012,27.012079 0,28.18198 1.169901,1.169901 27.012079,1.169901 28.18198,0\n                                z" }, null, -1)
            ]))) : createCommentVNode("", true),
            $data.state.windowIsMaximized ? (openBlock(), createElementBlock("svg", _hoisted_11$5, _cache[10] || (_cache[10] = [
              createBaseVNode("path", { d: "M 9.5176628,40.450425\n                                C 7.0856222,39.130792 6.8873929,38.083843 6.8873929,26.558595\n                                c 0,-8.531682 0.1321261,-10.799161 0.6923853,-11.882608 1.3072373,-2.527959 2.3074139,-2.723752 13.9137138,-2.723752 15.334616,0 14.606097,-0.728532 14.606097,14.60636 0,15.350649 0.741561,14.614611 -14.697541,14.588081\n                                C 12.88678,41.13205 10.518108,40.993273 9.5176628,40.450425\n                                Z\n\n                                M 32.643682,37.708982\n                                c 1.073063,-1.073082 1.073063,-21.227697 0,-22.300779 -1.073063,-1.073082 -21.227318,-1.073082 -22.300382,0 -1.0730626,1.073082 -1.0730626,21.227697 0,22.300779 1.073064,1.073081 21.227319,1.073081 22.300382,0\n                                z\n\n                                m 6.194552,-14.997596\n                                c 0,-10.358031 -0.101396,-12.164684 -0.717267,-12.7805678 -0.615868,-0.6158827 -2.422494,-0.7172753 -12.780335,-0.7172753 -7.854244,0 -12.063071,-0.1615961 -12.063071,-0.4631562 0,-0.2547337 0.667545,-0.8701751 1.483433,-1.3676412 1.366528,-0.8332043 2.321512,-0.9046168 12.11834,-0.9061882 15.451175,-0.00248 14.698314,-0.7553529 14.695836,14.6960957 -0.0015,9.797007 -0.07298,10.752002 -0.906173,12.118556 -0.497452,0.815901 -1.112883,1.483461 -1.367616,1.483461 -0.301552,0 -0.463147,-4.208902 -0.463147,-12.063284\n                                z" }, null, -1)
            ]))) : createCommentVNode("", true)
          ]),
          createBaseVNode("button", {
            class: "header__btns-close header__btn",
            onClick: _cache[4] || (_cache[4] = ($event) => $options.closeApp())
          }, _cache[11] || (_cache[11] = [
            createBaseVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 48 48",
              width: "18px",
              height: "18px"
            }, [
              createBaseVNode("path", { d: "M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z" })
            ], -1)
          ]))
        ])
      ])
    ])
  ]);
}
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-f5992b63"]]);
const _sfc_main$a = {
  name: "App",
  components: {
    Header,
    RouterView
  }
};
const _hoisted_1$a = { class: "on-col" };
const _hoisted_2$8 = { class: "w100 content-component" };
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Header = resolveComponent("Header");
  const _component_RouterView = resolveComponent("RouterView");
  return openBlock(), createElementBlock("div", _hoisted_1$a, [
    createVNode(_component_Header, { class: "w100 header-component" }),
    createBaseVNode("div", _hoisted_2$8, [
      createVNode(_component_RouterView)
    ])
  ]);
}
const App = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-47082eec"]]);
const settings = {
  //  backend
  productName: "M and T file manager",
  developer: "iviken",
  sessionProjectsFile: "sessionProjects.json",
  sessionBrowserFile: "sessionBrowser.json",
  dublicateFilePostfix: "is copied",
  //  filename after copy / move: SrcName [dublicateFilePostfix] [today]
  //  defaut sessions
  initPath: "/Temp",
  //  First opened folder during initialization (first starting app)
  //  FOLDERS
  excludedFolders: ["Recovery", "System Volume Information", "PerfLogs", "Config.Msi", "$SysReset", "$Recycle.Bin", "OneDriveTemp"],
  folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
  //  Folder name filter
  win32separator: "\\",
  actualSeparator: "/",
  excludedFiles: ["desktop.ini"],
  maxTabs: 10,
  //  max Folders On Bar
  forcedFolderUpdate: false,
  //  Принудительное обновление каталогов при каждом переходе или операции
  lengthOfTheLastPartOfTheFolderName: 6,
  //  Длинна последней части имени каталога, если его имя слишком длинное и вылезает за границу
  //  TREE
  replacedSymbolPath: " > ",
  //  Separator in address bar (in folders tree)
  folderNameMaxLength: 30,
  //
  addressBarFolderNameMaxLength: 10,
  //  Folder name max length in tab
  //List of folders protected from delition
  rootSystemFolder: ["WINDOWS", "USERS", "TEMP", "PROGRAMDATA", "PROGRAM FILES", "PROGRAM FILES (X86)"],
  //
  specialFolders: { docs: "Documents", imgs: "", loads: "Downloads" },
  protectSpecialFolders: true,
  //  Protect folders from delition
  protectRootSystemFolders: true,
  //  Protect folders from delition
  ROOT_C: "root_C:",
  //  FILES
  fileImgMask: ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "gif", "GIF", "bmp", "BMP", "ico", "ICO", "tiff", "TIFF", "webp", "WEBP", "eps", "EPS"],
  futureFileImgMask: ["svg", "SVG"],
  //  TO DO
  fileVideoMask: [],
  fileNameRegexp: /[\\\/<>:\"\*\?\|]/g,
  //  Filename filter
  //  FILE COMPONENT
  fileNameMaxLength: 25,
  //  File name max length
  lengthOfTheLastPartOfTheFileName: 8,
  //  Длинна последней части имени файла, если его имя слишком длинное и вылезает за границу
  //  BAR
  availableMarkColors: ["default", "red", "green", "yellow", "ocean", "blue", "orange"],
  MaxLenghtOfMarkName: 15,
  //  
  maxMarksOnBar: 5,
  maxFoldersOnBar: 6,
  rootFolderTabName: "root C",
  tabsFolderNameMaxLength: 16,
  searchFilesByFormatMask: ".",
  //  <BROWSER VIEW>
  imageZoomStep: 25,
  //  step size (px) for image preview
  minimumImagePreviewSize: 50,
  maximumImagePreviewSize: 350,
  SESSION: {
    showPinFolders: true,
    showCloudsStorageBtns: true,
    showSpecialFoldersBtns: true,
    showSessionFolders: false,
    openPreviousFolderAfterClosingActiveOne: false,
    resettingSelectedFilesAfterSwitchingToAnotherFolder: true
  },
  PROJECTS: {
    showPinFolders: false,
    showCloudsStorageBtns: true,
    showSpecialFoldersBtns: true,
    showSessionFolders: true,
    openPreviousFolderAfterClosingActiveOne: false,
    resettingSelectedFilesAfterSwitchingToAnotherFolder: true
  }
};
const defaults = {
  defaultMarksColor: "default",
  //  Цвет вновь созданной маркировки
  unmarkedColor: "unmarked-color",
  //  Цвет нулевой маркировки (группа непромаркированных файлов)
  unmarkedMarkID: "mark_unmarked"
  //  id ~
};
const _imports_0$3 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5'%20height='3'%20viewBox='0%200%202.5000001%203'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='favorite-folder.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='128'%20inkscape:cx='1.25'%20inkscape:cy='1.8476562'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:none;stroke:%23f2f2f2;stroke-width:0.557014;stroke-linecap:square;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20d='M%202.05764,2.4161445%20H%200.44236001%20V%200.58385547'%20id='path2'%20/%3e%3crect%20style='opacity:1;fill:%23f2f2f2;stroke:none;stroke-width:0.557;stroke-linecap:square;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20id='rect1'%20width='1.265625'%20height='1.4296875'%20x='1.0507812'%20y='0.3046875'%20/%3e%3c/svg%3e";
const _imports_0$2 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='3.4330001'%20height='3.4330001'%20viewBox='0%200%203.4330001%203.4330001'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='pin.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='84.144994'%20inkscape:cx='-0.53479117'%20inkscape:cy='2.2282966'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cg%20id='g1886'%20style='display:inline;fill:%23f2f2f2'%20transform='translate(-126.25575,-43.675954)'%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;stroke-width:0.0487914'%20d='m%20127.91282,47.091828%20c%20-0.0627,-0.03475%20-0.065,-0.05165%20-0.0655,-0.475769%20l%20-4.4e-4,-0.396964%20h%20-0.43331%20c%20-0.2725,0%20-0.44253,-0.005%20-0.45815,-0.01329%20-0.0342,-0.01832%20-0.0638,-0.07993%20-0.0638,-0.132834%200,-0.07832%200.0375,-0.262317%200.0731,-0.358267%200.0496,-0.133739%200.16324,-0.299193%200.28096,-0.408945%200.0552,-0.05147%200.10559,-0.09359%200.11197,-0.09359%200.007,0%200.0116,-0.201604%200.0116,-0.472474%20v%20-0.472472%20l%20-0.0449,-0.07295%20c%20-0.0627,-0.101974%20-0.0971,-0.210063%20-0.10608,-0.333499%20-0.008,-0.104946%20-0.007,-0.105898%200.0319,-0.14523%20l%200.0396,-0.03959%20h%200.68345%20c%200.66873,0%200.68417,5.68e-4%200.71699,0.02637%200.0442,0.03472%200.0548,0.0978%200.0365,0.215686%20-0.0159,0.101962%20-0.0501,0.193546%20-0.10783,0.288648%20l%20-0.0362,0.05952%20v%200.471236%200.471236%20l%200.0532,0.03683%20c%200.0808,0.05598%200.20747,0.20169%200.26924,0.309661%200.0735,0.12845%200.12444,0.282428%200.14166,0.428183%200.0156,0.131799%200.002,0.194693%20-0.049,0.221816%20-0.0172,0.0092%20-0.17367,0.01395%20-0.45937,0.01395%20h%20-0.43332%20v%200.388558%20c%200,0.324017%20-0.003,0.395554%20-0.02,0.430675%20-0.0314,0.06615%20-0.10703,0.08964%20-0.17223,0.0535%20z%20m%200.87642,-1.135032%20c%200,-0.03899%20-0.0444,-0.163257%20-0.0882,-0.247217%20-0.0554,-0.10603%20-0.17165,-0.234796%20-0.27574,-0.305482%20-0.0409,-0.02776%20-0.0803,-0.06159%20-0.0875,-0.07517%20-0.008,-0.01576%20-0.0132,-0.227472%20-0.0132,-0.585169%20v%20-0.560469%20l%200.0376,-0.05197%20c%200.0407,-0.05616%200.0828,-0.13458%200.0971,-0.181044%20l%200.009,-0.02905%20h%20-0.49143%20c%20-0.27344,0%20-0.49142,0.005%20-0.49142,0.01133%200,0.02681%200.045,0.116188%200.0885,0.175853%20l%200.0471,0.06455%200.004,0.556464%20c%200.002,0.340628%20-0.001,0.56934%20-0.009,0.589663%20-0.007,0.01826%20-0.0478,0.05706%20-0.0907,0.08622%20-0.0981,0.06659%20-0.19556,0.166694%20-0.25209,0.258806%20-0.042,0.06847%20-0.1101,0.247405%20-0.1101,0.289386%200,0.01827%200.082,0.02031%200.81329,0.02031%200.66456,0%200.81329,-0.0031%200.81329,-0.01702%20z'%20id='path1834'%20/%3e%3c/g%3e%3c/svg%3e";
const _imports_2$1 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='3.4330001'%20height='3.4330001'%20viewBox='0%200%203.4330001%203.4330001'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='unpin.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='128'%20inkscape:cx='0.78125'%20inkscape:cy='1.9492188'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;stroke:%23ffffff;stroke-width:0.0877824;stroke-dasharray:none;stroke-opacity:1'%20d='M%201.6600043,3.3308088%20C%201.6004528,3.2978202%201.5982757,3.2817735%201.5978193,2.8790401%20L%201.597412,2.5021006%20H%201.1859564%20c%20-0.25875625,0%20-0.42021271,-0.00474%20-0.43503916,-0.012641%20-0.0324619,-0.017381%20-0.0605874,-0.075897%20-0.0605874,-0.1261257%200,-0.074369%200.0356748,-0.2490844%200.0694534,-0.3401938%20C%200.80686974,1.896154%200.91478945,1.7390393%201.0265612,1.634824%201.0789322,1.585946%201.1268267,1.545953%201.1328832,1.545953%20c%200.00667,0%200.011055,-0.1914342%200.011055,-0.4486402%20V%200.64867456%20L%201.1012815,0.57939667%20C%201.0417298,0.48257265%201.0090748,0.37993041%201.00056,0.26271979%200.993011,0.16306919%200.993888,0.16215624%201.030862,0.12481359%20l%200.037554,-0.037606%20h%200.6489685%20c%200.6350023,0%200.6496585,5.3898e-4%200.6808212,0.0250531%200.041907,0.0329711%200.052091,0.0928738%200.034639,0.20480518%20-0.015099,0.096824%20-0.04756,0.18378306%20-0.1023898,0.27408836%20l%20-0.034359,0.0565143%20V%201.0951326%201.5425982%20l%200.050493,0.034973%20c%200.076723,0.053144%200.1970001,0.191515%200.2556634,0.2940397%200.069735,0.1219649%200.1181557,0.2681806%200.1345001,0.4065836%200.014747,0.1251426%200.00193,0.1848716%20-0.046525,0.2106269%20-0.016327,0.00877%20-0.164908,0.013167%20-0.4361926,0.013167%20H%201.8425795%20v%200.3689583%20c%200,0.3076721%20-0.00281,0.3756%20-0.018961,0.4089503%20C%201.7937905,3.342714%201.7220014,3.365011%201.6600799,3.330705%20Z%20M%202.4922116,2.2530337%20c%200,-0.037027%20-0.042083,-0.1550237%20-0.083797,-0.234746%20C%202.3558504,1.9176012%202.2454377,1.7953343%202.1465807,1.7282141%202.1077983,1.7018619%202.0703328,1.6697335%202.0634331,1.6568295%202.0558839,1.6419064%202.0509681,1.4408338%202.0509681,1.1011807%20V%200.56898391%20l%200.035762,-0.0493512%20c%200.038607,-0.0533366%200.078618,-0.12779368%200.092207,-0.17191314%20l%200.00843,-0.0275812%20H%201.720727%20c%20-0.2596341,0%20-0.4666269,0.004741%20-0.4666269,0.0107091%200,0.0254569%200.04275,0.11032495%200.083991,0.16697974%20l%200.044734,0.0612897%200.00386,0.52839229%20c%200.00193,0.323445%20-9.429e-4,0.5406205%20-0.00843,0.5599185%20-0.00667,0.017381%20-0.0454,0.054179%20-0.086167,0.081865%20C%201.1989331,1.7925307%201.106386,1.887582%201.0527158,1.9750431%201.0128978,2.0400551%200.94816695,2.2099683%200.94816695,2.249832%20c%200,0.017381%200.0779509,0.019294%200.77226955,0.019294%200.6310292,0%200.7722606,-0.00298%200.7722606,-0.016152%20z'%20id='path173'%20/%3e%3cpath%20style='display:inline;fill:%23000000;fill-opacity:1;stroke:%231e2228;stroke-width:0.653953;stroke-dasharray:none;stroke-opacity:1'%20d='M%200.77719971,2.5470052%202.4839254,1.0656824'%20id='path176'%20sodipodi:nodetypes='cc'%20/%3e%3cpath%20style='opacity:1;fill:none;fill-opacity:1;stroke:%23fafafa;stroke-width:0.369233;stroke-dasharray:none;stroke-opacity:1'%20d='M%200.21402454,3.0290067%203.2189755,0.40399343'%20id='path178'%20/%3e%3c/svg%3e";
const _imports_3$2 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='eye.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='256'%20inkscape:cx='0.76171875'%20inkscape:cy='1.3339844'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3ccircle%20style='opacity:1;fill:none;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.306872;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20id='path3'%20cx='1.2653701'%20cy='1.7120404'%20r='0.28340372'%20/%3e%3cpath%20style='opacity:1;fill:none;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.167916;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%200.35779713,1.4440376%20c%200,0%200.84499297,-0.83502544%201.81436687,0'%20id='path6'%20/%3e%3cpath%20style='opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0490218;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%200.49241358,1.0951728%20c%200,0%20-0.30358667,-0.073938%20-0.44125168,-0.27918242%200,0%200.11684516,0.34067832%200.25443587,0.39929002'%20id='path7'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0547425;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%201.0023593,0.88731645%20c%200,0%20-0.28794533,-0.2139557%20-0.35476385,-0.48936903%200,0%20-0.005088,0.40671103%200.11609315,0.52975689'%20id='path7-8'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0577566;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%201.4792008,0.89212345%20c%200,0%200.3125838,-0.23384341%200.3753968,-0.51232557%200,0%200.023209,0.40354538%20-0.1069181,0.53473726'%20id='path7-8-6'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0450505;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%202.0602812,1.1097176%20c%200,0%200.2893998,-0.060809%200.412457,-0.23879676%200,0%20-0.096541,0.29688166%20-0.2264877,0.34643766'%20id='path7-8-6-0'%20/%3e%3c/svg%3e";
const _imports_4$1 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='eye%20closed.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='256'%20inkscape:cx='1.1054688'%20inkscape:cy='1.2128906'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='opacity:1;fill:none;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.16948;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%202.1725249,1.084386%20c%200,0%20-0.8528665,0.842806%20-1.83127295,0'%20id='path10'%20/%3e%3cpath%20style='opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0494786;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%202.0366541,1.4365015%20c%200,0%200.3064154,0.074627%200.4453632,0.2817837%200,0%20-0.1179339,-0.3438527%20-0.2568067,-0.4030105'%20id='path11'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0552525;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%201.5219568,1.6462945%20c%200,0%200.2906283,0.2159494%200.3580694,0.4939289%200,0%200.00514,-0.4105007%20-0.1171748,-0.534693'%20id='path12'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0582947;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%201.0406721,1.6414428%20c%200,0%20-0.31549639,0.2360223%20-0.37889472,0.5170993%200,0%20-0.023425,-0.4073056%200.10791443,-0.5397199'%20id='path13'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.0454703;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:markers%20fill%20stroke'%20d='m%200.45417725,1.4218211%20c%200,0%20-0.29209639,0.061376%20-0.41630013,0.2410218%200,0%200.09744046,-0.2996479%200.22859806,-0.3496657'%20id='path14'%20/%3e%3c/svg%3e";
const _imports_3$1 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMS43NjUiCiAgIGhlaWdodD0iMS43NjUiCiAgIHZpZXdCb3g9IjAgMCAxLjc2NSAxLjc2NSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMSIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icGx1cy5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMy4yICgwOTFlMjBlLCAyMDIzLTExLTI1LCBjdXN0b20pIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjI1NiIKICAgICBpbmtzY2FwZTpjeD0iMC44MjQyMTg3NSIKICAgICBpbmtzY2FwZTpjeT0iMS4xOTMzNTk0IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA5IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcxIiAvPjxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPjx0ZXh0CiAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDozMDA7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6My44NTM5NHB4O2xpbmUtaGVpZ2h0OjEuODtmb250LWZhbWlseTpDYWxpYnJpOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0NhbGlicmksIExpZ2h0Jztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDt0ZXh0LWFsaWduOmVuZDtsZXR0ZXItc3BhY2luZzoxLjUwMjk2cHg7d29yZC1zcGFjaW5nOjBweDtkaXJlY3Rpb246bHRyO3RleHQtYW5jaG9yOmVuZDtkaXNwbGF5Om5vbmU7ZmlsbDojZjJmMmYyO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjY7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtwYWludC1vcmRlcjptYXJrZXJzIGZpbGwgc3Ryb2tlIgogICAgIHg9Ii0wLjEzMTczMDk0IgogICAgIHk9IjEuOTY4MzciCiAgICAgaWQ9InRleHQxODc4Ij48dHNwYW4KICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0OjMwMDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTozLjg1Mzk0cHg7bGluZS1oZWlnaHQ6MS44O2ZvbnQtZmFtaWx5OkNhbGlicmk7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQ2FsaWJyaSwgTGlnaHQnO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1jYXBzOm5vcm1hbDtmb250LXZhcmlhbnQtbnVtZXJpYzpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsO3RleHQtYWxpZ246c3RhcnQ7ZGlyZWN0aW9uOmx0cjt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNmMmYyZjI7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuNjtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgICB4PSItMC4xMzE3MzA5NCIKICAgICAgIHk9IjEuOTY4MzciCiAgICAgICBpZD0idHNwYW4xODc4Ij4rPC90c3Bhbj48L3RleHQ+PHBhdGgKICAgICBzdHlsZT0ib3BhY2l0eTowLjc2MzQ4NTtmaWxsOm5vbmU7c3Ryb2tlOiNmMmYyZjI7c3Ryb2tlLXdpZHRoOjAuMTY1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm1hcmtlcnMgZmlsbCBzdHJva2UiCiAgICAgZD0iTSAwLjg4MjQ5OTk5LDAuMTE4NDIzOTkgViAxLjY0NjcxMDciCiAgICAgaWQ9InBhdGgxIiAvPjxwYXRoCiAgICAgc3R5bGU9Im9wYWNpdHk6MC43NjM0ODU7ZmlsbDpub25lO3N0cm9rZTojZjJmMmYyO3N0cm9rZS13aWR0aDowLjE2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIGZpbGwgc3Ryb2tlIgogICAgIGQ9Ik0gMS42NDY2NDMzLDAuODgyNDk5OTkgSCAwLjExODM1NjY1IgogICAgIGlkPSJwYXRoMS03IiAvPjwvc3ZnPgo=";
const _imports_1 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='x.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='256'%20inkscape:cx='0.88671875'%20inkscape:cy='1.2480469'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='mix-blend-mode:difference;fill:none;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.264567;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1'%20d='M%202.3722434,0.13861392%200.14966343,2.3612039'%20id='path1737'%20/%3e%3cpath%20style='mix-blend-mode:difference;fill:none;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0.265;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1'%20d='M%202.3722484,2.3611984%200.14965843,0.13861942'%20id='path1738'%20/%3e%3c/svg%3e";
const _imports_7 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5'%20height='3'%20viewBox='0%200%202.5000001%203'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='tree-level.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='128'%20inkscape:cx='0.78125'%20inkscape:cy='1.1992188'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:none;stroke:%23f4f4f4;stroke-width:0.557014;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20d='M%202.05764,2.4161445%20H%200.44236001%20V%200.58385547'%20id='path2'%20/%3e%3c/svg%3e";
const _imports_8 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='list.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='256'%20inkscape:cx='0.5703125'%20inkscape:cy='1.4199219'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='display:inline;opacity:1;fill:%23f3f3f3;stroke-width:0.0419107;fill-opacity:1'%20d='M%200.53146052,2.4503284%20C%200.44834712,2.4109974%200.36958383,2.3263221%200.33824879,2.2425762%200.31593949,2.1829472%200.31545489,2.1627212%200.31545489,1.2461008%20V%200.3104927%20l%200.0245019,-0.0647351%20c%200.033591,-0.088682%200.12451472,-0.18006319%200.21162002,-0.21265517%200.061796,-0.02307456%200.0799919,-0.02399215%200.51322459,-0.02399215%200.4188547,0%200.4518954,0.00127129%200.4902879,0.02098384%200.080617,0.04115331%200.5363854,0.48968107%200.6232873,0.61342786%20l%200.038841,0.0552885%200.00281,0.74309502%200.00281,0.7430948%20-0.035271,0.076573%20C%202.1466927,2.3501763%202.0829068,2.4149494%201.9970831,2.4549099%20l%20-0.0576,0.026804%20-0.6708763,8.42e-5%20-0.67087638,8.41e-5%20z%20M%201.9356641,2.2692403%20c%200.029744,-0.016726%200.05186,-0.041573%200.07091,-0.07985%20l%200.027714,-0.055569%20V%201.4817612%20c%200,-0.63448531%20-5.099e-4,-0.6526591%20-0.021901,-0.67397159%20-0.030376,-0.0303738%20-0.045282,-0.0322631%20-0.280101,-0.0359725%20l%20-0.2077343,-0.003499%20-0.030724,-0.030657%20-0.030726,-0.0306545%20-0.00559,-0.2248578%20C%201.4526169,0.29172899%201.4489667,0.2526966%201.4323229,0.22732768%20L%201.4126645,0.19737178%20H%201.0338569%20c%20-0.35533549,0%20-0.38160953,0.001271%20-0.42390298,0.0220537%20-0.024833,0.0121087%20-0.0575278,0.0404547%20-0.0727971,0.0629176%20l%20-0.0277141,0.0409419%20-0.002807,0.91077702%20-0.002807,0.9107848%200.0259658,0.049058%20c%200.0421326,0.079722%200.0756984,0.09258%200.26273004,0.1007415%200.088434,0.0035%200.37213774,0.0049%200.63046714,0.00281%200.4588305,-0.0042%200.470671,-0.0049%200.5128956,-0.028418%20z%20M%200.72491694,1.8839999%20c%20-0.0402407,-0.040243%20-0.0412918,-0.077279%20-0.003499,-0.1219847%20l%200.0286934,-0.034155%20H%201.264139%201.7781717%20l%200.027714,0.024935%20c%200.042202,0.038003%200.0429,0.09516%200.00127,0.136347%20l%20-0.027224,0.027226%20H%201.2685%200.75705516%20Z%20m%200.002807,-0.3781855%20c%20-0.0324746,-0.030304%20-0.0406612,-0.069078%20-0.0224628,-0.1069961%200.027013,-0.056268%200.0611,-0.060189%200.49459446,-0.056688%20l%200.3925398,0.00281%200.026735,0.031147%20c%200.032825,0.038142%200.034224,0.083907%200.0035,0.1226355%20L%201.59958,1.5279048%20H%201.175552%20c%20-0.4106244,0%20-0.42478771,-7.65e-4%20-0.44815768,-0.022463%20z%20m%200.0239405,-0.365534%20c%20-0.0305147,-0.01231%20-0.0594171,-0.053609%20-0.0594171,-0.084881%200,-0.013437%200.0129269,-0.039749%200.0286934,-0.0585071%20L%200.74963414,0.9628066%20H%201.2627873%20c%200.5023504,0%200.5137728,5.099e-4%200.5423695,0.0230494%200.021621,0.0170063%200.029186,0.0330359%200.029186,0.0617294%200,0.05263%20-0.01517,0.077014%20-0.056829,0.091551%20-0.042557,0.014839%20-0.98940801,0.015935%20-1.02589077,0.00127%20z'%20id='path182'%20/%3e%3c/svg%3e";
const _imports_9 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='load.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='256'%20inkscape:cx='0.515625'%20inkscape:cy='1.0214844'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='fill:none;stroke:%23f7f7f7;stroke-width:0.223306;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke%20fill%20markers;stroke-opacity:1'%20d='M%200.14290162,1.4208162%20V%202.2242417%20H%202.3953559%20V%201.4064695'%20id='path183'%20/%3e%3cpath%20style='fill:none;stroke:%23f7f7f7;stroke-width:0.253518;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke%20fill%20markers;stroke-opacity:1'%20d='M%201.2751499,0.36114673%20V%201.5470784%20L%200.64819928,0.959708%201.29507,1.5657407%201.9074563,0.99200417'%20id='path184'%20/%3e%3c/svg%3e";
const _imports_10 = "" + new URL("cloud-CdgFZIf4.svg", import.meta.url).href;
const _sfc_main$9 = {
  props: {
    foldersMethods2: {
      type: Object,
      required: true
    },
    dataSettings: {
      type: Object,
      required: true
    },
    folders: {
      type: Object,
      required: true
    },
    localState: {
      type: Object,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    projectID: {
      type: String,
      required: true
    }
  },
  methods: {
    markActiveFolder: function(name) {
      return name == this.path.split("/")[this.path.split("/").length - 1];
    },
    markOpenedFolder: function(dat) {
    },
    foldPin: function() {
      this.dataSettings.pinFoldersIsFolded = !this.dataSettings.pinFoldersIsFolded;
    },
    foldSessionFolders: function() {
      this.dataSettings.foldersIsFolded = !this.dataSettings.foldersIsFolded;
    },
    clickToAddressBarPart: function(dat) {
      this.foldersMethods2.clickToFolder(dat);
    },
    sessionFolderDisplayFilter: function(folder2) {
      return folder2.files.length > 0 ? !folder2.files.every((file) => file.markID == defaults.unmarkedMarkID) : false;
    },
    pressEsc() {
      this.foldersMethods2.abortCopyCutOperation();
      this.renameSelectedFolder({ state: "abort" });
    },
    renameSelectedFolder: function(dat) {
      if (dat.state == "input-start") {
        this.nameOfTheFolderToBeRenamed = this.foldersMethods2.getActiveFolderName();
      }
      if (dat.state == "abort") {
        this.nameOfTheFolderToBeRenamed = null;
      }
      if (dat.state == "input-done") {
        let result = this.foldersMethods2.renameSelectedFolder({ newName: this.renameValue });
        if (result) {
          this.renameValue = "";
          this.nameOfTheFolderToBeRenamed = null;
        }
      }
    },
    createNewFolder: function(dat) {
      console.log("CREATE FOLDER");
      if (dat.state == "input-start") {
        this.isCreatredNewFolder = true;
      }
      if (dat.state == "input-done") {
        let result = this.foldersMethods2.createNewFolder(this.newFolderName);
        if (result) {
          this.isCreatredNewFolder = false;
        }
      }
    }
  },
  beforeMount() {
  },
  beforeUpdate() {
  },
  data() {
    return {
      nameOfTheFolderToBeRenamed: null,
      renameValue: "",
      isCreatredNewFolder: false,
      newFolderName: "",
      settings,
      defaults
      // settings:{
      //   replacedSymbolPath: ' > ',
      //   folderNameRegexp: /[\\\/<>:\"\*\?\|]/g,
      //   folderNameMaxLength: 30,
      //   addressBarFolderNameMaxLength: 10,    //  pick up
      // },
      // defaults:{
      //   unmarkedMarkID: 'mark_unmarked',
      // },
    };
  },
  computed: {
    getPathForAddressBar() {
      if (this.path.indexOf("/") >= 0) return this.path.split("/");
      if (this.path.indexOf("\\") >= 0) return this.path.split("\\");
    }
  }
};
const _hoisted_1$9 = {
  key: 0,
  class: "folders block on-row"
};
const _hoisted_2$7 = {
  key: 0,
  class: "folders-item on-col w100"
};
const _hoisted_3$7 = { class: "item w100 on-row" };
const _hoisted_4$7 = ["onClick", "id"];
const _hoisted_5$7 = { class: "t-tree-item text-nowrap uppercase" };
const _hoisted_6$7 = {
  key: 1,
  class: "pin-block block on-row focus",
  tabindex: "0"
};
const _hoisted_7$7 = {
  key: 0,
  class: "on-col w100"
};
const _hoisted_8$7 = { class: "item w100" };
const _hoisted_9$6 = {
  key: 0,
  class: "w100"
};
const _hoisted_10$5 = ["onClick", "id"];
const _hoisted_11$4 = { class: "t-tree-item text-nowrap uppercase" };
const _hoisted_12$4 = { class: "address-bar on-row w100" };
const _hoisted_13$4 = {
  key: 0,
  class: "address-box"
};
const _hoisted_14$4 = { class: "address-block on-row no-wrap w100" };
const _hoisted_15$2 = { class: "on-row no-wrap" };
const _hoisted_16$2 = ["onClick"];
const _hoisted_17$2 = { class: "t-tree-address uppercase text-nowrap" };
const _hoisted_18$2 = { class: "t-tree-address uppercase text-nowrap" };
const _hoisted_19$2 = {
  key: 1,
  class: "address-box"
};
const _hoisted_20$2 = { class: "t-tree-address uppercase text-nowrap" };
const _hoisted_21$2 = {
  key: 0,
  src: _imports_3$2,
  alt: "Show hide & system folders",
  class: "eye"
};
const _hoisted_22$2 = {
  key: 1,
  src: _imports_4$1,
  alt: "Hide system folders",
  class: "eye"
};
const _hoisted_23$2 = {
  class: "tree-block focus scrollY on-col",
  tabindex: "0"
};
const _hoisted_24$2 = { class: "block on-col" };
const _hoisted_25$2 = { class: "" };
const _hoisted_26$2 = ["onClick"];
const _hoisted_27$2 = { class: "t-tree-item uppercase text-nowrap" };
const _hoisted_28$2 = {
  key: 1,
  class: "rename"
};
const _hoisted_29$2 = ["v-model", "id"];
const _hoisted_30$2 = { class: "block on-col" };
const _hoisted_31$2 = { class: "" };
const _hoisted_32$2 = { class: "list-item item on-row w100" };
const _hoisted_33$2 = ["onClick"];
const _hoisted_34$2 = { class: "t-tree-item text-nowrap uppercase text-nowrap" };
const _hoisted_35$2 = {
  key: 1,
  class: "rename"
};
const _hoisted_36$2 = ["v-model", "id"];
const _hoisted_37$2 = {
  key: 0,
  class: "block list-item item new-folder rename on-row w100"
};
const _hoisted_38$2 = ["v-model"];
const _hoisted_39$2 = {
  key: 2,
  class: "special-folders block on-col"
};
const _hoisted_40$2 = { class: "on-row item" };
const _hoisted_41$1 = { class: "on-row item" };
const _hoisted_42$1 = {
  key: 3,
  class: "clouds-block block on-col"
};
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    onKeyup: [
      _cache[19] || (_cache[19] = withKeys(($event) => $options.renameSelectedFolder({ state: "input-start" }), ["f2"])),
      _cache[20] || (_cache[20] = withKeys(($event) => $options.pressEsc(), ["esc"])),
      _cache[21] || (_cache[21] = withKeys(withModifiers(($event) => $props.foldersMethods2.pinFolder(), ["ctrl"]), ["d"])),
      _cache[22] || (_cache[22] = withKeys(($event) => $props.foldersMethods2.refreshDisplayedFolders(), ["f5"])),
      _cache[23] || (_cache[23] = withKeys(withModifiers(($event) => $options.createNewFolder({ state: "input-start" }), ["shift", "ctrl", "exact"]), ["n"])),
      _cache[24] || (_cache[24] = withKeys(withModifiers(($event) => $options.createNewFolder({ state: "input-start" }), ["ctrl"]), ["n"])),
      _cache[25] || (_cache[25] = withKeys(withModifiers(($event) => $props.foldersMethods2.copyPastFolder({ state: "copy folder" }), ["ctrl"]), ["c"])),
      _cache[26] || (_cache[26] = withKeys(withModifiers(($event) => $props.foldersMethods2.copyPastFolder({ state: "past folder" }), ["ctrl"]), ["v"])),
      _cache[27] || (_cache[27] = withKeys(withModifiers(($event) => $props.foldersMethods2.copyPastFolder({ state: "cut folder" }), ["ctrl"]), ["x"])),
      _cache[28] || (_cache[28] = withKeys(withModifiers(($event) => $props.foldersMethods2.treeNavigate("adjacent folder: up"), ["exact"]), ["up"])),
      _cache[29] || (_cache[29] = withKeys(withModifiers(($event) => $props.foldersMethods2.treeNavigate("adjacent folder: down"), ["exact"]), ["down"])),
      _cache[30] || (_cache[30] = withKeys(withModifiers(($event) => $props.foldersMethods2.treeNavigate("first child folder"), ["exact"]), ["right"])),
      _cache[31] || (_cache[31] = withKeys(withModifiers(($event) => $props.foldersMethods2.treeNavigate("parent folder"), ["exact"]), ["left"])),
      _cache[32] || (_cache[32] = withKeys(withModifiers(($event) => $props.foldersMethods2.treeNavigate("previous folder in history"), ["ctrl"]), ["left"]))
    ],
    class: "component focus h100 on-col",
    tabindex: "0"
  }, [
    $data.settings[$props.localState.actualSessionType].showSessionFolders ? (openBlock(), createElementBlock("div", _hoisted_1$9, [
      createBaseVNode("div", {
        onClick: _cache[0] || (_cache[0] = ($event) => $options.foldSessionFolders()),
        class: "left-field"
      }, [
        createBaseVNode("div", {
          class: normalizeClass({ foldersActive: $props.dataSettings.foldersIsFolded })
        }, _cache[33] || (_cache[33] = [
          createBaseVNode("img", {
            src: _imports_0$3,
            alt: "",
            class: "left-field-logo"
          }, null, -1)
        ]), 2)
      ]),
      $props.dataSettings.foldersIsFolded ? (openBlock(), createElementBlock("div", _hoisted_2$7, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.folders, (folder2) => {
          return openBlock(), createElementBlock("div", _hoisted_3$7, [
            $options.sessionFolderDisplayFilter(folder2) ? (openBlock(), createElementBlock("div", {
              key: 0,
              onClick: ($event) => $props.foldersMethods2.clickToFolder({ path: folder2.path, folderID: folder2.id }),
              id: folder2.id,
              class: normalizeClass([{ active: $options.markActiveFolder($props.foldersMethods2.getFolderName(folder2.path)), opened: $options.markOpenedFolder(folder2.path) }, "list-item w100"])
            }, [
              createBaseVNode("span", _hoisted_5$7, toDisplayString($props.foldersMethods2.getFolderName(folder2.path)), 1)
            ], 10, _hoisted_4$7)) : createCommentVNode("", true)
          ]);
        }), 256))
      ])) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    $data.settings[this.localState.actualSessionType].showPinFolders ? (openBlock(), createElementBlock("div", _hoisted_6$7, [
      createBaseVNode("div", {
        onClick: _cache[1] || (_cache[1] = ($event) => $options.foldPin()),
        class: "left-field"
      }, [
        createBaseVNode("div", {
          class: normalizeClass({ pinActive: $props.dataSettings.pinFoldersIsFolded })
        }, _cache[34] || (_cache[34] = [
          createBaseVNode("img", {
            src: _imports_0$2,
            alt: "",
            class: "left-field-logo"
          }, null, -1)
        ]), 2)
      ]),
      !$props.dataSettings.pinFoldersIsFolded ? (openBlock(), createElementBlock("div", _hoisted_7$7, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.folders, (folder2) => {
          return openBlock(), createElementBlock("div", _hoisted_8$7, [
            folder2.isPinned ? (openBlock(), createElementBlock("div", _hoisted_9$6, [
              createBaseVNode("div", {
                onClick: ($event) => $props.foldersMethods2.clickToFolder({ path: folder2.path, folderID: folder2.id }),
                id: folder2.id,
                class: normalizeClass([{ active: $options.markActiveFolder($props.foldersMethods2.getFolderName(folder2.path)), opened: $options.markOpenedFolder(folder2.path) }, "list-item on-row w100"])
              }, [
                createBaseVNode("div", null, [
                  createBaseVNode("span", _hoisted_11$4, toDisplayString($props.foldersMethods2.getFolderName(folder2.path)), 1)
                ]),
                _cache[36] || (_cache[36] = createBaseVNode("div", { class: "w100" }, null, -1)),
                createBaseVNode("div", {
                  onClick: _cache[2] || (_cache[2] = ($event) => $props.foldersMethods2.pinFolder()),
                  class: "pin btn-opacity h100 on-center"
                }, _cache[35] || (_cache[35] = [
                  createBaseVNode("img", {
                    src: _imports_2$1,
                    alt: "pin folder",
                    class: "pix-btn"
                  }, null, -1)
                ]))
              ], 10, _hoisted_10$5)
            ])) : createCommentVNode("", true)
          ]);
        }), 256))
      ])) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", _hoisted_12$4, [
      !$props.foldersMethods2.openedFolderIsRoot() ? (openBlock(), createElementBlock("div", _hoisted_13$4, [
        createBaseVNode("div", _hoisted_14$4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($options.getPathForAddressBar, (part, index) => {
            return openBlock(), createElementBlock("div", _hoisted_15$2, [
              createBaseVNode("div", {
                onClick: ($event) => $options.clickToAddressBarPart({ path: $props.path.split($data.settings.actualSeparator).slice(0, index + 1).join($data.settings.actualSeparator) }),
                class: "address-bar-part"
              }, [
                createBaseVNode("span", _hoisted_17$2, toDisplayString($props.foldersMethods2.shrinkName(part, $data.settings.addressBarFolderNameMaxLength)), 1)
              ], 8, _hoisted_16$2),
              createBaseVNode("div", null, [
                createBaseVNode("span", _hoisted_18$2, toDisplayString($data.settings.replacedSymbolPath), 1)
              ])
            ]);
          }), 256))
        ])
      ])) : createCommentVNode("", true),
      $props.foldersMethods2.openedFolderIsRoot() ? (openBlock(), createElementBlock("div", _hoisted_19$2, [
        createBaseVNode("div", null, [
          createBaseVNode("span", _hoisted_20$2, toDisplayString($data.settings.replacedSymbolPath), 1)
        ])
      ])) : createCommentVNode("", true),
      _cache[37] || (_cache[37] = createBaseVNode("div", { class: "w100" }, null, -1)),
      createBaseVNode("div", {
        onClick: _cache[3] || (_cache[3] = ($event) => $props.foldersMethods2.showFoldersStartingWithDot()),
        class: "btn-opacity vertical-center h100"
      }, [
        $props.dataSettings.showFoldersStartingWithDot ? (openBlock(), createElementBlock("img", _hoisted_21$2)) : (openBlock(), createElementBlock("img", _hoisted_22$2))
      ])
    ]),
    createBaseVNode("div", _hoisted_23$2, [
      createBaseVNode("div", _hoisted_24$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.foldersMethods2.getFoldersList(), (item) => {
          return openBlock(), createElementBlock("div", _hoisted_25$2, [
            $data.nameOfTheFolderToBeRenamed != item ? (openBlock(), createElementBlock("div", {
              key: 0,
              onDblclick: _cache[7] || (_cache[7] = ($event) => $options.renameSelectedFolder({ state: "input-start" })),
              onClick: ($event) => $props.foldersMethods2.clickOnTheDirectoryInTheFolderTree(item, "this level"),
              class: normalizeClass([{ active: $options.markActiveFolder(item), opened: $options.markOpenedFolder(item), "item-copy-cut": item == $props.foldersMethods2.copyPastFolder({ state: "get copy-folder name" }) }, "list-item item on-row w100"])
            }, [
              createBaseVNode("div", null, [
                createBaseVNode("span", _hoisted_27$2, toDisplayString($props.foldersMethods2.shrinkName(item, $data.settings.folderNameMaxLength)), 1)
              ]),
              _cache[41] || (_cache[41] = createBaseVNode("div", { class: "w100" }, null, -1)),
              createBaseVNode("div", {
                onClick: _cache[4] || (_cache[4] = ($event) => $options.createNewFolder({ state: "input-start" })),
                class: "add btn-opacity vertical-center h100"
              }, _cache[38] || (_cache[38] = [
                createBaseVNode("img", {
                  src: _imports_3$1,
                  alt: "create new folder",
                  class: "pix-btn"
                }, null, -1)
              ])),
              createBaseVNode("div", {
                onClick: _cache[5] || (_cache[5] = ($event) => $props.foldersMethods2.pinFolder()),
                class: "pin btn-opacity vertical-center h100"
              }, _cache[39] || (_cache[39] = [
                createBaseVNode("img", {
                  src: _imports_0$2,
                  alt: "pin folder",
                  class: "pix-btn"
                }, null, -1)
              ])),
              $props.foldersMethods2.isProtected() ? (openBlock(), createElementBlock("div", {
                key: 0,
                onClick: _cache[6] || (_cache[6] = ($event) => $props.foldersMethods2.deleteFolder()),
                class: "delete btn-opacity vertical-center h100"
              }, _cache[40] || (_cache[40] = [
                createBaseVNode("img", {
                  src: _imports_1,
                  alt: "delete this folder",
                  class: "pix-btn"
                }, null, -1)
              ]))) : createCommentVNode("", true)
            ], 42, _hoisted_26$2)) : (openBlock(), createElementBlock("div", _hoisted_28$2, [
              createBaseVNode("input", {
                type: "text",
                placeholder: "folder name",
                "v-model": $data.renameValue,
                onInput: _cache[8] || (_cache[8] = (event) => $data.renameValue = event.target.value.replace($data.settings.folderNameRegexp, "")),
                id: `${item}`,
                onKeyup: [
                  _cache[9] || (_cache[9] = withKeys(($event) => _ctx.isRemaned = false, ["esc"])),
                  _cache[10] || (_cache[10] = withKeys(($event) => $options.renameSelectedFolder({ state: "input-done" }), ["enter"]))
                ],
                class: "t-tree-item t-tree-renaming rename-input uppercase focus w100"
              }, null, 40, _hoisted_29$2)
            ]))
          ]);
        }), 256))
      ]),
      createBaseVNode("div", _hoisted_30$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.foldersMethods2.getSubfoldersList(), (item) => {
          return openBlock(), createElementBlock("div", _hoisted_31$2, [
            createBaseVNode("div", _hoisted_32$2, [
              _cache[42] || (_cache[42] = createBaseVNode("div", { class: "vertical-center h100" }, [
                createBaseVNode("img", {
                  src: _imports_7,
                  class: "tree-level-pix"
                })
              ], -1)),
              $data.nameOfTheFolderToBeRenamed != item ? (openBlock(), createElementBlock("div", {
                key: 0,
                onClick: ($event) => $props.foldersMethods2.clickOnTheDirectoryInTheFolderTree(item, "child level"),
                class: "sub-item"
              }, [
                createBaseVNode("span", _hoisted_34$2, toDisplayString($props.foldersMethods2.shrinkName(item, $data.settings.folderNameMaxLength)), 1)
              ], 8, _hoisted_33$2)) : (openBlock(), createElementBlock("div", _hoisted_35$2, [
                createBaseVNode("input", {
                  type: "text",
                  placeholder: "folder name",
                  "v-model": $data.renameValue,
                  onInput: _cache[11] || (_cache[11] = (event) => $data.renameValue = event.target.value.replace($data.settings.folderNameRegexp, "")),
                  id: `sub_${item}`,
                  onKeyup: [
                    _cache[12] || (_cache[12] = withKeys(($event) => _ctx.isRemaned = false, ["esc"])),
                    _cache[13] || (_cache[13] = withKeys(($event) => $options.renameSelectedFolder({ state: "input-done" }), ["enter"]))
                  ],
                  class: "t-tree-renaming rename-input focus w100"
                }, null, 40, _hoisted_36$2)
              ]))
            ])
          ]);
        }), 256))
      ]),
      $data.isCreatredNewFolder ? (openBlock(), createElementBlock("div", _hoisted_37$2, [
        _cache[43] || (_cache[43] = createBaseVNode("div", { class: "vertical-center h100" }, [
          createBaseVNode("img", {
            src: _imports_7,
            class: "tree-level-pix"
          })
        ], -1)),
        createBaseVNode("input", {
          type: "text",
          placeholder: "new folder name",
          "v-model": $data.newFolderName,
          onInput: _cache[14] || (_cache[14] = (event) => $data.newFolderName = event.target.value.replace($data.settings.folderNameRegexp, "")),
          id: "newFolderInput",
          onKeyup: [
            _cache[15] || (_cache[15] = withKeys(($event) => $data.isCreatredNewFolder = false, ["esc"])),
            _cache[16] || (_cache[16] = withKeys(($event) => $options.createNewFolder({ state: "input-done" }), ["enter"]))
          ],
          class: "sub-item t-tree-item t-tree-renaming rename-input uppercase focus w100"
        }, null, 40, _hoisted_38$2)
      ])) : createCommentVNode("", true)
    ]),
    $data.settings[this.localState.actualSessionType].showSpecialFoldersBtns ? (openBlock(), createElementBlock("div", _hoisted_39$2, [
      createBaseVNode("div", _hoisted_40$2, [
        _cache[45] || (_cache[45] = createBaseVNode("div", { class: "left-field" }, [
          createBaseVNode("img", {
            src: _imports_8,
            alt: "my documents",
            class: "pix-btn docs"
          })
        ], -1)),
        createBaseVNode("div", {
          onClick: _cache[17] || (_cache[17] = ($event) => $props.foldersMethods2.clickToSpecialFolder($data.settings.specialFolders.docs)),
          class: "list-item"
        }, _cache[44] || (_cache[44] = [
          createBaseVNode("span", { class: "t-tree-item text-nowrap uppercase" }, "my docs", -1)
        ]))
      ]),
      createBaseVNode("div", _hoisted_41$1, [
        _cache[47] || (_cache[47] = createBaseVNode("div", { class: "left-field" }, [
          createBaseVNode("img", {
            src: _imports_9,
            alt: "downloads",
            class: "pix-btn loads"
          })
        ], -1)),
        createBaseVNode("div", {
          onClick: _cache[18] || (_cache[18] = ($event) => $props.foldersMethods2.clickToSpecialFolder($data.settings.specialFolders.loads)),
          class: "list-item"
        }, _cache[46] || (_cache[46] = [
          createBaseVNode("span", { class: "t-tree-item text-nowrap uppercase" }, "downloads", -1)
        ]))
      ])
    ])) : createCommentVNode("", true),
    $data.settings[this.localState.actualSessionType].showCloudsStorageBtns ? (openBlock(), createElementBlock("div", _hoisted_42$1, _cache[48] || (_cache[48] = [
      createStaticVNode('<div class="on-row item" data-v-ed8e3966><div class="left-field" data-v-ed8e3966><img src="' + _imports_10 + '" alt="clouds" class="pix-btn cloud" data-v-ed8e3966></div><div class="list-item" data-v-ed8e3966><span class="t-tree-item text-nowrap uppercase" data-v-ed8e3966>one drive</span></div></div><div class="on-row item" data-v-ed8e3966><div class="left-field" data-v-ed8e3966></div><div class="list-item" data-v-ed8e3966><span class="t-tree-item text-nowrap uppercase" data-v-ed8e3966>google drive</span></div></div>', 2)
    ]))) : createCommentVNode("", true)
  ], 32);
}
const Tree = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-ed8e3966"]]);
const _imports_0$1 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.322'%20height='2.322'%20viewBox='0%200%202.322%202.322'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='arc%20dawn.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='256'%20inkscape:cx='0.6953125'%20inkscape:cy='1.2792969'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cg%20id='g1886'%20style='display:inline;fill:%23f2f2f2;stroke:%23f2f2f2;stroke-opacity:1;stroke-width:0;stroke-dasharray:none'%20transform='translate(-126.63519,-106.0517)'%3e%3cpath%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:%23f2f2f2;stroke-width:0;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20d='m%20128.82302,106.90737%20h%20-2.05366%20l%201.01598,0.80207%20z'%20id='path1885-4'%20sodipodi:nodetypes='cccc'%20/%3e%3c/g%3e%3c/svg%3e";
const _sfc_main$8 = {
  props: {
    task: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    selectTask: function(id) {
      console.log(this.selected);
    },
    checkToTask: function(id) {
      this.task.isDone = !this.task.isDone;
      if (this.task.subtasksAvailability) {
        let allSubtasksIsDone = true;
        for (const key in this.task.subtasks) {
          if (!this.task.subtasks[key].isDone) allSubtasksIsDone = false;
        }
        if (allSubtasksIsDone) this.task.isDone = true;
      }
    },
    pinTask: function() {
      if (Object.hasOwn(this.task, "subtasks")) {
        this.task.isPinned = !this.task.isPinned;
      }
    },
    editTask: function(dat) {
      if (dat.state == "input-start") {
        this.isRemaned = true;
        this.renamedValue = dat.name;
      }
      if (dat.state == "input-done") {
        if (this.renamedValue.length > 0) {
          this.task.name = document.querySelector(`#${dat.taskID} span`).innerText;
          this.isRemaned = false;
        }
      }
    },
    addSubTask: function() {
      if (this.task.id.indexOf("sub") != 0) {
        let subID = "sub" + Math.floor(Math.random() * 1e7);
        this.task.subtasksAvailability = true;
        this.task.isFolded = false;
        this.task.subtasks[subID] = {
          id: subID,
          name: "new sub-task",
          descr: "description...",
          isDone: false,
          isSelected: false,
          subtasksAvailability: false
        };
      }
    },
    foldTask: function() {
      if (this.task.id.indexOf("sub") == -1) this.task.isFolded = !this.task.isFolded;
    }
  },
  data() {
    return {
      isRemaned: false,
      renamedValue: ""
    };
  },
  beforeUpdate() {
    this.task.isSelected = this.selected;
  }
};
const _hoisted_1$8 = { class: "check" };
const _hoisted_2$6 = {
  key: 0,
  class: "check-done w100 h100"
};
const _hoisted_3$6 = { class: "w100 on-row" };
const _hoisted_4$6 = {
  key: 0,
  src: _imports_0$2,
  alt: "Pin this task",
  class: "btn pix-btn"
};
const _hoisted_5$6 = {
  key: 1,
  src: _imports_2$1,
  alt: "Pin this task",
  class: "btn pix-btn"
};
const _hoisted_6$6 = {
  key: 2,
  class: "add btn-opacity on-center"
};
const _hoisted_7$6 = { key: 0 };
const _hoisted_8$6 = {
  key: 1,
  id: "INPUT",
  class: "list-item rename-box w100"
};
const _hoisted_9$5 = ["id"];
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return !$data.isRemaned ? (openBlock(), createElementBlock("div", {
    key: 0,
    onKeyup: [
      _cache[7] || (_cache[7] = withKeys(withModifiers(($event) => $options.pinTask($props.task.id), ["ctrl"]), ["d"])),
      _cache[8] || (_cache[8] = ($event) => $options.editTask({ state: "input-start", name: $props.task.name }))
    ],
    class: "task-block list-item w100 on-row focus",
    tabindex: "0"
  }, [
    !$props.task.subtasksAvailability ? (openBlock(), createElementBlock("div", {
      key: 0,
      onClick: _cache[0] || (_cache[0] = ($event) => $options.checkToTask($props.task.id)),
      class: "btn checkbox check-box"
    }, [
      createBaseVNode("div", _hoisted_1$8, [
        $props.task.isDone ? (openBlock(), createElementBlock("div", _hoisted_2$6)) : createCommentVNode("", true)
      ])
    ])) : createCommentVNode("", true),
    $props.task.subtasksAvailability ? (openBlock(), createElementBlock("div", {
      key: 1,
      onClick: _cache[1] || (_cache[1] = ($event) => $options.foldTask()),
      class: "btn fold-box on-center"
    }, _cache[11] || (_cache[11] = [
      createBaseVNode("div", null, [
        createBaseVNode("img", {
          src: _imports_0$1,
          alt: "fold task",
          class: "pix-btn"
        })
      ], -1)
    ]))) : createCommentVNode("", true),
    createBaseVNode("div", _hoisted_3$6, [
      createBaseVNode("div", {
        onClick: _cache[2] || (_cache[2] = ($event) => $options.selectTask($props.task.id)),
        onDblclick: _cache[3] || (_cache[3] = ($event) => $options.editTask({ state: "input-start", name: $props.task.name })),
        class: "task"
      }, [
        createBaseVNode("span", {
          class: normalizeClass([{ done: $props.task.isDone }, "uppercase t-task"])
        }, toDisplayString($props.task.name), 3)
      ], 32),
      $props.task.id.indexOf("sub") != 0 && !$props.task.isDone ? (openBlock(), createElementBlock("div", {
        key: 0,
        onClick: _cache[4] || (_cache[4] = ($event) => $options.pinTask()),
        class: "pin btn-opacity on-center"
      }, [
        !$props.task.isPinned ? (openBlock(), createElementBlock("img", _hoisted_4$6)) : createCommentVNode("", true),
        $props.task.isPinned ? (openBlock(), createElementBlock("img", _hoisted_5$6)) : createCommentVNode("", true)
      ])) : createCommentVNode("", true),
      $props.task.isDone ? (openBlock(), createElementBlock("div", {
        key: 1,
        onClick: _cache[5] || (_cache[5] = ($event) => this.$emit("deleteTask", this.task)),
        class: "delete btn-opacity on-center"
      }, _cache[12] || (_cache[12] = [
        createBaseVNode("img", {
          src: _imports_1,
          alt: "delete task / subtasks",
          class: "btn pix-btn"
        }, null, -1)
      ]))) : createCommentVNode("", true),
      $props.task.id.indexOf("sub") != 0 ? (openBlock(), createElementBlock("div", _hoisted_6$6, [
        !$props.task.isDone ? (openBlock(), createElementBlock("div", _hoisted_7$6, [
          createBaseVNode("img", {
            src: _imports_3$1,
            onClick: _cache[6] || (_cache[6] = ($event) => $options.addSubTask()),
            alt: "new subtask",
            class: "btn pix-btn"
          })
        ])) : createCommentVNode("", true)
      ])) : createCommentVNode("", true)
    ])
  ], 32)) : (openBlock(), createElementBlock("div", _hoisted_8$6, [
    createBaseVNode("div", {
      contenteditable: "true",
      id: `${$props.task.id}`,
      onKeyup: [
        _cache[9] || (_cache[9] = withKeys(($event) => $data.isRemaned = false, ["esc"])),
        _cache[10] || (_cache[10] = withKeys(($event) => $options.editTask({ state: "input-done", taskID: $props.task.id }), ["enter"]))
      ],
      class: "rename-input t-task t-task-renaming uppercase focus w100"
    }, [
      createBaseVNode("span", null, toDisplayString($data.renamedValue), 1)
    ], 40, _hoisted_9$5)
  ]));
}
const TaskItem = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-bc893421"]]);
const _sfc_main$7 = {
  components: {
    TaskItem
  },
  props: {
    tasks: {
      type: Object,
      required: true
    }
  },
  methods: {
    createNewTask: function() {
      if (this.newTaskValue.length > 0) {
        let taskID = "task_" + Math.floor(Math.random() * 1e7);
        this.tasks[taskID] = {
          id: taskID,
          name: this.newTaskValue,
          descr: "",
          isDone: false,
          isSelected: false,
          isPinned: false,
          isFolded: true,
          subtasksAvailability: false,
          subtasks: {}
        };
      }
    },
    moveTask: function(dat) {
      console.log("task: " + dat);
    },
    deleteTask(task) {
      if (Object.hasOwn(this.tasks, task.id)) {
        delete this.tasks[task.id];
      } else {
        for (const key in this.tasks) {
          if (Object.hasOwn(this.tasks[key], "subtasks")) {
            if (Object.hasOwn(this.tasks[key].subtasks, task.id)) {
              if (Object.keys(this.tasks[key].subtasks).length == 1)
                this.tasks[key].subtasksAvailability = false;
              delete this.tasks[key].subtasks[task.id];
            }
          }
        }
      }
    }
  },
  computed: {
    isThereAtLeastOneAttachedTask() {
      return Object.values(this.tasks).find((task) => task.isPinned == true);
    }
  },
  data() {
    return {
      newTaskValue: "new task",
      selectedTaskId: null,
      selectedSubTaskId: null
    };
  }
};
const _hoisted_1$7 = { class: "section on-col" };
const _hoisted_2$5 = {
  key: 0,
  class: "pin-block on-row"
};
const _hoisted_3$5 = { class: "scrollY on-col w100" };
const _hoisted_4$5 = { key: 0 };
const _hoisted_5$5 = { class: "on-row" };
const _hoisted_6$5 = ["value"];
const _hoisted_7$5 = { class: "sub on-col" };
const _hoisted_8$5 = { class: "block on-row" };
const _hoisted_9$4 = { class: "scrollY on-col w100" };
const _hoisted_10$4 = {
  key: 0,
  class: "on-col"
};
const _hoisted_11$3 = { class: "on-row" };
const _hoisted_12$3 = ["value"];
const _hoisted_13$3 = { class: "sub on-col" };
const _hoisted_14$3 = { class: "create on-row" };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TaskItem = resolveComponent("TaskItem");
  return openBlock(), createElementBlock("div", {
    onKeyup: [
      _cache[4] || (_cache[4] = withKeys(($event) => $options.moveTask("up"), ["up"])),
      _cache[5] || (_cache[5] = withKeys(($event) => $options.moveTask("down"), ["down"]))
    ],
    class: "task-component focus",
    tabindex: "0"
  }, [
    createBaseVNode("div", _hoisted_1$7, [
      $options.isThereAtLeastOneAttachedTask ? (openBlock(), createElementBlock("div", _hoisted_2$5, [
        _cache[6] || (_cache[6] = createBaseVNode("div", { class: "left-field" }, [
          createBaseVNode("img", {
            src: _imports_0$2,
            alt: "",
            class: "pix-btn"
          })
        ], -1)),
        createBaseVNode("div", _hoisted_3$5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.tasks, (task) => {
            return openBlock(), createElementBlock("label", {
              key: task.id
            }, [
              task.isPinned ? (openBlock(), createElementBlock("div", _hoisted_4$5, [
                createBaseVNode("div", _hoisted_5$5, [
                  withDirectives(createBaseVNode("input", {
                    type: "radio",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.selectedTaskId = $event),
                    value: task.id,
                    class: "hide radio"
                  }, null, 8, _hoisted_6$5), [
                    [vModelRadio, $data.selectedTaskId]
                  ]),
                  createVNode(_component_TaskItem, {
                    task,
                    selected: task.id == $data.selectedTaskId,
                    class: normalizeClass({ selected: !task.isDone && task.isSelected }),
                    onDeleteTask: $options.deleteTask
                  }, null, 8, ["task", "selected", "class", "onDeleteTask"])
                ]),
                !task.isFolded ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(task.subtasks, (subtask) => {
                  return openBlock(), createElementBlock("div", _hoisted_7$5, [
                    createVNode(_component_TaskItem, {
                      task: subtask,
                      selected: subtask.id == $data.selectedSubTaskId,
                      class: normalizeClass({ selected: !subtask.isDone && subtask.isSelected }),
                      onDeleteTask: $options.deleteTask
                    }, null, 8, ["task", "selected", "class", "onDeleteTask"])
                  ]);
                }), 256)) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ]);
          }), 128))
        ])
      ])) : createCommentVNode("", true),
      _cache[9] || (_cache[9] = createBaseVNode("div", { class: "empty1" }, null, -1)),
      createBaseVNode("div", _hoisted_8$5, [
        _cache[7] || (_cache[7] = createBaseVNode("div", { class: "left-field" }, null, -1)),
        createBaseVNode("div", _hoisted_9$4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.tasks, (task) => {
            return openBlock(), createElementBlock("label", {
              key: task.id
            }, [
              !task.isPinned ? (openBlock(), createElementBlock("div", _hoisted_10$4, [
                createBaseVNode("div", _hoisted_11$3, [
                  withDirectives(createBaseVNode("input", {
                    type: "radio",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.selectedTaskId = $event),
                    value: task.id,
                    class: "hide radio"
                  }, null, 8, _hoisted_12$3), [
                    [vModelRadio, $data.selectedTaskId]
                  ]),
                  createVNode(_component_TaskItem, {
                    task,
                    selected: task.id == $data.selectedTaskId,
                    class: normalizeClass({ selected: !task.isDone && task.isSelected }),
                    onDeleteTask: $options.deleteTask
                  }, null, 8, ["task", "selected", "class", "onDeleteTask"])
                ]),
                !task.isFolded ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(task.subtasks, (subtask) => {
                  return openBlock(), createElementBlock("div", _hoisted_13$3, [
                    createVNode(_component_TaskItem, {
                      task: subtask,
                      selected: subtask.id == $data.selectedSubTaskId,
                      class: normalizeClass({ selected: !subtask.isDone && subtask.isSelected }),
                      onDeleteTask: $options.deleteTask
                    }, null, 8, ["task", "selected", "class", "onDeleteTask"])
                  ]);
                }), 256)) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ]);
          }), 128))
        ])
      ]),
      _cache[10] || (_cache[10] = createBaseVNode("div", { class: "empty1" }, null, -1)),
      createBaseVNode("div", _hoisted_14$3, [
        _cache[8] || (_cache[8] = createBaseVNode("div", { class: "left-field" }, null, -1)),
        withDirectives(createBaseVNode("input", {
          type: "text",
          placeholder: "new task",
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.newTaskValue = $event),
          onKeyup: _cache[3] || (_cache[3] = withKeys(($event) => $options.createNewTask(), ["enter"])),
          class: "create-input t-task uppercase w100 focus"
        }, null, 544), [
          [vModelText, $data.newTaskValue]
        ])
      ])
    ])
  ], 32);
}
const Tasks = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-ba879a68"]]);
const _imports_2 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='arrow2.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='256'%20inkscape:cx='0.73632812'%20inkscape:cy='1.2792969'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cpath%20style='display:inline;fill:%23f1f1f1;fill-opacity:1;stroke:none;stroke-width:0.247137;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1'%20d='M%200.40078568,2.4764926%20V%200.02332521%20L%202.3476837,1.206563%20Z'%20id='path361'%20/%3e%3c/svg%3e";
const _imports_3 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='tree.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='181.01934'%20inkscape:cx='0.4695631'%20inkscape:cy='1.179432'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3cg%20id='g233'%20style='display:inline;opacity:1;stroke-width:1.11031;stroke-dasharray:none'%20transform='matrix(0.14613455,0,0,0.14607994,-122.73137,-16.459046)'%3e%3crect%20style='opacity:1;fill:%23ffffff;fill-opacity:1;stroke:none;stroke-width:1.1103;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20id='rect231'%20width='4.7977934'%20height='4.5312495'%20x='842.24121'%20y='115.38608'%20/%3e%3crect%20style='display:inline;opacity:1;fill:%23ffffff;fill-opacity:1;stroke:none;stroke-width:1.1103;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20id='rect232'%20width='4.7977934'%20height='4.5312495'%20x='842.21002'%20y='122.16735'%20/%3e%3crect%20style='opacity:1;fill:none;fill-opacity:1;stroke:%23f4f4f4;stroke-width:1.1103;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20id='rect233'%20width='15.906248'%20height='15.03125'%20x='840.52246'%20y='113.6361'%20/%3e%3c/g%3e%3c/svg%3e";
const _imports_4 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='2.5219069'%20height='2.4998178'%20viewBox='0%200%202.5219069%202.4998178'%20version='1.1'%20id='svg1'%20xml:space='preserve'%20sodipodi:docname='tasks.svg'%20inkscape:version='1.3.2%20(091e20e,%202023-11-25,%20custom)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='181.01934'%20inkscape:cx='0.90598054'%20inkscape:cy='1.3396359'%20inkscape:window-width='1920'%20inkscape:window-height='1009'%20inkscape:window-x='-8'%20inkscape:window-y='-8'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg1'%20/%3e%3cdefs%20id='defs1'%20/%3e%3crect%20style='opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:none;stroke-width:0.158965;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20id='rect302'%20width='1.6282746'%20height='0.27368379'%20x='0.4689298'%20y='0.68369269'%20/%3e%3crect%20style='display:inline;opacity:1;fill:%23f2f2f2;fill-opacity:1;stroke:none;stroke-width:0.159328;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20id='rect308'%20width='1.6357484'%20height='0.27368376'%20x='0.47183922'%20y='1.5440941'%20/%3e%3crect%20style='opacity:1;fill:none;fill-opacity:1;stroke:%23f4f4f4;stroke-width:0.162319;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers%20fill%20stroke'%20id='rect309'%20width='2.3258247'%20height='2.1970606'%20x='0.098031871'%20y='0.15137903'%20/%3e%3c/svg%3e";
const _sfc_main$6 = {
  props: {
    stateFiles: {
      type: Object,
      required: true
    },
    filesMethods: {
      type: Object,
      required: true
    },
    marksMethods: {
      type: Object,
      required: true
    },
    foldersMethods2: {
      type: Object,
      required: true
    },
    localState: {
      type: Object,
      required: true
    },
    folders: {
      type: Array,
      required: true
    },
    marks: {
      type: Object,
      required: true
    }
  },
  methods: {
    // unfoldMarks:function(){
    //     this.state.marksBoxIsFolded = !this.state.marksBoxIsFolded
    // },
    // setSizeMarksBlock:function(){
    //         document.querySelector('._marks-unfolded-block').style.width = document.querySelector('._marks').offsetWidth + 'px'
    //         document.querySelector('._marks-unfolded-block').style.left = document.querySelector('._marks').getBoundingClientRect().left + 'px'
    //     },
    switchPannels: function() {
      if (!this.localState.showFilesFromAllFoldersOption) {
        this.localState.showTreePanel = !this.localState.showTreePanel;
        this.localState.showTasksPanel = !this.localState.showTasksPanel;
      }
    },
    clickOnTab(dat) {
      this.foldersMethods2.clickOnTab(dat.path);
      this.filesMethods.countSelectedFiles();
      this.localState.showFilesFromAllFoldersOption = false;
    },
    shrinkMarkDescription: function(name) {
      if (name.length > this.settings.MaxLenghtOfMarkName) {
        return `${name.split(" ")[0]} ...${name.split(" ")[name.split(" ").length - 1]}`;
      } else {
        return name;
      }
    },
    pressEscOnBar: function() {
      this.state.showTextarea = false;
    },
    convertFileSize: function(num) {
      let _size = 0;
      if (num < 1e6)
        _size = Math.floor(Number(num) / 1024) + " Kb";
      if (num >= 1e6)
        _size = Math.floor(Number(num) / 1024 / 1024) + " Mb";
      return _size;
    },
    filesFromAllFolders: function() {
      this.localState.showFilesFromAllFoldersOption = true;
      this.folders.forEach((element) => {
        element.isOpened = false;
      });
      this.filesMethods.countSelectedFiles("all");
      if (this.localState.showFilesFromAllFoldersOption) {
        this.localState.showTreePanel = false;
        this.localState.showTasksPanel = true;
      }
    },
    deleteMark: function(markID) {
      this.filesMethods.deleteMark(markID);
      this.marksMethods.deleteMark(markID);
    },
    newMark: function(dat) {
      if (dat.state == "start create new mark") {
        this.state.showTextarea = true;
      }
      if (dat.state == "end create new mark") {
        this.state.markNewName = this.state.markNewName.trim();
        this.marksMethods.newMark(dat);
        this.state.showTextarea = false;
        this.state.selectedColorOnColorPicker = null;
      }
    },
    setMarkToFiles: function(markID) {
      if (this.marksMethods.checkIfAtLeastOneFileSelected()) {
        if (!this.localState.showFilesFromAllFoldersOption) {
          this.marksMethods.setMarkToFiles(this.folders[this.localState.activeFolderIndex].files, markID);
          this.filesMethods.resetStateFiles();
        } else {
          let _allFiles = [];
          for (const key in this.folders) {
            _allFiles = _allFiles.concat(this.folders[key].files);
          }
          this.marksMethods.setMarkToFiles(_allFiles, markID);
          this.filesMethods.deselectAllFiles();
        }
      }
    },
    abortMarkEdit() {
      this.state.showColorPicker = false;
      this.marksMethods.abortMarkEdit();
    },
    renameMark(dat) {
      this.localState.renamigMark = this.marksMethods.renameMark(dat);
      if (this.localState.renamigMark)
        this.state.showTextarea = false;
    },
    dblclickOnMarkItem() {
    },
    search() {
      this.state.searchValue = this.state.searchValue.trim();
      if (this.state.searchValue.length == 0) return;
      if (this.state.searchValue.startsWith("/")) return;
      if (this.state.searchValue.startsWith(this.settings.searchFilesByFormatMask))
        this.filesMethods.selectFilesBy({ params: "format", value: this.state.searchValue.slice(1) });
      if (!this.state.searchValue.startsWith(this.settings.searchFilesByFormatMask))
        this.filesMethods.selectFilesBy({ params: "name", value: this.state.searchValue });
    },
    searchAll() {
      if (this.state.searchValue.trim().length == 0) return;
      if (this.state.searchValue.trim().startsWith("/")) return;
    },
    unselectAllImageFiles() {
      this.localState.showImageProcessor = false;
      this.localState.showImageViewer = false;
      this.filesMethods.unselectAllImageFiles();
    }
  },
  //   mounted(){
  // this.$nextTick(function () {
  // Проверка ширины элемента после обновления
  // this.setSizeMarksBlock()
  //
  // let section = document.querySelector('_item-box')[0]
  // section.addEventListener('scroll', (e) => {
  //     console.log("WEE")
  //     section.scrollLeft += e.deltaX;
  // })
  // })
  //   },
  data() {
    return {
      settings,
      state: {
        marksBoxIsFolded: true,
        markNewName: "",
        showTextarea: false,
        showColorPicker: false,
        selectedColorOnColorPicker: null,
        searchValue: ""
      }
    };
  },
  computed: {
    numberOfFoldersDisplayedOnTheBar() {
      let count = 0;
      this.folders.forEach((folder2) => {
        if (folder2.displayedOnBar) count++;
      });
      return count;
    }
  },
  beforeUpdate() {
    this.filesMethods.countSelectedFiles();
  }
};
const _hoisted_1$6 = { class: "info h100 on-center w100" };
const _hoisted_2$4 = {
  key: 0,
  class: "on-row"
};
const _hoisted_3$4 = { class: "info-text" };
const _hoisted_4$4 = {
  key: 0,
  class: "info-text"
};
const _hoisted_5$4 = {
  key: 1,
  class: "info-text"
};
const _hoisted_6$4 = {
  key: 0,
  class: "bar-block on-row h100"
};
const _hoisted_7$4 = { class: "_marks marks-block on-row h100" };
const _hoisted_8$4 = { class: "on-row h100" };
const _hoisted_9$3 = {
  key: 0,
  class: "item-box on-row"
};
const _hoisted_10$3 = { class: "menu h100" };
const _hoisted_11$2 = {
  key: 0,
  class: "item h100 on-center"
};
const _hoisted_12$2 = ["onClick"];
const _hoisted_13$2 = {
  key: 1,
  class: "item-box on-row h100"
};
const _hoisted_14$2 = ["onClick"];
const _hoisted_15$1 = {
  key: 1,
  class: "input-text-box on-center w100"
};
const _hoisted_16$1 = { class: "btns on-row h100" };
const _hoisted_17$1 = {
  key: 0,
  src: _imports_2$1,
  alt: "Pin / Unpin selected files",
  class: "pix-btn"
};
const _hoisted_18$1 = {
  key: 1,
  src: _imports_0$2,
  alt: "Pin / Unpin selected files",
  class: "pix-btn"
};
const _hoisted_19$1 = {
  key: 0,
  class: "folders on-row h100"
};
const _hoisted_20$1 = {
  key: 0,
  class: "item h100 on-center"
};
const _hoisted_21$1 = { class: "menu on-row h100" };
const _hoisted_22$1 = ["onClick"];
const _hoisted_23$1 = {
  key: 1,
  class: "search-2 w100 on-center"
};
const _hoisted_24$1 = {
  key: 1,
  class: "bar-block meta-block on-center h100"
};
const _hoisted_25$1 = { class: "on-row no-wrap" };
const _hoisted_26$1 = { class: "meta-item" };
const _hoisted_27$1 = { class: "meta-item" };
const _hoisted_28$1 = { class: "meta-item" };
const _hoisted_29$1 = { class: "meta-item text-nowrap" };
const _hoisted_30$1 = { class: "meta-item text-nowrap uppercase" };
const _hoisted_31$1 = {
  key: 2,
  class: "bar-block on-row h100 w100"
};
const _hoisted_32$1 = { class: "menu" };
const _hoisted_33$1 = { class: "search on-center w100" };
const _hoisted_34$1 = { class: "marks-box__item menu on-row w100" };
const _hoisted_35$1 = { class: "vertical-center checkbox-block menu-item h100" };
const _hoisted_36$1 = ["onUpdate:modelValue"];
const _hoisted_37$1 = ["onClick", "onDblclick"];
const _hoisted_38$1 = {
  key: 1,
  class: "on-center"
};
const _hoisted_39$1 = { key: 0 };
const _hoisted_40$1 = { class: "marks-menu-clr-pic on-row h100" };
const _hoisted_41 = ["onClick"];
const _hoisted_42 = {
  key: 1,
  class: "on-row"
};
const _hoisted_43 = {
  for: "picker",
  class: "vertical-center"
};
const _hoisted_44 = ["onClick"];
const _hoisted_45 = {
  key: 2,
  class: "vertical-center h100"
};
const _hoisted_46 = ["onClick"];
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", {
      onKeyup: [
        _cache[22] || (_cache[22] = withKeys(($event) => $options.pressEscOnBar(), ["esc"])),
        _cache[23] || (_cache[23] = withKeys(withModifiers(($event) => $props.foldersMethods2.openClosedTab(), ["ctrl"]), ["t"]))
      ],
      tabindex: "0",
      class: "bar on-row focus"
    }, [
      createBaseVNode("div", _hoisted_1$6, [
        $props.stateFiles.numberOfSelectedFiles > 0 ? (openBlock(), createElementBlock("div", _hoisted_2$4, [
          createBaseVNode("span", _hoisted_3$4, toDisplayString($props.stateFiles.numberOfSelectedFiles), 1),
          $props.stateFiles.numberOfSelectedFiles == 1 ? (openBlock(), createElementBlock("span", _hoisted_4$4, " file selected")) : createCommentVNode("", true),
          $props.stateFiles.numberOfSelectedFiles > 1 ? (openBlock(), createElementBlock("span", _hoisted_5$4, " files selected")) : createCommentVNode("", true)
        ])) : createCommentVNode("", true)
      ]),
      $props.localState.metadataIsHidden && !$props.localState.showImageProcessor ? (openBlock(), createElementBlock("div", _hoisted_6$4, [
        createBaseVNode("div", _hoisted_7$4, [
          createBaseVNode("div", {
            onClick: _cache[0] || (_cache[0] = ($event) => $data.state.marksBoxIsFolded = !$data.state.marksBoxIsFolded),
            class: "item hover-item h100 on-center"
          }, _cache[31] || (_cache[31] = [
            createBaseVNode("img", {
              src: _imports_0$1,
              alt: "choose mark",
              class: "arrow-1"
            }, null, -1)
          ])),
          createBaseVNode("div", _hoisted_8$4, [
            createBaseVNode("div", {
              onClick: _cache[1] || (_cache[1] = ($event) => $options.newMark({ state: "start create new mark" })),
              class: "item hover-item h100 on-center"
            }, _cache[32] || (_cache[32] = [
              createBaseVNode("img", {
                src: _imports_3$1,
                alt: "create new mark",
                class: "pix-btn-plus-1"
              }, null, -1)
            ])),
            !$data.state.showTextarea ? (openBlock(), createElementBlock("div", _hoisted_9$3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($props.marks, (item, value, index) => {
                return openBlock(), createElementBlock("div", _hoisted_10$3, [
                  index < $data.settings.maxMarksOnBar ? (openBlock(), createElementBlock("div", _hoisted_11$2, [
                    createBaseVNode("div", {
                      onClick: ($event) => $options.setMarkToFiles(item.id),
                      onDblclick: _cache[2] || (_cache[2] = ($event) => $options.dblclickOnMarkItem()),
                      class: normalizeClass({ hiddenMark: !item.show })
                    }, [
                      createBaseVNode("span", {
                        class: normalizeClass([`${item.color}-text`, "menu-item uppercase t-bar-marks text-nowrap"])
                      }, toDisplayString($options.shrinkMarkDescription(item.descr)), 3)
                    ], 42, _hoisted_12$2)
                  ])) : createCommentVNode("", true)
                ]);
              }), 256))
            ])) : (openBlock(), createElementBlock("div", _hoisted_13$2, [
              withDirectives(createBaseVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.state.showColorPicker = $event),
                id: "picker",
                name: "picker",
                class: "checkbox"
              }, null, 512), [
                [vModelCheckbox, $data.state.showColorPicker]
              ]),
              _cache[33] || (_cache[33] = createBaseVNode("label", { for: "picker" }, [
                createBaseVNode("div", { class: "set-color-btn vertical-center on-center h100" }, [
                  createBaseVNode("img", {
                    src: _imports_2,
                    alt: "set color",
                    class: "arrow-3"
                  })
                ])
              ], -1)),
              $data.state.showColorPicker ? (openBlock(), createElementBlock("div", {
                key: 0,
                onClick: _cache[4] || (_cache[4] = ($event) => $data.state.showColorPicker = false),
                class: "color-pic on-row"
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($data.settings.availableMarkColors, (clr) => {
                  return openBlock(), createElementBlock("div", null, [
                    createBaseVNode("div", {
                      onClick: ($event) => $data.state.selectedColorOnColorPicker = clr,
                      class: normalizeClass([`color-pic-${clr}`, "clr-pic-item clr-pic-box-bar h100"])
                    }, null, 10, _hoisted_14$2)
                  ]);
                }), 256))
              ])) : (openBlock(), createElementBlock("div", _hoisted_15$1, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  placeholder: "new mark name",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.state.markNewName = $event),
                  onKeyup: _cache[6] || (_cache[6] = withKeys(($event) => $options.newMark({ state: "end create new mark", newName: $data.state.markNewName, color: $data.state.selectedColorOnColorPicker }), ["enter"])),
                  class: normalizeClass([`${$data.state.selectedColorOnColorPicker}-text`, "input bar-new-mark on-center uppercase w100 focus"])
                }, null, 34), [
                  [vModelText, $data.state.markNewName]
                ])
              ]))
            ]))
          ])
        ]),
        createBaseVNode("div", _hoisted_16$1, [
          $props.localState.showTasksPanel ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "item show-tree h100 on-center",
            onClick: _cache[7] || (_cache[7] = ($event) => $options.switchPannels())
          }, _cache[34] || (_cache[34] = [
            createBaseVNode("img", {
              src: _imports_3,
              alt: "Folders tree",
              class: "pix-btn"
            }, null, -1)
          ]))) : createCommentVNode("", true),
          $props.localState.showTreePanel ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: "item show-tree h100 on-center",
            onClick: _cache[8] || (_cache[8] = ($event) => $options.switchPannels())
          }, _cache[35] || (_cache[35] = [
            createBaseVNode("img", {
              src: _imports_4,
              alt: "Tasks",
              class: "pix-btn"
            }, null, -1)
          ]))) : createCommentVNode("", true),
          createBaseVNode("div", {
            class: "item pin-this h100 on-center",
            onClick: _cache[9] || (_cache[9] = ($event) => $props.filesMethods.pinSelectedFiles())
          }, [
            $props.filesMethods.checkIsAtLeastOneSelectedFilePinned() ? (openBlock(), createElementBlock("img", _hoisted_17$1)) : createCommentVNode("", true),
            !$props.filesMethods.checkIsAtLeastOneSelectedFilePinned() ? (openBlock(), createElementBlock("img", _hoisted_18$1)) : createCommentVNode("", true)
          ])
        ]),
        !$props.localState.hideTabs ? (openBlock(), createElementBlock("div", _hoisted_19$1, [
          $options.numberOfFoldersDisplayedOnTheBar > 1 ? (openBlock(), createElementBlock("div", _hoisted_20$1, [
            createBaseVNode("span", {
              class: normalizeClass([{ tActiveTab: $props.localState.showFilesFromAllFoldersOption }, "menu-item uppercase t-bar-folders text-nowrap"]),
              onClick: _cache[10] || (_cache[10] = ($event) => $options.filesFromAllFolders())
            }, "ALL", 2)
          ])) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.folders, (item, index) => {
            return openBlock(), createElementBlock("div", _hoisted_21$1, [
              item.displayedOnBar ? (openBlock(), createElementBlock("div", {
                key: 0,
                onClick: ($event) => $options.clickOnTab({ id: item.id, index, path: item.path }),
                onDblclick: _cache[11] || (_cache[11] = ($event) => $props.foldersMethods2.closeTab()),
                class: "item on-center h100"
              }, [
                !$props.foldersMethods2.pathIsRoot(item.path) ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: normalizeClass([{ tActiveTab: item.isOpened }, "menu-item uppercase t-bar-folders text-nowrap"])
                }, toDisplayString($props.foldersMethods2.shrinkName($props.foldersMethods2.getFolderName(item.path), $data.settings.tabsFolderNameMaxLength)), 3)) : (openBlock(), createElementBlock("span", {
                  key: 1,
                  class: normalizeClass([{ tActiveTab: item.isOpened }, "menu-item uppercase t-bar-folders text-nowrap"])
                }, toDisplayString($data.settings.rootFolderTabName), 3))
              ], 40, _hoisted_22$1)) : createCommentVNode("", true)
            ]);
          }), 256)),
          $options.numberOfFoldersDisplayedOnTheBar < $data.settings.maxFoldersOnBar ? (openBlock(), createElementBlock("div", {
            key: 1,
            onClick: _cache[12] || (_cache[12] = ($event) => $props.foldersMethods2.newTab()),
            class: "item h100 on-center"
          }, _cache[36] || (_cache[36] = [
            createBaseVNode("img", {
              src: _imports_3$1,
              alt: "new tab",
              class: "pix-btn-plus-2"
            }, null, -1)
          ]))) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        $props.localState.hideTabs ? (openBlock(), createElementBlock("div", _hoisted_23$1, [
          withDirectives(createBaseVNode("input", {
            type: "text",
            placeholder: "search",
            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.state.searchValue = $event),
            onInput: _cache[14] || (_cache[14] = ($event) => $options.search()),
            onKeyup: _cache[15] || (_cache[15] = withKeys(($event) => $options.searchAll(), ["enter"])),
            onClick: _cache[16] || (_cache[16] = ($event) => $data.state.searchValue = ""),
            id: "search",
            class: "search-input t-bar-search on-center focus w100"
          }, null, 544), [
            [vModelText, $data.state.searchValue]
          ])
        ])) : createCommentVNode("", true)
      ])) : createCommentVNode("", true),
      !$props.localState.metadataIsHidden && !$props.localState.showImageProcessor ? (openBlock(), createElementBlock("div", _hoisted_24$1, [
        createBaseVNode("div", _hoisted_25$1, [
          createBaseVNode("span", _hoisted_26$1, toDisplayString($props.stateFiles.onFocusFile.name), 1),
          _cache[37] || (_cache[37] = createBaseVNode("span", { class: "meta-item text-nowrap" }, "Created: ", -1)),
          createBaseVNode("span", _hoisted_27$1, toDisplayString($props.stateFiles.onFocusFile.metadata.created.toLocaleString().replaceAll(/[,]/g, "")), 1),
          _cache[38] || (_cache[38] = createBaseVNode("span", { class: "meta-item text-nowrap" }, "Last edited: ", -1)),
          createBaseVNode("span", _hoisted_28$1, toDisplayString($props.stateFiles.onFocusFile.metadata.lastEdited.toLocaleString().replaceAll(/[,]/g, "")), 1),
          createBaseVNode("span", _hoisted_29$1, toDisplayString($options.convertFileSize($props.stateFiles.onFocusFile.metadata.size)), 1),
          createBaseVNode("span", _hoisted_30$1, toDisplayString($props.stateFiles.onFocusFile.format), 1)
        ])
      ])) : createCommentVNode("", true),
      $props.localState.showImageProcessor ? (openBlock(), createElementBlock("div", _hoisted_31$1, [
        createBaseVNode("div", _hoisted_32$1, [
          createBaseVNode("div", {
            onClick: _cache[17] || (_cache[17] = ($event) => $options.unselectAllImageFiles()),
            class: "menu-item item uppercase t-bar-img-processor text-nowrap"
          }, _cache[39] || (_cache[39] = [
            createBaseVNode("span", null, "unselect all", -1)
          ]))
        ]),
        _cache[40] || (_cache[40] = createTextVNode(" image processor... "))
      ])) : createCommentVNode("", true),
      createBaseVNode("div", _hoisted_33$1, [
        withDirectives(createBaseVNode("input", {
          type: "text",
          placeholder: "search",
          "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.state.searchValue = $event),
          onInput: _cache[19] || (_cache[19] = ($event) => $options.search()),
          onKeyup: _cache[20] || (_cache[20] = withKeys(($event) => $options.searchAll(), ["enter"])),
          onClick: _cache[21] || (_cache[21] = ($event) => $data.state.searchValue = ""),
          id: "search",
          class: "search-input t-bar-search on-center focus w100"
        }, null, 544), [
          [vModelText, $data.state.searchValue]
        ])
      ])
    ], 32),
    createBaseVNode("div", {
      onKeyup: _cache[29] || (_cache[29] = withKeys(($event) => $options.abortMarkEdit(), ["esc"])),
      onMouseleave: _cache[30] || (_cache[30] = ($event) => $data.state.marksBoxIsFolded = true),
      class: normalizeClass([{ HIDE: $data.state.marksBoxIsFolded }, "_marks-unfolded-block on-col focus"]),
      tabindex: "0"
    }, [
      createBaseVNode("div", {
        class: normalizeClass([`${$props.localState.actualSessionType}-menu-back`, "marks-menu-box h100 w100"])
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.marks, (item) => {
          return openBlock(), createElementBlock("div", _hoisted_34$1, [
            createBaseVNode("div", _hoisted_35$1, [
              withDirectives(createBaseVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": ($event) => item.show = $event,
                class: "checkbox-mark-item"
              }, null, 8, _hoisted_36$1), [
                [vModelCheckbox, item.show]
              ])
            ]),
            $props.marksMethods.state.markRenameID != item.id ? (openBlock(), createElementBlock("div", {
              key: 0,
              onClick: ($event) => $options.setMarkToFiles(item.id),
              onDblclick: ($event) => $options.renameMark({ state: "start rename", markID: item.id }),
              class: normalizeClass([{ hiddenMark: !item.show }, "menu-item"])
            }, [
              createBaseVNode("span", {
                class: normalizeClass(`${item.color}-text text-nowrap uppercase`)
              }, toDisplayString(item.descr), 3)
            ], 42, _hoisted_37$1)) : (openBlock(), createElementBlock("div", _hoisted_38$1, [
              !$data.state.showColorPicker ? (openBlock(), createElementBlock("div", _hoisted_39$1, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  placeholder: "mark name",
                  "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => $data.state.markNewName = $event),
                  onKeyup: _cache[25] || (_cache[25] = withKeys(($event) => $options.renameMark({ state: "end rename", newName: $data.state.markNewName }), ["enter"])),
                  class: normalizeClass([`${$data.state.selectedColorOnColorPicker}-text`, "input marks-box-rename uppercase focus w100"])
                }, null, 34), [
                  [vModelText, $data.state.markNewName]
                ])
              ])) : createCommentVNode("", true)
            ])),
            createBaseVNode("div", _hoisted_40$1, [
              $data.state.showColorPicker && $props.marksMethods.state.markRenameID == item.id ? (openBlock(), createElementBlock("div", {
                key: 0,
                onClick: _cache[27] || (_cache[27] = ($event) => $data.state.showColorPicker = false),
                class: "color-pic on-row"
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($data.settings.availableMarkColors, (clr) => {
                  return openBlock(), createElementBlock("div", {
                    onClick: _cache[26] || (_cache[26] = ($event) => $props.marksMethods.state.markRenameID = null),
                    class: "h100"
                  }, [
                    createBaseVNode("div", {
                      onClick: ($event) => item.color = clr,
                      class: normalizeClass([`color-pic-${clr}`, "clr-pic-item clr-pic-box-menu-bar h100"])
                    }, null, 10, _hoisted_41)
                  ]);
                }), 256))
              ])) : createCommentVNode("", true),
              item.id != $props.stateFiles.defaults.unmarkedMarkID ? (openBlock(), createElementBlock("div", _hoisted_42, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => $data.state.showColorPicker = $event),
                  id: "picker",
                  name: "picker",
                  class: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, $data.state.showColorPicker]
                ]),
                createBaseVNode("label", _hoisted_43, [
                  createBaseVNode("div", {
                    onClick: ($event) => $props.marksMethods.state.markRenameID = $props.marksMethods.state.markRenameID == null ? item.id : null,
                    class: "vertical-center set-color hover-item"
                  }, _cache[41] || (_cache[41] = [
                    createBaseVNode("img", {
                      src: _imports_2,
                      alt: "Set marks color",
                      class: "marks-menu-arrow rotate180"
                    }, null, -1)
                  ]), 8, _hoisted_44)
                ])
              ])) : createCommentVNode("", true)
            ]),
            !$data.state.showColorPicker ? (openBlock(), createElementBlock("div", _hoisted_45, [
              item.id != $props.stateFiles.defaults.unmarkedMarkID ? (openBlock(), createElementBlock("div", {
                key: 0,
                onClick: ($event) => $options.deleteMark(item.id),
                class: "vertical-center delete hover-item"
              }, _cache[42] || (_cache[42] = [
                createBaseVNode("img", {
                  src: _imports_1,
                  alt: "delete mark",
                  class: "marks-menu-x"
                }, null, -1)
              ]), 8, _hoisted_46)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ]);
        }), 256))
      ], 2)
    ], 34)
  ], 64);
}
const Bar = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-3225c0f4"]]);
const _sfc_main$5 = {
  props: {
    file: {
      type: Object,
      required: true
    },
    state: {
      type: Object,
      required: true
    },
    filesMethods: {
      type: Object,
      required: true
    },
    viewMode: {
      //text or imgs
      type: String,
      required: true
    },
    pixHeight: {
      //  300 (px)
      type: Number,
      required: true
    }
  },
  methods: {
    shrinkName: function(name, format) {
      if (format == void 0) format = "";
      if (this.settings.fileNameMaxLength >= name.length + format.length) {
        return name;
      } else {
        let lastWord = name.indexOf(" ") > 0 ? name.split(" ")[name.split(" ").length - 1] : name.slice(-1 * this.settings.lengthOfTheLastPartOfTheFileName);
        if (lastWord.length > this.settings.lengthOfTheLastPartOfTheFileName)
          lastWord = lastWord.slice(-1 * this.settings.lengthOfTheLastPartOfTheFileName);
        let index = this.settings.fileNameMaxLength - lastWord.length - format.length;
        return `${name.slice(0, index)}..${lastWord}`;
      }
    },
    getUlrFromPath(path) {
      return window.api.convertPathToUrl(path).href;
    }
  },
  data() {
    return {
      renamedValue: "",
      settings
    };
  }
};
const _hoisted_1$5 = {
  key: 0,
  class: "on-row"
};
const _hoisted_2$3 = { class: "item-name t-file-name text-nowrap" };
const _hoisted_3$3 = { class: "format-default" };
const _hoisted_4$3 = {
  key: 1,
  class: "rename-text w100"
};
const _hoisted_5$3 = ["id"];
const _hoisted_6$3 = ["src"];
const _hoisted_7$3 = {
  key: 0,
  class: "rename-img on-center h100 w100"
};
const _hoisted_8$3 = ["id"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    !$props.filesMethods.isAPicture($props.file.format) && $props.viewMode != "imgs" ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass([`${$props.state.files[$props.file.id]}-text`, "text-file w100"])
    }, [
      $props.state.files[$props.file.id] != "RENAME" ? (openBlock(), createElementBlock("div", _hoisted_1$5, [
        createBaseVNode("span", _hoisted_2$3, toDisplayString($options.shrinkName($props.file.name, $props.file.format)), 1),
        createBaseVNode("span", _hoisted_3$3, [
          createBaseVNode("span", {
            class: normalizeClass([`format-${$props.file.format}`, "t-file-format text-nowrap"])
          }, " " + toDisplayString($props.file.format), 3)
        ])
      ])) : createCommentVNode("", true),
      $props.state.files[$props.file.id] == "RENAME" ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
        withDirectives(createBaseVNode("input", {
          type: "text",
          placeholder: "file name",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.renamedValue = $event),
          id: `${$props.file.id}`,
          onKeyup: _cache[1] || (_cache[1] = withKeys(($event) => $props.filesMethods.renameFiles({ state: "input done", newName: $data.renamedValue.replace($data.settings.fileNameRegexp, "").trim() }), ["enter"])),
          class: "item-name rename-input-text t-file-renaming text-nowrap focus w100"
        }, null, 40, _hoisted_5$3), [
          [vModelText, $data.renamedValue]
        ])
      ])) : createCommentVNode("", true)
    ], 2)) : createCommentVNode("", true),
    $props.filesMethods.isAPicture($props.file.format) && $props.viewMode == "imgs" ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass([`${$props.state.files[$props.file.id]}-imgs`, "img-box shadow on-center"])
    }, [
      createBaseVNode("img", {
        src: $options.getUlrFromPath(`${$props.file.path}${$data.settings.actualSeparator}${$props.file.name}.${$props.file.format}`),
        style: normalizeStyle(`height:${$props.pixHeight}px;`),
        class: normalizeClass([`opacity-${$props.state.files[$props.file.id]}-imgs`, "img"])
      }, null, 14, _hoisted_6$3),
      $props.state.files[$props.file.id] == "RENAME" ? (openBlock(), createElementBlock("div", _hoisted_7$3, [
        withDirectives(createBaseVNode("input", {
          type: "text",
          placeholder: "file name",
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.renamedValue = $event),
          id: `${$props.file.id}`,
          onKeyup: _cache[3] || (_cache[3] = withKeys(($event) => $props.filesMethods.renameFiles({ state: "input done", newName: $data.renamedValue.replace($data.settings.fileNameRegexp, "").trim() }), ["enter"])),
          class: "rename-input-imgs t-file-name t-file-renaming text-center text-nowrap focus w100"
        }, null, 40, _hoisted_8$3), [
          [vModelText, $data.renamedValue]
        ])
      ])) : createCommentVNode("", true)
    ], 2)) : createCommentVNode("", true)
  ], 64);
}
const FileComponent = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-105fa395"]]);
const _sfc_main$4 = {
  components: {
    FileComponent
  },
  props: {
    files: {
      type: Object,
      required: true
    },
    marks: {
      type: Object,
      required: true
    },
    state: {
      //  stateFiles
      type: Object,
      required: true
    },
    localState: {
      type: Object,
      required: true
    },
    inputSettings: {
      type: Object,
      required: true
    },
    filesMethods: {
      type: Object,
      required: true
    },
    viewMode: {
      //text or imgs
      type: String,
      required: true
    }
  },
  methods: {
    foldMark: function(mark_ID) {
      this.marks[mark_ID].isFolded[this.viewMode] = !this.marks[mark_ID].isFolded[this.viewMode];
    },
    singleMarkMode: function(mark_ID) {
      this.marks[mark_ID].isFolded[this.viewMode] = true;
      this.singleDisplayMarkMode.isEnabled = !this.singleDisplayMarkMode.isEnabled;
      this.singleDisplayMarkMode.mark_id = mark_ID;
    },
    singleMarkModeFilter: function(dat) {
      if (!this.singleDisplayMarkMode.isEnabled) {
        return dat;
      } else {
        return { [this.singleDisplayMarkMode.mark_id]: dat[this.singleDisplayMarkMode.mark_id] };
      }
    },
    filterMark: function(mark) {
      let _mark = { text: false, imgs: false };
      this.files.forEach((file) => {
        if (this.settings.fileImgMask.includes(file.format)) {
          if (mark.id == file.markID) {
            if (!file.isPinned) {
              _mark.imgs = true;
            }
          }
        }
        if (!this.settings.fileImgMask.includes(file.format)) {
          if (mark.id == file.markID) {
            if (!file.isPinned) {
              _mark.text = true;
            }
          }
        }
      });
      return _mark[this.viewMode];
    },
    countUnpinBlockHeight: function() {
      this.unpinHeightBlock = document.querySelector("._component").clientHeight - document.querySelector("._left-field").clientHeight;
    },
    foldPin: function() {
      this.inputSettings.pinFilesIsFolded[this.viewMode] = !this.inputSettings.pinFilesIsFolded[this.viewMode];
      if (this.inputSettings.pinFilesIsFolded[this.viewMode]) {
        this.filesMethods.resetPinnedSelection(this.viewMode);
      }
    }
  },
  computed: {
    isThereAtLeastOneAttachedFile() {
      return this.files.filter((file) => this.viewMode == "imgs" ? this.settings.fileImgMask.includes(file.format) : !this.settings.fileImgMask.includes(file.format)).find((file) => file.isPinned == true);
    }
    // countUnpinBlockHeight1:function(){
    //   return document.querySelector('._component').clientHeight - document.querySelector('._left-field').clientHeight
    // },
  },
  data() {
    return {
      settings,
      displayedMarks: { text: [], imgs: [] },
      singleDisplayMarkMode: { isEnabled: false, mark_id: "" },
      unpinHeightBlock: 600
    };
  },
  beforeUpdate() {
    this.countUnpinBlockHeight();
  },
  beforeMount() {
  }
};
const _hoisted_1$4 = { class: "on-row w100" };
const _hoisted_2$2 = {
  key: 0,
  class: "w100"
};
const _hoisted_3$2 = { class: "file" };
const _hoisted_4$2 = ["onClick", "onMouseenter", "onDblclick"];
const _hoisted_5$2 = { class: "unpin-sub-block" };
const _hoisted_6$2 = { key: 0 };
const _hoisted_7$2 = ["id"];
const _hoisted_8$2 = ["onClick"];
const _hoisted_9$2 = { class: "right-field on-col w100" };
const _hoisted_10$2 = ["onClick", "onDblclick"];
const _hoisted_11$1 = ["onKeyup"];
const _hoisted_12$1 = { class: "file" };
const _hoisted_13$1 = {
  key: 0,
  class: ""
};
const _hoisted_14$1 = ["onClick", "onMouseenter", "onDblclick"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FileComponent = resolveComponent("FileComponent");
  return openBlock(), createElementBlock("div", {
    class: "_component accordion h100 focus",
    tabindex: "0",
    onKeyup: [
      _cache[1] || (_cache[1] = withKeys(($event) => $props.filesMethods.resetStateFiles(), ["esc"])),
      _cache[2] || (_cache[2] = withKeys(($event) => $props.filesMethods.renameFiles({ state: "start rename" }), ["f2"])),
      _cache[3] || (_cache[3] = withKeys(($event) => $props.filesMethods.deleteFiles(), ["delete"])),
      _cache[4] || (_cache[4] = withKeys(withModifiers(($event) => !$props.localState.showFilesFromAllFoldersOption && $props.filesMethods.copyFiles(), ["ctrl"]), ["c"])),
      _cache[5] || (_cache[5] = withKeys(withModifiers(($event) => !$props.localState.showFilesFromAllFoldersOption && $props.filesMethods.cutFiles(), ["ctrl"]), ["x"])),
      _cache[6] || (_cache[6] = withKeys(withModifiers(($event) => !$props.localState.showFilesFromAllFoldersOption && $props.filesMethods.pasteFiles(), ["ctrl"]), ["v"])),
      _cache[7] || (_cache[7] = withKeys(withModifiers(($event) => $props.filesMethods.pinSelectedFiles(), ["ctrl"]), ["d"]))
    ]
  }, [
    createBaseVNode("div", _hoisted_1$4, [
      createBaseVNode("div", {
        onClick: _cache[0] || (_cache[0] = ($event) => $options.foldPin()),
        class: "left-field _left-field on-row"
      }, [
        _cache[9] || (_cache[9] = createBaseVNode("div", { class: "w100" }, null, -1)),
        $options.isThereAtLeastOneAttachedFile ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass({ pinActive: $props.inputSettings.pinFilesIsFolded[$props.viewMode] })
        }, _cache[8] || (_cache[8] = [
          createBaseVNode("img", {
            src: _imports_0$2,
            alt: "",
            class: "pix-btn pin"
          }, null, -1)
        ]), 2)) : createCommentVNode("", true)
      ]),
      !$props.inputSettings.pinFilesIsFolded[$props.viewMode] ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
        createBaseVNode("div", {
          class: normalizeClass([`${$props.viewMode}`, "w100"])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.files, (fileItem) => {
            return openBlock(), createElementBlock("div", _hoisted_3$2, [
              fileItem.isPinned ? (openBlock(), createElementBlock("div", {
                key: 0,
                onClick: ($event) => $props.filesMethods.clickToFile(fileItem.id),
                onMouseenter: ($event) => $props.filesMethods.readMetadata(fileItem),
                onDblclick: ($event) => $props.filesMethods.openFile(fileItem),
                class: ""
              }, [
                createVNode(_component_FileComponent, {
                  file: fileItem,
                  viewMode: $props.viewMode,
                  state: $props.state,
                  pixHeight: $props.inputSettings.imagesHeight,
                  filesMethods: $props.filesMethods,
                  class: "file-component"
                }, null, 8, ["file", "viewMode", "state", "pixHeight", "filesMethods"])
              ], 40, _hoisted_4$2)) : createCommentVNode("", true)
            ]);
          }), 256))
        ], 2)
      ])) : createCommentVNode("", true)
    ]),
    createBaseVNode("div", {
      class: "scrollY unpin-block",
      style: normalizeStyle(`height: ${$data.unpinHeightBlock}px;`)
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.singleMarkModeFilter($props.marks), (markItem) => {
        return openBlock(), createElementBlock("div", _hoisted_5$2, [
          markItem.show ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
            $options.filterMark(markItem) ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "on-row w100",
              id: `${markItem.id}`
            }, [
              createBaseVNode("div", {
                class: "left-field left-field-gradient",
                onClick: ($event) => $options.foldMark(markItem.id)
              }, [
                createBaseVNode("div", {
                  class: normalizeClass([`${markItem.color}-back`, "h100 w100"])
                }, null, 2)
              ], 8, _hoisted_8$2),
              createBaseVNode("div", _hoisted_9$2, [
                createBaseVNode("div", {
                  onClick: ($event) => $options.foldMark(markItem.id),
                  onDblclick: ($event) => $options.singleMarkMode(markItem.id)
                }, [
                  createBaseVNode("span", {
                    class: normalizeClass(`${markItem.color}-text uppercase t-files-mark mark-name`)
                  }, toDisplayString(markItem.descr), 3)
                ], 40, _hoisted_10$2),
                createBaseVNode("div", {
                  onKeyup: withKeys(withModifiers(($event) => $props.filesMethods.selectAllFilesInGroupMark(markItem.id, this.viewMode), ["ctrl"]), ["a"]),
                  class: normalizeClass([`${$props.viewMode}`, "files-block focus w100"]),
                  tabindex: "0"
                }, [
                  markItem.isFolded[$props.viewMode] ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList($props.files, (fileItem) => {
                    return openBlock(), createElementBlock("div", _hoisted_12$1, [
                      !fileItem.isPinned && fileItem.markID == markItem.id ? (openBlock(), createElementBlock("div", _hoisted_13$1, [
                        createBaseVNode("div", {
                          onClick: ($event) => $props.filesMethods.clickToFile(fileItem.id),
                          onMouseenter: ($event) => $props.filesMethods.readMetadata(fileItem),
                          onDblclick: ($event) => $props.filesMethods.openFile(fileItem),
                          class: ""
                        }, [
                          createVNode(_component_FileComponent, {
                            file: fileItem,
                            state: $props.state,
                            viewMode: $props.viewMode,
                            pixHeight: $props.inputSettings.imagesHeight,
                            filesMethods: $props.filesMethods,
                            class: "file-component"
                          }, null, 8, ["file", "state", "viewMode", "pixHeight", "filesMethods"])
                        ], 40, _hoisted_14$1)
                      ])) : createCommentVNode("", true)
                    ]);
                  }), 256)) : createCommentVNode("", true)
                ], 42, _hoisted_11$1)
              ])
            ], 8, _hoisted_7$2)) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ]);
      }), 256)),
      _cache[10] || (_cache[10] = createBaseVNode("div", { class: "empty-block" }, null, -1))
    ], 4)
  ], 32);
}
const AccordionFiles = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-58c67a30"]]);
const filesMethods = {
  localState: null,
  stateFiles: null,
  files: null,
  //  ?
  folders: null,
  destFolderID: null,
  srcFolderID: null,
  _allowCopyingOrMovingFiles: false,
  init: function(dat) {
    this.destFolderID = null;
    this.srcFolderID = null;
    this._allowCopyingOrMovingFiles = false;
    this.folders = dat.folders;
  },
  validateFileName: function(name) {
    if (!name) return false;
    let _name = name.trim();
    _name = _name.replace(settings.fileNameRegexp, "");
    if (_name.length == 0 && _name.split(" ").length == _name.length) return false;
    return _name;
  },
  pinSelectedFiles: function() {
    this.folders[this.localState.activeFolderIndex].files.forEach((file) => {
      for (let fileID in this.stateFiles.files) {
        if (file.id == fileID && this.stateFiles.files[fileID] == "SELECTED") {
          file.isPinned = !file.isPinned;
          this.stateFiles.files[fileID] = "";
        }
      }
    });
    this.countSelectedFiles();
  },
  countSelectedFiles: function(params) {
    this.stateFiles.numberOfSelectedFiles = 0;
    for (const fileID in this.stateFiles.files) {
      if (this.stateFiles.files[fileID] == "SELECTED") {
        if (this.folders[this.localState.activeFolderIndex].files.find((file) => file.id == fileID) || params == "all")
          this.stateFiles.numberOfSelectedFiles++;
      }
      if (this.stateFiles.files[fileID] == "")
        delete this.stateFiles.files[fileID];
    }
  },
  clickToFile: function(file_ID) {
    if (this.stateFiles.files[file_ID] == "SELECTED") {
      this.stateFiles.files[file_ID] = "";
    } else {
      if (this.stateFiles.files[file_ID] == "" || this.stateFiles.files[file_ID] == void 0) {
        this.stateFiles.files[file_ID] = "SELECTED";
      }
    }
    this.countSelectedFiles();
  },
  deselectAllFiles: function() {
    this.stateFiles.files = {};
    this.stateFiles.numberOfSelectedFiles = 0;
  },
  resetStateAllFiles: function() {
    this.deselectAllFiles();
  },
  resetStateFiles: function() {
    this.setFilesState("SELECTED", "");
    this.setFilesState("RENAME", "");
    this.setFilesState("COPY FILE", "");
    this.setFilesState("MOVE FILE", "");
    this.countSelectedFiles();
    this.abortCopyCutOperation();
  },
  abortCopyCutOperation: function() {
    this.destFolderID = null;
    this.srcFolderID = null;
    this._allowCopyingOrMovingFiles = false;
  },
  selectAllFilesInGroupMark: function(mark_ID, viewMode) {
    let filteredFiles = viewMode == "imgs" ? this.folders[this.localState.activeFolderIndex].files.filter((file) => settings.fileImgMask.includes(file.format)) : this.folders[this.localState.activeFolderIndex].files.filter((file) => !settings.fileImgMask.includes(file.format));
    filteredFiles.forEach((file) => {
      if (file.markID == mark_ID) {
        if (!file.isPinned) {
          if (file) this.stateFiles.files[file.id] = "SELECTED";
        }
      }
    });
    this.countSelectedFiles();
  },
  resetPinnedSelection(viewMode) {
    this.folders[this.localState.activeFolderIndex].files.forEach((file) => {
      if (file.isPinned) {
        if (viewMode == "imgs" && settings.fileImgMask.includes(file.format)) {
          this.stateFiles.files[file.id] = "";
        }
        if (viewMode == "text" && !settings.fileImgMask.includes(file.format)) {
          this.stateFiles.files[file.id] = "";
        }
      }
    });
    this.countSelectedFiles();
  },
  readMetadata: function(dat) {
    this.stateFiles.onFocusFile.metadata = dat.meta;
    this.stateFiles.onFocusFile.name = dat.name;
    this.stateFiles.onFocusFile.format = dat.format;
  },
  openFile: function(file) {
    console.log("OPEN FILE )");
    window.api.openFileInExternalApp(file.path, `${file.name}.${file.format}`);
  },
  renameFile: function(file, newName) {
    window.api.renameFile(file.path, `${file.name}.${file.format}`, `${newName}.${file.format}`).then(
      (result) => {
        if (result) {
          file.name = newName;
          this.stateFiles.files[file.id] = "";
        }
      }
    );
  },
  renameFiles: function(dat) {
    if (dat.state == "start rename") {
      for (let fileID in this.stateFiles.files) {
        if (this.stateFiles.files[fileID] == "SELECTED") {
          if (this.folders[this.localState.activeFolderIndex].files.find((file) => file.id == fileID))
            this.stateFiles.files[fileID] = "RENAME";
        }
      }
    }
    if (dat.state == "input done") {
      let newName = this.validateFileName(dat.newName);
      if (!newName) return;
      let ch = 0;
      for (const fileID in this.stateFiles.files) {
        if (this.stateFiles.files[fileID] == "RENAME") {
          ch++;
          this.folders[this.localState.activeFolderIndex].files.forEach((file, index) => {
            if (file.id == fileID) {
              if (ch == 1) {
                this.renameFile(this.folders[this.localState.activeFolderIndex].files[index], newName);
              }
              if (ch > 1) {
                this.renameFile(this.folders[this.localState.activeFolderIndex].files[index], `${newName} ${ch}`);
              }
            }
          });
        }
      }
    }
  },
  setFilesState: function(STATEfrom, STATEto, params, cnst) {
    this.folders[this.localState.activeFolderIndex].files.forEach((file) => {
      if (this.stateFiles.files.hasOwnProperty(file.id)) {
        if (this.stateFiles.files[file.id] == STATEfrom) {
          if (params == void 0 || params == "all formats")
            this.stateFiles.files[file.id] = STATEto;
          if (params == "imgs") {
            if (this.isAPicture(file))
              this.stateFiles.files[file.id] = STATEto;
          }
        }
      }
    });
    if (cnst == "in all folders")
      this.folders.forEach((folder2) => {
        folder2.files.forEach((file) => {
          if (this.stateFiles.files[file.id] == STATEfrom) {
            if (params == "imgs") {
              if (this.isAPicture(file))
                this.stateFiles.files[file.id] = STATEto;
            }
          }
        });
      });
  },
  copyFiles: function() {
    this.srcFolderID = this.folders[this.localState.activeFolderIndex].id;
    this._allowCopyingOrMovingFiles = true;
    this.setFilesState("SELECTED", "COPY FILE");
    console.log("COPY FILE");
  },
  cutFiles: function() {
    this.srcFolderID = this.folders[this.localState.activeFolderIndex].id;
    this._allowCopyingOrMovingFiles = true;
    this.setFilesState("SELECTED", "MOVE FILE");
    console.log("MOVE FILE");
  },
  pasteFiles: function() {
    if (!this._allowCopyingOrMovingFiles) return;
    this._allowCopyingOrMovingFiles = false;
    let destFolder = this.folders[this.localState.activeFolderIndex];
    for (const fileID in this.stateFiles.files) {
      this.folders.forEach((srcFolder) => {
        if (srcFolder.id == this.srcFolderID) {
          srcFolder.files.forEach((file) => {
            if (file.id == fileID) {
              file.meta = window.api.getFileMeta(srcFolder.path, `${file.name}.${file.format}`);
              if (this.stateFiles.files[fileID] == "COPY FILE") {
                window.api.copyFile(srcFolder.path, destFolder.path, { name: file.name, format: file.format }).then(
                  (result_fileName) => {
                    if (result_fileName) {
                      destFolder.files.push(
                        {
                          id: "fileID_" + Math.floor(Math.random() * 1e14),
                          name: result_fileName.name,
                          format: result_fileName.format,
                          markID: defaults.unmarkedMarkID,
                          // reset
                          isPinned: false,
                          // reset
                          path: srcFolder.path,
                          meta: JSON.parse(JSON.stringify(file.meta))
                        }
                      );
                      this.stateFiles.files[fileID] = "";
                    }
                  }
                );
              }
              if (this.stateFiles.files[fileID] == "MOVE FILE")
                this._moveFile(srcFolder.path, destFolder.path, { name: file.name, format: file.format }, fileID);
            }
          });
        }
      });
    }
  },
  // _copyFile:function(pathSrc, pathDest, fileFullname, fileID){
  //   window.api.copyFile( pathSrc, pathDest, fileFullname )
  //     .then(
  //       result=>{
  //         console.log('copied file: ')
  //         console.log(result)
  //         if(result){
  //           //
  //           this.stateFiles.files[fileID] = ''
  //           // writeFileToDB
  //           //  Coping writed file in db
  //           //  To DO: add unique file id
  //           // let writedFile = null
  //           // this.folders.forEach(folder => {
  //           //   if( folder.path == result.pathSrc ){
  //           //     writedFile = folder.files.find( file => `${file.name}.${file.format}` == result.fileFullname )
  //           //   }
  //           // })
  //           // this.folders.forEach(folder => {
  //           //   if( folder.path == result.pathDest ){
  //           //     if(writedFile){
  //           //       folder.files.push( JSON.parse(JSON.stringify(writedFile)) )
  //           //       this.stateFiles.files[writedFile.id] = ''
  //           //     }
  //           //   }
  //           // })
  //         }
  //       }
  //     )
  // },
  _moveFile: function(pathSrc, pathDest, fileFullname) {
    window.api.moveFileTo(pathSrc, pathDest, fileFullname).then(
      (result_fileFullname) => {
        console.log("movied file: ");
        console.log(result_pathDest);
        if (result_fileFullname) {
          let writedFile = null;
          this.folders.forEach((srcFolder) => {
            if (srcFolder.path == pathSrc)
              writedFile = srcFolder.files.find((file) => `${file.name}.${file.format}` == result_fileFullname);
          });
          this.folders.forEach((destFolder) => {
            if (destFolder.path == pathDest) {
              if (writedFile) {
                writedFile.path = pathDest;
                destFolder.files.push(JSON.parse(JSON.stringify(writedFile)));
                this.stateFiles.files[writedFile.id] = "";
              }
            }
          });
        }
      }
    );
  },
  deleteFile: function(file) {
    window.api.deleteFile(file.path, `${file.name}.${file.format}`).then(
      (fileFullname) => {
        console.log("deleted file: " + fileFullname);
        if (fileFullname) {
          this.stateFiles.files[file.id] = "";
          this.eraseFileFromDB(fileFullname);
        }
      }
    );
  },
  deleteFiles: function() {
    for (const fileID in this.stateFiles.files) {
      if (this.stateFiles.files[fileID] == "SELECTED") {
        this.folders[this.localState.activeFolderIndex].files.forEach((file) => {
          if (file.id == fileID)
            this.deleteFile(file);
        });
      }
    }
  },
  eraseFileFromDB: function(fileFullname) {
    let index = this.folders[this.localState.activeFolderIndex].files.findIndex((file) => fileFullname == `${file.name}.${file.format}`);
    if (index >= 0)
      this.folders[this.localState.activeFolderIndex].files.splice(index, 1);
  },
  writeFileToDB: function(fileFullname) {
  },
  deleteMark: function(markID) {
    if (markID != this.stateFiles.defaults.unmarkedMarkID) {
      this.folders.forEach((folder2) => {
        folder2.files.forEach((file) => {
          if (file.markID == markID) {
            file.markID = this.stateFiles.defaults.unmarkedMarkID;
          }
        });
      });
    }
  },
  getFolderBy: function(cnst, param) {
    if (this.folders.length == 0)
      return false;
    if (cnst == "id")
      return this.folders.find((folder2) => folder2.id == param);
    if (cnst == "path")
      return this.folders.find((folder2) => folder2.path == param);
  },
  getFileBy: function(cnst, param) {
    if (folder.files.length == 0)
      return false;
    function _funk(element, index, array) {
      if (cnst == "fullname")
        return element.files.find((file) => `${file.name}.${file.format}` == param);
      if (cnst == "path")
        return element.files.find((file) => file.path == param);
      if (cnst == "id")
        return element.files.find((file) => file.id == param);
    }
    return this.folders.find(_funk);
  },
  checkIsAtLeastOneSelectedFilePinned: function() {
    let filesPinned = 0;
    for (const fileID in this.stateFiles.files) {
      if (this.stateFiles.files[fileID] == "SELECTED") {
        if (this.folders[this.localState.activeFolderIndex].files.find((file) => file.id == fileID && file.isPinned))
          filesPinned++;
      }
    }
    return filesPinned;
  },
  selectFilesBy: function(dat, folderIndex) {
    function _funk(folders2, stateFiles, params) {
      folders2[folderIndex].files.forEach((file) => {
        if (file[params.partName].toLowerCase().startsWith(params.value)) {
          if (stateFiles.files[file.id] != "RENAME" || stateFiles.files[file.id] != "COPY FILE" || stateFiles.files[file.id] != "MOVE FILE")
            stateFiles.files[file.id] = params.state;
        }
      });
    }
    dat.value = dat.value.trim().toLowerCase();
    if (dat.value.length == 0) return false;
    if (dat.value.startsWith("/")) return false;
    if (folderIndex == void 0) folderIndex = this.localState.activeFolderIndex;
    if (dat.value.length > 1) {
      if (dat.params == "name")
        _funk(this.folders, this.stateFiles, { partName: "name", value: dat.value.slice(0, -1), state: "" });
    }
    if (dat.params == "format")
      _funk(this.folders, this.stateFiles, { partName: "format", value: dat.value.slice(0, -1), state: "" });
    if (dat.params == "name")
      _funk(this.folders, this.stateFiles, { partName: "name", value: dat.value, state: "SELECTED" });
    if (dat.params == "format")
      _funk(this.folders, this.stateFiles, { partName: "format", value: dat.value, state: "SELECTED" });
  },
  isAPicture: function(format) {
    if (typeof format == "string")
      return settings.fileImgMask.includes(format);
    if (typeof format == "object")
      return settings.fileImgMask.includes(format.format);
  },
  unselectAllImageFiles: function() {
    this.setFilesState("SELECTED", "", "imgs", "in all folders");
    this.countSelectedFiles();
  }
};
const marksMethods = {
  stateFiles: null,
  marks: null,
  state: {
    markRenameID: null,
    newName: null
  },
  checkIfAtLeastOneFileSelected: function() {
    let atLeastOneFileSelected = false;
    for (const key in this.stateFiles.files) {
      if (this.stateFiles.files[key] == "SELECTED") atLeastOneFileSelected = true;
    }
    return atLeastOneFileSelected;
  },
  renameMark: function(dat) {
    if (!this.checkIfAtLeastOneFileSelected()) {
      if (dat.markID != this.stateFiles.defaults.unmarkedMarkID) {
        if (dat.state == "start rename") {
          this.state.markRenameID = dat.markID;
          this.state.newName = this.marks[this.state.markRenameID].descr;
          return false;
        }
        if (dat.state == "end rename") {
          this.marks[this.state.markRenameID].descr = dat.newName;
          this.state.markRenameID = null;
          return true;
        }
      }
    }
  },
  deleteMark: function(markID) {
    if (markID != this.stateFiles.defaults.unmarkedMarkID) {
      delete this.marks[markID];
    }
  },
  newMark: function(dat) {
    if (dat.newName.trim().length == 0) return;
    delete this.marks[defaults.unmarkedMarkID];
    let newMarkId = "mark_" + Math.floor(Math.random() * 1e7);
    this.marks[newMarkId] = {
      id: newMarkId,
      color: dat.color ? dat.color : defaults.defaultMarksColor,
      descr: dat.newName,
      isFolded: { text: true, imgs: true },
      show: true
    };
    this.marks[defaults.unmarkedMarkID] = {
      id: defaults.unmarkedMarkID,
      color: defaults.unmarkedColor,
      descr: "--unmarked--",
      isFolded: { text: true, imgs: true },
      show: true
    };
  },
  setMarkToFiles: function(files, mark_ID) {
    if (!this.checkIfAtLeastOneFileSelected()) return;
    files.forEach((file) => {
      for (let key in this.stateFiles.files) {
        if (file.id == key && this.stateFiles.files[key] == "SELECTED") {
          file.markID = mark_ID;
          this.stateFiles.files[key] = "";
        }
      }
    });
  },
  abortMarkEdit: function() {
    this.state.markRenameID = null;
  }
};
const paths = {
  errors: function(mode, val) {
    return mode == "safe" ? val : false;
  },
  getParentFolderPath: function(path, params) {
    if (path == "/") return this.errors(params, "/");
    let res = path.slice(0, path.lastIndexOf(this.getFolderName(path)) - 1);
    return res == "" ? "/" : res;
  },
  getFolderName: function(path, params) {
    if (path == "/") return this.errors(params, "/");
    if (path.includes("/"))
      return path.split("/")[path.split("/").length - 1];
    if (path.includes("\\"))
      return path.split("\\")[path.split("\\").length - 1];
  },
  nextFirstChild: function(path, folderNamesList, params) {
    if (folderNamesList.length == 0) return this.errors(params, path);
    return path += settings.actualSeparator + folderNamesList[0];
  },
  getAdjacent: function(cnst, path, folderNamesList, params) {
    if (folderNamesList.length == 0) return this.errors(params, path);
    let _folderName = this.getFolderName(path);
    let _index = folderNamesList.indexOf(_folderName);
    if (_index == -1) return this.errors(params, path);
    if (cnst == "up") _index--;
    if (cnst == "down") _index++;
    if (_index >= folderNamesList.length) _index = 0;
    if (_index < 0) _index = folderNamesList.length - 1;
    return `${this.getParentFolderPath(path)}${settings.actualSeparator}${folderNamesList[_index]}`;
  },
  AisNestedInB: function(path1, path2) {
    if (path2 == "/")
      return true;
    if (path2 == path1)
      return false;
    return path1.startsWith(path2);
  },
  isImmediateChild: function(path) {
    if (history$1.isFill()) {
      return this.getParentFolderPath(path) == history$1.actual(folders.folders).path;
    } else {
      return false;
    }
  },
  isCommonParent: function(path) {
    if (history$1.isFill()) {
      return this.getParentFolderPath(path) == this.getParentFolderPath(history$1.actual(folders.folders).path);
    } else {
      return false;
    }
  },
  isParent: function(path) {
    if (history$1.isFill()) {
      return path == this.getParentFolderPath(history$1.actual(folders.folders).path);
    } else {
      return false;
    }
  },
  validate: function(path) {
    console.log("validate path: " + path);
    path = path.replaceAll(settings.win32separator, settings.actualSeparator);
    if (path.startsWith("//"))
      return path.substring(1);
    if (path.startsWith("///"))
      return path.substring(2);
    return path.replaceAll(settings.win32separator, settings.actualSeparator);
  },
  folderIsSystem: function(path, cnst) {
    if (this.isRoot(path))
      return true;
    if (cnst == void 0)
      return this.getFolderName(path).startsWith(".");
    if (cnst == "soft")
      return settings.excludedFolders.includes(this.getFolderName(path));
    if (cnst == "root") {
      if (!this.isRootsChild(path)) return false;
    }
    return settings.rootSystemFolder.includes(paths.getFolderName(path).toUpperCase());
  },
  pathIsSystem: function(path, params) {
    path = this.validate(path);
    if (params == void 0)
      return path.split(settings.actualSeparator).some((folderName) => folderName.startsWith("."));
  },
  isRoot: function(path) {
    return path == settings.actualSeparator || path == "";
  },
  isRootsChild: function(path) {
    return path.split(settings.actualSeparator).length == 2;
  },
  folderIsSpecial: function(path) {
    let specialFoldersPath = window.api.getPathSpecialFolder();
    specialFoldersPath = paths.validate(specialFoldersPath);
    return Object.values(settings.specialFolders).some((specFolder) => `${specialFoldersPath}${settings.actualSeparator}${specFolder}` == path);
  }
};
const helpers = {
  validateFolderAndFileName: function(name) {
    if (!name) return false;
    let _name = name.trim();
    _name = _name.replace(settings.folderNameRegexp, "");
    if (settings.excludedFolders.includes(_name)) return false;
    if (_name.length == 0 && _name.split(" ").length == _name.length) return false;
    return _name;
  },
  shrinkName: function(name, maxLength) {
    if (maxLength == void 0) return name;
    if (maxLength < settings.lengthOfTheLastPartOfTheFolderName + 3) return name;
    if (maxLength >= name.length) return name;
    let lastWord = name.indexOf(" ") > 0 ? name.split(" ")[name.split(" ").length - 1] : name.slice(-1 * settings.lengthOfTheLastPartOfTheFolderName);
    let index = maxLength - lastWord.length - 2;
    return `${name.slice(0, index)}...${lastWord}`;
  }
};
const folders = {
  folders: null,
  localState: null,
  parameters: null,
  deletingQueue: /* @__PURE__ */ new Set(),
  copyCutQueue: [],
  isDeleteSrcFolder: null,
  init: function(dat) {
    this.deletingQueue = /* @__PURE__ */ new Set();
    this.copyCutQueue = [];
    this.isDeleteSrcFolder = null;
    navigation.init();
    history$1.init();
    this.folders = dat.folders;
    this.localState = dat.localState;
    this.parameters = dat.parameters;
    let activeFolder;
    activeFolder = db_foldersCollectionMethods.getOpenedFolder(this.folders, "safe");
    console.log(activeFolder);
    this.clickToFolder(activeFolder.folder);
    db_folderMethods.set_(this.folders[this.localState.activeFolderIndex], "pin on bar");
    foldersCollectionMethods.refreshFolders(history$1.actual(this.folders).path, "refresh");
  },
  clickOnTheDirectoryInTheFolderTree: function(folderName, LEVEL) {
    if (folderName != settings.ROOT_C) {
      if (LEVEL == "child level")
        this.clickToFolder({ path: `${history$1.actual(this.folders).path}${settings.actualSeparator}${folderName}` });
      if (LEVEL == "this level")
        this.clickToFolder({ path: `${paths.getParentFolderPath(history$1.actual(this.folders).path)}${settings.actualSeparator}${folderName}` });
    } else {
      this.clickToFolder({ path: settings.actualSeparator });
    }
  },
  clickToFolder: function(folder2, cnst) {
    let params;
    if (cnst == "go to a created child") params = "folder exists";
    this.localState.activeFolderIndex = navigation.switchTo(this.folders, folder2.path, cnst, params);
  },
  clickToSpecialFolder: function(folderName) {
    let specialFoldersPath = window.api.getPathSpecialFolder();
    specialFoldersPath = paths.validate(specialFoldersPath);
    this.clickToFolder({ path: `${specialFoldersPath}${settings.actualSeparator}${folderName}` });
  },
  copyPastFolder: function(dat) {
    if (dat.state == "copy folder") {
      this.isDeleteSrcFolder = false;
      this.copyCutQueue.push(history$1.actual(this.folders).path);
    }
    if (dat.state == "cut folder") {
      this.isDeleteSrcFolder = true;
      this.copyCutQueue.push(history$1.actual(this.folders).path);
    }
    if (dat.state == "past folder") {
      if (this._isDeletionOfExternalFolder()) return;
      let pathTo = window.api.checkUniqueFolderName(history$1.actual(this.folders).path);
      window.api.copyFolder(this.copyCutQueue.pop(), pathTo).then(
        (pathFrom) => {
          db_foldersCollectionMethods.rename(this.folders, pathFrom, paths.getFolderName(pathTo));
          foldersCollectionMethods.refreshFolders(pathTo, "copy folder");
          if (this.isDeleteSrcFolder) {
            this.copyPastFolder({ state: "delete src folder", path: pathFrom });
          }
        }
      );
    }
    if (dat.state == "delete src folder" && this.isDeleteSrcFolder) {
      this.isDeleteSrcFolder = null;
      this.deleteFolder(dat.path);
    }
    if (dat.state == "get copy-folder name") {
      if (this.copyCutQueue.length > 0) {
        return paths.getFolderName(this.copyCutQueue[0]);
      }
    }
  },
  deleteFolder: function() {
    let path = history$1.actual(this.folders).path;
    if (paths.folderIsSystem(path, "soft")) return;
    this.deletingQueue.add(path || history$1.actual(this.folders).path);
    window.api.deleteFolder(path || history$1.actual(this.folders).path).then(
      (deletingPath) => {
        deletingPath = paths.validate(deletingPath);
        if (history$1.actual(this.folders).path == deletingPath) {
          console.log("delete actual: ");
          console.log(deletingPath);
          this.clickToFolder({ path: paths.getParentFolderPath(deletingPath) }, "go parent");
          navigation.deleteFromList(deletingPath);
        }
        if (paths.AisNestedInB(history$1.actual(this.folders).path, deletingPath)) {
          console.log("path is nested: ");
          console.log(deletingPath);
          this.clickToFolder({ path: foldersCollectionMethods.getNearestParentFolder(this.folders, deletingPath).folder.path }, "forced");
        }
        db_foldersCollectionMethods.delete(this.folders, deletingPath);
        this.deletingQueue.delete(deletingPath);
      }
    );
  },
  renameSelectedFolder: function(dat) {
    if (this._isDeletionOfExternalFolder()) return false;
    let newName = helpers.validateFolderAndFileName(dat.newName);
    if (!newName) return false;
    let oldPath = history$1.actual(this.folders).path;
    newName = window.api.checkUniqueFolderName(`${paths.getParentFolderPath(oldPath)}${settings.actualSeparator}${newName}`);
    newName = paths.getFolderName(newName);
    let newPath = window.api.renameFolder({ fullpath: oldPath, newName });
    if (newPath) {
      db_foldersCollectionMethods.rename(this.folders, oldPath, paths.getFolderName(newPath));
      foldersCollectionMethods.refreshFolders(oldPath, "rename folder", newName);
      return true;
    }
  },
  createNewFolder: function(newFolderName) {
    if (this._isDeletionOfExternalFolder()) return false;
    let newName = helpers.validateFolderAndFileName(newFolderName);
    if (!newName) return false;
    let newFolderPath = window.api.createFolder(history$1.actual(this.folders).path, newName);
    if (newFolderPath) {
      this.clickToFolder({ path: newFolderPath }, "go to a created child");
      return true;
    }
  },
  pinFolder: function() {
    let openedFolder = history$1.actual(this.folders);
    openedFolder.isPinned = !openedFolder.isPinned;
  },
  newTab: function() {
    if (tabs.countTabs(this.folders) < settings.maxTabs)
      this.localState.activeFolderIndex = tabs.showNew(this.folders);
    console.log("new tab");
  },
  closeTab: function() {
    if (tabs.countTabs(this.folders) < 2) return;
    this.localState.activeFolderIndex = tabs.close(this.folders);
  },
  openClosedTab: function() {
    this.localState.activeFolderIndex = tabs.openClosedTab(this.folders);
  },
  clickOnTab: function(path) {
    this.localState.activeFolderIndex = tabs.clickOnTab(this.folders, path);
  },
  abortCopyCutOperation: function() {
    this.isDeleteSrcFolder = null;
    this.copyCutQueue = [];
  },
  _isDeletionOfExternalFolder: function() {
    this.deletingQueue.forEach((deletingPath) => {
      if (paths.AisNestedInB(history$1.actual(this.folders).path, deletingPath)) return true;
    });
    return false;
  },
  treeNavigate: function(cnst) {
    switch (cnst) {
      case "parent folder":
        this.localState.activeFolderIndex = navigation.parent(this.folders);
        break;
      case "first child folder":
        this.localState.activeFolderIndex = navigation.nextFirst(this.folders);
        break;
      case "adjacent folder: down":
        this.localState.activeFolderIndex = navigation.adjacent(this.folders, "down");
        break;
      case "adjacent folder: up":
        this.localState.activeFolderIndex = navigation.adjacent(this.folders, "up");
        break;
      case "previous folder in history":
        this.localState.activeFolderIndex = navigation.previous(this.folders);
        break;
    }
  },
  countTabs: function() {
    return tabs.countTabs(this.folders);
  },
  refreshDisplayedFolders: function() {
    foldersCollectionMethods.refreshFolders(history$1.actual(this.folders).path, "refresh");
  },
  getActiveFolderName: function() {
    return paths.getFolderName(history$1.actual(this.folders).path);
  },
  validateFolderAndFileName: function(name) {
    return helpers.validateFolderAndFileName(name);
  },
  getFolderName: function(path) {
    return paths.getFolderName(path, "safe");
  },
  getFoldersList: function() {
    return navigation.foldersList;
  },
  getSubfoldersList: function() {
    return navigation.subfoldersList;
  },
  refreshFiles: function() {
    filesCollectionMethods.refreshFilesInActualFolder();
  },
  // getFolderName:function(path){
  //   return paths.getFolderName(path)
  // },
  showFoldersStartingWithDot: function() {
    this.parameters.showFoldersStartingWithDot = !this.parameters.showFoldersStartingWithDot;
    this.refreshDisplayedFolders();
  },
  shrinkName: function(name, maxLength) {
    return helpers.shrinkName(name, maxLength);
  },
  pathIsRoot: function(path) {
    return paths.isRoot(path);
  },
  isProtected: function() {
    if (!settings.protectSpecialFolders) return true;
    if (!settings.protectRootSystemFolders) return true;
    let path = history$1.actual(this.folders).path;
    if (paths.folderIsSystem(path, "soft")) return false;
    if (paths.folderIsSystem(path, "root")) return false;
    if (paths.folderIsSpecial(path)) return false;
    return true;
  },
  openedFolderIsRoot: function() {
    return this.pathIsRoot(history$1.actual(this.folders).path);
  }
  // recordNewFileInActualFolder:function(file){
  //   filesCollectionMethods.recordNewFileInActualFolder( `${file.name}.${file.format}` )
  // },
};
const navigation = {
  foldersList: null,
  subfoldersList: null,
  init: function() {
    this.foldersList = null;
    this.subfoldersList = null;
  },
  switchTo: function(folders2, path, cnst, params, mode) {
    let result = foldersCollectionMethods.checkFolderAndPushNewRecordOrResetNonExistent(folders2, path, params);
    if (result) {
      foldersCollectionMethods.refreshFolders(path, cnst);
      if (history$1.isFill()) {
        if (mode == void 0) {
          db_folderMethods.set_(history$1.actual(folders2), "unpin on bar");
          db_folderMethods.set_(result.folder, "pin on bar");
        }
      }
      history$1.add(result.folder);
      db_foldersCollectionMethods.closeAll(folders2);
      db_folderMethods.set_(result.folder, "open");
      if (cnst != "go to a created child")
        filesCollectionMethods.refreshFilesInActualFolder();
      return result.index;
    } else {
      let _nearestParentPath = foldersCollectionMethods.getNearestParentFolder(folders2, path).folder.path;
      this.switchTo(folders2, _nearestParentPath, cnst, "folder exists", mode);
    }
  },
  nextFirst: function(folders2) {
    let futurePath = paths.nextFirstChild(history$1.actual(folders2).path, this.subfoldersList, "safe");
    return this.switchTo(folders2, futurePath);
  },
  previous: function(folders2) {
    let previousPath = history$1.previous(folders2).path;
    console.log("prev: ");
    console.log(previousPath);
    if (previousPath)
      return this.switchTo(folders2, previousPath, "forced");
  },
  parent: function(folders2) {
    let parentPath = paths.getParentFolderPath(history$1.actual(folders2).path, "safe");
    return this.switchTo(folders2, parentPath);
  },
  adjacent: function(folders2, cnst) {
    let _path = history$1.actual(folders2).path;
    let adjacentUpPath = paths.getAdjacent(cnst, _path, this.foldersList, "safe");
    return this.switchTo(folders2, adjacentUpPath);
  },
  deleteFromList: function(path) {
    path = paths.validate(path);
    console.log("delete from list: path: ");
    console.log(path);
    let folderName = paths.getFolderName(paths.getParentFolderPath(path));
    let subFolderName = paths.getFolderName(path);
    if (this.foldersList.includes(folderName) && this.subfoldersList.includes(subFolderName)) {
      this.subfoldersList = this.subfoldersList.filter((name) => name != subFolderName);
      console.log(this.subfoldersList);
      return this.subfoldersList;
    }
    if (this.foldersList.includes(folderName) && this.subfoldersList.length == 0) {
      this.foldersList = this.foldersList.filter((name) => name != folderName);
      console.log(this.foldersList);
      return this.foldersList;
    }
  },
  replaceInTheList: function(oldName, newName) {
    let index = this.foldersList.indexOf(oldName);
    if (this.foldersList.length > 1) {
      if (index >= 0)
        this.foldersList[index] = newName;
    }
    if (this.foldersList.length == 1)
      this.foldersList = [newName];
  },
  addInTheFoldersList: function(name) {
    this.foldersList.push(name);
  }
};
const tabs = {
  close: function(folders2) {
    if (this.countTabs(folders2) < 1) return navigation.switchTo(folders2, folders2[0].path);
    let openedFolder = history$1.actual(folders2);
    let displayedOnBarFolder = folders2.findLast((folder2) => folder2.displayedOnBar && !folder2.isOpened);
    let nextFolderIndex = navigation.switchTo(folders2, displayedOnBarFolder.path, null, null, "tab");
    db_folderMethods.set_(openedFolder, "unpin on bar");
    return nextFolderIndex;
  },
  showNew: function(folders2, folder2) {
    if (folder2 == void 0)
      folder2 = foldersCollectionMethods.getNearestParentFolder(folders2, history$1.actual(folders2).path).folder;
    if (folder2) {
      db_folderMethods.set_(folder2, "pin on bar");
      return navigation.switchTo(folders2, folder2.path, null, null, "tab");
    }
  },
  clickOnTab: function(folders2, path) {
    return navigation.switchTo(folders2, path, null, null, "tab");
  },
  openClosedTab: function(folders2) {
    if (history$1.isFill())
      return this.showNew(folders2, history$1.previous(folders2));
  },
  countTabs: function(folders2) {
    let result = 0;
    folders2.forEach((folder2) => {
      if (folder2.displayedOnBar) result++;
    });
    return result;
  }
};
const history$1 = {
  id_pull: [],
  init: function() {
    this._clear();
  },
  previous: function(folders2) {
    let result = 0;
    let _flag = true;
    do {
      this.id_pull.pop();
      folders2.forEach((folder2, index) => {
        if (folder2.id == this.id_pull[this.id_pull.length - 1]) {
          result = index;
          _flag = false;
        }
      });
    } while (_flag && this.id_pull.length > 1);
    return folders2[result];
  },
  actual: function(folders2) {
    if (this.id_pull.length == 0) return;
    let result = folders2.find((folder2) => folder2.id == this.id_pull[this.id_pull.length - 1]);
    if (result) {
      return result;
    } else {
      this.id_pull.pop();
      this.actual(folders2);
    }
  },
  add: function(folder2) {
    if (this.id_pull.length == 0) {
      this.id_pull.push(folder2.id);
    } else {
      if (folder2.id != this.id_pull[this.id_pull.length - 1]) {
        this.id_pull.push(folder2.id);
      }
    }
  },
  _clear: function() {
    this.id_pull = [];
  },
  isFill: function() {
    return this.id_pull.length;
  }
};
const db_foldersCollectionMethods = {
  clearNonExistFolders: function(folders2) {
    let arrSize = folders2.length;
    for (let ch = 0; ch < arrSize; ch++) {
      if (!folders2[ch].isExist) {
        folders2.splice(ch, 1);
        ch--;
        arrSize--;
      }
    }
  },
  pushNew: function(folders2, path) {
    folders2.push(
      {
        id: "folder_" + Math.floor(Math.random() * 1e13),
        path: paths.validate(path),
        files: [],
        isOpened: false,
        isPinned: false,
        displayedOnBar: false
      }
    );
    return { folder: folders2[folders2.length - 1], index: folders2.length - 1 };
  },
  searchPathAndGetFolderID: function(folders2, path) {
    let res = false;
    folders2.forEach((folder2, index) => {
      res = db_folderMethods.is_(folder2, "are the paths the same", path);
      if (res)
        return { id: folder2.id, index };
    });
    if (!res) return { id: null, index: null };
  },
  searchFolderByPath: function(folders2, path) {
    let result = { folder: null, index: null };
    folders2.forEach((folder2, index) => {
      if (db_folderMethods.is_(folder2, "are the paths the same", { path }))
        result = { folder: folder2, index };
    });
    return result;
  },
  rename: function(folders2, oldPath, newName) {
    folders2.forEach((folder2) => {
      if (folder2.path == oldPath) {
        db_folderMethods.set_(folder2, "rename", { name: newName });
      }
      if (folder2.path.split(settings.actualSeparator).length > oldPath.split(settings.actualSeparator).length) {
        if (folder2.path.startsWith(oldPath)) {
          let newSubpath = `${oldPath.substring(0, oldPath.lastIndexOf(settings.actualSeparator))}${settings.actualSeparator}${newName}${folder2.path.split(oldPath)[1]}`;
          db_folderMethods.set_(folder2, "rewrite path", { path: newSubpath });
        }
      }
    });
  },
  delete: function(folders2, path) {
    folders2 = folders2.filter((i) => !i.path.startsWith(path));
  },
  getOpenedFolder: function(folders2, cnst) {
    let result = { folder: null, index: null };
    if (cnst == "safe")
      result = { folder: folders2[0], index: 0 };
    folders2.forEach((folder2, index) => {
      if (folder2.isOpened)
        result = { folder: folder2, index };
    });
    return result;
  },
  closeAll: function(folders2) {
    folders2.forEach((folder2) => {
      folder2.isOpened = false;
    });
  }
};
const foldersCollectionMethods = {
  folderIsExist: function(path) {
    return window.api.folderIsExist(path);
  },
  checkFolderAndPushNewRecordOrResetNonExistent: function(folders2, path, params) {
    let folderIsExist = params == "folder exists" ? true : this.folderIsExist(path);
    let folderIsRecorded = db_foldersCollectionMethods.searchFolderByPath(folders2, path);
    if (folderIsRecorded.folder) {
      if (folderIsExist)
        return folderIsRecorded;
      if (!folderIsExist) {
        db_foldersCollectionMethods.delete(folders2, path);
        return null;
      }
    }
    if (!folderIsRecorded.folder) {
      if (folderIsExist)
        return db_foldersCollectionMethods.pushNew(folders2, path);
      if (!folderIsExist) {
        return null;
      }
    }
  },
  refreshFolders: function(path, cnst, data) {
    console.log("refreshing path: ");
    console.log(path);
    console.log(cnst);
    function sublist(path2, cnst2) {
      navigation.subfoldersList = window.api.getFolderNames(path2, cnst2) || [];
      if (!folders.parameters.showFoldersStartingWithDot) {
        if (!paths.getFolderName(path2, "safe").startsWith("."))
          navigation.subfoldersList = navigation.subfoldersList.filter((folderName) => !folderName.startsWith("."));
      }
    }
    function list(path2, cnst2) {
      if (paths.isRoot(path2)) {
        navigation.foldersList = [settings.ROOT_C];
        return;
      }
      navigation.foldersList = window.api.getFolderNames(paths.getParentFolderPath(path2), cnst2) || [];
      navigation.foldersList = navigation.foldersList.filter((i) => !settings.excludedFolders.includes(i)) || [];
      if (!folders.parameters.showFoldersStartingWithDot) {
        if (!paths.getFolderName(paths.getParentFolderPath(path2, "safe"), "safe").startsWith("."))
          navigation.foldersList = navigation.foldersList.filter((folderName) => !folderName.startsWith(".") || folderName == paths.getFolderName(path2));
      }
    }
    if (cnst == void 0) {
      if (!paths.isImmediateChild(path))
        cnst = "forced";
      if (paths.isCommonParent(path))
        cnst = "common parent";
      if (paths.isParent(path))
        cnst = "go parent";
    }
    if (cnst == "forced" || navigation.foldersList == null || navigation.subfoldersList == null || cnst == "refresh" || settings.forcedFolderUpdate) {
      console.log(cnst);
      sublist(path);
      list(path);
      return;
    }
    if (cnst != "forced" && cnst == void 0) {
      if (Array.isArray(navigation.subfoldersList)) {
        if (navigation.subfoldersList.length > 0) {
          navigation.foldersList = [];
          navigation.foldersList = structuredClone(navigation.subfoldersList);
          sublist(path, "dont check for existence");
        } else {
          list(path);
        }
      }
    }
    if (cnst == "common parent") {
      sublist(path, "dont check for existence");
    }
    if (cnst == "go parent") {
      navigation.subfoldersList = [];
      navigation.subfoldersList = structuredClone(navigation.foldersList);
      list(path, "dont check for existence");
    }
    if (cnst == "go to a created child") {
      navigation.foldersList = structuredClone(navigation.subfoldersList);
      navigation.foldersList.push(paths.getFolderName(path));
      navigation.subfoldersList = [];
    }
    if (cnst == "rename folder") {
      navigation.replaceInTheList(paths.getFolderName(path), data);
    }
    if (cnst == "copy folder") {
      navigation.addInTheFoldersList(paths.getFolderName(path));
    }
  },
  getNearestParentFolder: function(folders2, path) {
    let result = null;
    let _path = path;
    do {
      _path = paths.getParentFolderPath(_path);
      result = this.checkFolderAndPushNewRecordOrResetNonExistent(folders2, _path);
    } while (result == null && _path != settings.actualSeparator);
    return result;
  }
};
const db_folderMethods = {
  set_: function(folder2, cnst, params) {
    switch (cnst) {
      case "open":
        folder2.isOpened = true;
        break;
      case "close":
        folder2.isOpened = false;
        break;
      case "pin / unpin":
        folder2.isPinned = !folder2.isPinned;
        break;
      case "pin on bar":
        folder2.displayedOnBar = true;
        break;
      case "unpin on bar":
        folder2.displayedOnBar = false;
        break;
      case "rename":
        let _newName = helpers.validateFolderAndFileName(params.name);
        if (_newName) {
          let newPath = `${paths.getParentFolderPath(folder2.path)}${settings.actualSeparator}${_newName}`;
          folder2.path = newPath;
          folder2.files.forEach((file) => {
            file.path = newPath;
          });
        }
        break;
      case "rewrite path":
        if (params.path) {
          folder2.path = params.path;
          folder2.files.forEach((file) => {
            file.path = params.path;
          });
        }
        break;
    }
  },
  get_: function(folder2, cnst, params) {
    switch (cnst) {
      case "path":
        return folder2.path;
      case "parent path":
        return paths.getParentFolderPath(folder2.path);
      case "is opened":
        return folder2.isOpened;
    }
  },
  is_: function(childFolder, cnst, params) {
    switch (cnst) {
      // case 'nested in':
      //   if( == '/') return
      //   return ParentFolder.path.startsWith(childFolder.path)
      // if( folder.path.startsWith(params.path) || params.path.startsWith(folder.path) ){
      //   return params.path.includes(folder.path)
      // }
      case "are the paths the same":
        return childFolder.path == params.path;
    }
  }
};
const filesCollectionMethods = {
  refreshFilesInActualFolder: function() {
    let readDirResult = window.api.getFileFullnames(history$1.actual(folders.folders).path);
    readDirResult = readDirResult.filter((filename) => !settings.excludedFiles.includes(filename));
    history$1.actual(folders.folders).files = history$1.actual(folders.folders).files.filter((file) => readDirResult.includes(`${file.name}.${file.format}`));
    history$1.actual(folders.folders).files.forEach((file) => {
      file.meta = window.api.getFileMeta(history$1.actual(folders.folders).path, `${file.name}.${file.format}`);
    });
    readDirResult.forEach((fullname) => {
      this.recordNewFileInActualFolder(fullname);
    });
  },
  recordNewFileInActualFolder: function(fullname) {
    if (history$1.actual(folders.folders).files.find((file) => `${file.name}.${file.format}` == fullname)) return false;
    history$1.actual(folders.folders).files.push(
      {
        id: "fileID_" + Math.floor(Math.random() * 1e14),
        name: fullname.slice(0, fullname.lastIndexOf(".")),
        //      To Do
        format: fullname.slice(fullname.lastIndexOf(".") + 1),
        markID: defaults.unmarkedMarkID,
        // markID: defaults.defaulMarkID, 
        isPinned: false,
        path: paths.validate(history$1.actual(folders.folders).path),
        meta: window.api.getFileMeta(history$1.actual(folders.folders).path, fullname)
      }
    );
    return true;
  }
};
const _sfc_main$3 = {
  components: {
    Tree,
    Tasks,
    Bar,
    AccordionFiles
  },
  props: {
    sessionType: {
      //  
      type: String,
      required: true
    }
  },
  data() {
    return {
      data: {},
      fullData: {},
      settings,
      // refreshFilesQueueLOG: {deletedIrrelevant: [], foundAndAdded: []},
      filesMethods: null,
      marksMethods: null,
      foldersMethods2: null,
      stateFiles: {
        files: {},
        //  {ID_file_1: 'SELECTED', ID_file_12: 'SELECTED'}
        imageViewerPullFiles: {},
        //  pull images files for viewer
        pathsOfOpenedFolders: [],
        //
        numberOfSelectedFiles: 0,
        defaults: {
          unmarkedMarkID: "mark_unmarked"
          //
        },
        onFocusFile: {
          metadata: {
            created: "",
            lastEdited: "",
            size: ""
          },
          //  metadata hovered file
          name: "",
          format: ""
        }
      },
      localState: {
        showTreePanel: false,
        showTasksPanel: true,
        activeFolderIndex: 0,
        metadataIsHidden: true,
        showImageProcessor: false,
        showFilesFromAllFoldersOption: false,
        showImageViewer: false,
        actualSessionType: "",
        //
        renamigMark: false,
        hideTabs: false
        //  Скрывать при нажатии F3 на малых форматах экрана (для отображения строки поиска вместо вкладок)
      },
      imageViewerData: {
        countImages: 0,
        imageBoxClassName: null
      },
      imageProcessorData: {}
      //  show only if image viewer showing
    };
  },
  methods: {
    getAllFiles() {
      let allFiles_ = [];
      this.localState.pathsOfOpenedFolders = [];
      for (const key in this.data.folders) {
        allFiles_ = allFiles_.concat(this.data.folders[key].files);
        this.localState.pathsOfOpenedFolders.push(this.data.folders[key].path);
      }
      return allFiles_;
    },
    getProject() {
      if (this.sessionType == "SESSION") {
        this.fullData = window.api.getSessionData();
        this.localState.actualSessionType = "SESSION";
      }
      if (this.sessionType == "PROJECTS") {
        this.fullData = window.api.getProjectData();
        this.localState.actualSessionType = "PROJECTS";
      }
      for (const key in this.fullData) {
        if (this.fullData[key].meta.status == "opened") {
          this.data = this.fullData[key];
        }
      }
      this.resetStateFiles();
      this.init();
    },
    imageViewer() {
      this.stateFiles.imageViewerPullFiles = {};
      let filePullIsEmpty = true;
      this.imageViewerData.countImages = 0;
      this.data.folders.forEach((folder2) => {
        folder2.files.forEach((file) => {
          for (let key in this.stateFiles.files) {
            if (file.id == key && this.stateFiles.files[key] == "SELECTED" && filesMethods.isAPicture(file)) {
              this.stateFiles.imageViewerPullFiles[key] = file;
              this.imageViewerData.countImages++;
              filePullIsEmpty = false;
            }
          }
        });
      });
      if (!filePullIsEmpty)
        this.imageViewerData.imageBoxClassName = this.imageViewerData.countImages < 5 ? this.imageViewerData.countImages : "MANY";
      return !filePullIsEmpty;
    },
    resetStateFiles() {
      this.stateFiles.pathsOfOpenedFolders = [];
    },
    init() {
      this.foldersMethods2 = folders;
      this.foldersMethods2.init({ folders: this.data.folders, localState: this.localState, parameters: this.data.parameters });
      this.filesMethods = filesMethods;
      this.filesMethods.localState = this.localState;
      this.filesMethods.stateFiles = this.stateFiles;
      this.filesMethods.init(this.data);
      this.filesMethods.resetStateAllFiles();
      this.marksMethods = marksMethods;
      this.marksMethods.stateFiles = this.stateFiles;
      this.marksMethods.marks = this.data.marks;
    },
    showSearchPanel() {
      if (window.outerWidth != window.screen.width)
        this.localState.hideTabs = !this.localState.hideTabs;
    },
    spaceKey(cnst, e) {
      if (e.target.id == "INPUT") return;
      if (e.target.parentElement.id == "INPUT") return;
      if (e.target.nodeName == "INPUT") return;
      if (this.localState.renamigMark) return;
      e.preventDefault();
      if (cnst == "keyup") {
        let selectedImages = this.imageViewer();
        if (selectedImages > 0)
          this.localState.showImageViewer = !this.localState.showImageViewer;
        if (selectedImages == 1)
          this.localState.showImageProcessor = !this.localState.showImageProcessor;
        this.localState.metadataIsHidden = true;
      }
      if (!this.localState.showImageViewer) {
        if (cnst == "keydown") {
          if (this.localState.metadataIsHidden)
            this.localState.metadataIsHidden = false;
        }
      }
    },
    getUlrFromPath(path) {
      return window.api.convertPathToUrl(path).href;
    }
  },
  beforeMount() {
    this.getProject();
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", (e) => {
        if (window.outerWidth == window.screen.width)
          this.localState.hideTabs = false;
      });
      window.addEventListener("keydown", (e) => {
        if (e.key == "Tab")
          e.preventDefault();
        if (e.key == " ")
          this.spaceKey("keydown", e);
      });
      window.addEventListener("keyup", (e) => {
        if (e.key == "Tab")
          e.preventDefault();
        if (e.key == " ")
          this.spaceKey("keyup", e);
        if (e.key == "+" || e.key == "=") {
          if (this.data.parameters.imagesHeight < this.settings.maximumImagePreviewSize - this.settings.imageZoomStep)
            this.data.parameters.imagesHeight += this.settings.imageZoomStep;
        }
        if (e.key == "-") {
          if (this.data.parameters.imagesHeight > this.settings.minimumImagePreviewSize + this.settings.imageZoomStep)
            this.data.parameters.imagesHeight -= this.settings.imageZoomStep;
        }
      });
    });
  },
  beforeUpdate() {
    if (this.localState.actualSessionType != this.sessionType)
      this.getProject();
  }
};
const _hoisted_1$3 = { class: "page-block on-row w100" };
const _hoisted_2$1 = { class: "tasks-and-tree" };
const _hoisted_3$1 = { class: "section-right h100" };
const _hoisted_4$1 = {
  key: 0,
  class: "h100"
};
const _hoisted_5$1 = { class: "w100 h100 on-row" };
const _hoisted_6$1 = {
  key: 1,
  class: "h100"
};
const _hoisted_7$1 = { class: "w100 h100 on-row" };
const _hoisted_8$1 = {
  key: 0,
  class: "component image-viewer on-center"
};
const _hoisted_9$1 = { class: "image-viewer-box" };
const _hoisted_10$1 = ["src"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Bar = resolveComponent("Bar");
  const _component_Tasks = resolveComponent("Tasks");
  const _component_Tree = resolveComponent("Tree");
  const _component_AccordionFiles = resolveComponent("AccordionFiles");
  return openBlock(), createElementBlock("div", {
    onKeyup: [
      _cache[0] || (_cache[0] = withKeys(($event) => $data.foldersMethods2.refreshFiles(), ["f5"])),
      _cache[1] || (_cache[1] = withKeys(($event) => $options.showSearchPanel(), ["f3"])),
      _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => $options.showSearchPanel(), ["ctrl"]), ["f"]))
    ],
    class: "on-col focus",
    tabindex: "0"
  }, [
    createVNode(_component_Bar, {
      stateFiles: $data.stateFiles,
      localState: $data.localState,
      foldersMethods2: $data.foldersMethods2,
      marks: $data.data.marks,
      marksMethods: $data.marksMethods,
      filesMethods: $data.filesMethods,
      folders: $data.data.folders,
      class: "bar-component"
    }, null, 8, ["stateFiles", "localState", "foldersMethods2", "marks", "marksMethods", "filesMethods", "folders"]),
    createBaseVNode("div", {
      class: normalizeClass(`${$data.localState.actualSessionType}-page`)
    }, [
      createBaseVNode("div", {
        class: normalizeClass([{ collapse: $data.localState.showImageViewer }, "on-row"])
      }, [
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "left-field w100" }, null, -1)),
        createBaseVNode("div", _hoisted_1$3, [
          createBaseVNode("div", _hoisted_2$1, [
            $data.localState.showTasksPanel ? (openBlock(), createBlock(_component_Tasks, {
              key: 0,
              tasks: $data.data.tasks,
              class: "component tasks"
            }, null, 8, ["tasks"])) : createCommentVNode("", true),
            $data.localState.showTreePanel && !$data.localState.showFilesFromAllFoldersOption ? (openBlock(), createBlock(_component_Tree, {
              key: 1,
              foldersMethods2: $data.foldersMethods2,
              filesMethods: $data.filesMethods,
              path: $data.data.folders[$data.localState.activeFolderIndex].path,
              folders: $data.data.folders,
              dataSettings: $data.data.parameters,
              localState: $data.localState,
              projectID: $data.data.id,
              class: "component tree"
            }, null, 8, ["foldersMethods2", "filesMethods", "path", "folders", "dataSettings", "localState", "projectID"])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_3$1, [
            !$data.localState.showFilesFromAllFoldersOption ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
              createBaseVNode("div", _hoisted_5$1, [
                createBaseVNode("div", null, [
                  createVNode(_component_AccordionFiles, {
                    localState: $data.localState,
                    filesMethods: $data.filesMethods,
                    files: $data.data.folders[$data.localState.activeFolderIndex].files,
                    marks: $data.data.marks,
                    viewMode: "text",
                    state: $data.stateFiles,
                    inputSettings: $data.data.parameters,
                    class: "text-files-component component"
                  }, null, 8, ["localState", "filesMethods", "files", "marks", "state", "inputSettings"])
                ]),
                createBaseVNode("div", null, [
                  createVNode(_component_AccordionFiles, {
                    localState: $data.localState,
                    filesMethods: $data.filesMethods,
                    files: $data.data.folders[$data.localState.activeFolderIndex].files,
                    marks: $data.data.marks,
                    viewMode: "imgs",
                    state: $data.stateFiles,
                    inputSettings: $data.data.parameters,
                    class: "image-files-component component"
                  }, null, 8, ["localState", "filesMethods", "files", "marks", "state", "inputSettings"])
                ])
              ])
            ])) : (openBlock(), createElementBlock("div", _hoisted_6$1, [
              createBaseVNode("div", _hoisted_7$1, [
                createBaseVNode("div", null, [
                  createVNode(_component_AccordionFiles, {
                    localState: $data.localState,
                    filesMethods: $data.filesMethods,
                    files: $options.getAllFiles(),
                    marks: $data.data.marks,
                    viewMode: "text",
                    state: $data.stateFiles,
                    inputSettings: $data.data.parameters,
                    class: "text-files-component component"
                  }, null, 8, ["localState", "filesMethods", "files", "marks", "state", "inputSettings"])
                ]),
                createBaseVNode("div", null, [
                  createVNode(_component_AccordionFiles, {
                    localState: $data.localState,
                    filesMethods: $data.filesMethods,
                    files: $options.getAllFiles(),
                    marks: $data.data.marks,
                    viewMode: "imgs",
                    state: $data.stateFiles,
                    inputSettings: $data.data.parameters,
                    class: "image-files-component component"
                  }, null, 8, ["localState", "filesMethods", "files", "marks", "state", "inputSettings"])
                ])
              ])
            ]))
          ])
        ]),
        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "right-fiels w100" }, null, -1))
      ], 2),
      $data.localState.showImageViewer ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
        createBaseVNode("div", {
          class: normalizeClass([`images-block-${$data.imageViewerData.imageBoxClassName}`, "images-block on-center"])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($data.stateFiles.imageViewerPullFiles, (pix) => {
            return openBlock(), createElementBlock("div", _hoisted_9$1, [
              createBaseVNode("img", {
                src: $options.getUlrFromPath(`${pix.path}${$data.settings.actualSeparator}${pix.name}.${pix.format}`),
                class: "img"
              }, null, 8, _hoisted_10$1)
            ]);
          }), 256))
        ], 2)
      ])) : createCommentVNode("", true)
    ], 2)
  ], 32);
}
const BrowserView = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-912a5810"]]);
const _imports_0 = "" + new URL("icon512-h_Bt3UrW.png", import.meta.url).href;
const _sfc_main$2 = {};
const _hoisted_1$2 = { class: "help t-help scrollY" };
function _sfc_render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createStaticVNode('<div class="about on-center" data-v-4b181cea><div class="on-col w100" data-v-4b181cea><div class="w100 on-center" data-v-4b181cea><img src="' + _imports_0 + '" alt="" class="logo" data-v-4b181cea></div><div class="w100 on-center" data-v-4b181cea><span class="t-about uppercase" data-v-4b181cea> Marks and Tasks file manager - is a free app with tabs, color tags (marks) and task manager for Windows. </span></div></div></div><div class="info on-row" data-v-4b181cea><div class="info-block on-col" data-v-4b181cea><span data-v-4b181cea><span class="t-key" data-v-4b181cea>Space</span>: open the comparison window for the selected photos.</span><span data-v-4b181cea><span class="t-key" data-v-4b181cea>Space</span> (press): show metadata of the file in focus.</span><span data-v-4b181cea><span class="t-key" data-v-4b181cea>F3</span>: show / hide search panel (in unmaximize window only).</span><span data-v-4b181cea><span class="t-key" data-v-4b181cea>F5</span>: refresh files in opened folder.</span><span class="on-row" data-v-4b181cea><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>+</span> <span class="t-key" data-v-4b181cea>-</span> <span class="t-key" data-v-4b181cea>=</span></span> : increase or decrease the size of image icons. </span><span data-v-4b181cea>Some hotkeys only work when the corresponding component has focus.</span></div><div class="info-block on-col" data-v-4b181cea><span class="block-name t-block-name h3 w100 on-center uppercase" data-v-4b181cea>Bar panel</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + T</span>: open last closed tab folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Esc</span>: hide the input line for the name of the created &#39;mark&#39;.</span></div><div class="info-block on-col" data-v-4b181cea><span class="block-name t-block-name h3 w100 on-center uppercase" data-v-4b181cea>Tasks panel</span><span class="on-row" data-v-4b181cea><span class="t-key on-row" data-v-4b181cea>Arrow Up</span> and <span class="t-key on-row" data-v-4b181cea>Arrow Down</span> (IN DEV): move a task up or down in the list. </span><span class="on-row" data-v-4b181cea><span class="t-click" data-v-4b181cea>Single click</span>: select task.</span><span class="on-row" data-v-4b181cea><span class="t-click" data-v-4b181cea>Double click</span>: edit task description.</span></div><div class="info-block on-col" data-v-4b181cea><span class="block-name t-block-name h3 w100 on-center uppercase" data-v-4b181cea>Folder tree panel</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>F2</span>: rename folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>F5</span>: refresh folders.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Esc</span>: cancel renaming / copy / cut folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + D</span>: pin / unpin folder.*</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + Shift + N</span> / <span data-v-4b181cea>Ctrl + N</span>: Create new sub-folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + C</span>: start copying folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + X</span>: start moving folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + V</span>: paste folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Arrow Up</span>: move to next folder (up).</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Arrow Down</span>: move to next folder (down).</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Arrow Left</span>: move to parent folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + Arrow Left</span>: move to previous folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Arrow Right</span>: move to first child folder.</span><span class="on-row" data-v-4b181cea><span class="t-click" data-v-4b181cea>Single click</span>: move to folder.</span></div><div class="info-block on-col" data-v-4b181cea><span class="block-name t-block-name h3 w100 on-center uppercase" data-v-4b181cea>Files panel</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>F2</span>: rename files.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>F5</span>: refresh files in opened folder.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Esc</span>: cancel selected / renaming / copy / cut files.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + D</span>: pin / unpin files.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + C</span>: start copying files.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + X</span>: start moving files.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + V</span>: paste files.</span><span class="on-row" data-v-4b181cea><span class="t-key" data-v-4b181cea>Ctrl + A</span>: select all files in mark block. If you click on the block of &#39;marked&#39; files.</span><span class="on-row" data-v-4b181cea><span class="t-click" data-v-4b181cea>Single click</span>: select / unselect file.</span><span class="on-row" data-v-4b181cea><span class="t-click" data-v-4b181cea>Double click</span>: open file.</span></div></div>', 2)
  ]));
}
const HelpView = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-4b181cea"]]);
const _sfc_main$1 = {
  methods: {
    openProject: function(proj_id) {
      window.api.openProject(proj_id);
      this.$router.push({ name: "Browser-projects" });
    },
    deleteProject: function(proj_id) {
      delete this.fullData[proj_id];
      this.hoverOnProject_ID = null;
    },
    pinProject: function(proj_id) {
      this.fullData[proj_id].meta.isPinned = !this.fullData[proj_id].meta.isPinned;
    },
    createNewProjectFromOpenedFolders() {
      let newProjectId = "proj_" + Math.floor(Math.random() * 1e11);
      this.fullData[newProjectId] = structuredClone(window.api.getSessionData().proj_default);
      this.fullData[newProjectId].id = newProjectId;
      this.fullData[newProjectId].meta.name = this.nameOfNewProject;
      this.fullData[newProjectId].meta.created = Date.now();
      this.fullData[newProjectId].meta.lastModified = Date.now();
      this.fullData[newProjectId].meta.lastOpened = Date.now();
      this.fullData[newProjectId].meta.isPinned = false;
      this.fullData[newProjectId].meta.description = this.descriptionOfNewProject;
      this.fullData[newProjectId].meta.status = "closed";
      this.fullData[newProjectId].tasks = {};
      this.fullData[newProjectId].marks = {
        mark_unmarked: {
          id: "mark_unmarked",
          color: this.defaults.defaultMark.color,
          descr: this.defaults.defaultMark.descr,
          isFolded: { text: false, imgs: false },
          show: true
        }
      };
      let session = window.api.getSessionData().proj_default;
      session.folders.filter((folder2) => folder2.isOpened);
    },
    renameProject: function(dat) {
      if (dat.state == "input-start") {
        if (this.selectedProjectID) {
          this.renamingProjectID = this.selectedProjectID;
          this.renamedValue = this.fullData[this.renamingProjectID].meta.name;
        }
      }
      if (dat.state == "input-end") {
        if (this.selectedProjectID) {
          this.renamedValue.trim();
          if (this.renamedValue.length > 1) {
            this.fullData[this.renamingProjectID].meta.name = this.renamedValue;
          }
          this.selectedProjectID = null;
          this.renamingProjectID = null;
        }
      }
    },
    cancelRenaiming: function() {
      this.selectedProjectID = null;
      this.renamingProjectID = null;
    }
  },
  beforeMount() {
    this.fullData = window.api.getProjectData();
  },
  computed: {
    sortProjects() {
      return Object.fromEntries(
        Object.entries(this.fullData).sort(
          (a, b) => b[1].meta.lastOpened - a[1].meta.lastOpened
        )
      );
    }
  },
  data() {
    return {
      fullData: {},
      hoverOnProject_ID: null,
      hoverOnCreateNewProject: false,
      nameOfNewProject: "give a name to your project",
      descriptionOfNewProject: "",
      renamedValue: "",
      selectedProjectID: null,
      renamingProjectID: null,
      defaults: {
        defaultMark: {
          color: "default-color",
          descr: "--unmarked--"
        }
      }
    };
  }
};
const _hoisted_1$1 = { class: "content on-col w100 h100" };
const _hoisted_2 = { class: "pin-block on-row w100" };
const _hoisted_3 = { class: "pin-list left-side on-row" };
const _hoisted_4 = {
  key: 0,
  class: "info"
};
const _hoisted_5 = { key: 0 };
const _hoisted_6 = { class: "t-project-descr project-description" };
const _hoisted_7 = { class: "pin-list right-side" };
const _hoisted_8 = { class: "w100 on-col" };
const _hoisted_9 = { class: "w100" };
const _hoisted_10 = { key: 0 };
const _hoisted_11 = ["onMouseenter"];
const _hoisted_12 = ["onClick", "onDblclick"];
const _hoisted_13 = { class: "btn on-center" };
const _hoisted_14 = ["onClick"];
const _hoisted_15 = { class: "btn on-center" };
const _hoisted_16 = ["onClick"];
const _hoisted_17 = {
  key: 1,
  class: "rename-box"
};
const _hoisted_18 = ["id"];
const _hoisted_19 = { class: "unpin-block on-row w100" };
const _hoisted_20 = { class: "unpin-list left-side on-row" };
const _hoisted_21 = {
  key: 0,
  class: "info"
};
const _hoisted_22 = { key: 0 };
const _hoisted_23 = { class: "t-project-descr project-description" };
const _hoisted_24 = { class: "unpin-list right-side" };
const _hoisted_25 = { class: "w100 on-col" };
const _hoisted_26 = { class: "w100" };
const _hoisted_27 = { key: 0 };
const _hoisted_28 = ["onMouseenter"];
const _hoisted_29 = ["onClick", "onDblclick"];
const _hoisted_30 = { class: "btn on-center" };
const _hoisted_31 = ["onClick"];
const _hoisted_32 = { class: "btn on-center" };
const _hoisted_33 = ["onClick"];
const _hoisted_34 = {
  key: 1,
  class: "rename-box"
};
const _hoisted_35 = ["id"];
const _hoisted_36 = { class: "create-block on-row w100" };
const _hoisted_37 = { class: "new-list left-side on-row" };
const _hoisted_38 = {
  key: 0,
  class: "info"
};
const _hoisted_39 = { class: "new-list right-side" };
const _hoisted_40 = { class: "w100" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    onKeyup: [
      _cache[9] || (_cache[9] = withKeys(($event) => $options.renameProject({ state: "input-start" }), ["f2"])),
      _cache[10] || (_cache[10] = withKeys(($event) => $options.cancelRenaiming(), ["esc"]))
    ],
    tabindex: "0",
    class: "focus projects-list-component on-row h100 w100"
  }, [
    _cache[23] || (_cache[23] = createBaseVNode("div", { class: "fill on-row w100 h100" }, [
      createBaseVNode("div", { class: "left-block left-side h100" }),
      createBaseVNode("div", { class: "right-block right-side h100" })
    ], -1)),
    createBaseVNode("div", _hoisted_1$1, [
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("div", _hoisted_3, [
          _cache[11] || (_cache[11] = createBaseVNode("div", { class: "w100" }, null, -1)),
          $data.hoverOnProject_ID != null ? (openBlock(), createElementBlock("div", _hoisted_4, [
            $data.fullData[$data.hoverOnProject_ID].meta.isPinned ? (openBlock(), createElementBlock("div", _hoisted_5, [
              createBaseVNode("span", _hoisted_6, toDisplayString($data.fullData[$data.hoverOnProject_ID].meta.description), 1)
            ])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_7, [
          createBaseVNode("div", _hoisted_8, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($options.sortProjects, (item, index) => {
              return openBlock(), createElementBlock("div", _hoisted_9, [
                item.meta.isPinned ? (openBlock(), createElementBlock("div", _hoisted_10, [
                  item.id != $data.renamingProjectID ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: normalizeClass([{ active: item.id == $data.selectedProjectID }, "projects-list__item on-row"])
                  }, [
                    _cache[14] || (_cache[14] = createBaseVNode("div", { class: "pin-logo" }, [
                      createBaseVNode("img", {
                        src: _imports_0$2,
                        class: "pix-btn"
                      })
                    ], -1)),
                    createBaseVNode("div", {
                      onMouseleave: _cache[0] || (_cache[0] = ($event) => $data.hoverOnProject_ID = null),
                      onMouseenter: ($event) => $data.hoverOnProject_ID = item.id,
                      class: "projects-list__name on-row item"
                    }, [
                      createBaseVNode("span", {
                        onClick: ($event) => $data.selectedProjectID = $data.renamingProjectID ? $data.selectedProjectID : item.id,
                        onDblclick: ($event) => $options.openProject(item.id),
                        class: "item-name t-project-name uppercase"
                      }, toDisplayString(item.meta.name), 41, _hoisted_12),
                      createBaseVNode("div", _hoisted_13, [
                        createBaseVNode("span", {
                          onClick: ($event) => $options.deleteProject(item.id)
                        }, _cache[12] || (_cache[12] = [
                          createBaseVNode("img", {
                            src: _imports_1,
                            class: "item__icon"
                          }, null, -1)
                        ]), 8, _hoisted_14)
                      ]),
                      createBaseVNode("div", _hoisted_15, [
                        createBaseVNode("span", {
                          onClick: ($event) => $options.pinProject(item.id)
                        }, _cache[13] || (_cache[13] = [
                          createBaseVNode("img", {
                            src: _imports_2$1,
                            class: "item__icon"
                          }, null, -1)
                        ]), 8, _hoisted_16)
                      ])
                    ], 40, _hoisted_11)
                  ], 2)) : createCommentVNode("", true),
                  item.id == $data.renamingProjectID ? (openBlock(), createElementBlock("div", _hoisted_17, [
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.renamedValue = $event),
                      id: `${item.id}`,
                      onKeyup: _cache[2] || (_cache[2] = withKeys(($event) => $options.renameProject({ state: "input-end" }), ["enter"])),
                      class: "item-name t-project-name t-project-renaming rename-inputbox focus w100"
                    }, null, 40, _hoisted_18), [
                      [vModelText, $data.renamedValue]
                    ])
                  ])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
              ]);
            }), 256))
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_19, [
        createBaseVNode("div", _hoisted_20, [
          _cache[15] || (_cache[15] = createBaseVNode("div", { class: "w100" }, null, -1)),
          $data.hoverOnProject_ID != null ? (openBlock(), createElementBlock("div", _hoisted_21, [
            !$data.fullData[$data.hoverOnProject_ID].meta.isPinned ? (openBlock(), createElementBlock("div", _hoisted_22, [
              createBaseVNode("span", _hoisted_23, toDisplayString($data.fullData[$data.hoverOnProject_ID].meta.description), 1)
            ])) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_24, [
          createBaseVNode("div", _hoisted_25, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($options.sortProjects, (item, index) => {
              return openBlock(), createElementBlock("div", _hoisted_26, [
                !item.meta.isPinned ? (openBlock(), createElementBlock("div", _hoisted_27, [
                  item.id != $data.renamingProjectID ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: normalizeClass([{ active: item.id == $data.selectedProjectID }, "projects-list__item on-row"])
                  }, [
                    _cache[18] || (_cache[18] = createBaseVNode("div", { class: "pin-logo" }, [
                      createBaseVNode("span")
                    ], -1)),
                    createBaseVNode("div", {
                      onMouseleave: _cache[3] || (_cache[3] = ($event) => $data.hoverOnProject_ID = null),
                      onMouseenter: ($event) => $data.hoverOnProject_ID = item.id,
                      class: "projects-list__name item on-row"
                    }, [
                      createBaseVNode("span", {
                        class: "item-name t-project-name uppercase",
                        onClick: ($event) => $data.selectedProjectID = $data.renamingProjectID ? $data.selectedProjectID : item.id,
                        onDblclick: ($event) => $options.openProject(item.id)
                      }, toDisplayString(item.meta.name), 41, _hoisted_29),
                      createBaseVNode("div", _hoisted_30, [
                        createBaseVNode("span", {
                          onClick: ($event) => $options.deleteProject(item.id)
                        }, _cache[16] || (_cache[16] = [
                          createBaseVNode("img", {
                            src: _imports_1,
                            class: "item__icon"
                          }, null, -1)
                        ]), 8, _hoisted_31)
                      ]),
                      createBaseVNode("div", _hoisted_32, [
                        createBaseVNode("span", {
                          onClick: ($event) => $options.pinProject(item.id)
                        }, _cache[17] || (_cache[17] = [
                          createBaseVNode("img", {
                            src: _imports_0$2,
                            class: "item__icon"
                          }, null, -1)
                        ]), 8, _hoisted_33)
                      ])
                    ], 40, _hoisted_28)
                  ], 2)) : createCommentVNode("", true),
                  item.id == $data.renamingProjectID ? (openBlock(), createElementBlock("div", _hoisted_34, [
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.renamedValue = $event),
                      id: `${item.id}`,
                      onKeyup: _cache[5] || (_cache[5] = withKeys(($event) => $options.renameProject({ state: "input-end" }), ["enter"])),
                      class: "item-name t-project-name t-project-renaming uppercase rename-inputbox focus w100"
                    }, null, 40, _hoisted_35), [
                      [vModelText, $data.renamedValue]
                    ])
                  ])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
              ]);
            }), 256))
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_36, [
        createBaseVNode("div", _hoisted_37, [
          _cache[20] || (_cache[20] = createBaseVNode("div", { class: "w100" }, null, -1)),
          $data.hoverOnCreateNewProject ? (openBlock(), createElementBlock("div", _hoisted_38, _cache[19] || (_cache[19] = [
            createBaseVNode("span", { class: "t-project-descr project-description" }, "Create new project from opened folders. Your marks and tasks will remain.", -1)
          ]))) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_39, [
          createBaseVNode("div", _hoisted_40, [
            createBaseVNode("div", {
              onMouseleave: _cache[7] || (_cache[7] = ($event) => $data.hoverOnCreateNewProject = false),
              onMouseenter: _cache[8] || (_cache[8] = ($event) => $data.hoverOnCreateNewProject = true),
              class: "w100 on-row"
            }, [
              _cache[22] || (_cache[22] = createBaseVNode("div", { class: "new-proj-logo" }, [
                createBaseVNode("img", {
                  src: _imports_3$1,
                  class: "pix-btn"
                })
              ], -1)),
              createBaseVNode("div", {
                class: "create w100",
                onClick: _cache[6] || (_cache[6] = ($event) => $options.createNewProjectFromOpenedFolders())
              }, _cache[21] || (_cache[21] = [
                createBaseVNode("span", { class: "t-project-name uppercase" }, "Create new project", -1)
              ]))
            ], 32)
          ])
        ])
      ])
    ])
  ], 32);
}
const ProjectsListView = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-1ce89c01"]]);
const _sfc_main = {};
const _hoisted_1 = { class: "unsplash" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1, " unsplash ");
}
const UnsplashView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-305ca2e0"]]);
const router = createRouter({
  history: createMemoryHistory("./"),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/BrowserView",
      name: "Browser-projects",
      component: BrowserView,
      props: { sessionType: "PROJECTS" }
    },
    {
      path: "/BrowserView",
      name: "Browser-session",
      component: BrowserView,
      props: { sessionType: "SESSION" }
    },
    {
      path: "/HelpView",
      name: "Help",
      component: HelpView
    },
    {
      path: "/",
      // path: '/ProjectsListView',
      name: "ProjectsList",
      component: ProjectsListView
    },
    {
      path: "/UnsplashView",
      name: "Unsplash",
      component: UnsplashView
    }
  ]
});
const app = createApp(App);
app.use(router);
app.mount("#app");
