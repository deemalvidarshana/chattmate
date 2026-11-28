var Nu = Object.defineProperty;
var Pu = (e, t, n) => t in e ? Nu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var et = (e, t, n) => Pu(e, typeof t != "symbol" ? t + "" : t, n);
/**
* @vue/shared v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function po(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const tt = {}, ds = [], ln = () => {
}, Mu = () => !1, Xi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), go = (e) => e.startsWith("onUpdate:"), Et = Object.assign, mo = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Fu = Object.prototype.hasOwnProperty, Ve = (e, t) => Fu.call(e, t), me = Array.isArray, ps = (e) => Zi(e) === "[object Map]", vl = (e) => Zi(e) === "[object Set]", ye = (e) => typeof e == "function", ht = (e) => typeof e == "string", Bn = (e) => typeof e == "symbol", at = (e) => e !== null && typeof e == "object", yl = (e) => (at(e) || ye(e)) && ye(e.then) && ye(e.catch), bl = Object.prototype.toString, Zi = (e) => bl.call(e), Du = (e) => Zi(e).slice(8, -1), wl = (e) => Zi(e) === "[object Object]", _o = (e) => ht(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Gs = /* @__PURE__ */ po(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Ji = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Bu = /-(\w)/g, Mn = Ji(
  (e) => e.replace(Bu, (t, n) => n ? n.toUpperCase() : "")
), $u = /\B([A-Z])/g, $n = Ji(
  (e) => e.replace($u, "-$1").toLowerCase()
), kl = Ji((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ar = Ji(
  (e) => e ? `on${kl(e)}` : ""
), Nn = (e, t) => !Object.is(e, t), Si = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Wr = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, jr = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let _a;
const Qi = () => _a || (_a = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function we(e) {
  if (me(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = ht(s) ? qu(s) : we(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (ht(e) || at(e))
    return e;
}
const Uu = /;(?![^(]*\))/g, zu = /:([^]+)/, Hu = /\/\*[^]*?\*\//g;
function qu(e) {
  const t = {};
  return e.replace(Hu, "").split(Uu).forEach((n) => {
    if (n) {
      const s = n.split(zu);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function $e(e) {
  let t = "";
  if (ht(e))
    t = e;
  else if (me(e))
    for (let n = 0; n < e.length; n++) {
      const s = $e(e[n]);
      s && (t += s + " ");
    }
  else if (at(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Wu = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ju = /* @__PURE__ */ po(Wu);
function xl(e) {
  return !!e || e === "";
}
const Al = (e) => !!(e && e.__v_isRef === !0), ee = (e) => ht(e) ? e : e == null ? "" : me(e) || at(e) && (e.toString === bl || !ye(e.toString)) ? Al(e) ? ee(e.value) : JSON.stringify(e, Sl, 2) : String(e), Sl = (e, t) => Al(t) ? Sl(e, t.value) : ps(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[Sr(s, r) + " =>"] = i, n),
    {}
  )
} : vl(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Sr(n))
} : Bn(t) ? Sr(t) : at(t) && !me(t) && !wl(t) ? String(t) : t, Sr = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Bn(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Dt;
class Vu {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Dt, !t && Dt && (this.index = (Dt.scopes || (Dt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Dt;
      try {
        return Dt = this, t();
      } finally {
        Dt = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Dt, Dt = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Dt = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Ku() {
  return Dt;
}
let rt;
const Tr = /* @__PURE__ */ new WeakSet();
class Tl {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Dt && Dt.active && Dt.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Tr.has(this) && (Tr.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Cl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, va(this), Rl(this);
    const t = rt, n = en;
    rt = this, en = !0;
    try {
      return this.fn();
    } finally {
      Il(this), rt = t, en = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        bo(t);
      this.deps = this.depsTail = void 0, va(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Tr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Vr(this) && this.run();
  }
  get dirty() {
    return Vr(this);
  }
}
let El = 0, Ys, Xs;
function Cl(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Xs, Xs = e;
    return;
  }
  e.next = Ys, Ys = e;
}
function vo() {
  El++;
}
function yo() {
  if (--El > 0)
    return;
  if (Xs) {
    let t = Xs;
    for (Xs = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Ys; ) {
    let t = Ys;
    for (Ys = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Rl(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Il(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), bo(s), Gu(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Vr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Ll(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Ll(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ni) || (e.globalVersion = ni, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Vr(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = rt, s = en;
  rt = e, en = !0;
  try {
    Rl(e);
    const i = e.fn(e._value);
    (t.version === 0 || Nn(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    rt = n, en = s, Il(e), e.flags &= -3;
  }
}
function bo(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      bo(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Gu(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let en = !0;
const Ol = [];
function kn() {
  Ol.push(en), en = !1;
}
function xn() {
  const e = Ol.pop();
  en = e === void 0 ? !0 : e;
}
function va(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = rt;
    rt = void 0;
    try {
      t();
    } finally {
      rt = n;
    }
  }
}
let ni = 0;
class Yu {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class wo {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!rt || !en || rt === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== rt)
      n = this.activeLink = new Yu(rt, this), rt.deps ? (n.prevDep = rt.depsTail, rt.depsTail.nextDep = n, rt.depsTail = n) : rt.deps = rt.depsTail = n, Nl(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = rt.depsTail, n.nextDep = void 0, rt.depsTail.nextDep = n, rt.depsTail = n, rt.deps === n && (rt.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, ni++, this.notify(t);
  }
  notify(t) {
    vo();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      yo();
    }
  }
}
function Nl(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Nl(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Kr = /* @__PURE__ */ new WeakMap(), Qn = Symbol(
  ""
), Gr = Symbol(
  ""
), si = Symbol(
  ""
);
function St(e, t, n) {
  if (en && rt) {
    let s = Kr.get(e);
    s || Kr.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new wo()), i.map = s, i.key = n), i.track();
  }
}
function vn(e, t, n, s, i, r) {
  const o = Kr.get(e);
  if (!o) {
    ni++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (vo(), t === "clear")
    o.forEach(a);
  else {
    const l = me(e), d = l && _o(n);
    if (l && n === "length") {
      const u = Number(s);
      o.forEach((w, m) => {
        (m === "length" || m === si || !Bn(m) && m >= u) && a(w);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && a(o.get(n)), d && a(o.get(si)), t) {
        case "add":
          l ? d && a(o.get("length")) : (a(o.get(Qn)), ps(e) && a(o.get(Gr)));
          break;
        case "delete":
          l || (a(o.get(Qn)), ps(e) && a(o.get(Gr)));
          break;
        case "set":
          ps(e) && a(o.get(Qn));
          break;
      }
  }
  yo();
}
function us(e) {
  const t = je(e);
  return t === e ? t : (St(t, "iterate", si), Gt(e) ? t : t.map(xt));
}
function er(e) {
  return St(e = je(e), "iterate", si), e;
}
const Xu = {
  __proto__: null,
  [Symbol.iterator]() {
    return Er(this, Symbol.iterator, xt);
  },
  concat(...e) {
    return us(this).concat(
      ...e.map((t) => me(t) ? us(t) : t)
    );
  },
  entries() {
    return Er(this, "entries", (e) => (e[1] = xt(e[1]), e));
  },
  every(e, t) {
    return pn(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return pn(this, "filter", e, t, (n) => n.map(xt), arguments);
  },
  find(e, t) {
    return pn(this, "find", e, t, xt, arguments);
  },
  findIndex(e, t) {
    return pn(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return pn(this, "findLast", e, t, xt, arguments);
  },
  findLastIndex(e, t) {
    return pn(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return pn(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Cr(this, "includes", e);
  },
  indexOf(...e) {
    return Cr(this, "indexOf", e);
  },
  join(e) {
    return us(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return Cr(this, "lastIndexOf", e);
  },
  map(e, t) {
    return pn(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Os(this, "pop");
  },
  push(...e) {
    return Os(this, "push", e);
  },
  reduce(e, ...t) {
    return ya(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return ya(this, "reduceRight", e, t);
  },
  shift() {
    return Os(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return pn(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Os(this, "splice", e);
  },
  toReversed() {
    return us(this).toReversed();
  },
  toSorted(e) {
    return us(this).toSorted(e);
  },
  toSpliced(...e) {
    return us(this).toSpliced(...e);
  },
  unshift(...e) {
    return Os(this, "unshift", e);
  },
  values() {
    return Er(this, "values", xt);
  }
};
function Er(e, t, n) {
  const s = er(e), i = s[t]();
  return s !== e && !Gt(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.value && (r.value = n(r.value)), r;
  }), i;
}
const Zu = Array.prototype;
function pn(e, t, n, s, i, r) {
  const o = er(e), a = o !== e && !Gt(e), l = o[t];
  if (l !== Zu[t]) {
    const w = l.apply(e, r);
    return a ? xt(w) : w;
  }
  let d = n;
  o !== e && (a ? d = function(w, m) {
    return n.call(this, xt(w), m, e);
  } : n.length > 2 && (d = function(w, m) {
    return n.call(this, w, m, e);
  }));
  const u = l.call(o, d, s);
  return a && i ? i(u) : u;
}
function ya(e, t, n, s) {
  const i = er(e);
  let r = n;
  return i !== e && (Gt(e) ? n.length > 3 && (r = function(o, a, l) {
    return n.call(this, o, a, l, e);
  }) : r = function(o, a, l) {
    return n.call(this, o, xt(a), l, e);
  }), i[t](r, ...s);
}
function Cr(e, t, n) {
  const s = je(e);
  St(s, "iterate", si);
  const i = s[t](...n);
  return (i === -1 || i === !1) && Ao(n[0]) ? (n[0] = je(n[0]), s[t](...n)) : i;
}
function Os(e, t, n = []) {
  kn(), vo();
  const s = je(e)[t].apply(e, n);
  return yo(), xn(), s;
}
const Ju = /* @__PURE__ */ po("__proto__,__v_isRef,__isVue"), Pl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Bn)
);
function Qu(e) {
  Bn(e) || (e = String(e));
  const t = je(this);
  return St(t, "has", e), t.hasOwnProperty(e);
}
class Ml {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return s === (i ? r ? uf : $l : r ? Bl : Dl).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = me(t);
    if (!i) {
      let l;
      if (o && (l = Xu[n]))
        return l;
      if (n === "hasOwnProperty")
        return Qu;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Tt(t) ? t : s
    );
    return (Bn(n) ? Pl.has(n) : Ju(n)) || (i || St(t, "get", n), r) ? a : Tt(a) ? o && _o(n) ? a : a.value : at(a) ? i ? Ul(a) : tr(a) : a;
  }
}
class Fl extends Ml {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    if (!this._isShallow) {
      const l = Fn(r);
      if (!Gt(s) && !Fn(s) && (r = je(r), s = je(s)), !me(t) && Tt(r) && !Tt(s))
        return l ? !1 : (r.value = s, !0);
    }
    const o = me(t) && _o(n) ? Number(n) < t.length : Ve(t, n), a = Reflect.set(
      t,
      n,
      s,
      Tt(t) ? t : i
    );
    return t === je(i) && (o ? Nn(s, r) && vn(t, "set", n, s) : vn(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = Ve(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && vn(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Bn(n) || !Pl.has(n)) && St(t, "has", n), s;
  }
  ownKeys(t) {
    return St(
      t,
      "iterate",
      me(t) ? "length" : Qn
    ), Reflect.ownKeys(t);
  }
}
class ef extends Ml {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const tf = /* @__PURE__ */ new Fl(), nf = /* @__PURE__ */ new ef(), sf = /* @__PURE__ */ new Fl(!0);
const Yr = (e) => e, _i = (e) => Reflect.getPrototypeOf(e);
function rf(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = je(i), o = ps(r), a = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, d = i[e](...s), u = n ? Yr : t ? $i : xt;
    return !t && St(
      r,
      "iterate",
      l ? Gr : Qn
    ), {
      // iterator protocol
      next() {
        const { value: w, done: m } = d.next();
        return m ? { value: w, done: m } : {
          value: a ? [u(w[0]), u(w[1])] : u(w),
          done: m
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function vi(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function of(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, o = je(r), a = je(i);
      e || (Nn(i, a) && St(o, "get", i), St(o, "get", a));
      const { has: l } = _i(o), d = t ? Yr : e ? $i : xt;
      if (l.call(o, i))
        return d(r.get(i));
      if (l.call(o, a))
        return d(r.get(a));
      r !== o && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && St(je(i), "iterate", Qn), Reflect.get(i, "size", i);
    },
    has(i) {
      const r = this.__v_raw, o = je(r), a = je(i);
      return e || (Nn(i, a) && St(o, "has", i), St(o, "has", a)), i === a ? r.has(i) : r.has(i) || r.has(a);
    },
    forEach(i, r) {
      const o = this, a = o.__v_raw, l = je(a), d = t ? Yr : e ? $i : xt;
      return !e && St(l, "iterate", Qn), a.forEach((u, w) => i.call(r, d(u), d(w), o));
    }
  };
  return Et(
    n,
    e ? {
      add: vi("add"),
      set: vi("set"),
      delete: vi("delete"),
      clear: vi("clear")
    } : {
      add(i) {
        !t && !Gt(i) && !Fn(i) && (i = je(i));
        const r = je(this);
        return _i(r).has.call(r, i) || (r.add(i), vn(r, "add", i, i)), this;
      },
      set(i, r) {
        !t && !Gt(r) && !Fn(r) && (r = je(r));
        const o = je(this), { has: a, get: l } = _i(o);
        let d = a.call(o, i);
        d || (i = je(i), d = a.call(o, i));
        const u = l.call(o, i);
        return o.set(i, r), d ? Nn(r, u) && vn(o, "set", i, r) : vn(o, "add", i, r), this;
      },
      delete(i) {
        const r = je(this), { has: o, get: a } = _i(r);
        let l = o.call(r, i);
        l || (i = je(i), l = o.call(r, i)), a && a.call(r, i);
        const d = r.delete(i);
        return l && vn(r, "delete", i, void 0), d;
      },
      clear() {
        const i = je(this), r = i.size !== 0, o = i.clear();
        return r && vn(
          i,
          "clear",
          void 0,
          void 0
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = rf(i, e, t);
  }), n;
}
function ko(e, t) {
  const n = of(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    Ve(n, i) && i in s ? n : s,
    i,
    r
  );
}
const af = {
  get: /* @__PURE__ */ ko(!1, !1)
}, lf = {
  get: /* @__PURE__ */ ko(!1, !0)
}, cf = {
  get: /* @__PURE__ */ ko(!0, !1)
};
const Dl = /* @__PURE__ */ new WeakMap(), Bl = /* @__PURE__ */ new WeakMap(), $l = /* @__PURE__ */ new WeakMap(), uf = /* @__PURE__ */ new WeakMap();
function ff(e) {
  switch (e) {
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
function hf(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ff(Du(e));
}
function tr(e) {
  return Fn(e) ? e : xo(
    e,
    !1,
    tf,
    af,
    Dl
  );
}
function df(e) {
  return xo(
    e,
    !1,
    sf,
    lf,
    Bl
  );
}
function Ul(e) {
  return xo(
    e,
    !0,
    nf,
    cf,
    $l
  );
}
function xo(e, t, n, s, i) {
  if (!at(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = hf(e);
  if (r === 0)
    return e;
  const o = i.get(e);
  if (o)
    return o;
  const a = new Proxy(
    e,
    r === 2 ? s : n
  );
  return i.set(e, a), a;
}
function gs(e) {
  return Fn(e) ? gs(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Fn(e) {
  return !!(e && e.__v_isReadonly);
}
function Gt(e) {
  return !!(e && e.__v_isShallow);
}
function Ao(e) {
  return e ? !!e.__v_raw : !1;
}
function je(e) {
  const t = e && e.__v_raw;
  return t ? je(t) : e;
}
function pf(e) {
  return !Ve(e, "__v_skip") && Object.isExtensible(e) && Wr(e, "__v_skip", !0), e;
}
const xt = (e) => at(e) ? tr(e) : e, $i = (e) => at(e) ? Ul(e) : e;
function Tt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function re(e) {
  return gf(e, !1);
}
function gf(e, t) {
  return Tt(e) ? e : new mf(e, t);
}
class mf {
  constructor(t, n) {
    this.dep = new wo(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : je(t), this._value = n ? t : xt(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || Gt(t) || Fn(t);
    t = s ? t : je(t), Nn(t, n) && (this._rawValue = t, this._value = s ? t : xt(t), this.dep.trigger());
  }
}
function E(e) {
  return Tt(e) ? e.value : e;
}
const _f = {
  get: (e, t, n) => t === "__v_raw" ? e : E(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return Tt(i) && !Tt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function zl(e) {
  return gs(e) ? e : new Proxy(e, _f);
}
class vf {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new wo(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ni - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    rt !== this)
      return Cl(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Ll(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function yf(e, t, n = !1) {
  let s, i;
  return ye(e) ? s = e : (s = e.get, i = e.set), new vf(s, i, n);
}
const yi = {}, Ui = /* @__PURE__ */ new WeakMap();
let Zn;
function bf(e, t = !1, n = Zn) {
  if (n) {
    let s = Ui.get(n);
    s || Ui.set(n, s = []), s.push(e);
  }
}
function wf(e, t, n = tt) {
  const { immediate: s, deep: i, once: r, scheduler: o, augmentJob: a, call: l } = n, d = (S) => i ? S : Gt(S) || i === !1 || i === 0 ? yn(S, 1) : yn(S);
  let u, w, m, N, M = !1, G = !1;
  if (Tt(e) ? (w = () => e.value, M = Gt(e)) : gs(e) ? (w = () => d(e), M = !0) : me(e) ? (G = !0, M = e.some((S) => gs(S) || Gt(S)), w = () => e.map((S) => {
    if (Tt(S))
      return S.value;
    if (gs(S))
      return d(S);
    if (ye(S))
      return l ? l(S, 2) : S();
  })) : ye(e) ? t ? w = l ? () => l(e, 2) : e : w = () => {
    if (m) {
      kn();
      try {
        m();
      } finally {
        xn();
      }
    }
    const S = Zn;
    Zn = u;
    try {
      return l ? l(e, 3, [N]) : e(N);
    } finally {
      Zn = S;
    }
  } : w = ln, t && i) {
    const S = w, L = i === !0 ? 1 / 0 : i;
    w = () => yn(S(), L);
  }
  const Fe = Ku(), de = () => {
    u.stop(), Fe && Fe.active && mo(Fe.effects, u);
  };
  if (r && t) {
    const S = t;
    t = (...L) => {
      S(...L), de();
    };
  }
  let _e = G ? new Array(e.length).fill(yi) : yi;
  const ke = (S) => {
    if (!(!(u.flags & 1) || !u.dirty && !S))
      if (t) {
        const L = u.run();
        if (i || M || (G ? L.some((V, Y) => Nn(V, _e[Y])) : Nn(L, _e))) {
          m && m();
          const V = Zn;
          Zn = u;
          try {
            const Y = [
              L,
              // pass undefined as the old value when it's changed for the first time
              _e === yi ? void 0 : G && _e[0] === yi ? [] : _e,
              N
            ];
            _e = L, l ? l(t, 3, Y) : (
              // @ts-expect-error
              t(...Y)
            );
          } finally {
            Zn = V;
          }
        }
      } else
        u.run();
  };
  return a && a(ke), u = new Tl(w), u.scheduler = o ? () => o(ke, !1) : ke, N = (S) => bf(S, !1, u), m = u.onStop = () => {
    const S = Ui.get(u);
    if (S) {
      if (l)
        l(S, 4);
      else
        for (const L of S) L();
      Ui.delete(u);
    }
  }, t ? s ? ke(!0) : _e = u.run() : o ? o(ke.bind(null, !0), !0) : u.run(), de.pause = u.pause.bind(u), de.resume = u.resume.bind(u), de.stop = de, de;
}
function yn(e, t = 1 / 0, n) {
  if (t <= 0 || !at(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Set(), n.has(e)))
    return e;
  if (n.add(e), t--, Tt(e))
    yn(e.value, t, n);
  else if (me(e))
    for (let s = 0; s < e.length; s++)
      yn(e[s], t, n);
  else if (vl(e) || ps(e))
    e.forEach((s) => {
      yn(s, t, n);
    });
  else if (wl(e)) {
    for (const s in e)
      yn(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && yn(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function ai(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    nr(i, t, n);
  }
}
function fn(e, t, n, s) {
  if (ye(e)) {
    const i = ai(e, t, n, s);
    return i && yl(i) && i.catch((r) => {
      nr(r, t, n);
    }), i;
  }
  if (me(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(fn(e[r], t, n, s));
    return i;
  }
}
function nr(e, t, n, s = !0) {
  const i = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: o } = t && t.appContext.config || tt;
  if (t) {
    let a = t.parent;
    const l = t.proxy, d = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const u = a.ec;
      if (u) {
        for (let w = 0; w < u.length; w++)
          if (u[w](e, l, d) === !1)
            return;
      }
      a = a.parent;
    }
    if (r) {
      kn(), ai(r, null, 10, [
        e,
        l,
        d
      ]), xn();
      return;
    }
  }
  kf(e, n, i, s, o);
}
function kf(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const Lt = [];
let on = -1;
const ms = [];
let Ln = null, fs = 0;
const Hl = /* @__PURE__ */ Promise.resolve();
let zi = null;
function _s(e) {
  const t = zi || Hl;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function xf(e) {
  let t = on + 1, n = Lt.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = Lt[s], r = ii(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function So(e) {
  if (!(e.flags & 1)) {
    const t = ii(e), n = Lt[Lt.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= ii(n) ? Lt.push(e) : Lt.splice(xf(t), 0, e), e.flags |= 1, ql();
  }
}
function ql() {
  zi || (zi = Hl.then(jl));
}
function Af(e) {
  me(e) ? ms.push(...e) : Ln && e.id === -1 ? Ln.splice(fs + 1, 0, e) : e.flags & 1 || (ms.push(e), e.flags |= 1), ql();
}
function ba(e, t, n = on + 1) {
  for (; n < Lt.length; n++) {
    const s = Lt[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      Lt.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Wl(e) {
  if (ms.length) {
    const t = [...new Set(ms)].sort(
      (n, s) => ii(n) - ii(s)
    );
    if (ms.length = 0, Ln) {
      Ln.push(...t);
      return;
    }
    for (Ln = t, fs = 0; fs < Ln.length; fs++) {
      const n = Ln[fs];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    Ln = null, fs = 0;
  }
}
const ii = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function jl(e) {
  try {
    for (on = 0; on < Lt.length; on++) {
      const t = Lt[on];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), ai(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; on < Lt.length; on++) {
      const t = Lt[on];
      t && (t.flags &= -2);
    }
    on = -1, Lt.length = 0, Wl(), zi = null, (Lt.length || ms.length) && jl();
  }
}
let Kt = null, Vl = null;
function Hi(e) {
  const t = Kt;
  return Kt = e, Vl = e && e.type.__scopeId || null, t;
}
function Sf(e, t = Kt, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && Ra(-1);
    const r = Hi(t);
    let o;
    try {
      o = e(...i);
    } finally {
      Hi(r), s._d && Ra(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function In(e, t) {
  if (Kt === null)
    return e;
  const n = ar(Kt), s = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [r, o, a, l = tt] = t[i];
    r && (ye(r) && (r = {
      mounted: r,
      updated: r
    }), r.deep && yn(o), s.push({
      dir: r,
      instance: n,
      value: o,
      oldValue: void 0,
      arg: a,
      modifiers: l
    }));
  }
  return e;
}
function Kn(e, t, n, s) {
  const i = e.dirs, r = t && t.dirs;
  for (let o = 0; o < i.length; o++) {
    const a = i[o];
    r && (a.oldValue = r[o].value);
    let l = a.dir[s];
    l && (kn(), fn(l, n, 8, [
      e.el,
      a,
      e,
      t
    ]), xn());
  }
}
const Tf = Symbol("_vte"), Ef = (e) => e.__isTeleport;
function To(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, To(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Kl(e, t) {
  return ye(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Et({ name: e.name }, t, { setup: e })
  ) : e;
}
function Gl(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Zs(e, t, n, s, i = !1) {
  if (me(e)) {
    e.forEach(
      (M, G) => Zs(
        M,
        t && (me(t) ? t[G] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (Js(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Zs(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? ar(s.component) : s.el, o = i ? null : r, { i: a, r: l } = e, d = t && t.r, u = a.refs === tt ? a.refs = {} : a.refs, w = a.setupState, m = je(w), N = w === tt ? () => !1 : (M) => Ve(m, M);
  if (d != null && d !== l && (ht(d) ? (u[d] = null, N(d) && (w[d] = null)) : Tt(d) && (d.value = null)), ye(l))
    ai(l, a, 12, [o, u]);
  else {
    const M = ht(l), G = Tt(l);
    if (M || G) {
      const Fe = () => {
        if (e.f) {
          const de = M ? N(l) ? w[l] : u[l] : l.value;
          i ? me(de) && mo(de, r) : me(de) ? de.includes(r) || de.push(r) : M ? (u[l] = [r], N(l) && (w[l] = u[l])) : (l.value = [r], e.k && (u[e.k] = l.value));
        } else M ? (u[l] = o, N(l) && (w[l] = o)) : G && (l.value = o, e.k && (u[e.k] = o));
      };
      o ? (Fe.id = -1, Ht(Fe, n)) : Fe();
    }
  }
}
Qi().requestIdleCallback;
Qi().cancelIdleCallback;
const Js = (e) => !!e.type.__asyncLoader, Yl = (e) => e.type.__isKeepAlive;
function Cf(e, t) {
  Xl(e, "a", t);
}
function Rf(e, t) {
  Xl(e, "da", t);
}
function Xl(e, t, n = Ot) {
  const s = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (sr(t, s, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      Yl(i.parent.vnode) && If(s, t, n, i), i = i.parent;
  }
}
function If(e, t, n, s) {
  const i = sr(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  li(() => {
    mo(s[t], i);
  }, n);
}
function sr(e, t, n = Ot, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...o) => {
      kn();
      const a = ci(n), l = fn(t, n, e, o);
      return a(), xn(), l;
    });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const An = (e) => (t, n = Ot) => {
  (!oi || e === "sp") && sr(e, (...s) => t(...s), n);
}, Lf = An("bm"), ir = An("m"), Of = An(
  "bu"
), Nf = An("u"), Zl = An(
  "bum"
), li = An("um"), Pf = An(
  "sp"
), Mf = An("rtg"), Ff = An("rtc");
function Df(e, t = Ot) {
  sr("ec", e, t);
}
const Bf = Symbol.for("v-ndc");
function kt(e, t, n, s) {
  let i;
  const r = n, o = me(e);
  if (o || ht(e)) {
    const a = o && gs(e);
    let l = !1, d = !1;
    a && (l = !Gt(e), d = Fn(e), e = er(e)), i = new Array(e.length);
    for (let u = 0, w = e.length; u < w; u++)
      i[u] = t(
        l ? d ? $i(xt(e[u])) : xt(e[u]) : e[u],
        u,
        void 0,
        r
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let a = 0; a < e; a++)
      i[a] = t(a + 1, a, void 0, r);
  } else if (at(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (a, l) => t(a, l, void 0, r)
      );
    else {
      const a = Object.keys(e);
      i = new Array(a.length);
      for (let l = 0, d = a.length; l < d; l++) {
        const u = a[l];
        i[l] = t(e[u], u, l, r);
      }
    }
  else
    i = [];
  return i;
}
const Xr = (e) => e ? yc(e) ? ar(e) : Xr(e.parent) : null, Qs = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Et(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Xr(e.parent),
    $root: (e) => Xr(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Ql(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      So(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = _s.bind(e.proxy)),
    $watch: (e) => oh.bind(e)
  })
), Rr = (e, t) => e !== tt && !e.__isScriptSetup && Ve(e, t), $f = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: r, accessCache: o, type: a, appContext: l } = e;
    let d;
    if (t[0] !== "$") {
      const N = o[t];
      if (N !== void 0)
        switch (N) {
          case 1:
            return s[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (Rr(s, t))
          return o[t] = 1, s[t];
        if (i !== tt && Ve(i, t))
          return o[t] = 2, i[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (d = e.propsOptions[0]) && Ve(d, t)
        )
          return o[t] = 3, r[t];
        if (n !== tt && Ve(n, t))
          return o[t] = 4, n[t];
        Zr && (o[t] = 0);
      }
    }
    const u = Qs[t];
    let w, m;
    if (u)
      return t === "$attrs" && St(e.attrs, "get", ""), u(e);
    if (
      // css module (injected by vue-loader)
      (w = a.__cssModules) && (w = w[t])
    )
      return w;
    if (n !== tt && Ve(n, t))
      return o[t] = 4, n[t];
    if (
      // global properties
      m = l.config.globalProperties, Ve(m, t)
    )
      return m[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return Rr(i, t) ? (i[t] = n, !0) : s !== tt && Ve(s, t) ? (s[t] = n, !0) : Ve(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, propsOptions: r }
  }, o) {
    let a;
    return !!n[o] || e !== tt && Ve(e, o) || Rr(t, o) || (a = r[0]) && Ve(a, o) || Ve(s, o) || Ve(Qs, o) || Ve(i.config.globalProperties, o);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : Ve(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function wa(e) {
  return me(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Zr = !0;
function Uf(e) {
  const t = Ql(e), n = e.proxy, s = e.ctx;
  Zr = !1, t.beforeCreate && ka(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: r,
    methods: o,
    watch: a,
    provide: l,
    inject: d,
    // lifecycle
    created: u,
    beforeMount: w,
    mounted: m,
    beforeUpdate: N,
    updated: M,
    activated: G,
    deactivated: Fe,
    beforeDestroy: de,
    beforeUnmount: _e,
    destroyed: ke,
    unmounted: S,
    render: L,
    renderTracked: V,
    renderTriggered: Y,
    errorCaptured: Se,
    serverPrefetch: He,
    // public API
    expose: Xe,
    inheritAttrs: Ce,
    // assets
    components: be,
    directives: Je,
    filters: nt
  } = t;
  if (d && zf(d, s, null), o)
    for (const ge in o) {
      const le = o[ge];
      ye(le) && (s[ge] = le.bind(n));
    }
  if (i) {
    const ge = i.call(n, n);
    at(ge) && (e.data = tr(ge));
  }
  if (Zr = !0, r)
    for (const ge in r) {
      const le = r[ge], Te = ye(le) ? le.bind(n, n) : ye(le.get) ? le.get.bind(n, n) : ln, st = !ye(le) && ye(le.set) ? le.set.bind(n) : ln, ae = fe({
        get: Te,
        set: st
      });
      Object.defineProperty(s, ge, {
        enumerable: !0,
        configurable: !0,
        get: () => ae.value,
        set: (De) => ae.value = De
      });
    }
  if (a)
    for (const ge in a)
      Jl(a[ge], s, n, ge);
  if (l) {
    const ge = ye(l) ? l.call(n) : l;
    Reflect.ownKeys(ge).forEach((le) => {
      Kf(le, ge[le]);
    });
  }
  u && ka(u, e, "c");
  function he(ge, le) {
    me(le) ? le.forEach((Te) => ge(Te.bind(n))) : le && ge(le.bind(n));
  }
  if (he(Lf, w), he(ir, m), he(Of, N), he(Nf, M), he(Cf, G), he(Rf, Fe), he(Df, Se), he(Ff, V), he(Mf, Y), he(Zl, _e), he(li, S), he(Pf, He), me(Xe))
    if (Xe.length) {
      const ge = e.exposed || (e.exposed = {});
      Xe.forEach((le) => {
        Object.defineProperty(ge, le, {
          get: () => n[le],
          set: (Te) => n[le] = Te,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  L && e.render === ln && (e.render = L), Ce != null && (e.inheritAttrs = Ce), be && (e.components = be), Je && (e.directives = Je), He && Gl(e);
}
function zf(e, t, n = ln) {
  me(e) && (e = Jr(e));
  for (const s in e) {
    const i = e[s];
    let r;
    at(i) ? "default" in i ? r = Ti(
      i.from || s,
      i.default,
      !0
    ) : r = Ti(i.from || s) : r = Ti(i), Tt(r) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (o) => r.value = o
    }) : t[s] = r;
  }
}
function ka(e, t, n) {
  fn(
    me(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Jl(e, t, n, s) {
  let i = s.includes(".") ? hc(n, s) : () => n[s];
  if (ht(e)) {
    const r = t[e];
    ye(r) && Vt(i, r);
  } else if (ye(e))
    Vt(i, e.bind(n));
  else if (at(e))
    if (me(e))
      e.forEach((r) => Jl(r, t, n, s));
    else {
      const r = ye(e.handler) ? e.handler.bind(n) : t[e.handler];
      ye(r) && Vt(i, r, e);
    }
}
function Ql(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: i,
    optionsCache: r,
    config: { optionMergeStrategies: o }
  } = e.appContext, a = r.get(t);
  let l;
  return a ? l = a : !i.length && !n && !s ? l = t : (l = {}, i.length && i.forEach(
    (d) => qi(l, d, o, !0)
  ), qi(l, t, o)), at(t) && r.set(t, l), l;
}
function qi(e, t, n, s = !1) {
  const { mixins: i, extends: r } = t;
  r && qi(e, r, n, !0), i && i.forEach(
    (o) => qi(e, o, n, !0)
  );
  for (const o in t)
    if (!(s && o === "expose")) {
      const a = Hf[o] || n && n[o];
      e[o] = a ? a(e[o], t[o]) : t[o];
    }
  return e;
}
const Hf = {
  data: xa,
  props: Aa,
  emits: Aa,
  // objects
  methods: js,
  computed: js,
  // lifecycle
  beforeCreate: It,
  created: It,
  beforeMount: It,
  mounted: It,
  beforeUpdate: It,
  updated: It,
  beforeDestroy: It,
  beforeUnmount: It,
  destroyed: It,
  unmounted: It,
  activated: It,
  deactivated: It,
  errorCaptured: It,
  serverPrefetch: It,
  // assets
  components: js,
  directives: js,
  // watch
  watch: Wf,
  // provide / inject
  provide: xa,
  inject: qf
};
function xa(e, t) {
  return t ? e ? function() {
    return Et(
      ye(e) ? e.call(this, this) : e,
      ye(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function qf(e, t) {
  return js(Jr(e), Jr(t));
}
function Jr(e) {
  if (me(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function It(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function js(e, t) {
  return e ? Et(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Aa(e, t) {
  return e ? me(e) && me(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Et(
    /* @__PURE__ */ Object.create(null),
    wa(e),
    wa(t ?? {})
  ) : t;
}
function Wf(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Et(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = It(e[s], t[s]);
  return n;
}
function ec() {
  return {
    app: null,
    config: {
      isNativeTag: Mu,
      performance: !1,
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
let jf = 0;
function Vf(e, t) {
  return function(s, i = null) {
    ye(s) || (s = Et({}, s)), i != null && !at(i) && (i = null);
    const r = ec(), o = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const d = r.app = {
      _uid: jf++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: Eh,
      get config() {
        return r.config;
      },
      set config(u) {
      },
      use(u, ...w) {
        return o.has(u) || (u && ye(u.install) ? (o.add(u), u.install(d, ...w)) : ye(u) && (o.add(u), u(d, ...w))), d;
      },
      mixin(u) {
        return r.mixins.includes(u) || r.mixins.push(u), d;
      },
      component(u, w) {
        return w ? (r.components[u] = w, d) : r.components[u];
      },
      directive(u, w) {
        return w ? (r.directives[u] = w, d) : r.directives[u];
      },
      mount(u, w, m) {
        if (!l) {
          const N = d._ceVNode || cn(s, i);
          return N.appContext = r, m === !0 ? m = "svg" : m === !1 && (m = void 0), e(N, u, m), l = !0, d._container = u, u.__vue_app__ = d, ar(N.component);
        }
      },
      onUnmount(u) {
        a.push(u);
      },
      unmount() {
        l && (fn(
          a,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(u, w) {
        return r.provides[u] = w, d;
      },
      runWithContext(u) {
        const w = vs;
        vs = d;
        try {
          return u();
        } finally {
          vs = w;
        }
      }
    };
    return d;
  };
}
let vs = null;
function Kf(e, t) {
  if (Ot) {
    let n = Ot.provides;
    const s = Ot.parent && Ot.parent.provides;
    s === n && (n = Ot.provides = Object.create(s)), n[e] = t;
  }
}
function Ti(e, t, n = !1) {
  const s = wh();
  if (s || vs) {
    let i = vs ? vs._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && ye(t) ? t.call(s && s.proxy) : t;
  }
}
const tc = {}, nc = () => Object.create(tc), sc = (e) => Object.getPrototypeOf(e) === tc;
function Gf(e, t, n, s = !1) {
  const i = {}, r = nc();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), ic(e, t, i, r);
  for (const o in e.propsOptions[0])
    o in i || (i[o] = void 0);
  n ? e.props = s ? i : df(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function Yf(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: o }
  } = e, a = je(i), [l] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const u = e.vnode.dynamicProps;
      for (let w = 0; w < u.length; w++) {
        let m = u[w];
        if (rr(e.emitsOptions, m))
          continue;
        const N = t[m];
        if (l)
          if (Ve(r, m))
            N !== r[m] && (r[m] = N, d = !0);
          else {
            const M = Mn(m);
            i[M] = Qr(
              l,
              a,
              M,
              N,
              e,
              !1
            );
          }
        else
          N !== r[m] && (r[m] = N, d = !0);
      }
    }
  } else {
    ic(e, t, i, r) && (d = !0);
    let u;
    for (const w in a)
      (!t || // for camelCase
      !Ve(t, w) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = $n(w)) === w || !Ve(t, u))) && (l ? n && // for camelCase
      (n[w] !== void 0 || // for kebab-case
      n[u] !== void 0) && (i[w] = Qr(
        l,
        a,
        w,
        void 0,
        e,
        !0
      )) : delete i[w]);
    if (r !== a)
      for (const w in r)
        (!t || !Ve(t, w)) && (delete r[w], d = !0);
  }
  d && vn(e.attrs, "set", "");
}
function ic(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let o = !1, a;
  if (t)
    for (let l in t) {
      if (Gs(l))
        continue;
      const d = t[l];
      let u;
      i && Ve(i, u = Mn(l)) ? !r || !r.includes(u) ? n[u] = d : (a || (a = {}))[u] = d : rr(e.emitsOptions, l) || (!(l in s) || d !== s[l]) && (s[l] = d, o = !0);
    }
  if (r) {
    const l = je(n), d = a || tt;
    for (let u = 0; u < r.length; u++) {
      const w = r[u];
      n[w] = Qr(
        i,
        l,
        w,
        d[w],
        e,
        !Ve(d, w)
      );
    }
  }
  return o;
}
function Qr(e, t, n, s, i, r) {
  const o = e[n];
  if (o != null) {
    const a = Ve(o, "default");
    if (a && s === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && ye(l)) {
        const { propsDefaults: d } = i;
        if (n in d)
          s = d[n];
        else {
          const u = ci(i);
          s = d[n] = l.call(
            null,
            t
          ), u();
        }
      } else
        s = l;
      i.ce && i.ce._setProp(n, s);
    }
    o[
      0
      /* shouldCast */
    ] && (r && !a ? s = !1 : o[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === $n(n)) && (s = !0));
  }
  return s;
}
const Xf = /* @__PURE__ */ new WeakMap();
function rc(e, t, n = !1) {
  const s = n ? Xf : t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, o = {}, a = [];
  let l = !1;
  if (!ye(e)) {
    const u = (w) => {
      l = !0;
      const [m, N] = rc(w, t, !0);
      Et(o, m), N && a.push(...N);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!r && !l)
    return at(e) && s.set(e, ds), ds;
  if (me(r))
    for (let u = 0; u < r.length; u++) {
      const w = Mn(r[u]);
      Sa(w) && (o[w] = tt);
    }
  else if (r)
    for (const u in r) {
      const w = Mn(u);
      if (Sa(w)) {
        const m = r[u], N = o[w] = me(m) || ye(m) ? { type: m } : Et({}, m), M = N.type;
        let G = !1, Fe = !0;
        if (me(M))
          for (let de = 0; de < M.length; ++de) {
            const _e = M[de], ke = ye(_e) && _e.name;
            if (ke === "Boolean") {
              G = !0;
              break;
            } else ke === "String" && (Fe = !1);
          }
        else
          G = ye(M) && M.name === "Boolean";
        N[
          0
          /* shouldCast */
        ] = G, N[
          1
          /* shouldCastTrue */
        ] = Fe, (G || Ve(N, "default")) && a.push(w);
      }
    }
  const d = [o, a];
  return at(e) && s.set(e, d), d;
}
function Sa(e) {
  return e[0] !== "$" && !Gs(e);
}
const Eo = (e) => e === "_" || e === "__" || e === "_ctx" || e === "$stable", Co = (e) => me(e) ? e.map(an) : [an(e)], Zf = (e, t, n) => {
  if (t._n)
    return t;
  const s = Sf((...i) => Co(t(...i)), n);
  return s._c = !1, s;
}, oc = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (Eo(i)) continue;
    const r = e[i];
    if (ye(r))
      t[i] = Zf(i, r, s);
    else if (r != null) {
      const o = Co(r);
      t[i] = () => o;
    }
  }
}, ac = (e, t) => {
  const n = Co(t);
  e.slots.default = () => n;
}, lc = (e, t, n) => {
  for (const s in t)
    (n || !Eo(s)) && (e[s] = t[s]);
}, Jf = (e, t, n) => {
  const s = e.slots = nc();
  if (e.vnode.shapeFlag & 32) {
    const i = t.__;
    i && Wr(s, "__", i, !0);
    const r = t._;
    r ? (lc(s, t, n), n && Wr(s, "_", r, !0)) : oc(t, s);
  } else t && ac(e, t);
}, Qf = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, o = tt;
  if (s.shapeFlag & 32) {
    const a = t._;
    a ? n && a === 1 ? r = !1 : lc(i, t, n) : (r = !t.$stable, oc(t, i)), o = t;
  } else t && (ac(e, t), o = { default: 1 });
  if (r)
    for (const a in i)
      !Eo(a) && o[a] == null && delete i[a];
}, Ht = dh;
function eh(e) {
  return th(e);
}
function th(e, t) {
  const n = Qi();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: r,
    createElement: o,
    createText: a,
    createComment: l,
    setText: d,
    setElementText: u,
    parentNode: w,
    nextSibling: m,
    setScopeId: N = ln,
    insertStaticContent: M
  } = e, G = (g, _, A, F = null, R = null, I = null, B = void 0, z = null, U = !!_.dynamicChildren) => {
    if (g === _)
      return;
    g && !Ns(g, _) && (F = Me(g), De(g, R, I, !0), g = null), _.patchFlag === -2 && (U = !1, _.dynamicChildren = null);
    const { type: P, ref: X, shapeFlag: H } = _;
    switch (P) {
      case or:
        Fe(g, _, A, F);
        break;
      case Dn:
        de(g, _, A, F);
        break;
      case Ei:
        g == null && _e(_, A, F, B);
        break;
      case Ue:
        be(
          g,
          _,
          A,
          F,
          R,
          I,
          B,
          z,
          U
        );
        break;
      default:
        H & 1 ? L(
          g,
          _,
          A,
          F,
          R,
          I,
          B,
          z,
          U
        ) : H & 6 ? Je(
          g,
          _,
          A,
          F,
          R,
          I,
          B,
          z,
          U
        ) : (H & 64 || H & 128) && P.process(
          g,
          _,
          A,
          F,
          R,
          I,
          B,
          z,
          U,
          K
        );
    }
    X != null && R ? Zs(X, g && g.ref, I, _ || g, !_) : X == null && g && g.ref != null && Zs(g.ref, null, I, g, !0);
  }, Fe = (g, _, A, F) => {
    if (g == null)
      s(
        _.el = a(_.children),
        A,
        F
      );
    else {
      const R = _.el = g.el;
      _.children !== g.children && d(R, _.children);
    }
  }, de = (g, _, A, F) => {
    g == null ? s(
      _.el = l(_.children || ""),
      A,
      F
    ) : _.el = g.el;
  }, _e = (g, _, A, F) => {
    [g.el, g.anchor] = M(
      g.children,
      _,
      A,
      F,
      g.el,
      g.anchor
    );
  }, ke = ({ el: g, anchor: _ }, A, F) => {
    let R;
    for (; g && g !== _; )
      R = m(g), s(g, A, F), g = R;
    s(_, A, F);
  }, S = ({ el: g, anchor: _ }) => {
    let A;
    for (; g && g !== _; )
      A = m(g), i(g), g = A;
    i(_);
  }, L = (g, _, A, F, R, I, B, z, U) => {
    _.type === "svg" ? B = "svg" : _.type === "math" && (B = "mathml"), g == null ? V(
      _,
      A,
      F,
      R,
      I,
      B,
      z,
      U
    ) : He(
      g,
      _,
      R,
      I,
      B,
      z,
      U
    );
  }, V = (g, _, A, F, R, I, B, z) => {
    let U, P;
    const { props: X, shapeFlag: H, transition: W, dirs: te } = g;
    if (U = g.el = o(
      g.type,
      I,
      X && X.is,
      X
    ), H & 8 ? u(U, g.children) : H & 16 && Se(
      g.children,
      U,
      null,
      F,
      R,
      Ir(g, I),
      B,
      z
    ), te && Kn(g, null, F, "created"), Y(U, g, g.scopeId, B, F), X) {
      for (const xe in X)
        xe !== "value" && !Gs(xe) && r(U, xe, null, X[xe], I, F);
      "value" in X && r(U, "value", null, X.value, I), (P = X.onVnodeBeforeMount) && sn(P, F, g);
    }
    te && Kn(g, null, F, "beforeMount");
    const J = nh(R, W);
    J && W.beforeEnter(U), s(U, _, A), ((P = X && X.onVnodeMounted) || J || te) && Ht(() => {
      P && sn(P, F, g), J && W.enter(U), te && Kn(g, null, F, "mounted");
    }, R);
  }, Y = (g, _, A, F, R) => {
    if (A && N(g, A), F)
      for (let I = 0; I < F.length; I++)
        N(g, F[I]);
    if (R) {
      let I = R.subTree;
      if (_ === I || pc(I.type) && (I.ssContent === _ || I.ssFallback === _)) {
        const B = R.vnode;
        Y(
          g,
          B,
          B.scopeId,
          B.slotScopeIds,
          R.parent
        );
      }
    }
  }, Se = (g, _, A, F, R, I, B, z, U = 0) => {
    for (let P = U; P < g.length; P++) {
      const X = g[P] = z ? On(g[P]) : an(g[P]);
      G(
        null,
        X,
        _,
        A,
        F,
        R,
        I,
        B,
        z
      );
    }
  }, He = (g, _, A, F, R, I, B) => {
    const z = _.el = g.el;
    let { patchFlag: U, dynamicChildren: P, dirs: X } = _;
    U |= g.patchFlag & 16;
    const H = g.props || tt, W = _.props || tt;
    let te;
    if (A && Gn(A, !1), (te = W.onVnodeBeforeUpdate) && sn(te, A, _, g), X && Kn(_, g, A, "beforeUpdate"), A && Gn(A, !0), (H.innerHTML && W.innerHTML == null || H.textContent && W.textContent == null) && u(z, ""), P ? Xe(
      g.dynamicChildren,
      P,
      z,
      A,
      F,
      Ir(_, R),
      I
    ) : B || le(
      g,
      _,
      z,
      null,
      A,
      F,
      Ir(_, R),
      I,
      !1
    ), U > 0) {
      if (U & 16)
        Ce(z, H, W, A, R);
      else if (U & 2 && H.class !== W.class && r(z, "class", null, W.class, R), U & 4 && r(z, "style", H.style, W.style, R), U & 8) {
        const J = _.dynamicProps;
        for (let xe = 0; xe < J.length; xe++) {
          const ve = J[xe], Ze = H[ve], Re = W[ve];
          (Re !== Ze || ve === "value") && r(z, ve, Ze, Re, R, A);
        }
      }
      U & 1 && g.children !== _.children && u(z, _.children);
    } else !B && P == null && Ce(z, H, W, A, R);
    ((te = W.onVnodeUpdated) || X) && Ht(() => {
      te && sn(te, A, _, g), X && Kn(_, g, A, "updated");
    }, F);
  }, Xe = (g, _, A, F, R, I, B) => {
    for (let z = 0; z < _.length; z++) {
      const U = g[z], P = _[z], X = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        U.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (U.type === Ue || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Ns(U, P) || // - In the case of a component, it could contain anything.
        U.shapeFlag & 198) ? w(U.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          A
        )
      );
      G(
        U,
        P,
        X,
        null,
        F,
        R,
        I,
        B,
        !0
      );
    }
  }, Ce = (g, _, A, F, R) => {
    if (_ !== A) {
      if (_ !== tt)
        for (const I in _)
          !Gs(I) && !(I in A) && r(
            g,
            I,
            _[I],
            null,
            R,
            F
          );
      for (const I in A) {
        if (Gs(I)) continue;
        const B = A[I], z = _[I];
        B !== z && I !== "value" && r(g, I, z, B, R, F);
      }
      "value" in A && r(g, "value", _.value, A.value, R);
    }
  }, be = (g, _, A, F, R, I, B, z, U) => {
    const P = _.el = g ? g.el : a(""), X = _.anchor = g ? g.anchor : a("");
    let { patchFlag: H, dynamicChildren: W, slotScopeIds: te } = _;
    te && (z = z ? z.concat(te) : te), g == null ? (s(P, A, F), s(X, A, F), Se(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      _.children || [],
      A,
      X,
      R,
      I,
      B,
      z,
      U
    )) : H > 0 && H & 64 && W && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    g.dynamicChildren ? (Xe(
      g.dynamicChildren,
      W,
      A,
      R,
      I,
      B,
      z
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (_.key != null || R && _ === R.subTree) && cc(
      g,
      _,
      !0
      /* shallow */
    )) : le(
      g,
      _,
      A,
      X,
      R,
      I,
      B,
      z,
      U
    );
  }, Je = (g, _, A, F, R, I, B, z, U) => {
    _.slotScopeIds = z, g == null ? _.shapeFlag & 512 ? R.ctx.activate(
      _,
      A,
      F,
      B,
      U
    ) : nt(
      _,
      A,
      F,
      R,
      I,
      B,
      U
    ) : lt(g, _, U);
  }, nt = (g, _, A, F, R, I, B) => {
    const z = g.component = bh(
      g,
      F,
      R
    );
    if (Yl(g) && (z.ctx.renderer = K), kh(z, !1, B), z.asyncDep) {
      if (R && R.registerDep(z, he, B), !g.el) {
        const U = z.subTree = cn(Dn);
        de(null, U, _, A), g.placeholder = U.el;
      }
    } else
      he(
        z,
        g,
        _,
        A,
        R,
        I,
        B
      );
  }, lt = (g, _, A) => {
    const F = _.component = g.component;
    if (fh(g, _, A))
      if (F.asyncDep && !F.asyncResolved) {
        ge(F, _, A);
        return;
      } else
        F.next = _, F.update();
    else
      _.el = g.el, F.vnode = _;
  }, he = (g, _, A, F, R, I, B) => {
    const z = () => {
      if (g.isMounted) {
        let { next: H, bu: W, u: te, parent: J, vnode: xe } = g;
        {
          const h = uc(g);
          if (h) {
            H && (H.el = xe.el, ge(g, H, B)), h.asyncDep.then(() => {
              g.isUnmounted || z();
            });
            return;
          }
        }
        let ve = H, Ze;
        Gn(g, !1), H ? (H.el = xe.el, ge(g, H, B)) : H = xe, W && Si(W), (Ze = H.props && H.props.onVnodeBeforeUpdate) && sn(Ze, J, H, xe), Gn(g, !0);
        const Re = Ea(g), ct = g.subTree;
        g.subTree = Re, G(
          ct,
          Re,
          // parent may have changed if it's in a teleport
          w(ct.el),
          // anchor may have changed if it's in a fragment
          Me(ct),
          g,
          R,
          I
        ), H.el = Re.el, ve === null && hh(g, Re.el), te && Ht(te, R), (Ze = H.props && H.props.onVnodeUpdated) && Ht(
          () => sn(Ze, J, H, xe),
          R
        );
      } else {
        let H;
        const { el: W, props: te } = _, { bm: J, m: xe, parent: ve, root: Ze, type: Re } = g, ct = Js(_);
        Gn(g, !1), J && Si(J), !ct && (H = te && te.onVnodeBeforeMount) && sn(H, ve, _), Gn(g, !0);
        {
          Ze.ce && // @ts-expect-error _def is private
          Ze.ce._def.shadowRoot !== !1 && Ze.ce._injectChildStyle(Re);
          const h = g.subTree = Ea(g);
          G(
            null,
            h,
            A,
            F,
            g,
            R,
            I
          ), _.el = h.el;
        }
        if (xe && Ht(xe, R), !ct && (H = te && te.onVnodeMounted)) {
          const h = _;
          Ht(
            () => sn(H, ve, h),
            R
          );
        }
        (_.shapeFlag & 256 || ve && Js(ve.vnode) && ve.vnode.shapeFlag & 256) && g.a && Ht(g.a, R), g.isMounted = !0, _ = A = F = null;
      }
    };
    g.scope.on();
    const U = g.effect = new Tl(z);
    g.scope.off();
    const P = g.update = U.run.bind(U), X = g.job = U.runIfDirty.bind(U);
    X.i = g, X.id = g.uid, U.scheduler = () => So(X), Gn(g, !0), P();
  }, ge = (g, _, A) => {
    _.component = g;
    const F = g.vnode.props;
    g.vnode = _, g.next = null, Yf(g, _.props, F, A), Qf(g, _.children, A), kn(), ba(g), xn();
  }, le = (g, _, A, F, R, I, B, z, U = !1) => {
    const P = g && g.children, X = g ? g.shapeFlag : 0, H = _.children, { patchFlag: W, shapeFlag: te } = _;
    if (W > 0) {
      if (W & 128) {
        st(
          P,
          H,
          A,
          F,
          R,
          I,
          B,
          z,
          U
        );
        return;
      } else if (W & 256) {
        Te(
          P,
          H,
          A,
          F,
          R,
          I,
          B,
          z,
          U
        );
        return;
      }
    }
    te & 8 ? (X & 16 && q(P, R, I), H !== P && u(A, H)) : X & 16 ? te & 16 ? st(
      P,
      H,
      A,
      F,
      R,
      I,
      B,
      z,
      U
    ) : q(P, R, I, !0) : (X & 8 && u(A, ""), te & 16 && Se(
      H,
      A,
      F,
      R,
      I,
      B,
      z,
      U
    ));
  }, Te = (g, _, A, F, R, I, B, z, U) => {
    g = g || ds, _ = _ || ds;
    const P = g.length, X = _.length, H = Math.min(P, X);
    let W;
    for (W = 0; W < H; W++) {
      const te = _[W] = U ? On(_[W]) : an(_[W]);
      G(
        g[W],
        te,
        A,
        null,
        R,
        I,
        B,
        z,
        U
      );
    }
    P > X ? q(
      g,
      R,
      I,
      !0,
      !1,
      H
    ) : Se(
      _,
      A,
      F,
      R,
      I,
      B,
      z,
      U,
      H
    );
  }, st = (g, _, A, F, R, I, B, z, U) => {
    let P = 0;
    const X = _.length;
    let H = g.length - 1, W = X - 1;
    for (; P <= H && P <= W; ) {
      const te = g[P], J = _[P] = U ? On(_[P]) : an(_[P]);
      if (Ns(te, J))
        G(
          te,
          J,
          A,
          null,
          R,
          I,
          B,
          z,
          U
        );
      else
        break;
      P++;
    }
    for (; P <= H && P <= W; ) {
      const te = g[H], J = _[W] = U ? On(_[W]) : an(_[W]);
      if (Ns(te, J))
        G(
          te,
          J,
          A,
          null,
          R,
          I,
          B,
          z,
          U
        );
      else
        break;
      H--, W--;
    }
    if (P > H) {
      if (P <= W) {
        const te = W + 1, J = te < X ? _[te].el : F;
        for (; P <= W; )
          G(
            null,
            _[P] = U ? On(_[P]) : an(_[P]),
            A,
            J,
            R,
            I,
            B,
            z,
            U
          ), P++;
      }
    } else if (P > W)
      for (; P <= H; )
        De(g[P], R, I, !0), P++;
    else {
      const te = P, J = P, xe = /* @__PURE__ */ new Map();
      for (P = J; P <= W; P++) {
        const T = _[P] = U ? On(_[P]) : an(_[P]);
        T.key != null && xe.set(T.key, P);
      }
      let ve, Ze = 0;
      const Re = W - J + 1;
      let ct = !1, h = 0;
      const v = new Array(Re);
      for (P = 0; P < Re; P++) v[P] = 0;
      for (P = te; P <= H; P++) {
        const T = g[P];
        if (Ze >= Re) {
          De(T, R, I, !0);
          continue;
        }
        let D;
        if (T.key != null)
          D = xe.get(T.key);
        else
          for (ve = J; ve <= W; ve++)
            if (v[ve - J] === 0 && Ns(T, _[ve])) {
              D = ve;
              break;
            }
        D === void 0 ? De(T, R, I, !0) : (v[D - J] = P + 1, D >= h ? h = D : ct = !0, G(
          T,
          _[D],
          A,
          null,
          R,
          I,
          B,
          z,
          U
        ), Ze++);
      }
      const C = ct ? sh(v) : ds;
      for (ve = C.length - 1, P = Re - 1; P >= 0; P--) {
        const T = J + P, D = _[T], j = _[T + 1], ie = T + 1 < X ? (
          // #13559, fallback to el placeholder for unresolved async component
          j.el || j.placeholder
        ) : F;
        v[P] === 0 ? G(
          null,
          D,
          A,
          ie,
          R,
          I,
          B,
          z,
          U
        ) : ct && (ve < 0 || P !== C[ve] ? ae(D, A, ie, 2) : ve--);
      }
    }
  }, ae = (g, _, A, F, R = null) => {
    const { el: I, type: B, transition: z, children: U, shapeFlag: P } = g;
    if (P & 6) {
      ae(g.component.subTree, _, A, F);
      return;
    }
    if (P & 128) {
      g.suspense.move(_, A, F);
      return;
    }
    if (P & 64) {
      B.move(g, _, A, K);
      return;
    }
    if (B === Ue) {
      s(I, _, A);
      for (let H = 0; H < U.length; H++)
        ae(U[H], _, A, F);
      s(g.anchor, _, A);
      return;
    }
    if (B === Ei) {
      ke(g, _, A);
      return;
    }
    if (F !== 2 && P & 1 && z)
      if (F === 0)
        z.beforeEnter(I), s(I, _, A), Ht(() => z.enter(I), R);
      else {
        const { leave: H, delayLeave: W, afterLeave: te } = z, J = () => {
          g.ctx.isUnmounted ? i(I) : s(I, _, A);
        }, xe = () => {
          H(I, () => {
            J(), te && te();
          });
        };
        W ? W(I, J, xe) : xe();
      }
    else
      s(I, _, A);
  }, De = (g, _, A, F = !1, R = !1) => {
    const {
      type: I,
      props: B,
      ref: z,
      children: U,
      dynamicChildren: P,
      shapeFlag: X,
      patchFlag: H,
      dirs: W,
      cacheIndex: te
    } = g;
    if (H === -2 && (R = !1), z != null && (kn(), Zs(z, null, A, g, !0), xn()), te != null && (_.renderCache[te] = void 0), X & 256) {
      _.ctx.deactivate(g);
      return;
    }
    const J = X & 1 && W, xe = !Js(g);
    let ve;
    if (xe && (ve = B && B.onVnodeBeforeUnmount) && sn(ve, _, g), X & 6)
      Le(g.component, A, F);
    else {
      if (X & 128) {
        g.suspense.unmount(A, F);
        return;
      }
      J && Kn(g, null, _, "beforeUnmount"), X & 64 ? g.type.remove(
        g,
        _,
        A,
        K,
        F
      ) : P && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !P.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (I !== Ue || H > 0 && H & 64) ? q(
        P,
        _,
        A,
        !1,
        !0
      ) : (I === Ue && H & 384 || !R && X & 16) && q(U, _, A), F && Be(g);
    }
    (xe && (ve = B && B.onVnodeUnmounted) || J) && Ht(() => {
      ve && sn(ve, _, g), J && Kn(g, null, _, "unmounted");
    }, A);
  }, Be = (g) => {
    const { type: _, el: A, anchor: F, transition: R } = g;
    if (_ === Ue) {
      At(A, F);
      return;
    }
    if (_ === Ei) {
      S(g);
      return;
    }
    const I = () => {
      i(A), R && !R.persisted && R.afterLeave && R.afterLeave();
    };
    if (g.shapeFlag & 1 && R && !R.persisted) {
      const { leave: B, delayLeave: z } = R, U = () => B(A, I);
      z ? z(g.el, I, U) : U();
    } else
      I();
  }, At = (g, _) => {
    let A;
    for (; g !== _; )
      A = m(g), i(g), g = A;
    i(_);
  }, Le = (g, _, A) => {
    const {
      bum: F,
      scope: R,
      job: I,
      subTree: B,
      um: z,
      m: U,
      a: P,
      parent: X,
      slots: { __: H }
    } = g;
    Ta(U), Ta(P), F && Si(F), X && me(H) && H.forEach((W) => {
      X.renderCache[W] = void 0;
    }), R.stop(), I && (I.flags |= 8, De(B, g, _, A)), z && Ht(z, _), Ht(() => {
      g.isUnmounted = !0;
    }, _), _ && _.pendingBranch && !_.isUnmounted && g.asyncDep && !g.asyncResolved && g.suspenseId === _.pendingId && (_.deps--, _.deps === 0 && _.resolve());
  }, q = (g, _, A, F = !1, R = !1, I = 0) => {
    for (let B = I; B < g.length; B++)
      De(g[B], _, A, F, R);
  }, Me = (g) => {
    if (g.shapeFlag & 6)
      return Me(g.component.subTree);
    if (g.shapeFlag & 128)
      return g.suspense.next();
    const _ = m(g.anchor || g.el), A = _ && _[Tf];
    return A ? m(A) : _;
  };
  let ce = !1;
  const Oe = (g, _, A) => {
    g == null ? _._vnode && De(_._vnode, null, null, !0) : G(
      _._vnode || null,
      g,
      _,
      null,
      null,
      null,
      A
    ), _._vnode = g, ce || (ce = !0, ba(), Wl(), ce = !1);
  }, K = {
    p: G,
    um: De,
    m: ae,
    r: Be,
    mt: nt,
    mc: Se,
    pc: le,
    pbc: Xe,
    n: Me,
    o: e
  };
  return {
    render: Oe,
    hydrate: void 0,
    createApp: Vf(Oe)
  };
}
function Ir({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Gn({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function nh(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function cc(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (me(s) && me(i))
    for (let r = 0; r < s.length; r++) {
      const o = s[r];
      let a = i[r];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[r] = On(i[r]), a.el = o.el), !n && a.patchFlag !== -2 && cc(o, a)), a.type === or && (a.el = o.el), a.type === Dn && !a.el && (a.el = o.el);
    }
}
function sh(e) {
  const t = e.slice(), n = [0];
  let s, i, r, o, a;
  const l = e.length;
  for (s = 0; s < l; s++) {
    const d = e[s];
    if (d !== 0) {
      if (i = n[n.length - 1], e[i] < d) {
        t[s] = i, n.push(s);
        continue;
      }
      for (r = 0, o = n.length - 1; r < o; )
        a = r + o >> 1, e[n[a]] < d ? r = a + 1 : o = a;
      d < e[n[r]] && (r > 0 && (t[s] = n[r - 1]), n[r] = s);
    }
  }
  for (r = n.length, o = n[r - 1]; r-- > 0; )
    n[r] = o, o = t[o];
  return n;
}
function uc(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : uc(t);
}
function Ta(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const ih = Symbol.for("v-scx"), rh = () => Ti(ih);
function Vt(e, t, n) {
  return fc(e, t, n);
}
function fc(e, t, n = tt) {
  const { immediate: s, deep: i, flush: r, once: o } = n, a = Et({}, n), l = t && s || !t && r !== "post";
  let d;
  if (oi) {
    if (r === "sync") {
      const N = rh();
      d = N.__watcherHandles || (N.__watcherHandles = []);
    } else if (!l) {
      const N = () => {
      };
      return N.stop = ln, N.resume = ln, N.pause = ln, N;
    }
  }
  const u = Ot;
  a.call = (N, M, G) => fn(N, u, M, G);
  let w = !1;
  r === "post" ? a.scheduler = (N) => {
    Ht(N, u && u.suspense);
  } : r !== "sync" && (w = !0, a.scheduler = (N, M) => {
    M ? N() : So(N);
  }), a.augmentJob = (N) => {
    t && (N.flags |= 4), w && (N.flags |= 2, u && (N.id = u.uid, N.i = u));
  };
  const m = wf(e, t, a);
  return oi && (d ? d.push(m) : l && m()), m;
}
function oh(e, t, n) {
  const s = this.proxy, i = ht(e) ? e.includes(".") ? hc(s, e) : () => s[e] : e.bind(s, s);
  let r;
  ye(t) ? r = t : (r = t.handler, n = t);
  const o = ci(this), a = fc(i, r.bind(s), n);
  return o(), a;
}
function hc(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++)
      s = s[n[i]];
    return s;
  };
}
const ah = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Mn(t)}Modifiers`] || e[`${$n(t)}Modifiers`];
function lh(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || tt;
  let i = n;
  const r = t.startsWith("update:"), o = r && ah(s, t.slice(7));
  o && (o.trim && (i = n.map((u) => ht(u) ? u.trim() : u)), o.number && (i = n.map(jr)));
  let a, l = s[a = Ar(t)] || // also try camelCase event handler (#2249)
  s[a = Ar(Mn(t))];
  !l && r && (l = s[a = Ar($n(t))]), l && fn(
    l,
    e,
    6,
    i
  );
  const d = s[a + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[a])
      return;
    e.emitted[a] = !0, fn(
      d,
      e,
      6,
      i
    );
  }
}
function dc(e, t, n = !1) {
  const s = t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let o = {}, a = !1;
  if (!ye(e)) {
    const l = (d) => {
      const u = dc(d, t, !0);
      u && (a = !0, Et(o, u));
    };
    !n && t.mixins.length && t.mixins.forEach(l), e.extends && l(e.extends), e.mixins && e.mixins.forEach(l);
  }
  return !r && !a ? (at(e) && s.set(e, null), null) : (me(r) ? r.forEach((l) => o[l] = null) : Et(o, r), at(e) && s.set(e, o), o);
}
function rr(e, t) {
  return !e || !Xi(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), Ve(e, t[0].toLowerCase() + t.slice(1)) || Ve(e, $n(t)) || Ve(e, t));
}
function Ea(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: i,
    propsOptions: [r],
    slots: o,
    attrs: a,
    emit: l,
    render: d,
    renderCache: u,
    props: w,
    data: m,
    setupState: N,
    ctx: M,
    inheritAttrs: G
  } = e, Fe = Hi(e);
  let de, _e;
  try {
    if (n.shapeFlag & 4) {
      const S = i || s, L = S;
      de = an(
        d.call(
          L,
          S,
          u,
          w,
          N,
          m,
          M
        )
      ), _e = a;
    } else {
      const S = t;
      de = an(
        S.length > 1 ? S(
          w,
          { attrs: a, slots: o, emit: l }
        ) : S(
          w,
          null
        )
      ), _e = t.props ? a : ch(a);
    }
  } catch (S) {
    ei.length = 0, nr(S, e, 1), de = cn(Dn);
  }
  let ke = de;
  if (_e && G !== !1) {
    const S = Object.keys(_e), { shapeFlag: L } = ke;
    S.length && L & 7 && (r && S.some(go) && (_e = uh(
      _e,
      r
    )), ke = ws(ke, _e, !1, !0));
  }
  return n.dirs && (ke = ws(ke, null, !1, !0), ke.dirs = ke.dirs ? ke.dirs.concat(n.dirs) : n.dirs), n.transition && To(ke, n.transition), de = ke, Hi(Fe), de;
}
const ch = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Xi(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, uh = (e, t) => {
  const n = {};
  for (const s in e)
    (!go(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function fh(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: o, children: a, patchFlag: l } = t, d = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return s ? Ca(s, o, d) : !!o;
    if (l & 8) {
      const u = t.dynamicProps;
      for (let w = 0; w < u.length; w++) {
        const m = u[w];
        if (o[m] !== s[m] && !rr(d, m))
          return !0;
      }
    }
  } else
    return (i || a) && (!a || !a.$stable) ? !0 : s === o ? !1 : s ? o ? Ca(s, o, d) : !0 : !!o;
  return !1;
}
function Ca(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (t[r] !== e[r] && !rr(n, r))
      return !0;
  }
  return !1;
}
function hh({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const pc = (e) => e.__isSuspense;
function dh(e, t) {
  t && t.pendingBranch ? me(e) ? t.effects.push(...e) : t.effects.push(e) : Af(e);
}
const Ue = Symbol.for("v-fgt"), or = Symbol.for("v-txt"), Dn = Symbol.for("v-cmt"), Ei = Symbol.for("v-stc"), ei = [];
let qt = null;
function k(e = !1) {
  ei.push(qt = e ? null : []);
}
function ph() {
  ei.pop(), qt = ei[ei.length - 1] || null;
}
let ri = 1;
function Ra(e, t = !1) {
  ri += e, e < 0 && qt && t && (qt.hasOnce = !0);
}
function gc(e) {
  return e.dynamicChildren = ri > 0 ? qt || ds : null, ph(), ri > 0 && qt && qt.push(e), e;
}
function x(e, t, n, s, i, r) {
  return gc(
    b(
      e,
      t,
      n,
      s,
      i,
      r,
      !0
    )
  );
}
function mc(e, t, n, s, i) {
  return gc(
    cn(
      e,
      t,
      n,
      s,
      i,
      !0
    )
  );
}
function _c(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Ns(e, t) {
  return e.type === t.type && e.key === t.key;
}
const vc = ({ key: e }) => e ?? null, Ci = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ht(e) || Tt(e) || ye(e) ? { i: Kt, r: e, k: t, f: !!n } : e : null);
function b(e, t = null, n = null, s = 0, i = null, r = e === Ue ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && vc(t),
    ref: t && Ci(t),
    scopeId: Vl,
    slotScopeIds: null,
    children: n,
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
    shapeFlag: r,
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Kt
  };
  return a ? (Ro(l, n), r & 128 && e.normalize(l)) : n && (l.shapeFlag |= ht(n) ? 8 : 16), ri > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  qt && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && qt.push(l), l;
}
const cn = gh;
function gh(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === Bf) && (e = Dn), _c(e)) {
    const a = ws(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Ro(a, n), ri > 0 && !r && qt && (a.shapeFlag & 6 ? qt[qt.indexOf(e)] = a : qt.push(a)), a.patchFlag = -2, a;
  }
  if (Th(e) && (e = e.__vccOpts), t) {
    t = mh(t);
    let { class: a, style: l } = t;
    a && !ht(a) && (t.class = $e(a)), at(l) && (Ao(l) && !me(l) && (l = Et({}, l)), t.style = we(l));
  }
  const o = ht(e) ? 1 : pc(e) ? 128 : Ef(e) ? 64 : at(e) ? 4 : ye(e) ? 2 : 0;
  return b(
    e,
    t,
    n,
    s,
    i,
    o,
    r,
    !0
  );
}
function mh(e) {
  return e ? Ao(e) || sc(e) ? Et({}, e) : e : null;
}
function ws(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: o, children: a, transition: l } = e, d = t ? _h(i || {}, t) : i, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && vc(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? me(r) ? r.concat(Ci(t)) : [r, Ci(t)] : Ci(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: a,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ue ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: l,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && ws(e.ssContent),
    ssFallback: e.ssFallback && ws(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return l && s && To(
    u,
    l.clone(u)
  ), u;
}
function gn(e = " ", t = 0) {
  return cn(or, null, e, t);
}
function Yn(e, t) {
  const n = cn(Ei, null, e);
  return n.staticCount = t, n;
}
function ne(e = "", t = !1) {
  return t ? (k(), mc(Dn, null, e)) : cn(Dn, null, e);
}
function an(e) {
  return e == null || typeof e == "boolean" ? cn(Dn) : me(e) ? cn(
    Ue,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : _c(e) ? On(e) : cn(or, null, String(e));
}
function On(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : ws(e);
}
function Ro(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (me(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), Ro(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !sc(t) ? t._ctx = Kt : i === 3 && Kt && (Kt.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else ye(t) ? (t = { default: t, _ctx: Kt }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [gn(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function _h(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = $e([t.class, s.class]));
      else if (i === "style")
        t.style = we([t.style, s.style]);
      else if (Xi(i)) {
        const r = t[i], o = s[i];
        o && r !== o && !(me(r) && r.includes(o)) && (t[i] = r ? [].concat(r, o) : o);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function sn(e, t, n, s = null) {
  fn(e, t, 7, [
    n,
    s
  ]);
}
const vh = ec();
let yh = 0;
function bh(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || vh, r = {
    uid: yh++,
    vnode: e,
    type: s,
    parent: t,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Vu(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(i.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: rc(s, i),
    emitsOptions: dc(s, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: tt,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: tt,
    data: tt,
    props: tt,
    attrs: tt,
    slots: tt,
    refs: tt,
    setupState: tt,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
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
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = lh.bind(null, r), e.ce && e.ce(r), r;
}
let Ot = null;
const wh = () => Ot || Kt;
let Wi, eo;
{
  const e = Qi(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((o) => o(r)) : i[0](r);
    };
  };
  Wi = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Ot = n
  ), eo = t(
    "__VUE_SSR_SETTERS__",
    (n) => oi = n
  );
}
const ci = (e) => {
  const t = Ot;
  return Wi(e), e.scope.on(), () => {
    e.scope.off(), Wi(t);
  };
}, Ia = () => {
  Ot && Ot.scope.off(), Wi(null);
};
function yc(e) {
  return e.vnode.shapeFlag & 4;
}
let oi = !1;
function kh(e, t = !1, n = !1) {
  t && eo(t);
  const { props: s, children: i } = e.vnode, r = yc(e);
  Gf(e, s, r, t), Jf(e, i, n || t);
  const o = r ? xh(e, t) : void 0;
  return t && eo(!1), o;
}
function xh(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, $f);
  const { setup: s } = n;
  if (s) {
    kn();
    const i = e.setupContext = s.length > 1 ? Sh(e) : null, r = ci(e), o = ai(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), a = yl(o);
    if (xn(), r(), (a || e.sp) && !Js(e) && Gl(e), a) {
      if (o.then(Ia, Ia), t)
        return o.then((l) => {
          La(e, l);
        }).catch((l) => {
          nr(l, e, 0);
        });
      e.asyncDep = o;
    } else
      La(e, o);
  } else
    bc(e);
}
function La(e, t, n) {
  ye(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : at(t) && (e.setupState = zl(t)), bc(e);
}
function bc(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || ln);
  {
    const i = ci(e);
    kn();
    try {
      Uf(e);
    } finally {
      xn(), i();
    }
  }
}
const Ah = {
  get(e, t) {
    return St(e, "get", ""), e[t];
  }
};
function Sh(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Ah),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function ar(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(zl(pf(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Qs)
        return Qs[n](e);
    },
    has(t, n) {
      return n in t || n in Qs;
    }
  })) : e.proxy;
}
function Th(e) {
  return ye(e) && "__vccOpts" in e;
}
const fe = (e, t) => yf(e, t, oi), Eh = "3.5.18";
/**
* @vue/runtime-dom v3.5.18
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let to;
const Oa = typeof window < "u" && window.trustedTypes;
if (Oa)
  try {
    to = /* @__PURE__ */ Oa.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const wc = to ? (e) => to.createHTML(e) : (e) => e, Ch = "http://www.w3.org/2000/svg", Rh = "http://www.w3.org/1998/Math/MathML", _n = typeof document < "u" ? document : null, Na = _n && /* @__PURE__ */ _n.createElement("template"), Ih = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? _n.createElementNS(Ch, e) : t === "mathml" ? _n.createElementNS(Rh, e) : n ? _n.createElement(e, { is: n }) : _n.createElement(e);
    return e === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
  },
  createText: (e) => _n.createTextNode(e),
  createComment: (e) => _n.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => _n.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, i, r) {
    const o = n ? n.previousSibling : t.lastChild;
    if (i && (i === r || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === r || !(i = i.nextSibling)); )
        ;
    else {
      Na.innerHTML = wc(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const a = Na.content;
      if (s === "svg" || s === "mathml") {
        const l = a.firstChild;
        for (; l.firstChild; )
          a.appendChild(l.firstChild);
        a.removeChild(l);
      }
      t.insertBefore(a, n);
    }
    return [
      // first
      o ? o.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Lh = Symbol("_vtc");
function Oh(e, t, n) {
  const s = e[Lh];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ji = Symbol("_vod"), kc = Symbol("_vsh"), Nh = {
  beforeMount(e, { value: t }, { transition: n }) {
    e[ji] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Ps(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: s }) {
    !t != !n && (s ? t ? (s.beforeEnter(e), Ps(e, !0), s.enter(e)) : s.leave(e, () => {
      Ps(e, !1);
    }) : Ps(e, t));
  },
  beforeUnmount(e, { value: t }) {
    Ps(e, t);
  }
};
function Ps(e, t) {
  e.style.display = t ? e[ji] : "none", e[kc] = !t;
}
const Ph = Symbol(""), Mh = /(^|;)\s*display\s*:/;
function Fh(e, t, n) {
  const s = e.style, i = ht(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (ht(t))
        for (const o of t.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          n[a] == null && Ri(s, a, "");
        }
      else
        for (const o in t)
          n[o] == null && Ri(s, o, "");
    for (const o in n)
      o === "display" && (r = !0), Ri(s, o, n[o]);
  } else if (i) {
    if (t !== n) {
      const o = s[Ph];
      o && (n += ";" + o), s.cssText = n, r = Mh.test(n);
    }
  } else t && e.removeAttribute("style");
  ji in e && (e[ji] = r ? s.display : "", e[kc] && (s.display = "none"));
}
const Pa = /\s*!important$/;
function Ri(e, t, n) {
  if (me(n))
    n.forEach((s) => Ri(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Dh(e, t);
    Pa.test(n) ? e.setProperty(
      $n(s),
      n.replace(Pa, ""),
      "important"
    ) : e[s] = n;
  }
}
const Ma = ["Webkit", "Moz", "ms"], Lr = {};
function Dh(e, t) {
  const n = Lr[t];
  if (n)
    return n;
  let s = Mn(t);
  if (s !== "filter" && s in e)
    return Lr[t] = s;
  s = kl(s);
  for (let i = 0; i < Ma.length; i++) {
    const r = Ma[i] + s;
    if (r in e)
      return Lr[t] = r;
  }
  return t;
}
const Fa = "http://www.w3.org/1999/xlink";
function Da(e, t, n, s, i, r = ju(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Fa, t.slice(6, t.length)) : e.setAttributeNS(Fa, t, n) : n == null || r && !xl(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : Bn(n) ? String(n) : n
  );
}
function Ba(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? wc(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const a = r === "OPTION" ? e.getAttribute("value") || "" : e.value, l = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (a !== l || !("_value" in e)) && (e.value = l), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const a = typeof e[t];
    a === "boolean" ? n = xl(n) : n == null && a === "string" ? (n = "", o = !0) : a === "number" && (n = 0, o = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  o && e.removeAttribute(i || t);
}
function hs(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Bh(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const $a = Symbol("_vei");
function $h(e, t, n, s, i = null) {
  const r = e[$a] || (e[$a] = {}), o = r[t];
  if (s && o)
    o.value = s;
  else {
    const [a, l] = Uh(t);
    if (s) {
      const d = r[t] = qh(
        s,
        i
      );
      hs(e, a, d, l);
    } else o && (Bh(e, a, o, l), r[t] = void 0);
  }
}
const Ua = /(?:Once|Passive|Capture)$/;
function Uh(e) {
  let t;
  if (Ua.test(e)) {
    t = {};
    let s;
    for (; s = e.match(Ua); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : $n(e.slice(2)), t];
}
let Or = 0;
const zh = /* @__PURE__ */ Promise.resolve(), Hh = () => Or || (zh.then(() => Or = 0), Or = Date.now());
function qh(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    fn(
      Wh(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = Hh(), n;
}
function Wh(e, t) {
  if (me(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (s) => (i) => !i._stopped && s && s(i)
    );
  } else
    return t;
}
const za = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, jh = (e, t, n, s, i, r) => {
  const o = i === "svg";
  t === "class" ? Oh(e, s, o) : t === "style" ? Fh(e, n, s) : Xi(t) ? go(t) || $h(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Vh(e, t, s, o)) ? (Ba(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Da(e, t, s, o, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !ht(s)) ? Ba(e, Mn(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Da(e, t, s, o));
};
function Vh(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && za(t) && ye(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return za(t) && ht(n) ? !1 : t in e;
}
const Ha = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return me(t) ? (n) => Si(t, n) : t;
};
function Kh(e) {
  e.target.composing = !0;
}
function qa(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Nr = Symbol("_assign"), Xn = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, i) {
    e[Nr] = Ha(i);
    const r = s || i.props && i.props.type === "number";
    hs(e, t ? "change" : "input", (o) => {
      if (o.target.composing) return;
      let a = e.value;
      n && (a = a.trim()), r && (a = jr(a)), e[Nr](a);
    }), n && hs(e, "change", () => {
      e.value = e.value.trim();
    }), t || (hs(e, "compositionstart", Kh), hs(e, "compositionend", qa), hs(e, "change", qa));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: i, number: r } }, o) {
    if (e[Nr] = Ha(o), e.composing) return;
    const a = (r || e.type === "number") && !/^0\d/.test(e.value) ? jr(e.value) : e.value, l = t ?? "";
    a !== l && (document.activeElement === e && e.type !== "range" && (s && t === n || i && e.value.trim() === l) || (e.value = l));
  }
}, Gh = ["ctrl", "shift", "alt", "meta"], Yh = {
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
  exact: (e, t) => Gh.some((n) => e[`${n}Key`] && !t.includes(n))
}, Jn = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = (i, ...r) => {
    for (let o = 0; o < t.length; o++) {
      const a = Yh[t[o]];
      if (a && a(i, t)) return;
    }
    return e(i, ...r);
  });
}, Xh = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, Ii = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = (i) => {
    if (!("key" in i))
      return;
    const r = $n(i.key);
    if (t.some(
      (o) => o === r || Xh[o] === r
    ))
      return e(i);
  });
}, Zh = /* @__PURE__ */ Et({ patchProp: jh }, Ih);
let Wa;
function Jh() {
  return Wa || (Wa = eh(Zh));
}
const Qh = (...e) => {
  const t = Jh().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = td(s);
    if (!i) return;
    const r = t._component;
    !ye(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const o = n(i, !1, ed(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), o;
  }, t;
};
function ed(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function td(e) {
  return ht(e) ? document.querySelector(e) : e;
}
const ys = (e) => {
  const t = e.replace("#", ""), n = parseInt(t.substr(0, 2), 16), s = parseInt(t.substr(2, 2), 16), i = parseInt(t.substr(4, 2), 16);
  return (n * 299 + s * 587 + i * 114) / 1e3 < 128;
}, nd = (e, t) => {
  const n = e.replace("#", ""), s = parseInt(n.substr(0, 2), 16), i = parseInt(n.substr(2, 2), 16), r = parseInt(n.substr(4, 2), 16), o = ys(e), a = o ? Math.min(255, s + t) : Math.max(0, s - t), l = o ? Math.min(255, i + t) : Math.max(0, i - t), d = o ? Math.min(255, r + t) : Math.max(0, r - t);
  return `#${a.toString(16).padStart(2, "0")}${l.toString(16).padStart(2, "0")}${d.toString(16).padStart(2, "0")}`;
}, Ms = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), sd = (e) => {
  switch (e.type) {
    case "connection_error":
      return "Unable to connect. Please try again later.";
    case "auth_error":
      return "Authentication failed. Please refresh the page.";
    case "chat_error":
      return "Unable to send message. Please try again.";
    case "ai_config_missing":
      return "Chat service is currently unavailable.";
    default:
      return e.error || "Something went wrong. Please try again.";
  }
};
function Io() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var ts = Io();
function xc(e) {
  ts = e;
}
var ti = { exec: () => null };
function Ke(e, t = "") {
  let n = typeof e == "string" ? e : e.source;
  const s = {
    replace: (i, r) => {
      let o = typeof r == "string" ? r : r.source;
      return o = o.replace(Nt.caret, "$1"), n = n.replace(i, o), s;
    },
    getRegex: () => new RegExp(n, t)
  };
  return s;
}
var Nt = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
  htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i")
}, id = /^(?:[ \t]*(?:\n|$))+/, rd = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, od = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, ui = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ad = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Lo = /(?:[*+-]|\d{1,9}[.)])/, Ac = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Sc = Ke(Ac).replace(/bull/g, Lo).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), ld = Ke(Ac).replace(/bull/g, Lo).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Oo = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, cd = /^[^\n]+/, No = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ud = Ke(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", No).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), fd = Ke(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Lo).getRegex(), lr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Po = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, hd = Ke(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Po).replace("tag", lr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Tc = Ke(Oo).replace("hr", ui).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", lr).getRegex(), dd = Ke(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Tc).getRegex(), Mo = {
  blockquote: dd,
  code: rd,
  def: ud,
  fences: od,
  heading: ad,
  hr: ui,
  html: hd,
  lheading: Sc,
  list: fd,
  newline: id,
  paragraph: Tc,
  table: ti,
  text: cd
}, ja = Ke(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", ui).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", lr).getRegex(), pd = {
  ...Mo,
  lheading: ld,
  table: ja,
  paragraph: Ke(Oo).replace("hr", ui).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ja).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", lr).getRegex()
}, gd = {
  ...Mo,
  html: Ke(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Po).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: ti,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: Ke(Oo).replace("hr", ui).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Sc).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, md = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, _d = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ec = /^( {2,}|\\)\n(?!\s*$)/, vd = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, cr = /[\p{P}\p{S}]/u, Fo = /[\s\p{P}\p{S}]/u, Cc = /[^\s\p{P}\p{S}]/u, yd = Ke(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Fo).getRegex(), Rc = /(?!~)[\p{P}\p{S}]/u, bd = /(?!~)[\s\p{P}\p{S}]/u, wd = /(?:[^\s\p{P}\p{S}]|~)/u, kd = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Ic = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, xd = Ke(Ic, "u").replace(/punct/g, cr).getRegex(), Ad = Ke(Ic, "u").replace(/punct/g, Rc).getRegex(), Lc = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Sd = Ke(Lc, "gu").replace(/notPunctSpace/g, Cc).replace(/punctSpace/g, Fo).replace(/punct/g, cr).getRegex(), Td = Ke(Lc, "gu").replace(/notPunctSpace/g, wd).replace(/punctSpace/g, bd).replace(/punct/g, Rc).getRegex(), Ed = Ke(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Cc).replace(/punctSpace/g, Fo).replace(/punct/g, cr).getRegex(), Cd = Ke(/\\(punct)/, "gu").replace(/punct/g, cr).getRegex(), Rd = Ke(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Id = Ke(Po).replace("(?:-->|$)", "-->").getRegex(), Ld = Ke(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Id).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Vi = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Od = Ke(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Vi).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Oc = Ke(/^!?\[(label)\]\[(ref)\]/).replace("label", Vi).replace("ref", No).getRegex(), Nc = Ke(/^!?\[(ref)\](?:\[\])?/).replace("ref", No).getRegex(), Nd = Ke("reflink|nolink(?!\\()", "g").replace("reflink", Oc).replace("nolink", Nc).getRegex(), Do = {
  _backpedal: ti,
  // only used for GFM url
  anyPunctuation: Cd,
  autolink: Rd,
  blockSkip: kd,
  br: Ec,
  code: _d,
  del: ti,
  emStrongLDelim: xd,
  emStrongRDelimAst: Sd,
  emStrongRDelimUnd: Ed,
  escape: md,
  link: Od,
  nolink: Nc,
  punctuation: yd,
  reflink: Oc,
  reflinkSearch: Nd,
  tag: Ld,
  text: vd,
  url: ti
}, Pd = {
  ...Do,
  link: Ke(/^!?\[(label)\]\((.*?)\)/).replace("label", Vi).getRegex(),
  reflink: Ke(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Vi).getRegex()
}, no = {
  ...Do,
  emStrongRDelimAst: Td,
  emStrongLDelim: Ad,
  url: Ke(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Md = {
  ...no,
  br: Ke(Ec).replace("{2,}", "*").getRegex(),
  text: Ke(no.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, bi = {
  normal: Mo,
  gfm: pd,
  pedantic: gd
}, Fs = {
  normal: Do,
  gfm: no,
  breaks: Md,
  pedantic: Pd
}, Fd = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Va = (e) => Fd[e];
function rn(e, t) {
  if (t) {
    if (Nt.escapeTest.test(e))
      return e.replace(Nt.escapeReplace, Va);
  } else if (Nt.escapeTestNoEncode.test(e))
    return e.replace(Nt.escapeReplaceNoEncode, Va);
  return e;
}
function Ka(e) {
  try {
    e = encodeURI(e).replace(Nt.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Ga(e, t) {
  var r;
  const n = e.replace(Nt.findPipe, (o, a, l) => {
    let d = !1, u = a;
    for (; --u >= 0 && l[u] === "\\"; ) d = !d;
    return d ? "|" : " |";
  }), s = n.split(Nt.splitPipe);
  let i = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !((r = s.at(-1)) != null && r.trim()) && s.pop(), t)
    if (s.length > t)
      s.splice(t);
    else
      for (; s.length < t; ) s.push("");
  for (; i < s.length; i++)
    s[i] = s[i].trim().replace(Nt.slashPipe, "|");
  return s;
}
function Ds(e, t, n) {
  const s = e.length;
  if (s === 0)
    return "";
  let i = 0;
  for (; i < s && e.charAt(s - i - 1) === t; )
    i++;
  return e.slice(0, s - i);
}
function Dd(e, t) {
  if (e.indexOf(t[1]) === -1)
    return -1;
  let n = 0;
  for (let s = 0; s < e.length; s++)
    if (e[s] === "\\")
      s++;
    else if (e[s] === t[0])
      n++;
    else if (e[s] === t[1] && (n--, n < 0))
      return s;
  return n > 0 ? -2 : -1;
}
function Ya(e, t, n, s, i) {
  const r = t.href, o = t.title || null, a = e[1].replace(i.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  const l = {
    type: e[0].charAt(0) === "!" ? "image" : "link",
    raw: n,
    href: r,
    title: o,
    text: a,
    tokens: s.inlineTokens(a)
  };
  return s.state.inLink = !1, l;
}
function Bd(e, t, n) {
  const s = e.match(n.other.indentCodeCompensation);
  if (s === null)
    return t;
  const i = s[1];
  return t.split(`
`).map((r) => {
    const o = r.match(n.other.beginningSpace);
    if (o === null)
      return r;
    const [a] = o;
    return a.length >= i.length ? r.slice(i.length) : r;
  }).join(`
`);
}
var Ki = class {
  // set by the lexer
  constructor(e) {
    et(this, "options");
    et(this, "rules");
    // set by the lexer
    et(this, "lexer");
    this.options = e || ts;
  }
  space(e) {
    const t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0)
      return {
        type: "space",
        raw: t[0]
      };
  }
  code(e) {
    const t = this.rules.block.code.exec(e);
    if (t) {
      const n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: t[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? n : Ds(n, `
`)
      };
    }
  }
  fences(e) {
    const t = this.rules.block.fences.exec(e);
    if (t) {
      const n = t[0], s = Bd(n, t[3] || "", this.rules);
      return {
        type: "code",
        raw: n,
        lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
        text: s
      };
    }
  }
  heading(e) {
    const t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        const s = Ds(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return {
        type: "heading",
        raw: t[0],
        depth: t[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(e) {
    const t = this.rules.block.hr.exec(e);
    if (t)
      return {
        type: "hr",
        raw: Ds(t[0], `
`)
      };
  }
  blockquote(e) {
    const t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = Ds(t[0], `
`).split(`
`), s = "", i = "";
      const r = [];
      for (; n.length > 0; ) {
        let o = !1;
        const a = [];
        let l;
        for (l = 0; l < n.length; l++)
          if (this.rules.other.blockquoteStart.test(n[l]))
            a.push(n[l]), o = !0;
          else if (!o)
            a.push(n[l]);
          else
            break;
        n = n.slice(l);
        const d = a.join(`
`), u = d.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${d}` : d, i = i ? `${i}
${u}` : u;
        const w = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, r, !0), this.lexer.state.top = w, n.length === 0)
          break;
        const m = r.at(-1);
        if ((m == null ? void 0 : m.type) === "code")
          break;
        if ((m == null ? void 0 : m.type) === "blockquote") {
          const N = m, M = N.raw + `
` + n.join(`
`), G = this.blockquote(M);
          r[r.length - 1] = G, s = s.substring(0, s.length - N.raw.length) + G.raw, i = i.substring(0, i.length - N.text.length) + G.text;
          break;
        } else if ((m == null ? void 0 : m.type) === "list") {
          const N = m, M = N.raw + `
` + n.join(`
`), G = this.list(M);
          r[r.length - 1] = G, s = s.substring(0, s.length - m.raw.length) + G.raw, i = i.substring(0, i.length - N.raw.length) + G.raw, n = M.substring(r.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: s,
        tokens: r,
        text: i
      };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim();
      const s = n.length > 1, i = {
        type: "list",
        raw: "",
        ordered: s,
        start: s ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      const r = this.rules.other.listItemRegex(n);
      let o = !1;
      for (; e; ) {
        let l = !1, d = "", u = "";
        if (!(t = r.exec(e)) || this.rules.block.hr.test(e))
          break;
        d = t[0], e = e.substring(d.length);
        let w = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (de) => " ".repeat(3 * de.length)), m = e.split(`
`, 1)[0], N = !w.trim(), M = 0;
        if (this.options.pedantic ? (M = 2, u = w.trimStart()) : N ? M = t[1].length + 1 : (M = t[2].search(this.rules.other.nonSpaceChar), M = M > 4 ? 1 : M, u = w.slice(M), M += t[1].length), N && this.rules.other.blankLine.test(m) && (d += m + `
`, e = e.substring(m.length + 1), l = !0), !l) {
          const de = this.rules.other.nextBulletRegex(M), _e = this.rules.other.hrRegex(M), ke = this.rules.other.fencesBeginRegex(M), S = this.rules.other.headingBeginRegex(M), L = this.rules.other.htmlBeginRegex(M);
          for (; e; ) {
            const V = e.split(`
`, 1)[0];
            let Y;
            if (m = V, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), Y = m) : Y = m.replace(this.rules.other.tabCharGlobal, "    "), ke.test(m) || S.test(m) || L.test(m) || de.test(m) || _e.test(m))
              break;
            if (Y.search(this.rules.other.nonSpaceChar) >= M || !m.trim())
              u += `
` + Y.slice(M);
            else {
              if (N || w.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ke.test(w) || S.test(w) || _e.test(w))
                break;
              u += `
` + m;
            }
            !N && !m.trim() && (N = !0), d += V + `
`, e = e.substring(V.length + 1), w = Y.slice(M);
          }
        }
        i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(d) && (o = !0));
        let G = null, Fe;
        this.options.gfm && (G = this.rules.other.listIsTask.exec(u), G && (Fe = G[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: d,
          task: !!G,
          checked: Fe,
          loose: !1,
          text: u,
          tokens: []
        }), i.raw += d;
      }
      const a = i.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let l = 0; l < i.items.length; l++)
        if (this.lexer.state.top = !1, i.items[l].tokens = this.lexer.blockTokens(i.items[l].text, []), !i.loose) {
          const d = i.items[l].tokens.filter((w) => w.type === "space"), u = d.length > 0 && d.some((w) => this.rules.other.anyLine.test(w.raw));
          i.loose = u;
        }
      if (i.loose)
        for (let l = 0; l < i.items.length; l++)
          i.items[l].loose = !0;
      return i;
    }
  }
  html(e) {
    const t = this.rules.block.html.exec(e);
    if (t)
      return {
        type: "html",
        block: !0,
        raw: t[0],
        pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
        text: t[0]
      };
  }
  def(e) {
    const t = this.rules.block.def.exec(e);
    if (t) {
      const n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: n,
        raw: t[0],
        href: s,
        title: i
      };
    }
  }
  table(e) {
    var o;
    const t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2]))
      return;
    const n = Ga(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = (o = t[3]) != null && o.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], r = {
      type: "table",
      raw: t[0],
      header: [],
      align: [],
      rows: []
    };
    if (n.length === s.length) {
      for (const a of s)
        this.rules.other.tableAlignRight.test(a) ? r.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? r.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? r.align.push("left") : r.align.push(null);
      for (let a = 0; a < n.length; a++)
        r.header.push({
          text: n[a],
          tokens: this.lexer.inline(n[a]),
          header: !0,
          align: r.align[a]
        });
      for (const a of i)
        r.rows.push(Ga(a, r.header.length).map((l, d) => ({
          text: l,
          tokens: this.lexer.inline(l),
          header: !1,
          align: r.align[d]
        })));
      return r;
    }
  }
  lheading(e) {
    const t = this.rules.block.lheading.exec(e);
    if (t)
      return {
        type: "heading",
        raw: t[0],
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: t[1],
        tokens: this.lexer.inline(t[1])
      };
  }
  paragraph(e) {
    const t = this.rules.block.paragraph.exec(e);
    if (t) {
      const n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(e) {
    const t = this.rules.block.text.exec(e);
    if (t)
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        tokens: this.lexer.inline(t[0])
      };
  }
  escape(e) {
    const t = this.rules.inline.escape.exec(e);
    if (t)
      return {
        type: "escape",
        raw: t[0],
        text: t[1]
      };
  }
  tag(e) {
    const t = this.rules.inline.tag.exec(e);
    if (t)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: t[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: t[0]
      };
  }
  link(e) {
    const t = this.rules.inline.link.exec(e);
    if (t) {
      const n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n))
          return;
        const r = Ds(n.slice(0, -1), "\\");
        if ((n.length - r.length) % 2 === 0)
          return;
      } else {
        const r = Dd(t[2], "()");
        if (r === -2)
          return;
        if (r > -1) {
          const a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + r;
          t[2] = t[2].substring(0, r), t[0] = t[0].substring(0, a).trim(), t[3] = "";
        }
      }
      let s = t[2], i = "";
      if (this.options.pedantic) {
        const r = this.rules.other.pedanticHrefTitle.exec(s);
        r && (s = r[1], i = r[3]);
      } else
        i = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), Ya(t, {
        href: s && s.replace(this.rules.inline.anyPunctuation, "$1"),
        title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      const s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[s.toLowerCase()];
      if (!i) {
        const r = n[0].charAt(0);
        return {
          type: "text",
          raw: r,
          text: r
        };
      }
      return Ya(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const r = [...s[0]].length - 1;
      let o, a, l = r, d = 0;
      const u = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, t = t.slice(-1 * e.length + r); (s = u.exec(t)) != null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o) continue;
        if (a = [...o].length, s[3] || s[4]) {
          l += a;
          continue;
        } else if ((s[5] || s[6]) && r % 3 && !((r + a) % 3)) {
          d += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l + d);
        const w = [...s[0]][0].length, m = e.slice(0, r + s.index + w + a);
        if (Math.min(r, a) % 2) {
          const M = m.slice(1, -1);
          return {
            type: "em",
            raw: m,
            text: M,
            tokens: this.lexer.inlineTokens(M)
          };
        }
        const N = m.slice(2, -2);
        return {
          type: "strong",
          raw: m,
          text: N,
          tokens: this.lexer.inlineTokens(N)
        };
      }
    }
  }
  codespan(e) {
    const t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " ");
      const s = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && i && (n = n.substring(1, n.length - 1)), {
        type: "codespan",
        raw: t[0],
        text: n
      };
    }
  }
  br(e) {
    const t = this.rules.inline.br.exec(e);
    if (t)
      return {
        type: "br",
        raw: t[0]
      };
  }
  del(e) {
    const t = this.rules.inline.del.exec(e);
    if (t)
      return {
        type: "del",
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2])
      };
  }
  autolink(e) {
    const t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), {
        type: "link",
        raw: t[0],
        text: n,
        href: s,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(e) {
    var n;
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let s, i;
      if (t[2] === "@")
        s = t[0], i = "mailto:" + s;
      else {
        let r;
        do
          r = t[0], t[0] = ((n = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : n[0]) ?? "";
        while (r !== t[0]);
        s = t[0], t[1] === "www." ? i = "http://" + t[0] : i = t[0];
      }
      return {
        type: "link",
        raw: t[0],
        text: s,
        href: i,
        tokens: [
          {
            type: "text",
            raw: s,
            text: s
          }
        ]
      };
    }
  }
  inlineText(e) {
    const t = this.rules.inline.text.exec(e);
    if (t) {
      const n = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        escaped: n
      };
    }
  }
}, bn = class so {
  constructor(t) {
    et(this, "tokens");
    et(this, "options");
    et(this, "state");
    et(this, "tokenizer");
    et(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || ts, this.options.tokenizer = this.options.tokenizer || new Ki(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const n = {
      other: Nt,
      block: bi.normal,
      inline: Fs.normal
    };
    this.options.pedantic ? (n.block = bi.pedantic, n.inline = Fs.pedantic) : this.options.gfm && (n.block = bi.gfm, this.options.breaks ? n.inline = Fs.breaks : n.inline = Fs.gfm), this.tokenizer.rules = n;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: bi,
      inline: Fs
    };
  }
  /**
   * Static Lex Method
   */
  static lex(t, n) {
    return new so(n).lex(t);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(t, n) {
    return new so(n).inlineTokens(t);
  }
  /**
   * Preprocessing
   */
  lex(t) {
    t = t.replace(Nt.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      const s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], s = !1) {
    var i, r, o;
    for (this.options.pedantic && (t = t.replace(Nt.tabCharGlobal, "    ").replace(Nt.spaceLine, "")); t; ) {
      let a;
      if ((r = (i = this.options.extensions) == null ? void 0 : i.block) != null && r.some((d) => (a = d.call({ lexer: this }, t, n)) ? (t = t.substring(a.raw.length), n.push(a), !0) : !1))
        continue;
      if (a = this.tokenizer.space(t)) {
        t = t.substring(a.raw.length);
        const d = n.at(-1);
        a.raw.length === 1 && d !== void 0 ? d.raw += `
` : n.push(a);
        continue;
      }
      if (a = this.tokenizer.code(t)) {
        t = t.substring(a.raw.length);
        const d = n.at(-1);
        (d == null ? void 0 : d.type) === "paragraph" || (d == null ? void 0 : d.type) === "text" ? (d.raw += `
` + a.raw, d.text += `
` + a.text, this.inlineQueue.at(-1).src = d.text) : n.push(a);
        continue;
      }
      if (a = this.tokenizer.fences(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.heading(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.hr(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.blockquote(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.list(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.html(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.def(t)) {
        t = t.substring(a.raw.length);
        const d = n.at(-1);
        (d == null ? void 0 : d.type) === "paragraph" || (d == null ? void 0 : d.type) === "text" ? (d.raw += `
` + a.raw, d.text += `
` + a.raw, this.inlineQueue.at(-1).src = d.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = {
          href: a.href,
          title: a.title
        });
        continue;
      }
      if (a = this.tokenizer.table(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.lheading(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      let l = t;
      if ((o = this.options.extensions) != null && o.startBlock) {
        let d = 1 / 0;
        const u = t.slice(1);
        let w;
        this.options.extensions.startBlock.forEach((m) => {
          w = m.call({ lexer: this }, u), typeof w == "number" && w >= 0 && (d = Math.min(d, w));
        }), d < 1 / 0 && d >= 0 && (l = t.substring(0, d + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(l))) {
        const d = n.at(-1);
        s && (d == null ? void 0 : d.type) === "paragraph" ? (d.raw += `
` + a.raw, d.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = d.text) : n.push(a), s = l.length !== t.length, t = t.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(t)) {
        t = t.substring(a.raw.length);
        const d = n.at(-1);
        (d == null ? void 0 : d.type) === "text" ? (d.raw += `
` + a.raw, d.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = d.text) : n.push(a);
        continue;
      }
      if (t) {
        const d = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(d);
          break;
        } else
          throw new Error(d);
      }
    }
    return this.state.top = !0, n;
  }
  inline(t, n = []) {
    return this.inlineQueue.push({ src: t, tokens: n }), n;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(t, n = []) {
    var a, l, d;
    let s = t, i = null;
    if (this.tokens.links) {
      const u = Object.keys(this.tokens.links);
      if (u.length > 0)
        for (; (i = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; )
          u.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (i = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; )
      s = s.slice(0, i.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (i = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; )
      s = s.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let r = !1, o = "";
    for (; t; ) {
      r || (o = ""), r = !1;
      let u;
      if ((l = (a = this.options.extensions) == null ? void 0 : a.inline) != null && l.some((m) => (u = m.call({ lexer: this }, t, n)) ? (t = t.substring(u.raw.length), n.push(u), !0) : !1))
        continue;
      if (u = this.tokenizer.escape(t)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (u = this.tokenizer.tag(t)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (u = this.tokenizer.link(t)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (u = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(u.raw.length);
        const m = n.at(-1);
        u.type === "text" && (m == null ? void 0 : m.type) === "text" ? (m.raw += u.raw, m.text += u.text) : n.push(u);
        continue;
      }
      if (u = this.tokenizer.emStrong(t, s, o)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (u = this.tokenizer.codespan(t)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (u = this.tokenizer.br(t)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (u = this.tokenizer.del(t)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (u = this.tokenizer.autolink(t)) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      if (!this.state.inLink && (u = this.tokenizer.url(t))) {
        t = t.substring(u.raw.length), n.push(u);
        continue;
      }
      let w = t;
      if ((d = this.options.extensions) != null && d.startInline) {
        let m = 1 / 0;
        const N = t.slice(1);
        let M;
        this.options.extensions.startInline.forEach((G) => {
          M = G.call({ lexer: this }, N), typeof M == "number" && M >= 0 && (m = Math.min(m, M));
        }), m < 1 / 0 && m >= 0 && (w = t.substring(0, m + 1));
      }
      if (u = this.tokenizer.inlineText(w)) {
        t = t.substring(u.raw.length), u.raw.slice(-1) !== "_" && (o = u.raw.slice(-1)), r = !0;
        const m = n.at(-1);
        (m == null ? void 0 : m.type) === "text" ? (m.raw += u.raw, m.text += u.text) : n.push(u);
        continue;
      }
      if (t) {
        const m = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(m);
          break;
        } else
          throw new Error(m);
      }
    }
    return n;
  }
}, Gi = class {
  // set by the parser
  constructor(e) {
    et(this, "options");
    et(this, "parser");
    this.options = e || ts;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    var r;
    const s = (r = (t || "").match(Nt.notSpaceStart)) == null ? void 0 : r[0], i = e.replace(Nt.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + rn(s) + '">' + (n ? i : rn(i, !0)) + `</code></pre>
` : "<pre><code>" + (n ? i : rn(i, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    const t = e.ordered, n = e.start;
    let s = "";
    for (let o = 0; o < e.items.length; o++) {
      const a = e.items[o];
      s += this.listitem(a);
    }
    const i = t ? "ol" : "ul", r = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + r + `>
` + s + "</" + i + `>
`;
  }
  listitem(e) {
    var n;
    let t = "";
    if (e.task) {
      const s = this.checkbox({ checked: !!e.checked });
      e.loose ? ((n = e.tokens[0]) == null ? void 0 : n.type) === "paragraph" ? (e.tokens[0].text = s + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = s + " " + rn(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = !0)) : e.tokens.unshift({
        type: "text",
        raw: s + " ",
        text: s + " ",
        escaped: !0
      }) : t += s + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0; i < e.header.length; i++)
      n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let i = 0; i < e.rows.length; i++) {
      const r = e.rows[i];
      n = "";
      for (let o = 0; o < r.length; o++)
        n += this.tablecell(r[o]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    const t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${rn(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    const s = this.parser.parseInline(n), i = Ka(e);
    if (i === null)
      return s;
    e = i;
    let r = '<a href="' + e + '"';
    return t && (r += ' title="' + rn(t) + '"'), r += ">" + s + "</a>", r;
  }
  image({ href: e, title: t, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    const i = Ka(e);
    if (i === null)
      return rn(n);
    e = i;
    let r = `<img src="${e}" alt="${n}"`;
    return t && (r += ` title="${rn(t)}"`), r += ">", r;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : rn(e.text);
  }
}, Bo = class {
  // no need for block level renderers
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
}, wn = class io {
  constructor(t) {
    et(this, "options");
    et(this, "renderer");
    et(this, "textRenderer");
    this.options = t || ts, this.options.renderer = this.options.renderer || new Gi(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Bo();
  }
  /**
   * Static Parse Method
   */
  static parse(t, n) {
    return new io(n).parse(t);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(t, n) {
    return new io(n).parseInline(t);
  }
  /**
   * Parse Loop
   */
  parse(t, n = !0) {
    var i, r;
    let s = "";
    for (let o = 0; o < t.length; o++) {
      const a = t[o];
      if ((r = (i = this.options.extensions) == null ? void 0 : i.renderers) != null && r[a.type]) {
        const d = a, u = this.options.extensions.renderers[d.type].call({ parser: this }, d);
        if (u !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(d.type)) {
          s += u || "";
          continue;
        }
      }
      const l = a;
      switch (l.type) {
        case "space": {
          s += this.renderer.space(l);
          continue;
        }
        case "hr": {
          s += this.renderer.hr(l);
          continue;
        }
        case "heading": {
          s += this.renderer.heading(l);
          continue;
        }
        case "code": {
          s += this.renderer.code(l);
          continue;
        }
        case "table": {
          s += this.renderer.table(l);
          continue;
        }
        case "blockquote": {
          s += this.renderer.blockquote(l);
          continue;
        }
        case "list": {
          s += this.renderer.list(l);
          continue;
        }
        case "html": {
          s += this.renderer.html(l);
          continue;
        }
        case "paragraph": {
          s += this.renderer.paragraph(l);
          continue;
        }
        case "text": {
          let d = l, u = this.renderer.text(d);
          for (; o + 1 < t.length && t[o + 1].type === "text"; )
            d = t[++o], u += `
` + this.renderer.text(d);
          n ? s += this.renderer.paragraph({
            type: "paragraph",
            raw: u,
            text: u,
            tokens: [{ type: "text", raw: u, text: u, escaped: !0 }]
          }) : s += u;
          continue;
        }
        default: {
          const d = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent)
            return console.error(d), "";
          throw new Error(d);
        }
      }
    }
    return s;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(t, n = this.renderer) {
    var i, r;
    let s = "";
    for (let o = 0; o < t.length; o++) {
      const a = t[o];
      if ((r = (i = this.options.extensions) == null ? void 0 : i.renderers) != null && r[a.type]) {
        const d = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (d !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          s += d || "";
          continue;
        }
      }
      const l = a;
      switch (l.type) {
        case "escape": {
          s += n.text(l);
          break;
        }
        case "html": {
          s += n.html(l);
          break;
        }
        case "link": {
          s += n.link(l);
          break;
        }
        case "image": {
          s += n.image(l);
          break;
        }
        case "strong": {
          s += n.strong(l);
          break;
        }
        case "em": {
          s += n.em(l);
          break;
        }
        case "codespan": {
          s += n.codespan(l);
          break;
        }
        case "br": {
          s += n.br(l);
          break;
        }
        case "del": {
          s += n.del(l);
          break;
        }
        case "text": {
          s += n.text(l);
          break;
        }
        default: {
          const d = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent)
            return console.error(d), "";
          throw new Error(d);
        }
      }
    }
    return s;
  }
}, qr, Li = (qr = class {
  constructor(e) {
    et(this, "options");
    et(this, "block");
    this.options = e || ts;
  }
  /**
   * Process markdown before marked
   */
  preprocess(e) {
    return e;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(e) {
    return e;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(e) {
    return e;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? bn.lex : bn.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? wn.parse : wn.parseInline;
  }
}, et(qr, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), qr), $d = class {
  constructor(...e) {
    et(this, "defaults", Io());
    et(this, "options", this.setOptions);
    et(this, "parse", this.parseMarkdown(!0));
    et(this, "parseInline", this.parseMarkdown(!1));
    et(this, "Parser", wn);
    et(this, "Renderer", Gi);
    et(this, "TextRenderer", Bo);
    et(this, "Lexer", bn);
    et(this, "Tokenizer", Ki);
    et(this, "Hooks", Li);
    this.use(...e);
  }
  /**
   * Run callback for every token
   */
  walkTokens(e, t) {
    var s, i;
    let n = [];
    for (const r of e)
      switch (n = n.concat(t.call(this, r)), r.type) {
        case "table": {
          const o = r;
          for (const a of o.header)
            n = n.concat(this.walkTokens(a.tokens, t));
          for (const a of o.rows)
            for (const l of a)
              n = n.concat(this.walkTokens(l.tokens, t));
          break;
        }
        case "list": {
          const o = r;
          n = n.concat(this.walkTokens(o.items, t));
          break;
        }
        default: {
          const o = r;
          (i = (s = this.defaults.extensions) == null ? void 0 : s.childTokens) != null && i[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((a) => {
            const l = o[a].flat(1 / 0);
            n = n.concat(this.walkTokens(l, t));
          }) : o.tokens && (n = n.concat(this.walkTokens(o.tokens, t)));
        }
      }
    return n;
  }
  use(...e) {
    const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      const s = { ...n };
      if (s.async = this.defaults.async || s.async || !1, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name)
          throw new Error("extension name required");
        if ("renderer" in i) {
          const r = t.renderers[i.name];
          r ? t.renderers[i.name] = function(...o) {
            let a = i.renderer.apply(this, o);
            return a === !1 && (a = r.apply(this, o)), a;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const r = t[i.level];
          r ? r.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), s.extensions = t), n.renderer) {
        const i = this.defaults.renderer || new Gi(this.defaults);
        for (const r in n.renderer) {
          if (!(r in i))
            throw new Error(`renderer '${r}' does not exist`);
          if (["options", "parser"].includes(r))
            continue;
          const o = r, a = n.renderer[o], l = i[o];
          i[o] = (...d) => {
            let u = a.apply(i, d);
            return u === !1 && (u = l.apply(i, d)), u || "";
          };
        }
        s.renderer = i;
      }
      if (n.tokenizer) {
        const i = this.defaults.tokenizer || new Ki(this.defaults);
        for (const r in n.tokenizer) {
          if (!(r in i))
            throw new Error(`tokenizer '${r}' does not exist`);
          if (["options", "rules", "lexer"].includes(r))
            continue;
          const o = r, a = n.tokenizer[o], l = i[o];
          i[o] = (...d) => {
            let u = a.apply(i, d);
            return u === !1 && (u = l.apply(i, d)), u;
          };
        }
        s.tokenizer = i;
      }
      if (n.hooks) {
        const i = this.defaults.hooks || new Li();
        for (const r in n.hooks) {
          if (!(r in i))
            throw new Error(`hook '${r}' does not exist`);
          if (["options", "block"].includes(r))
            continue;
          const o = r, a = n.hooks[o], l = i[o];
          Li.passThroughHooks.has(r) ? i[o] = (d) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(i, d)).then((w) => l.call(i, w));
            const u = a.call(i, d);
            return l.call(i, u);
          } : i[o] = (...d) => {
            let u = a.apply(i, d);
            return u === !1 && (u = l.apply(i, d)), u;
          };
        }
        s.hooks = i;
      }
      if (n.walkTokens) {
        const i = this.defaults.walkTokens, r = n.walkTokens;
        s.walkTokens = function(o) {
          let a = [];
          return a.push(r.call(this, o)), i && (a = a.concat(i.call(this, o))), a;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return bn.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return wn.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, s) => {
      const i = { ...s }, r = { ...this.defaults, ...i }, o = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1)
        return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null)
        return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string")
        return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      r.hooks && (r.hooks.options = r, r.hooks.block = e);
      const a = r.hooks ? r.hooks.provideLexer() : e ? bn.lex : bn.lexInline, l = r.hooks ? r.hooks.provideParser() : e ? wn.parse : wn.parseInline;
      if (r.async)
        return Promise.resolve(r.hooks ? r.hooks.preprocess(n) : n).then((d) => a(d, r)).then((d) => r.hooks ? r.hooks.processAllTokens(d) : d).then((d) => r.walkTokens ? Promise.all(this.walkTokens(d, r.walkTokens)).then(() => d) : d).then((d) => l(d, r)).then((d) => r.hooks ? r.hooks.postprocess(d) : d).catch(o);
      try {
        r.hooks && (n = r.hooks.preprocess(n));
        let d = a(n, r);
        r.hooks && (d = r.hooks.processAllTokens(d)), r.walkTokens && this.walkTokens(d, r.walkTokens);
        let u = l(d, r);
        return r.hooks && (u = r.hooks.postprocess(u)), u;
      } catch (d) {
        return o(d);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        const s = "<p>An error occurred:</p><pre>" + rn(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(s) : s;
      }
      if (t)
        return Promise.reject(n);
      throw n;
    };
  }
}, es = new $d();
function ze(e, t) {
  return es.parse(e, t);
}
ze.options = ze.setOptions = function(e) {
  return es.setOptions(e), ze.defaults = es.defaults, xc(ze.defaults), ze;
};
ze.getDefaults = Io;
ze.defaults = ts;
ze.use = function(...e) {
  return es.use(...e), ze.defaults = es.defaults, xc(ze.defaults), ze;
};
ze.walkTokens = function(e, t) {
  return es.walkTokens(e, t);
};
ze.parseInline = es.parseInline;
ze.Parser = wn;
ze.parser = wn.parse;
ze.Renderer = Gi;
ze.TextRenderer = Bo;
ze.Lexer = bn;
ze.lexer = bn.lex;
ze.Tokenizer = Ki;
ze.Hooks = Li;
ze.parse = ze;
ze.options;
ze.setOptions;
ze.use;
ze.walkTokens;
ze.parseInline;
wn.parse;
bn.lex;
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: Pc,
  setPrototypeOf: Xa,
  isFrozen: Ud,
  getPrototypeOf: zd,
  getOwnPropertyDescriptor: Hd
} = Object;
let {
  freeze: Pt,
  seal: Yt,
  create: Mc
} = Object, {
  apply: ro,
  construct: oo
} = typeof Reflect < "u" && Reflect;
Pt || (Pt = function(t) {
  return t;
});
Yt || (Yt = function(t) {
  return t;
});
ro || (ro = function(t, n, s) {
  return t.apply(n, s);
});
oo || (oo = function(t, n) {
  return new t(...n);
});
const wi = Mt(Array.prototype.forEach), qd = Mt(Array.prototype.lastIndexOf), Za = Mt(Array.prototype.pop), Bs = Mt(Array.prototype.push), Wd = Mt(Array.prototype.splice), Oi = Mt(String.prototype.toLowerCase), Pr = Mt(String.prototype.toString), Ja = Mt(String.prototype.match), $s = Mt(String.prototype.replace), jd = Mt(String.prototype.indexOf), Vd = Mt(String.prototype.trim), Jt = Mt(Object.prototype.hasOwnProperty), Rt = Mt(RegExp.prototype.test), Us = Kd(TypeError);
function Mt(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var n = arguments.length, s = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
      s[i - 1] = arguments[i];
    return ro(e, t, s);
  };
}
function Kd(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), s = 0; s < t; s++)
      n[s] = arguments[s];
    return oo(e, n);
  };
}
function Ee(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Oi;
  Xa && Xa(e, null);
  let s = t.length;
  for (; s--; ) {
    let i = t[s];
    if (typeof i == "string") {
      const r = n(i);
      r !== i && (Ud(t) || (t[s] = r), i = r);
    }
    e[i] = !0;
  }
  return e;
}
function Gd(e) {
  for (let t = 0; t < e.length; t++)
    Jt(e, t) || (e[t] = null);
  return e;
}
function mn(e) {
  const t = Mc(null);
  for (const [n, s] of Pc(e))
    Jt(e, n) && (Array.isArray(s) ? t[n] = Gd(s) : s && typeof s == "object" && s.constructor === Object ? t[n] = mn(s) : t[n] = s);
  return t;
}
function zs(e, t) {
  for (; e !== null; ) {
    const s = Hd(e, t);
    if (s) {
      if (s.get)
        return Mt(s.get);
      if (typeof s.value == "function")
        return Mt(s.value);
    }
    e = zd(e);
  }
  function n() {
    return null;
  }
  return n;
}
const Qa = Pt(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Mr = Pt(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Fr = Pt(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Yd = Pt(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Dr = Pt(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Xd = Pt(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), el = Pt(["#text"]), tl = Pt(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Br = Pt(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), nl = Pt(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), ki = Pt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Zd = Yt(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Jd = Yt(/<%[\w\W]*|[\w\W]*%>/gm), Qd = Yt(/\$\{[\w\W]*/gm), ep = Yt(/^data-[\-\w.\u00B7-\uFFFF]+$/), tp = Yt(/^aria-[\-\w]+$/), Fc = Yt(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), np = Yt(/^(?:\w+script|data):/i), sp = Yt(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Dc = Yt(/^html$/i), ip = Yt(/^[a-z][.\w]*(-[.\w]+)+$/i);
var sl = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: tp,
  ATTR_WHITESPACE: sp,
  CUSTOM_ELEMENT: ip,
  DATA_ATTR: ep,
  DOCTYPE_NAME: Dc,
  ERB_EXPR: Jd,
  IS_ALLOWED_URI: Fc,
  IS_SCRIPT_OR_DATA: np,
  MUSTACHE_EXPR: Zd,
  TMPLIT_EXPR: Qd
});
const Hs = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, rp = function() {
  return typeof window > "u" ? null : window;
}, op = function(t, n) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let s = null;
  const i = "data-tt-policy-suffix";
  n && n.hasAttribute(i) && (s = n.getAttribute(i));
  const r = "dompurify" + (s ? "#" + s : "");
  try {
    return t.createPolicy(r, {
      createHTML(o) {
        return o;
      },
      createScriptURL(o) {
        return o;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + r + " could not be created."), null;
  }
}, il = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function Bc() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : rp();
  const t = (oe) => Bc(oe);
  if (t.version = "3.2.6", t.removed = [], !e || !e.document || e.document.nodeType !== Hs.document || !e.Element)
    return t.isSupported = !1, t;
  let {
    document: n
  } = e;
  const s = n, i = s.currentScript, {
    DocumentFragment: r,
    HTMLTemplateElement: o,
    Node: a,
    Element: l,
    NodeFilter: d,
    NamedNodeMap: u = e.NamedNodeMap || e.MozNamedAttrMap,
    HTMLFormElement: w,
    DOMParser: m,
    trustedTypes: N
  } = e, M = l.prototype, G = zs(M, "cloneNode"), Fe = zs(M, "remove"), de = zs(M, "nextSibling"), _e = zs(M, "childNodes"), ke = zs(M, "parentNode");
  if (typeof o == "function") {
    const oe = n.createElement("template");
    oe.content && oe.content.ownerDocument && (n = oe.content.ownerDocument);
  }
  let S, L = "";
  const {
    implementation: V,
    createNodeIterator: Y,
    createDocumentFragment: Se,
    getElementsByTagName: He
  } = n, {
    importNode: Xe
  } = s;
  let Ce = il();
  t.isSupported = typeof Pc == "function" && typeof ke == "function" && V && V.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: be,
    ERB_EXPR: Je,
    TMPLIT_EXPR: nt,
    DATA_ATTR: lt,
    ARIA_ATTR: he,
    IS_SCRIPT_OR_DATA: ge,
    ATTR_WHITESPACE: le,
    CUSTOM_ELEMENT: Te
  } = sl;
  let {
    IS_ALLOWED_URI: st
  } = sl, ae = null;
  const De = Ee({}, [...Qa, ...Mr, ...Fr, ...Dr, ...el]);
  let Be = null;
  const At = Ee({}, [...tl, ...Br, ...nl, ...ki]);
  let Le = Object.seal(Mc(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), q = null, Me = null, ce = !0, Oe = !0, K = !1, vt = !0, g = !1, _ = !0, A = !1, F = !1, R = !1, I = !1, B = !1, z = !1, U = !0, P = !1;
  const X = "user-content-";
  let H = !0, W = !1, te = {}, J = null;
  const xe = Ee({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let ve = null;
  const Ze = Ee({}, ["audio", "video", "img", "source", "image", "track"]);
  let Re = null;
  const ct = Ee({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), h = "http://www.w3.org/1998/Math/MathML", v = "http://www.w3.org/2000/svg", C = "http://www.w3.org/1999/xhtml";
  let T = C, D = !1, j = null;
  const ie = Ee({}, [h, v, C], Pr);
  let ue = Ee({}, ["mi", "mo", "mn", "ms", "mtext"]), Ie = Ee({}, ["annotation-xml"]);
  const Qe = Ee({}, ["title", "style", "font", "a", "script"]);
  let Ae = null;
  const dt = ["application/xhtml+xml", "text/html"], pt = "text/html";
  let Ge = null, tn = null;
  const ns = n.createElement("form"), xs = function(y) {
    return y instanceof RegExp || y instanceof Function;
  }, ss = function() {
    let y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(tn && tn === y)) {
      if ((!y || typeof y != "object") && (y = {}), y = mn(y), Ae = // eslint-disable-next-line unicorn/prefer-includes
      dt.indexOf(y.PARSER_MEDIA_TYPE) === -1 ? pt : y.PARSER_MEDIA_TYPE, Ge = Ae === "application/xhtml+xml" ? Pr : Oi, ae = Jt(y, "ALLOWED_TAGS") ? Ee({}, y.ALLOWED_TAGS, Ge) : De, Be = Jt(y, "ALLOWED_ATTR") ? Ee({}, y.ALLOWED_ATTR, Ge) : At, j = Jt(y, "ALLOWED_NAMESPACES") ? Ee({}, y.ALLOWED_NAMESPACES, Pr) : ie, Re = Jt(y, "ADD_URI_SAFE_ATTR") ? Ee(mn(ct), y.ADD_URI_SAFE_ATTR, Ge) : ct, ve = Jt(y, "ADD_DATA_URI_TAGS") ? Ee(mn(Ze), y.ADD_DATA_URI_TAGS, Ge) : Ze, J = Jt(y, "FORBID_CONTENTS") ? Ee({}, y.FORBID_CONTENTS, Ge) : xe, q = Jt(y, "FORBID_TAGS") ? Ee({}, y.FORBID_TAGS, Ge) : mn({}), Me = Jt(y, "FORBID_ATTR") ? Ee({}, y.FORBID_ATTR, Ge) : mn({}), te = Jt(y, "USE_PROFILES") ? y.USE_PROFILES : !1, ce = y.ALLOW_ARIA_ATTR !== !1, Oe = y.ALLOW_DATA_ATTR !== !1, K = y.ALLOW_UNKNOWN_PROTOCOLS || !1, vt = y.ALLOW_SELF_CLOSE_IN_ATTR !== !1, g = y.SAFE_FOR_TEMPLATES || !1, _ = y.SAFE_FOR_XML !== !1, A = y.WHOLE_DOCUMENT || !1, I = y.RETURN_DOM || !1, B = y.RETURN_DOM_FRAGMENT || !1, z = y.RETURN_TRUSTED_TYPE || !1, R = y.FORCE_BODY || !1, U = y.SANITIZE_DOM !== !1, P = y.SANITIZE_NAMED_PROPS || !1, H = y.KEEP_CONTENT !== !1, W = y.IN_PLACE || !1, st = y.ALLOWED_URI_REGEXP || Fc, T = y.NAMESPACE || C, ue = y.MATHML_TEXT_INTEGRATION_POINTS || ue, Ie = y.HTML_INTEGRATION_POINTS || Ie, Le = y.CUSTOM_ELEMENT_HANDLING || {}, y.CUSTOM_ELEMENT_HANDLING && xs(y.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (Le.tagNameCheck = y.CUSTOM_ELEMENT_HANDLING.tagNameCheck), y.CUSTOM_ELEMENT_HANDLING && xs(y.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (Le.attributeNameCheck = y.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), y.CUSTOM_ELEMENT_HANDLING && typeof y.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (Le.allowCustomizedBuiltInElements = y.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), g && (Oe = !1), B && (I = !0), te && (ae = Ee({}, el), Be = [], te.html === !0 && (Ee(ae, Qa), Ee(Be, tl)), te.svg === !0 && (Ee(ae, Mr), Ee(Be, Br), Ee(Be, ki)), te.svgFilters === !0 && (Ee(ae, Fr), Ee(Be, Br), Ee(Be, ki)), te.mathMl === !0 && (Ee(ae, Dr), Ee(Be, nl), Ee(Be, ki))), y.ADD_TAGS && (ae === De && (ae = mn(ae)), Ee(ae, y.ADD_TAGS, Ge)), y.ADD_ATTR && (Be === At && (Be = mn(Be)), Ee(Be, y.ADD_ATTR, Ge)), y.ADD_URI_SAFE_ATTR && Ee(Re, y.ADD_URI_SAFE_ATTR, Ge), y.FORBID_CONTENTS && (J === xe && (J = mn(J)), Ee(J, y.FORBID_CONTENTS, Ge)), H && (ae["#text"] = !0), A && Ee(ae, ["html", "head", "body"]), ae.table && (Ee(ae, ["tbody"]), delete q.tbody), y.TRUSTED_TYPES_POLICY) {
        if (typeof y.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Us('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof y.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Us('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        S = y.TRUSTED_TYPES_POLICY, L = S.createHTML("");
      } else
        S === void 0 && (S = op(N, i)), S !== null && typeof L == "string" && (L = S.createHTML(""));
      Pt && Pt(y), tn = y;
    }
  }, As = Ee({}, [...Mr, ...Fr, ...Yd]), Ss = Ee({}, [...Dr, ...Xd]), fi = function(y) {
    let $ = ke(y);
    (!$ || !$.tagName) && ($ = {
      namespaceURI: T,
      tagName: "template"
    });
    const Q = Oi(y.tagName), qe = Oi($.tagName);
    return j[y.namespaceURI] ? y.namespaceURI === v ? $.namespaceURI === C ? Q === "svg" : $.namespaceURI === h ? Q === "svg" && (qe === "annotation-xml" || ue[qe]) : !!As[Q] : y.namespaceURI === h ? $.namespaceURI === C ? Q === "math" : $.namespaceURI === v ? Q === "math" && Ie[qe] : !!Ss[Q] : y.namespaceURI === C ? $.namespaceURI === v && !Ie[qe] || $.namespaceURI === h && !ue[qe] ? !1 : !Ss[Q] && (Qe[Q] || !As[Q]) : !!(Ae === "application/xhtml+xml" && j[y.namespaceURI]) : !1;
  }, Bt = function(y) {
    Bs(t.removed, {
      element: y
    });
    try {
      ke(y).removeChild(y);
    } catch {
      Fe(y);
    }
  }, Sn = function(y, $) {
    try {
      Bs(t.removed, {
        attribute: $.getAttributeNode(y),
        from: $
      });
    } catch {
      Bs(t.removed, {
        attribute: null,
        from: $
      });
    }
    if ($.removeAttribute(y), y === "is")
      if (I || B)
        try {
          Bt($);
        } catch {
        }
      else
        try {
          $.setAttribute(y, "");
        } catch {
        }
  }, is = function(y) {
    let $ = null, Q = null;
    if (R)
      y = "<remove></remove>" + y;
    else {
      const ot = Ja(y, /^[\r\n\t ]+/);
      Q = ot && ot[0];
    }
    Ae === "application/xhtml+xml" && T === C && (y = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + y + "</body></html>");
    const qe = S ? S.createHTML(y) : y;
    if (T === C)
      try {
        $ = new m().parseFromString(qe, Ae);
      } catch {
      }
    if (!$ || !$.documentElement) {
      $ = V.createDocument(T, "template", null);
      try {
        $.documentElement.innerHTML = D ? L : qe;
      } catch {
      }
    }
    const yt = $.body || $.documentElement;
    return y && Q && yt.insertBefore(n.createTextNode(Q), yt.childNodes[0] || null), T === C ? He.call($, A ? "html" : "body")[0] : A ? $.documentElement : yt;
  }, Un = function(y) {
    return Y.call(
      y.ownerDocument || y,
      y,
      // eslint-disable-next-line no-bitwise
      d.SHOW_ELEMENT | d.SHOW_COMMENT | d.SHOW_TEXT | d.SHOW_PROCESSING_INSTRUCTION | d.SHOW_CDATA_SECTION,
      null
    );
  }, rs = function(y) {
    return y instanceof w && (typeof y.nodeName != "string" || typeof y.textContent != "string" || typeof y.removeChild != "function" || !(y.attributes instanceof u) || typeof y.removeAttribute != "function" || typeof y.setAttribute != "function" || typeof y.namespaceURI != "string" || typeof y.insertBefore != "function" || typeof y.hasChildNodes != "function");
  }, Ts = function(y) {
    return typeof a == "function" && y instanceof a;
  };
  function gt(oe, y, $) {
    wi(oe, (Q) => {
      Q.call(t, y, $, tn);
    });
  }
  const os = function(y) {
    let $ = null;
    if (gt(Ce.beforeSanitizeElements, y, null), rs(y))
      return Bt(y), !0;
    const Q = Ge(y.nodeName);
    if (gt(Ce.uponSanitizeElement, y, {
      tagName: Q,
      allowedTags: ae
    }), _ && y.hasChildNodes() && !Ts(y.firstElementChild) && Rt(/<[/\w!]/g, y.innerHTML) && Rt(/<[/\w!]/g, y.textContent) || y.nodeType === Hs.progressingInstruction || _ && y.nodeType === Hs.comment && Rt(/<[/\w]/g, y.data))
      return Bt(y), !0;
    if (!ae[Q] || q[Q]) {
      if (!q[Q] && Es(Q) && (Le.tagNameCheck instanceof RegExp && Rt(Le.tagNameCheck, Q) || Le.tagNameCheck instanceof Function && Le.tagNameCheck(Q)))
        return !1;
      if (H && !J[Q]) {
        const qe = ke(y) || y.parentNode, yt = _e(y) || y.childNodes;
        if (yt && qe) {
          const ot = yt.length;
          for (let bt = ot - 1; bt >= 0; --bt) {
            const Xt = G(yt[bt], !0);
            Xt.__removalCount = (y.__removalCount || 0) + 1, qe.insertBefore(Xt, de(y));
          }
        }
      }
      return Bt(y), !0;
    }
    return y instanceof l && !fi(y) || (Q === "noscript" || Q === "noembed" || Q === "noframes") && Rt(/<\/no(script|embed|frames)/i, y.innerHTML) ? (Bt(y), !0) : (g && y.nodeType === Hs.text && ($ = y.textContent, wi([be, Je, nt], (qe) => {
      $ = $s($, qe, " ");
    }), y.textContent !== $ && (Bs(t.removed, {
      element: y.cloneNode()
    }), y.textContent = $)), gt(Ce.afterSanitizeElements, y, null), !1);
  }, nn = function(y, $, Q) {
    if (U && ($ === "id" || $ === "name") && (Q in n || Q in ns))
      return !1;
    if (!(Oe && !Me[$] && Rt(lt, $))) {
      if (!(ce && Rt(he, $))) {
        if (!Be[$] || Me[$]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(Es(y) && (Le.tagNameCheck instanceof RegExp && Rt(Le.tagNameCheck, y) || Le.tagNameCheck instanceof Function && Le.tagNameCheck(y)) && (Le.attributeNameCheck instanceof RegExp && Rt(Le.attributeNameCheck, $) || Le.attributeNameCheck instanceof Function && Le.attributeNameCheck($)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            $ === "is" && Le.allowCustomizedBuiltInElements && (Le.tagNameCheck instanceof RegExp && Rt(Le.tagNameCheck, Q) || Le.tagNameCheck instanceof Function && Le.tagNameCheck(Q)))
          ) return !1;
        } else if (!Re[$]) {
          if (!Rt(st, $s(Q, le, ""))) {
            if (!(($ === "src" || $ === "xlink:href" || $ === "href") && y !== "script" && jd(Q, "data:") === 0 && ve[y])) {
              if (!(K && !Rt(ge, $s(Q, le, "")))) {
                if (Q)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, Es = function(y) {
    return y !== "annotation-xml" && Ja(y, Te);
  }, zn = function(y) {
    gt(Ce.beforeSanitizeAttributes, y, null);
    const {
      attributes: $
    } = y;
    if (!$ || rs(y))
      return;
    const Q = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: Be,
      forceKeepAttr: void 0
    };
    let qe = $.length;
    for (; qe--; ) {
      const yt = $[qe], {
        name: ot,
        namespaceURI: bt,
        value: Xt
      } = yt, Tn = Ge(ot), En = Xt;
      let ut = ot === "value" ? En : Vd(En);
      if (Q.attrName = Tn, Q.attrValue = ut, Q.keepAttr = !0, Q.forceKeepAttr = void 0, gt(Ce.uponSanitizeAttribute, y, Q), ut = Q.attrValue, P && (Tn === "id" || Tn === "name") && (Sn(ot, y), ut = X + ut), _ && Rt(/((--!?|])>)|<\/(style|title)/i, ut)) {
        Sn(ot, y);
        continue;
      }
      if (Q.forceKeepAttr)
        continue;
      if (!Q.keepAttr) {
        Sn(ot, y);
        continue;
      }
      if (!vt && Rt(/\/>/i, ut)) {
        Sn(ot, y);
        continue;
      }
      g && wi([be, Je, nt], (Ut) => {
        ut = $s(ut, Ut, " ");
      });
      const $t = Ge(y.nodeName);
      if (!nn($t, Tn, ut)) {
        Sn(ot, y);
        continue;
      }
      if (S && typeof N == "object" && typeof N.getAttributeType == "function" && !bt)
        switch (N.getAttributeType($t, Tn)) {
          case "TrustedHTML": {
            ut = S.createHTML(ut);
            break;
          }
          case "TrustedScriptURL": {
            ut = S.createScriptURL(ut);
            break;
          }
        }
      if (ut !== En)
        try {
          bt ? y.setAttributeNS(bt, ot, ut) : y.setAttribute(ot, ut), rs(y) ? Bt(y) : Za(t.removed);
        } catch {
          Sn(ot, y);
        }
    }
    gt(Ce.afterSanitizeAttributes, y, null);
  }, hr = function oe(y) {
    let $ = null;
    const Q = Un(y);
    for (gt(Ce.beforeSanitizeShadowDOM, y, null); $ = Q.nextNode(); )
      gt(Ce.uponSanitizeShadowNode, $, null), os($), zn($), $.content instanceof r && oe($.content);
    gt(Ce.afterSanitizeShadowDOM, y, null);
  };
  return t.sanitize = function(oe) {
    let y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, $ = null, Q = null, qe = null, yt = null;
    if (D = !oe, D && (oe = "<!-->"), typeof oe != "string" && !Ts(oe))
      if (typeof oe.toString == "function") {
        if (oe = oe.toString(), typeof oe != "string")
          throw Us("dirty is not a string, aborting");
      } else
        throw Us("toString is not a function");
    if (!t.isSupported)
      return oe;
    if (F || ss(y), t.removed = [], typeof oe == "string" && (W = !1), W) {
      if (oe.nodeName) {
        const Xt = Ge(oe.nodeName);
        if (!ae[Xt] || q[Xt])
          throw Us("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (oe instanceof a)
      $ = is("<!---->"), Q = $.ownerDocument.importNode(oe, !0), Q.nodeType === Hs.element && Q.nodeName === "BODY" || Q.nodeName === "HTML" ? $ = Q : $.appendChild(Q);
    else {
      if (!I && !g && !A && // eslint-disable-next-line unicorn/prefer-includes
      oe.indexOf("<") === -1)
        return S && z ? S.createHTML(oe) : oe;
      if ($ = is(oe), !$)
        return I ? null : z ? L : "";
    }
    $ && R && Bt($.firstChild);
    const ot = Un(W ? oe : $);
    for (; qe = ot.nextNode(); )
      os(qe), zn(qe), qe.content instanceof r && hr(qe.content);
    if (W)
      return oe;
    if (I) {
      if (B)
        for (yt = Se.call($.ownerDocument); $.firstChild; )
          yt.appendChild($.firstChild);
      else
        yt = $;
      return (Be.shadowroot || Be.shadowrootmode) && (yt = Xe.call(s, yt, !0)), yt;
    }
    let bt = A ? $.outerHTML : $.innerHTML;
    return A && ae["!doctype"] && $.ownerDocument && $.ownerDocument.doctype && $.ownerDocument.doctype.name && Rt(Dc, $.ownerDocument.doctype.name) && (bt = "<!DOCTYPE " + $.ownerDocument.doctype.name + `>
` + bt), g && wi([be, Je, nt], (Xt) => {
      bt = $s(bt, Xt, " ");
    }), S && z ? S.createHTML(bt) : bt;
  }, t.setConfig = function() {
    let oe = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    ss(oe), F = !0;
  }, t.clearConfig = function() {
    tn = null, F = !1;
  }, t.isValidAttribute = function(oe, y, $) {
    tn || ss({});
    const Q = Ge(oe), qe = Ge(y);
    return nn(Q, qe, $);
  }, t.addHook = function(oe, y) {
    typeof y == "function" && Bs(Ce[oe], y);
  }, t.removeHook = function(oe, y) {
    if (y !== void 0) {
      const $ = qd(Ce[oe], y);
      return $ === -1 ? void 0 : Wd(Ce[oe], $, 1)[0];
    }
    return Za(Ce[oe]);
  }, t.removeHooks = function(oe) {
    Ce[oe] = [];
  }, t.removeAllHooks = function() {
    Ce = il();
  }, t;
}
var $o = Bc();
$o.addHook("uponSanitizeElement", (e, t) => {
  var i, r, o, a, l;
  if (t.tagName === "svg") {
    (i = e.parentNode) == null || i.removeChild(e);
    return;
  }
  if (t.tagName === "math") {
    (r = e.parentNode) == null || r.removeChild(e);
    return;
  }
  if (t.tagName === "foreignobject") {
    (o = e.parentNode) == null || o.removeChild(e);
    return;
  }
  const n = e, s = (a = t.tagName) == null ? void 0 : a.toUpperCase();
  (s === "IMG" || s === "AREA" || s === "MAP") && ((l = n.parentNode) == null || l.removeChild(n));
});
$o.addHook("afterSanitizeAttributes", (e) => {
  if (e.hasAttribute("href")) {
    const t = e.getAttribute("href") || "";
    try {
      const n = decodeURIComponent(t.toLowerCase());
      (n.includes("javascript:") || n.includes("data:text/html") || n.includes("vbscript:") || n.includes("about:") || n.includes("file:")) && e.removeAttribute("href");
    } catch {
      (t.toLowerCase().includes("javascript:") || t.toLowerCase().includes("data:text/html") || t.toLowerCase().includes("vbscript:") || t.toLowerCase().includes("about:") || t.toLowerCase().includes("file:")) && e.removeAttribute("href");
    }
  }
  if (e.nodeName === "A") {
    const t = (e.getAttribute("href") || "").trim();
    /^(https?:|mailto:)/i.test(t) ? (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer nofollow")) : e.removeAttribute("href");
  }
  if (e.hasAttribute("src")) {
    const t = e.getAttribute("src") || "";
    try {
      const n = decodeURIComponent(t.toLowerCase());
      (n.includes("javascript:") || n.includes("data:text/html") || n.includes("vbscript:") || n.includes("about:") || n.includes("file:")) && e.removeAttribute("src");
    } catch {
      (t.toLowerCase().includes("javascript:") || t.toLowerCase().includes("data:text/html") || t.toLowerCase().includes("vbscript:") || t.toLowerCase().includes("about:") || t.toLowerCase().includes("file:")) && e.removeAttribute("src");
    }
  }
  if (e.hasAttribute("style")) {
    const t = e.getAttribute("style") || "";
    try {
      const n = decodeURIComponent(t.toLowerCase());
      (n.includes("expression(") || n.includes("behavior:") || n.includes("-moz-binding") || n.includes("import") || n.includes("javascript:") || n.includes("vbscript:")) && e.removeAttribute("style");
    } catch {
      (t.toLowerCase().includes("expression(") || t.toLowerCase().includes("behavior:") || t.toLowerCase().includes("-moz-binding") || t.toLowerCase().includes("import") || t.toLowerCase().includes("javascript:") || t.toLowerCase().includes("vbscript:")) && e.removeAttribute("style");
    }
  }
  Array.from(e.attributes).forEach((t) => {
    t.name.toLowerCase().startsWith("on") && e.removeAttribute(t.name);
  });
});
function ap(e) {
  const t = {
    // Block all dangerous tags including SVG, form elements and images.
    // NOTE: 'a' must NOT be in this list — FORBID_TAGS beats ALLOWED_TAGS, and
    // anchors are intentionally kept (markdown links) then hardened by the
    // afterSanitizeAttributes hook (http(s)/mailto only, forced target+rel).
    FORBID_TAGS: [
      "iframe",
      "frame",
      "frameset",
      "object",
      "embed",
      "applet",
      "script",
      "base",
      "link",
      "meta",
      "style",
      "svg",
      "math",
      "form",
      "input",
      "button",
      "textarea",
      "select",
      "option",
      "xml",
      "xss",
      "import",
      "video",
      "audio",
      "track",
      "source",
      "canvas",
      "details",
      "template",
      "slot",
      "noscript",
      "marquee",
      "bgsound",
      "keygen",
      "command",
      "img",
      "area",
      "map"
      // SECURITY: Remove image/map tags completely
    ],
    // Block dangerous attributes
    FORBID_ATTR: [
      // Event handlers
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onmouseout",
      "onmousemove",
      "onkeydown",
      "onkeyup",
      "onkeypress",
      "onfocus",
      "onblur",
      "onchange",
      "onsubmit",
      "ondblclick",
      "oncontextmenu",
      "oninput",
      "oninvalid",
      "onreset",
      "onsearch",
      "onselect",
      "onabort",
      "oncanplay",
      "oncanplaythrough",
      "oncuechange",
      "ondurationchange",
      "onemptied",
      "onended",
      "onloadeddata",
      "onloadedmetadata",
      "onloadstart",
      "onpause",
      "onplay",
      "onplaying",
      "onprogress",
      "onratechange",
      "onseeked",
      "onseeking",
      "onstalled",
      "onsuspend",
      "ontimeupdate",
      "onvolumechange",
      "onwaiting",
      "ontoggle",
      "onauxclick",
      "ongotpointercapture",
      "onlostpointercapture",
      "onpointercancel",
      "onpointerdown",
      "onpointerenter",
      "onpointerleave",
      "onpointermove",
      "onpointerout",
      "onpointerover",
      "onpointerup",
      "onwheel",
      "onanimationcancel",
      "onanimationend",
      "onanimationiteration",
      "onanimationstart",
      "ontransitioncancel",
      "ontransitionend",
      "ontransitionrun",
      "ontransitionstart",
      "ondrag",
      "ondragend",
      "ondragenter",
      "ondragleave",
      "ondragover",
      "ondragstart",
      "ondrop",
      "oncopy",
      "oncut",
      "onpaste",
      "onscroll",
      "onmessage",
      "onmouseenter",
      "onmouseleave",
      "onmousewheel",
      "onbeforeunload",
      "onerrorupdate",
      "onhelp",
      "onmove",
      "onreadystatechange",
      "onresize",
      "onstart",
      "onstop",
      "onunload",
      "onactivate",
      "onafterprint",
      "onafterupdate",
      "onbeforeactivate",
      "onbeforecopy",
      "onbeforecut",
      "onbeforedeactivate",
      "onbeforeeditfocus",
      "onbeforepaste",
      "onbeforeprint",
      "onbeforeupdate",
      "onbounce",
      "oncellchange",
      "oncontrolselect",
      "ondataavailable",
      "ondatasetchanged",
      "ondatasetcomplete",
      "ondeactivate",
      "onfilterchange",
      "onfinish",
      "onfocusin",
      "onfocusout",
      "onlayoutcomplete",
      "onlosecapture",
      "onmoveend",
      "onmovestart",
      "onpropertychange",
      "onresizeend",
      "onresizestart",
      "onrowenter",
      "onrowexit",
      "onrowsdelete",
      "onrowsinserted",
      "onselectionchange",
      "onselectstart",
      "onshow",
      "onsort",
      "onpointerrawupdate",
      // Dangerous attributes
      "formaction",
      "action",
      "form",
      "srcdoc",
      "srcset",
      "dynsrc",
      "lowsrc",
      "ping",
      "poster",
      "background",
      "code",
      "codebase",
      "archive",
      "profile",
      "xmlns",
      "xlink:href",
      "attributename",
      "from",
      "to",
      "values",
      "begin",
      "autofocus",
      "autoplay",
      "controls",
      "manifest",
      "sandbox",
      // SECURITY: block resource-loading attributes. 'href' is intentionally NOT
      // here (FORBID_ATTR beats ALLOWED_ATTR): markdown links need it, and the
      // afterSanitizeAttributes hook strips any href that isn't http(s)/mailto.
      "src",
      "data"
    ],
    // Only allow safe protocols
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // SECURITY: Strip ALL HTML tags to prevent rendering exploits
    // Only allow basic text formatting for markdown (no links, images, or any potentially dangerous tags)
    ALLOWED_TAGS: [
      "a",
      "b",
      "i",
      "u",
      "strong",
      "em",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
      "div",
      "del",
      "hr",
      "sup",
      "sub",
      "abbr",
      "cite",
      "dfn",
      "kbd",
      "mark",
      "q",
      "samp",
      "small",
      "time",
      "var"
    ],
    // Allow safe link attributes only (href is protocol-restricted + target/rel are
    // forced by the afterSanitizeAttributes hook above). No src or resource-loading attrs.
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "title",
      "class",
      "id",
      "align",
      "colspan",
      "rowspan"
    ],
    // Return a string instead of a document
    RETURN_DOM: !1,
    RETURN_DOM_FRAGMENT: !1,
    // Keep HTML comments removed
    ALLOW_DATA_ATTR: !1
    // NOTE: do NOT set USE_PROFILES here — it overrides ALLOWED_TAGS/ALLOWED_ATTR,
    // which would drop the <a> tags we explicitly allow above. The explicit
    // ALLOWED_TAGS/ALLOWED_ATTR allowlist is authoritative; protocols are still
    // restricted by the afterSanitizeAttributes hook (href → http/https/mailto only).
  };
  return $o.sanitize(e, t);
}
ze.setOptions({
  renderer: new ze.Renderer(),
  gfm: !0,
  breaks: !0
});
const Ni = (e) => ap(ze(e || "")), lp = { class: "askai" }, cp = { class: "askai__bar" }, up = ["value", "placeholder", "disabled", "aria-label", "onKeydown"], fp = ["disabled", "title", "aria-label"], hp = {
  key: 0,
  class: "askai__new-hint"
}, dp = { class: "askai__intro" }, pp = { class: "askai__title" }, gp = {
  key: 0,
  class: "askai__subtitle"
}, mp = {
  key: 0,
  class: "askai__suggestions"
}, _p = ["disabled", "onClick"], vp = ["aria-live"], yp = {
  key: 0,
  class: "askai__question"
}, bp = {
  key: 1,
  class: "askai__system"
}, wp = ["innerHTML"], kp = {
  key: 0,
  class: "askai__sources"
}, xp = ["title"], Ap = {
  key: 0,
  class: "askai__thinking",
  role: "status",
  "aria-live": "polite"
}, Sp = { class: "askai__thinking-text" }, Tp = { class: "askai__foot" }, Ep = { key: 0 }, Cp = /* @__PURE__ */ Kl({
  __name: "AskAiPanel",
  props: {
    messages: {},
    draft: {},
    agentName: {},
    suggestions: {},
    welcomeTitle: {},
    welcomeSubtitle: {},
    placeholder: {},
    inputEnabled: { type: Boolean },
    loading: { type: Boolean },
    showCitations: { type: Boolean },
    disclaimer: {},
    active: { type: Boolean },
    hotkey: { type: Boolean },
    citationLabel: { type: Function },
    citationTooltip: { type: Function },
    displayText: { type: Function },
    isStreaming: { type: Function },
    canStartNewChat: { type: Boolean },
    startingNewChat: { type: Boolean },
    newChatArmed: { type: Boolean }
  },
  emits: ["update:draft", "send", "ask", "close", "newChat", "cancelNewChat"],
  setup(e, { emit: t }) {
    const n = e, s = t, i = re(null), r = re(null), o = re(null), a = ["user", "bot", "agent", "system"], l = fe(
      () => n.messages.map((S, L) => ({ message: S, index: L })).filter(({ message: S }) => a.includes(S.message_type))
    ), d = fe(() => l.value.length > 0), u = (S) => {
      s("update:draft", S.target.value);
    }, w = () => {
      !n.inputEnabled || !n.draft.trim() || s("send");
    }, m = (S) => {
      n.inputEnabled && s("ask", S);
    }, N = typeof navigator < "u" && /Mac|iPod|iPhone|iPad/.test(navigator.platform || ""), M = (S) => {
      if (S.key === "Escape") {
        S.preventDefault(), s("close");
        return;
      }
      const L = N ? S.metaKey && !S.ctrlKey : S.ctrlKey && !S.metaKey;
      n.hotkey && L && !S.altKey && (S.key === "k" || S.key === "K") && (S.preventDefault(), s("close"));
    }, G = () => {
      _s(() => {
        var S;
        return (S = i.value) == null ? void 0 : S.focus();
      });
    };
    let Fe = 0;
    const de = () => {
      if (!o.value) return;
      const S = o.value.closest(".askai"), L = r.value;
      if (!S || !L) return;
      const V = S.offsetHeight - L.offsetHeight, Y = getComputedStyle(L), Se = parseFloat(Y.paddingTop) + parseFloat(Y.paddingBottom), He = Math.ceil(V + Se + o.value.getBoundingClientRect().height);
      Math.abs(He - Fe) < 3 || (Fe = He, window.parent.postMessage({ type: "WIDGET_RESIZE", height: He }, "*"));
    };
    let _e = null;
    const ke = fe(
      () => l.value.reduce((S, { message: L, index: V }) => S + n.displayText(V, L.message || "").length, 0)
    );
    return Vt(
      () => [l.value.length, ke.value, n.loading],
      () => _s(() => {
        r.value && (r.value.scrollTop = r.value.scrollHeight);
      })
    ), Vt(() => n.active, (S) => {
      S && G();
    }), ir(() => {
      n.active && G(), window.addEventListener("keydown", M), o.value && typeof ResizeObserver < "u" && (_e = new ResizeObserver(() => de()), _e.observe(o.value)), de();
    }), Zl(() => {
      window.removeEventListener("keydown", M), _e == null || _e.disconnect(), _e = null;
    }), (S, L) => (k(), x("div", lp, [
      b("div", cp, [
        L[5] || (L[5] = b("svg", {
          class: "askai__bar-icon",
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "1.8",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "aria-hidden": "true"
        }, [
          b("path", { d: "M12 3l1.9 4.9L19 9.8l-4.9 1.9L12 17l-1.9-5.3L5 9.8l5.1-1.9L12 3z" })
        ], -1)),
        b("input", {
          ref_key: "inputEl",
          ref: i,
          type: "text",
          class: "askai__input",
          value: S.draft,
          placeholder: S.placeholder,
          disabled: !S.inputEnabled,
          "aria-label": S.placeholder,
          autocomplete: "off",
          spellcheck: "false",
          onInput: u,
          onKeydown: Ii(Jn(w, ["prevent"]), ["enter"])
        }, null, 40, up),
        S.canStartNewChat ? (k(), x("button", {
          key: 0,
          type: "button",
          class: $e(["askai__new", { "askai__new--armed": S.newChatArmed }]),
          disabled: S.startingNewChat,
          title: S.newChatArmed ? "This ends the current chat — click again to confirm" : "Start a new chat",
          "aria-label": S.newChatArmed ? "Confirm starting a new chat" : "Start a new chat",
          onClick: L[0] || (L[0] = (V) => s("newChat")),
          onBlur: L[1] || (L[1] = (V) => s("cancelNewChat"))
        }, [
          L[3] || (L[3] = b("svg", {
            width: "15",
            height: "15",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            b("path", { d: "M12 20h9" }),
            b("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" })
          ], -1)),
          S.newChatArmed ? (k(), x("span", hp, "Click again to confirm")) : ne("", !0)
        ], 42, fp)) : ne("", !0),
        b("button", {
          type: "button",
          class: "askai__close",
          "aria-label": "Close",
          title: "Close (Esc)",
          onClick: L[2] || (L[2] = (V) => s("close"))
        }, L[4] || (L[4] = [
          b("span", { class: "askai__kbd" }, "Esc", -1)
        ]))
      ]),
      b("div", {
        ref_key: "bodyEl",
        ref: r,
        class: "askai__body"
      }, [
        b("div", {
          ref_key: "contentEl",
          ref: o,
          class: "askai__content"
        }, [
          d.value ? (k(), x(Ue, { key: 1 }, [
            (k(!0), x(Ue, null, kt(l.value, ({ message: V, index: Y }) => (k(), x("div", {
              key: Y,
              class: "askai__turn",
              "aria-live": S.isStreaming(Y) ? "off" : "polite"
            }, [
              V.message_type === "user" ? (k(), x("p", yp, ee(V.message), 1)) : V.message_type === "system" ? (k(), x("p", bp, ee(V.message), 1)) : (k(), x(Ue, { key: 2 }, [
                b("div", {
                  class: $e(["askai__answer", { "askai__answer--streaming": S.isStreaming(Y) }]),
                  innerHTML: E(Ni)(S.isStreaming(Y) ? S.displayText(Y, V.message || "") : V.message || "")
                }, null, 10, wp),
                S.showCitations && !S.isStreaming(Y) && V.sources && V.sources.length ? (k(), x("div", kp, [
                  L[8] || (L[8] = b("span", { class: "askai__label" }, "Sources", -1)),
                  (k(!0), x(Ue, null, kt(V.sources, (Se, He) => (k(), x("span", {
                    key: He,
                    class: "askai__source",
                    title: S.citationTooltip(Se)
                  }, ee(S.citationLabel(Se)), 9, xp))), 128))
                ])) : ne("", !0)
              ], 64))
            ], 8, vp))), 128)),
            S.loading ? (k(), x("div", Ap, [
              L[9] || (L[9] = b("span", { class: "askai__dot" }, null, -1)),
              L[10] || (L[10] = b("span", { class: "askai__dot" }, null, -1)),
              L[11] || (L[11] = b("span", { class: "askai__dot" }, null, -1)),
              b("span", Sp, ee(S.showCitations ? "Searching the knowledge base" : "Thinking"), 1)
            ])) : ne("", !0)
          ], 64)) : (k(), x(Ue, { key: 0 }, [
            b("div", dp, [
              b("h2", pp, ee(S.welcomeTitle || `Ask ${S.agentName}`), 1),
              S.welcomeSubtitle ? (k(), x("p", gp, ee(S.welcomeSubtitle), 1)) : ne("", !0)
            ]),
            S.suggestions.length && !S.draft.trim() ? (k(), x("div", mp, [
              L[7] || (L[7] = b("p", { class: "askai__label" }, "Suggested", -1)),
              (k(!0), x(Ue, null, kt(S.suggestions, (V) => (k(), x("button", {
                key: V,
                type: "button",
                class: "askai__suggestion",
                disabled: !S.inputEnabled,
                onClick: (Y) => m(V)
              }, [
                b("span", null, ee(V), 1),
                L[6] || (L[6] = b("svg", {
                  width: "15",
                  height: "15",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "aria-hidden": "true"
                }, [
                  b("path", { d: "M5 12h14M13 6l6 6-6 6" })
                ], -1))
              ], 8, _p))), 128))
            ])) : ne("", !0)
          ], 64))
        ], 512)
      ], 512),
      b("div", Tp, [
        S.disclaimer ? (k(), x("span", Ep, ee(S.disclaimer), 1)) : ne("", !0),
        L[12] || (L[12] = b("a", {
          class: "askai__brand",
          href: "https://chattermate.chat",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "Powered by Growmiq mini", -1))
      ])
    ]));
  }
}), $c = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, i] of t)
    n[s] = i;
  return n;
}, Rp = /* @__PURE__ */ $c(Cp, [["__scopeId", "data-v-647aa2a2"]]), Vs = [
  { stops: "#9D8CFF, #5FE3D6, #C9F24E", glow: "rgba(157,140,255,0.45)" },
  // aurora (default)
  { stops: "#FF8A73, #9D8CFF, #5FE3D6", glow: "rgba(255,138,115,0.40)" },
  // coral
  { stops: "#5FE3D6, #C9F24E, #9D8CFF", glow: "rgba(95,227,214,0.40)" },
  // teal
  { stops: "#C9F24E, #5FE3D6, #FF8A73", glow: "rgba(201,242,78,0.35)" },
  // lime
  { stops: "#6EA8FF, #9D8CFF, #5FE3D6", glow: "rgba(110,168,255,0.42)" },
  // blue
  { stops: "#FF7AC6, #9D8CFF, #6EA8FF", glow: "rgba(255,122,198,0.42)" },
  // pink
  { stops: "#FF8A73, #FFC857, #FF7AC6", glow: "rgba(255,200,87,0.40)" },
  // sunset
  { stops: "#7C5CFF, #B388FF, #5FE3D6", glow: "rgba(124,92,255,0.45)" },
  // violet
  { stops: "#0EA5A5, #5FE3D6, #C9F24E", glow: "rgba(14,165,165,0.40)" },
  // emerald
  { stops: "#F34611, #FF8A73, #FFC857", glow: "rgba(243,70,17,0.38)" }
  // ember
], Ip = (e) => (e || "").split("").reduce((t, n) => t + n.charCodeAt(0), 0) % Vs.length, Lp = (e) => {
  const t = Vs[(e % Vs.length + Vs.length) % Vs.length];
  return {
    background: `
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.22) 0%, transparent 42%),
            radial-gradient(circle at 68% 72%, rgba(0,0,0,0.25) 0%, transparent 38%),
            radial-gradient(ellipse at 50% 50%, ${t.stops})
        `.trim(),
    boxShadow: `0 4px 28px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
    borderRadius: "50%"
  };
}, Op = (e, t) => {
  const n = typeof t == "number" && Number.isFinite(t) ? t : Ip(e);
  return Lp(n);
}, rl = (e) => {
  var t;
  return !!((t = e == null ? void 0 : e.attributes) != null && t.end_chat);
}, ol = "AI can make mistakes. Check important info.";
function Np(e, t = !1) {
  return e !== !1 && !t;
}
const Uc = (e) => !!e && (/^https?:\/\//i.test(e) || e.startsWith("data:")), Pp = (e, t) => e ? Uc(e) || e.startsWith("blob:") ? e : `${t.replace(/\/api\/v1\/?$/, "")}${e.startsWith("/") ? "" : "/"}${e}` : "";
function al() {
  return typeof window < "u" && window.APP_CONFIG ? window.APP_CONFIG : {};
}
const bs = {
  get API_URL() {
    return al().API_URL || "http://localhost:8000/api/v1";
  },
  get WS_URL() {
    return al().WS_URL || "ws://localhost:8000";
  }
};
function Yi(e) {
  return Pp(e, bs.API_URL);
}
function Mp(e) {
  const t = fe(() => ({
    backgroundColor: "var(--cm-card)",
    color: "var(--cm-text)"
  })), n = fe(() => ({
    backgroundColor: e.value.chat_bubble_color || "#C9F24E",
    color: ys(e.value.chat_bubble_color || "#C9F24E") ? "#FFFFFF" : "#000000"
  })), s = fe(() => ({
    backgroundColor: "var(--cm-agent-bg)",
    color: "var(--cm-text)"
  })), i = fe(() => ({
    backgroundColor: "var(--cm-accent)",
    color: "var(--cm-on-accent)"
  })), r = fe(() => ({
    color: "var(--cm-text)"
  })), o = fe(() => ({
    borderBottom: "1px solid var(--cm-hairline)"
  })), a = fe(() => Yi(e.value.photo_url)), l = fe(() => {
    const d = e.value.chat_background_color || "#ffffff";
    return {
      boxShadow: `0 8px 5px ${ys(d) ? "rgba(0, 0, 0, 0.24)" : "rgba(0, 0, 0, 0.12)"}`
    };
  });
  return {
    chatStyles: t,
    chatIconStyles: n,
    agentBubbleStyles: s,
    userBubbleStyles: i,
    messageNameStyles: r,
    headerBorderStyles: o,
    photoUrl: a,
    shadowStyle: l
  };
}
const Fp = /* @__PURE__ */ new Set(["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]), Dp = /* @__PURE__ */ new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);
[...Fp, ...Dp];
function Bp(e, t) {
  const n = re([]), s = re(!1), i = re(null), r = (L) => {
    if (L === 0) return "0 Bytes";
    const V = 1024, Y = ["Bytes", "KB", "MB", "GB"], Se = Math.floor(Math.log(L) / Math.log(V));
    return parseFloat((L / Math.pow(V, Se)).toFixed(2)) + " " + Y[Se];
  }, o = (L) => L.startsWith("image/"), a = (L) => L ? Yi(L) : "", l = (L) => {
    const V = L.file_url || L.url;
    return V ? Yi(V) : "";
  }, d = async (L) => {
    const V = L.target;
    V.files && V.files.length > 0 && (await G(Array.from(V.files)), V.value = "");
  }, u = async (L) => {
    var Y;
    L.preventDefault();
    const V = (Y = L.dataTransfer) == null ? void 0 : Y.files;
    V && V.length > 0 && await G(Array.from(V));
  }, w = (L) => {
    L.preventDefault();
  }, m = (L) => {
    L.preventDefault();
  }, N = async (L) => {
    var Se;
    const V = (Se = L.clipboardData) == null ? void 0 : Se.items;
    if (!V) return;
    const Y = [];
    for (const He of Array.from(V))
      if (He.kind === "file") {
        const Xe = He.getAsFile();
        Xe && Y.push(Xe);
      }
    Y.length > 0 && await G(Y);
  }, M = async (L, V = 500) => new Promise((Y, Se) => {
    const He = new FileReader();
    He.onload = (Xe) => {
      var be;
      const Ce = new Image();
      Ce.onload = () => {
        const Je = document.createElement("canvas");
        let nt = Ce.width, lt = Ce.height;
        const he = 1920;
        (nt > he || lt > he) && (nt > lt ? (lt = lt / nt * he, nt = he) : (nt = nt / lt * he, lt = he)), Je.width = nt, Je.height = lt;
        const ge = Je.getContext("2d");
        if (!ge) {
          Se(new Error("Failed to get canvas context"));
          return;
        }
        ge.drawImage(Ce, 0, 0, nt, lt);
        let le = 0.9;
        const Te = () => {
          Je.toBlob((st) => {
            if (!st) {
              Se(new Error("Failed to compress image"));
              return;
            }
            if (st.size / 1024 > V && le > 0.3)
              le -= 0.1, Te();
            else {
              const De = new FileReader();
              De.onload = () => {
                const Be = De.result.split(",")[1];
                Y({ blob: st, base64: Be });
              }, De.readAsDataURL(st);
            }
          }, L.type === "image/png" ? "image/png" : "image/jpeg", le);
        };
        Te();
      }, Ce.onerror = () => Se(new Error("Failed to load image")), Ce.src = (be = Xe.target) == null ? void 0 : be.result;
    }, He.onerror = () => Se(new Error("Failed to read file")), He.readAsDataURL(L);
  }), G = async (L) => {
    if (n.value.length >= 3) {
      alert("Maximum 3 files allowed per message");
      return;
    }
    const Xe = 3 - n.value.length, Ce = L.slice(0, Xe);
    L.length > Xe && alert(`Only ${Xe} more file(s) can be uploaded. Maximum 3 files per message.`);
    for (const be of Ce)
      try {
        if (n.value.some((he) => he.filename === be.name)) {
          console.warn(`File ${be.name} is already selected`), alert(`File "${be.name}" is already selected`);
          continue;
        }
        const nt = be.type.startsWith("image/"), lt = nt ? 5242880 : 10485760;
        if (be.size > lt) {
          const he = lt / 1048576;
          console.error(`File ${be.name} is too large. Maximum size is ${he}MB`), alert(`File "${be.name}" is too large. Maximum size for ${nt ? "images" : "documents"} is ${he}MB`);
          continue;
        }
        if (nt)
          try {
            const { blob: he, base64: ge } = await M(be, 500), le = he.size;
            console.log(`Compressed ${be.name}: ${(be.size / 1024).toFixed(2)}KB → ${(le / 1024).toFixed(2)}KB`), n.value.push({
              content: ge,
              filename: be.name,
              type: be.type,
              size: le,
              url: URL.createObjectURL(he),
              file_url: URL.createObjectURL(he)
            });
          } catch (he) {
            console.error("Image compression failed, uploading original:", he);
            const ge = new FileReader();
            ge.onload = (le) => {
              var ae;
              const st = ((ae = le.target) == null ? void 0 : ae.result).split(",")[1];
              n.value.push({
                content: st,
                filename: be.name,
                type: be.type,
                size: be.size,
                url: URL.createObjectURL(be),
                file_url: URL.createObjectURL(be)
              });
            }, ge.readAsDataURL(be);
          }
        else {
          const he = new FileReader();
          he.onload = (ge) => {
            var st;
            const Te = ((st = ge.target) == null ? void 0 : st.result).split(",")[1];
            n.value.push({
              content: Te,
              filename: be.name,
              type: be.type || "application/octet-stream",
              size: be.size,
              url: "",
              file_url: ""
            });
          }, he.readAsDataURL(be);
        }
      } catch (Je) {
        console.error("File upload error:", Je);
      }
  };
  return {
    uploadedAttachments: n,
    previewModal: s,
    previewFile: i,
    formatFileSize: r,
    isImageAttachment: o,
    getDownloadUrl: a,
    getPreviewUrl: l,
    handleFileSelect: d,
    handleDrop: u,
    handleDragOver: w,
    handleDragLeave: m,
    handlePaste: N,
    uploadFiles: G,
    removeAttachment: async (L) => {
      const V = n.value[L];
      if (V) {
        try {
          let Y = V.url;
          if (Y.startsWith("/uploads/") ? Y = Y.substring(9) : Y.startsWith("/") && (Y = Y.substring(1)), Uc(Y))
            try {
              Y = new URL(Y).pathname.replace(/^\/+/, "");
            } catch {
            }
          const Se = {};
          e.value && (Se.Authorization = `Bearer ${e.value}`);
          const He = await fetch(`${bs.API_URL}/files/upload/${Y}`, {
            method: "DELETE",
            headers: Se
          });
          if (He.ok)
            console.log("File deleted successfully from backend.");
          else {
            const Xe = await He.json();
            console.error("Failed to delete file:", Xe.detail);
          }
        } catch (Y) {
          console.error("Error calling delete API:", Y);
        }
        V.url && V.url.startsWith("blob:") && URL.revokeObjectURL(V.url), V.file_url && V.file_url.startsWith("blob:") && URL.revokeObjectURL(V.file_url), n.value.splice(L, 1);
      }
    },
    openPreview: (L) => {
      i.value = L, s.value = !0;
    },
    closePreview: () => {
      s.value = !1, setTimeout(() => {
        i.value = null;
      }, 300);
    },
    openFilePicker: () => {
      var L;
      (L = t.value) == null || L.click();
    },
    isImage: (L) => L.startsWith("image/")
  };
}
const hn = /* @__PURE__ */ Object.create(null);
hn.open = "0";
hn.close = "1";
hn.ping = "2";
hn.pong = "3";
hn.message = "4";
hn.upgrade = "5";
hn.noop = "6";
const Pi = /* @__PURE__ */ Object.create(null);
Object.keys(hn).forEach((e) => {
  Pi[hn[e]] = e;
});
const ao = { type: "error", data: "parser error" }, zc = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", Hc = typeof ArrayBuffer == "function", qc = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e && e.buffer instanceof ArrayBuffer, Uo = ({ type: e, data: t }, n, s) => zc && t instanceof Blob ? n ? s(t) : ll(t, s) : Hc && (t instanceof ArrayBuffer || qc(t)) ? n ? s(t) : ll(new Blob([t]), s) : s(hn[e] + (t || "")), ll = (e, t) => {
  const n = new FileReader();
  return n.onload = function() {
    const s = n.result.split(",")[1];
    t("b" + (s || ""));
  }, n.readAsDataURL(e);
};
function cl(e) {
  return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
let $r;
function $p(e, t) {
  if (zc && e.data instanceof Blob)
    return e.data.arrayBuffer().then(cl).then(t);
  if (Hc && (e.data instanceof ArrayBuffer || qc(e.data)))
    return t(cl(e.data));
  Uo(e, !1, (n) => {
    $r || ($r = new TextEncoder()), t($r.encode(n));
  });
}
const ul = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ks = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let e = 0; e < ul.length; e++)
  Ks[ul.charCodeAt(e)] = e;
const Up = (e) => {
  let t = e.length * 0.75, n = e.length, s, i = 0, r, o, a, l;
  e[e.length - 1] === "=" && (t--, e[e.length - 2] === "=" && t--);
  const d = new ArrayBuffer(t), u = new Uint8Array(d);
  for (s = 0; s < n; s += 4)
    r = Ks[e.charCodeAt(s)], o = Ks[e.charCodeAt(s + 1)], a = Ks[e.charCodeAt(s + 2)], l = Ks[e.charCodeAt(s + 3)], u[i++] = r << 2 | o >> 4, u[i++] = (o & 15) << 4 | a >> 2, u[i++] = (a & 3) << 6 | l & 63;
  return d;
}, zp = typeof ArrayBuffer == "function", zo = (e, t) => {
  if (typeof e != "string")
    return {
      type: "message",
      data: Wc(e, t)
    };
  const n = e.charAt(0);
  return n === "b" ? {
    type: "message",
    data: Hp(e.substring(1), t)
  } : Pi[n] ? e.length > 1 ? {
    type: Pi[n],
    data: e.substring(1)
  } : {
    type: Pi[n]
  } : ao;
}, Hp = (e, t) => {
  if (zp) {
    const n = Up(e);
    return Wc(n, t);
  } else
    return { base64: !0, data: e };
}, Wc = (e, t) => {
  switch (t) {
    case "blob":
      return e instanceof Blob ? e : new Blob([e]);
    case "arraybuffer":
    default:
      return e instanceof ArrayBuffer ? e : e.buffer;
  }
}, jc = "", qp = (e, t) => {
  const n = e.length, s = new Array(n);
  let i = 0;
  e.forEach((r, o) => {
    Uo(r, !1, (a) => {
      s[o] = a, ++i === n && t(s.join(jc));
    });
  });
}, Wp = (e, t) => {
  const n = e.split(jc), s = [];
  for (let i = 0; i < n.length; i++) {
    const r = zo(n[i], t);
    if (s.push(r), r.type === "error")
      break;
  }
  return s;
};
function jp() {
  return new TransformStream({
    transform(e, t) {
      $p(e, (n) => {
        const s = n.length;
        let i;
        if (s < 126)
          i = new Uint8Array(1), new DataView(i.buffer).setUint8(0, s);
        else if (s < 65536) {
          i = new Uint8Array(3);
          const r = new DataView(i.buffer);
          r.setUint8(0, 126), r.setUint16(1, s);
        } else {
          i = new Uint8Array(9);
          const r = new DataView(i.buffer);
          r.setUint8(0, 127), r.setBigUint64(1, BigInt(s));
        }
        e.data && typeof e.data != "string" && (i[0] |= 128), t.enqueue(i), t.enqueue(n);
      });
    }
  });
}
let Ur;
function xi(e) {
  return e.reduce((t, n) => t + n.length, 0);
}
function Ai(e, t) {
  if (e[0].length === t)
    return e.shift();
  const n = new Uint8Array(t);
  let s = 0;
  for (let i = 0; i < t; i++)
    n[i] = e[0][s++], s === e[0].length && (e.shift(), s = 0);
  return e.length && s < e[0].length && (e[0] = e[0].slice(s)), n;
}
function Vp(e, t) {
  Ur || (Ur = new TextDecoder());
  const n = [];
  let s = 0, i = -1, r = !1;
  return new TransformStream({
    transform(o, a) {
      for (n.push(o); ; ) {
        if (s === 0) {
          if (xi(n) < 1)
            break;
          const l = Ai(n, 1);
          r = (l[0] & 128) === 128, i = l[0] & 127, i < 126 ? s = 3 : i === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (xi(n) < 2)
            break;
          const l = Ai(n, 2);
          i = new DataView(l.buffer, l.byteOffset, l.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (xi(n) < 8)
            break;
          const l = Ai(n, 8), d = new DataView(l.buffer, l.byteOffset, l.length), u = d.getUint32(0);
          if (u > Math.pow(2, 21) - 1) {
            a.enqueue(ao);
            break;
          }
          i = u * Math.pow(2, 32) + d.getUint32(4), s = 3;
        } else {
          if (xi(n) < i)
            break;
          const l = Ai(n, i);
          a.enqueue(zo(r ? l : Ur.decode(l), t)), s = 0;
        }
        if (i === 0 || i > e) {
          a.enqueue(ao);
          break;
        }
      }
    }
  });
}
const Vc = 4;
function ft(e) {
  if (e) return Kp(e);
}
function Kp(e) {
  for (var t in ft.prototype)
    e[t] = ft.prototype[t];
  return e;
}
ft.prototype.on = ft.prototype.addEventListener = function(e, t) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this;
};
ft.prototype.once = function(e, t) {
  function n() {
    this.off(e, n), t.apply(this, arguments);
  }
  return n.fn = t, this.on(e, n), this;
};
ft.prototype.off = ft.prototype.removeListener = ft.prototype.removeAllListeners = ft.prototype.removeEventListener = function(e, t) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var n = this._callbacks["$" + e];
  if (!n) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + e], this;
  for (var s, i = 0; i < n.length; i++)
    if (s = n[i], s === t || s.fn === t) {
      n.splice(i, 1);
      break;
    }
  return n.length === 0 && delete this._callbacks["$" + e], this;
};
ft.prototype.emit = function(e) {
  this._callbacks = this._callbacks || {};
  for (var t = new Array(arguments.length - 1), n = this._callbacks["$" + e], s = 1; s < arguments.length; s++)
    t[s - 1] = arguments[s];
  if (n) {
    n = n.slice(0);
    for (var s = 0, i = n.length; s < i; ++s)
      n[s].apply(this, t);
  }
  return this;
};
ft.prototype.emitReserved = ft.prototype.emit;
ft.prototype.listeners = function(e) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || [];
};
ft.prototype.hasListeners = function(e) {
  return !!this.listeners(e).length;
};
const ur = typeof Promise == "function" && typeof Promise.resolve == "function" ? (t) => Promise.resolve().then(t) : (t, n) => n(t, 0), Wt = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Gp = "arraybuffer";
function Kc(e, ...t) {
  return t.reduce((n, s) => (e.hasOwnProperty(s) && (n[s] = e[s]), n), {});
}
const Yp = Wt.setTimeout, Xp = Wt.clearTimeout;
function fr(e, t) {
  t.useNativeTimers ? (e.setTimeoutFn = Yp.bind(Wt), e.clearTimeoutFn = Xp.bind(Wt)) : (e.setTimeoutFn = Wt.setTimeout.bind(Wt), e.clearTimeoutFn = Wt.clearTimeout.bind(Wt));
}
const Zp = 1.33;
function Jp(e) {
  return typeof e == "string" ? Qp(e) : Math.ceil((e.byteLength || e.size) * Zp);
}
function Qp(e) {
  let t = 0, n = 0;
  for (let s = 0, i = e.length; s < i; s++)
    t = e.charCodeAt(s), t < 128 ? n += 1 : t < 2048 ? n += 2 : t < 55296 || t >= 57344 ? n += 3 : (s++, n += 4);
  return n;
}
function Gc() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function eg(e) {
  let t = "";
  for (let n in e)
    e.hasOwnProperty(n) && (t.length && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
  return t;
}
function tg(e) {
  let t = {}, n = e.split("&");
  for (let s = 0, i = n.length; s < i; s++) {
    let r = n[s].split("=");
    t[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return t;
}
class ng extends Error {
  constructor(t, n, s) {
    super(t), this.description = n, this.context = s, this.type = "TransportError";
  }
}
class Ho extends ft {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(t) {
    super(), this.writable = !1, fr(this, t), this.opts = t, this.query = t.query, this.socket = t.socket, this.supportsBinary = !t.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(t, n, s) {
    return super.emitReserved("error", new ng(t, n, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(t) {
    this.readyState === "open" && this.write(t);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(t) {
    const n = zo(t, this.socket.binaryType);
    this.onPacket(n);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(t) {
    super.emitReserved("packet", t);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(t) {
    this.readyState = "closed", super.emitReserved("close", t);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(t) {
  }
  createUri(t, n = {}) {
    return t + "://" + this._hostname() + this._port() + this.opts.path + this._query(n);
  }
  _hostname() {
    const t = this.opts.hostname;
    return t.indexOf(":") === -1 ? t : "[" + t + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(t) {
    const n = eg(t);
    return n.length ? "?" + n : "";
  }
}
class sg extends Ho {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(t) {
    this.readyState = "pausing";
    const n = () => {
      this.readyState = "paused", t();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (s++, this.once("pollComplete", function() {
        --s || n();
      })), this.writable || (s++, this.once("drain", function() {
        --s || n();
      }));
    } else
      n();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(t) {
    const n = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    Wp(t, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const t = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? t() : this.once("open", t);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(t) {
    this.writable = !1, qp(t, (n) => {
      this.doWrite(n, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "https" : "http", n = this.query || {};
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = Gc()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(t, n);
  }
}
let Yc = !1;
try {
  Yc = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const ig = Yc;
function rg() {
}
class og extends sg {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(t) {
    if (super(t), typeof location < "u") {
      const n = location.protocol === "https:";
      let s = location.port;
      s || (s = n ? "443" : "80"), this.xd = typeof location < "u" && t.hostname !== location.hostname || s !== t.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(t, n) {
    const s = this.request({
      method: "POST",
      data: t
    });
    s.on("success", n), s.on("error", (i, r) => {
      this.onError("xhr post error", i, r);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const t = this.request();
    t.on("data", this.onData.bind(this)), t.on("error", (n, s) => {
      this.onError("xhr poll error", n, s);
    }), this.pollXhr = t;
  }
}
class un extends ft {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(t, n, s) {
    super(), this.createRequest = t, fr(this, s), this._opts = s, this._method = s.method || "GET", this._uri = n, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var t;
    const n = Kc(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    n.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(n);
    try {
      s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let i in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(i) && s.setRequestHeader(i, this._opts.extraHeaders[i]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (t = this._opts.cookieJar) === null || t === void 0 || t.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var i;
        s.readyState === 3 && ((i = this._opts.cookieJar) === null || i === void 0 || i.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, s.send(this._data);
    } catch (i) {
      this.setTimeoutFn(() => {
        this._onError(i);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = un.requestsCount++, un.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(t) {
    this.emitReserved("error", t, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(t) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = rg, t)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete un.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const t = this._xhr.responseText;
    t !== null && (this.emitReserved("data", t), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
un.requestsCount = 0;
un.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", fl);
  else if (typeof addEventListener == "function") {
    const e = "onpagehide" in Wt ? "pagehide" : "unload";
    addEventListener(e, fl, !1);
  }
}
function fl() {
  for (let e in un.requests)
    un.requests.hasOwnProperty(e) && un.requests[e].abort();
}
const ag = function() {
  const e = Xc({
    xdomain: !1
  });
  return e && e.responseType !== null;
}();
class lg extends og {
  constructor(t) {
    super(t);
    const n = t && t.forceBase64;
    this.supportsBinary = ag && !n;
  }
  request(t = {}) {
    return Object.assign(t, { xd: this.xd }, this.opts), new un(Xc, this.uri(), t);
  }
}
function Xc(e) {
  const t = e.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!t || ig))
      return new XMLHttpRequest();
  } catch {
  }
  if (!t)
    try {
      return new Wt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const Zc = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class cg extends Ho {
  get name() {
    return "websocket";
  }
  doOpen() {
    const t = this.uri(), n = this.opts.protocols, s = Zc ? {} : Kc(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(t, n, s);
    } catch (i) {
      return this.emitReserved("error", i);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (t) => this.onClose({
      description: "websocket connection closed",
      context: t
    }), this.ws.onmessage = (t) => this.onData(t.data), this.ws.onerror = (t) => this.onError("websocket error", t);
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const s = t[n], i = n === t.length - 1;
      Uo(s, this.supportsBinary, (r) => {
        try {
          this.doWrite(s, r);
        } catch {
        }
        i && ur(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "wss" : "ws", n = this.query || {};
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = Gc()), this.supportsBinary || (n.b64 = 1), this.createUri(t, n);
  }
}
const zr = Wt.WebSocket || Wt.MozWebSocket;
class ug extends cg {
  createSocket(t, n, s) {
    return Zc ? new zr(t, n, s) : n ? new zr(t, n) : new zr(t);
  }
  doWrite(t, n) {
    this.ws.send(n);
  }
}
class fg extends Ho {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (t) {
      return this.emitReserved("error", t);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((t) => {
      this.onError("webtransport error", t);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((t) => {
        const n = Vp(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = t.readable.pipeThrough(n).getReader(), i = jp();
        i.readable.pipeTo(t.writable), this._writer = i.writable.getWriter();
        const r = () => {
          s.read().then(({ done: a, value: l }) => {
            a || (this.onPacket(l), r());
          }).catch((a) => {
          });
        };
        r();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const s = t[n], i = n === t.length - 1;
      this._writer.write(s).then(() => {
        i && ur(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var t;
    (t = this._transport) === null || t === void 0 || t.close();
  }
}
const hg = {
  websocket: ug,
  webtransport: fg,
  polling: lg
}, dg = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, pg = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function lo(e) {
  if (e.length > 8e3)
    throw "URI too long";
  const t = e, n = e.indexOf("["), s = e.indexOf("]");
  n != -1 && s != -1 && (e = e.substring(0, n) + e.substring(n, s).replace(/:/g, ";") + e.substring(s, e.length));
  let i = dg.exec(e || ""), r = {}, o = 14;
  for (; o--; )
    r[pg[o]] = i[o] || "";
  return n != -1 && s != -1 && (r.source = t, r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":"), r.authority = r.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), r.ipv6uri = !0), r.pathNames = gg(r, r.path), r.queryKey = mg(r, r.query), r;
}
function gg(e, t) {
  const n = /\/{2,9}/g, s = t.replace(n, "/").split("/");
  return (t.slice(0, 1) == "/" || t.length === 0) && s.splice(0, 1), t.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function mg(e, t) {
  const n = {};
  return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, i, r) {
    i && (n[i] = r);
  }), n;
}
const co = typeof addEventListener == "function" && typeof removeEventListener == "function", Mi = [];
co && addEventListener("offline", () => {
  Mi.forEach((e) => e());
}, !1);
class Pn extends ft {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(t, n) {
    if (super(), this.binaryType = Gp, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, t && typeof t == "object" && (n = t, t = null), t) {
      const s = lo(t);
      n.hostname = s.host, n.secure = s.protocol === "https" || s.protocol === "wss", n.port = s.port, s.query && (n.query = s.query);
    } else n.host && (n.hostname = lo(n.host).host);
    fr(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, n.transports.forEach((s) => {
      const i = s.prototype.name;
      this.transports.push(i), this._transportsByName[i] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = tg(this.opts.query)), co && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, Mi.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(t) {
    const n = Object.assign({}, this.opts.query);
    n.EIO = Vc, n.transport = t, this.id && (n.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: n,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[t]);
    return new this._transportsByName[t](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const t = this.opts.rememberUpgrade && Pn.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const n = this.createTransport(t);
    n.open(), this.setTransport(n);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (n) => this._onClose("transport close", n));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", Pn.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const n = new Error("server error");
          n.code = t.data, this._onError(n);
          break;
        case "message":
          this.emitReserved("data", t.data), this.emitReserved("message", t.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(t) {
    this.emitReserved("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this._pingInterval = t.pingInterval, this._pingTimeout = t.pingTimeout, this._maxPayload = t.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const t = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + t, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, t), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const t = this._getWritablePackets();
      this.transport.send(t), this._prevBufferLen = t.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let n = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const i = this.writeBuffer[s].data;
      if (i && (n += Jp(i)), s > 0 && n > this._maxPayload)
        return this.writeBuffer.slice(0, s);
      n += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const t = Date.now() > this._pingTimeoutTime;
    return t && (this._pingTimeoutTime = 0, ur(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), t;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(t, n, s) {
    return this._sendPacket("message", t, n, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(t, n, s) {
    return this._sendPacket("message", t, n, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(t, n, s, i) {
    if (typeof n == "function" && (i = n, n = void 0), typeof s == "function" && (i = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const r = {
      type: t,
      data: n,
      options: s
    };
    this.emitReserved("packetCreate", r), this.writeBuffer.push(r), i && this.once("flush", i), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const t = () => {
      this._onClose("forced close"), this.transport.close();
    }, n = () => {
      this.off("upgrade", n), this.off("upgradeError", n), t();
    }, s = () => {
      this.once("upgrade", n), this.once("upgradeError", n);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : t();
    }) : this.upgrading ? s() : t()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(t) {
    if (Pn.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", t), this._onClose("transport error", t);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(t, n) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), co && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = Mi.indexOf(this._offlineEventListener);
        s !== -1 && Mi.splice(s, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", t, n), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
Pn.protocol = Vc;
class _g extends Pn {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let t = 0; t < this._upgrades.length; t++)
        this._probe(this._upgrades[t]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(t) {
    let n = this.createTransport(t), s = !1;
    Pn.priorWebsocketSuccess = !1;
    const i = () => {
      s || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (w) => {
        if (!s)
          if (w.type === "pong" && w.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            Pn.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
              s || this.readyState !== "closed" && (u(), this.setTransport(n), n.send([{ type: "upgrade" }]), this.emitReserved("upgrade", n), n = null, this.upgrading = !1, this.flush());
            });
          } else {
            const m = new Error("probe error");
            m.transport = n.name, this.emitReserved("upgradeError", m);
          }
      }));
    };
    function r() {
      s || (s = !0, u(), n.close(), n = null);
    }
    const o = (w) => {
      const m = new Error("probe error: " + w);
      m.transport = n.name, r(), this.emitReserved("upgradeError", m);
    };
    function a() {
      o("transport closed");
    }
    function l() {
      o("socket closed");
    }
    function d(w) {
      n && w.name !== n.name && r();
    }
    const u = () => {
      n.removeListener("open", i), n.removeListener("error", o), n.removeListener("close", a), this.off("close", l), this.off("upgrading", d);
    };
    n.once("open", i), n.once("error", o), n.once("close", a), this.once("close", l), this.once("upgrading", d), this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport" ? this.setTimeoutFn(() => {
      s || n.open();
    }, 200) : n.open();
  }
  onHandshake(t) {
    this._upgrades = this._filterUpgrades(t.upgrades), super.onHandshake(t);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(t) {
    const n = [];
    for (let s = 0; s < t.length; s++)
      ~this.transports.indexOf(t[s]) && n.push(t[s]);
    return n;
  }
}
let vg = class extends _g {
  constructor(t, n = {}) {
    const s = typeof t == "object" ? t : n;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((i) => hg[i]).filter((i) => !!i)), super(t, s);
  }
};
function yg(e, t = "", n) {
  let s = e;
  n = n || typeof location < "u" && location, e == null && (e = n.protocol + "//" + n.host), typeof e == "string" && (e.charAt(0) === "/" && (e.charAt(1) === "/" ? e = n.protocol + e : e = n.host + e), /^(https?|wss?):\/\//.test(e) || (typeof n < "u" ? e = n.protocol + "//" + e : e = "https://" + e), s = lo(e)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const r = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + r + ":" + s.port + t, s.href = s.protocol + "://" + r + (n && n.port === s.port ? "" : ":" + s.port), s;
}
const bg = typeof ArrayBuffer == "function", wg = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e.buffer instanceof ArrayBuffer, Jc = Object.prototype.toString, kg = typeof Blob == "function" || typeof Blob < "u" && Jc.call(Blob) === "[object BlobConstructor]", xg = typeof File == "function" || typeof File < "u" && Jc.call(File) === "[object FileConstructor]";
function qo(e) {
  return bg && (e instanceof ArrayBuffer || wg(e)) || kg && e instanceof Blob || xg && e instanceof File;
}
function Fi(e, t) {
  if (!e || typeof e != "object")
    return !1;
  if (Array.isArray(e)) {
    for (let n = 0, s = e.length; n < s; n++)
      if (Fi(e[n]))
        return !0;
    return !1;
  }
  if (qo(e))
    return !0;
  if (e.toJSON && typeof e.toJSON == "function" && arguments.length === 1)
    return Fi(e.toJSON(), !0);
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && Fi(e[n]))
      return !0;
  return !1;
}
function Ag(e) {
  const t = [], n = e.data, s = e;
  return s.data = uo(n, t), s.attachments = t.length, { packet: s, buffers: t };
}
function uo(e, t) {
  if (!e)
    return e;
  if (qo(e)) {
    const n = { _placeholder: !0, num: t.length };
    return t.push(e), n;
  } else if (Array.isArray(e)) {
    const n = new Array(e.length);
    for (let s = 0; s < e.length; s++)
      n[s] = uo(e[s], t);
    return n;
  } else if (typeof e == "object" && !(e instanceof Date)) {
    const n = {};
    for (const s in e)
      Object.prototype.hasOwnProperty.call(e, s) && (n[s] = uo(e[s], t));
    return n;
  }
  return e;
}
function Sg(e, t) {
  return e.data = fo(e.data, t), delete e.attachments, e;
}
function fo(e, t) {
  if (!e)
    return e;
  if (e && e._placeholder === !0) {
    if (typeof e.num == "number" && e.num >= 0 && e.num < t.length)
      return t[e.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(e))
    for (let n = 0; n < e.length; n++)
      e[n] = fo(e[n], t);
  else if (typeof e == "object")
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && (e[n] = fo(e[n], t));
  return e;
}
const Tg = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
];
var Pe;
(function(e) {
  e[e.CONNECT = 0] = "CONNECT", e[e.DISCONNECT = 1] = "DISCONNECT", e[e.EVENT = 2] = "EVENT", e[e.ACK = 3] = "ACK", e[e.CONNECT_ERROR = 4] = "CONNECT_ERROR", e[e.BINARY_EVENT = 5] = "BINARY_EVENT", e[e.BINARY_ACK = 6] = "BINARY_ACK";
})(Pe || (Pe = {}));
class Eg {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(t) {
    this.replacer = t;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(t) {
    return (t.type === Pe.EVENT || t.type === Pe.ACK) && Fi(t) ? this.encodeAsBinary({
      type: t.type === Pe.EVENT ? Pe.BINARY_EVENT : Pe.BINARY_ACK,
      nsp: t.nsp,
      data: t.data,
      id: t.id
    }) : [this.encodeAsString(t)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(t) {
    let n = "" + t.type;
    return (t.type === Pe.BINARY_EVENT || t.type === Pe.BINARY_ACK) && (n += t.attachments + "-"), t.nsp && t.nsp !== "/" && (n += t.nsp + ","), t.id != null && (n += t.id), t.data != null && (n += JSON.stringify(t.data, this.replacer)), n;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(t) {
    const n = Ag(t), s = this.encodeAsString(n.packet), i = n.buffers;
    return i.unshift(s), i;
  }
}
function hl(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
class Wo extends ft {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(t) {
    super(), this.reviver = t;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(t) {
    let n;
    if (typeof t == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      n = this.decodeString(t);
      const s = n.type === Pe.BINARY_EVENT;
      s || n.type === Pe.BINARY_ACK ? (n.type = s ? Pe.EVENT : Pe.ACK, this.reconstructor = new Cg(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
    } else if (qo(t) || t.base64)
      if (this.reconstructor)
        n = this.reconstructor.takeBinaryData(t), n && (this.reconstructor = null, super.emitReserved("decoded", n));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + t);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(t) {
    let n = 0;
    const s = {
      type: Number(t.charAt(0))
    };
    if (Pe[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === Pe.BINARY_EVENT || s.type === Pe.BINARY_ACK) {
      const r = n + 1;
      for (; t.charAt(++n) !== "-" && n != t.length; )
        ;
      const o = t.substring(r, n);
      if (o != Number(o) || t.charAt(n) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(o);
    }
    if (t.charAt(n + 1) === "/") {
      const r = n + 1;
      for (; ++n && !(t.charAt(n) === "," || n === t.length); )
        ;
      s.nsp = t.substring(r, n);
    } else
      s.nsp = "/";
    const i = t.charAt(n + 1);
    if (i !== "" && Number(i) == i) {
      const r = n + 1;
      for (; ++n; ) {
        const o = t.charAt(n);
        if (o == null || Number(o) != o) {
          --n;
          break;
        }
        if (n === t.length)
          break;
      }
      s.id = Number(t.substring(r, n + 1));
    }
    if (t.charAt(++n)) {
      const r = this.tryParse(t.substr(n));
      if (Wo.isPayloadValid(s.type, r))
        s.data = r;
      else
        throw new Error("invalid payload");
    }
    return s;
  }
  tryParse(t) {
    try {
      return JSON.parse(t, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(t, n) {
    switch (t) {
      case Pe.CONNECT:
        return hl(n);
      case Pe.DISCONNECT:
        return n === void 0;
      case Pe.CONNECT_ERROR:
        return typeof n == "string" || hl(n);
      case Pe.EVENT:
      case Pe.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && Tg.indexOf(n[0]) === -1);
      case Pe.ACK:
      case Pe.BINARY_ACK:
        return Array.isArray(n);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class Cg {
  constructor(t) {
    this.packet = t, this.buffers = [], this.reconPack = t;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(t) {
    if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
      const n = Sg(this.reconPack, this.buffers);
      return this.finishedReconstruction(), n;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const Rg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Wo,
  Encoder: Eg,
  get PacketType() {
    return Pe;
  }
}, Symbol.toStringTag, { value: "Module" }));
function Qt(e, t, n) {
  return e.on(t, n), function() {
    e.off(t, n);
  };
}
const Ig = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Qc extends ft {
  /**
   * `Socket` constructor.
   */
  constructor(t, n, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = t, this.nsp = n, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const t = this.io;
    this.subs = [
      Qt(t, "open", this.onopen.bind(this)),
      Qt(t, "packet", this.onpacket.bind(this)),
      Qt(t, "error", this.onerror.bind(this)),
      Qt(t, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(t, ...n) {
    var s, i, r;
    if (Ig.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (n.unshift(t), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(n), this;
    const o = {
      type: Pe.EVENT,
      data: n
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof n[n.length - 1] == "function") {
      const u = this.ids++, w = n.pop();
      this._registerAckCallback(u, w), o.id = u;
    }
    const a = (i = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || i === void 0 ? void 0 : i.writable, l = this.connected && !(!((r = this.io.engine) === null || r === void 0) && r._hasPingExpired());
    return this.flags.volatile && !a || (l ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(t, n) {
    var s;
    const i = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (i === void 0) {
      this.acks[t] = n;
      return;
    }
    const r = this.io.setTimeoutFn(() => {
      delete this.acks[t];
      for (let a = 0; a < this.sendBuffer.length; a++)
        this.sendBuffer[a].id === t && this.sendBuffer.splice(a, 1);
      n.call(this, new Error("operation has timed out"));
    }, i), o = (...a) => {
      this.io.clearTimeoutFn(r), n.apply(this, a);
    };
    o.withError = !0, this.acks[t] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(t, ...n) {
    return new Promise((s, i) => {
      const r = (o, a) => o ? i(o) : s(a);
      r.withError = !0, n.push(r), this.emit(t, ...n);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(t) {
    let n;
    typeof t[t.length - 1] == "function" && (n = t.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: t,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    t.push((i, ...r) => s !== this._queue[0] ? void 0 : (i !== null ? s.tryCount > this._opts.retries && (this._queue.shift(), n && n(i)) : (this._queue.shift(), n && n(null, ...r)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(t = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const n = this._queue[0];
    n.pending && !t || (n.pending = !0, n.tryCount++, this.flags = n.flags, this.emit.apply(this, n.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(t) {
    t.nsp = this.nsp, this.io._packet(t);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((t) => {
      this._sendConnectPacket(t);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(t) {
    this.packet({
      type: Pe.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t) : t
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(t, n) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", t, n), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((t) => {
      if (!this.sendBuffer.some((s) => String(s.id) === t)) {
        const s = this.acks[t];
        delete this.acks[t], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(t) {
    if (t.nsp === this.nsp)
      switch (t.type) {
        case Pe.CONNECT:
          t.data && t.data.sid ? this.onconnect(t.data.sid, t.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case Pe.EVENT:
        case Pe.BINARY_EVENT:
          this.onevent(t);
          break;
        case Pe.ACK:
        case Pe.BINARY_ACK:
          this.onack(t);
          break;
        case Pe.DISCONNECT:
          this.ondisconnect();
          break;
        case Pe.CONNECT_ERROR:
          this.destroy();
          const s = new Error(t.data.message);
          s.data = t.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(t) {
    const n = t.data || [];
    t.id != null && n.push(this.ack(t.id)), this.connected ? this.emitEvent(n) : this.receiveBuffer.push(Object.freeze(n));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length) {
      const n = this._anyListeners.slice();
      for (const s of n)
        s.apply(this, t);
    }
    super.emit.apply(this, t), this._pid && t.length && typeof t[t.length - 1] == "string" && (this._lastOffset = t[t.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(t) {
    const n = this;
    let s = !1;
    return function(...i) {
      s || (s = !0, n.packet({
        type: Pe.ACK,
        id: t,
        data: i
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(t) {
    const n = this.acks[t.id];
    typeof n == "function" && (delete this.acks[t.id], n.withError && t.data.unshift(null), n.apply(this, t.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(t, n) {
    this.id = t, this.recovered = n && this._pid === n, this._pid = n, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)), this.receiveBuffer = [], this.sendBuffer.forEach((t) => {
      this.notifyOutgoingListeners(t), this.packet(t);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((t) => t()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: Pe.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(t) {
    return this.flags.compress = t, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(t) {
    return this.flags.timeout = t, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(t) {
    if (!this._anyListeners)
      return this;
    if (t) {
      const n = this._anyListeners;
      for (let s = 0; s < n.length; s++)
        if (t === n[s])
          return n.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(t) {
    if (!this._anyOutgoingListeners)
      return this;
    if (t) {
      const n = this._anyOutgoingListeners;
      for (let s = 0; s < n.length; s++)
        if (t === n[s])
          return n.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(t) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const n = this._anyOutgoingListeners.slice();
      for (const s of n)
        s.apply(this, t.data);
    }
  }
}
function ks(e) {
  e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0;
}
ks.prototype.duration = function() {
  var e = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(), n = Math.floor(t * this.jitter * e);
    e = (Math.floor(t * 10) & 1) == 0 ? e - n : e + n;
  }
  return Math.min(e, this.max) | 0;
};
ks.prototype.reset = function() {
  this.attempts = 0;
};
ks.prototype.setMin = function(e) {
  this.ms = e;
};
ks.prototype.setMax = function(e) {
  this.max = e;
};
ks.prototype.setJitter = function(e) {
  this.jitter = e;
};
class ho extends ft {
  constructor(t, n) {
    var s;
    super(), this.nsps = {}, this.subs = [], t && typeof t == "object" && (n = t, t = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, fr(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((s = n.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new ks({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = t;
    const i = n.parser || Rg;
    this.encoder = new i.Encoder(), this.decoder = new i.Decoder(), this._autoConnect = n.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length ? (this._reconnection = !!t, t || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(t) {
    return t === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this);
  }
  reconnectionDelay(t) {
    var n;
    return t === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = t, (n = this.backoff) === null || n === void 0 || n.setMin(t), this);
  }
  randomizationFactor(t) {
    var n;
    return t === void 0 ? this._randomizationFactor : (this._randomizationFactor = t, (n = this.backoff) === null || n === void 0 || n.setJitter(t), this);
  }
  reconnectionDelayMax(t) {
    var n;
    return t === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, (n = this.backoff) === null || n === void 0 || n.setMax(t), this);
  }
  timeout(t) {
    return arguments.length ? (this._timeout = t, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(t) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new vg(this.uri, this.opts);
    const n = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const i = Qt(n, "open", function() {
      s.onopen(), t && t();
    }), r = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), t ? t(a) : this.maybeReconnectOnOpen();
    }, o = Qt(n, "error", r);
    if (this._timeout !== !1) {
      const a = this._timeout, l = this.setTimeoutFn(() => {
        i(), r(new Error("timeout")), n.close();
      }, a);
      this.opts.autoUnref && l.unref(), this.subs.push(() => {
        this.clearTimeoutFn(l);
      });
    }
    return this.subs.push(i), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(t) {
    return this.open(t);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const t = this.engine;
    this.subs.push(
      Qt(t, "ping", this.onping.bind(this)),
      Qt(t, "data", this.ondata.bind(this)),
      Qt(t, "error", this.onerror.bind(this)),
      Qt(t, "close", this.onclose.bind(this)),
      // @ts-ignore
      Qt(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(t) {
    try {
      this.decoder.add(t);
    } catch (n) {
      this.onclose("parse error", n);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(t) {
    ur(() => {
      this.emitReserved("packet", t);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(t) {
    this.emitReserved("error", t);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(t, n) {
    let s = this.nsps[t];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new Qc(this, t, n), this.nsps[t] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(t) {
    const n = Object.keys(this.nsps);
    for (const s of n)
      if (this.nsps[s].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(t) {
    const n = this.encoder.encode(t);
    for (let s = 0; s < n.length; s++)
      this.engine.write(n[s], t.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((t) => t()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(t, n) {
    var s;
    this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", t, n), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const t = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const n = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        t.skipReconnect || (this.emitReserved("reconnect_attempt", t.backoff.attempts), !t.skipReconnect && t.open((i) => {
          i ? (t._reconnecting = !1, t.reconnect(), this.emitReserved("reconnect_error", i)) : t.onreconnect();
        }));
      }, n);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const t = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", t);
  }
}
const qs = {};
function Di(e, t) {
  typeof e == "object" && (t = e, e = void 0), t = t || {};
  const n = yg(e, t.path || "/socket.io"), s = n.source, i = n.id, r = n.path, o = qs[i] && r in qs[i].nsps, a = t.forceNew || t["force new connection"] || t.multiplex === !1 || o;
  let l;
  return a ? l = new ho(s, t) : (qs[i] || (qs[i] = new ho(s, t)), l = qs[i]), n.query && !t.query && (t.query = n.queryKey), l.socket(n.path, t);
}
Object.assign(Di, {
  Manager: ho,
  Socket: Qc,
  io: Di,
  connect: Di
});
function Lg() {
  const e = re([]), t = re(!1), n = re(""), s = re(!1), i = re(!1), r = re(!1), o = re("connecting"), a = re(0), l = 5, d = re({}), u = re(null), w = re("");
  let m = null, N = null, M = null, G = null, Fe, de;
  const _e = (q) => {
    Fe = q, q && localStorage.setItem("ctid", q);
  }, ke = (q) => {
    de = q;
  }, S = (q) => {
    var Oe;
    const Me = Fe || localStorage.getItem("ctid"), ce = {};
    Me && (ce.conversation_token = Me), de && (ce.widget_id = de);
    try {
      ce.page_url = window.parent !== window && ((Oe = window.parent.location) != null && Oe.href) ? window.parent.location.href : document.referrer || window.location.href;
    } catch {
      ce.page_url = document.referrer || "";
    }
    return m = Di(`${bs.WS_URL}/widget`, {
      transports: ["websocket"],
      reconnection: !0,
      reconnectionAttempts: l,
      reconnectionDelay: 1e3,
      auth: Object.keys(ce).length > 0 ? ce : void 0
    }), m.on("connect", () => {
      o.value = "connected", a.value = 0;
    }), m.on("disconnect", () => {
      o.value === "connected" && (console.log("Socket disconnected, setting connection status to connecting"), o.value = "connecting");
    }), m.on("connect_error", () => {
      a.value++, console.error("Socket connection failed, attempt:", a.value, "connection status:", o.value), a.value >= l && (o.value = "failed");
    }), m.on("chat_response", (K) => {
      if (t.value = !1, K.session_id ? (console.log("Captured session_id from chat_response:", K.session_id), w.value = K.session_id) : console.warn("No session_id in chat_response data:", K), K.type === "agent_message") {
        const vt = {
          message: K.message,
          message_type: "agent",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          session_id: "",
          agent_name: K.agent_name,
          stream: !0,
          // live reply → client-side typewriter reveal
          attributes: {
            end_chat: K.end_chat,
            end_chat_reason: K.end_chat_reason,
            end_chat_description: K.end_chat_description,
            request_rating: K.request_rating
          }
        };
        K.attachments && Array.isArray(K.attachments) && (vt.id = K.message_id, vt.attachments = K.attachments.map((g, _) => ({
          id: K.message_id * 1e3 + _,
          filename: g.filename,
          file_url: g.file_url,
          content_type: g.content_type,
          file_size: g.file_size
        }))), e.value.push(vt);
      } else K.shopify_output && typeof K.shopify_output == "object" && K.shopify_output.products ? e.value.push({
        message: K.message,
        // Keep the accompanying text message
        message_type: "product",
        // Use 'product' type for rendering
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: "",
        agent_name: K.agent_name,
        // Assign the whole structured object
        shopify_output: K.shopify_output,
        // Remove the old flattened fields (product_id, product_title, etc.)
        attributes: {
          // Keep other attributes if needed
          end_chat: K.end_chat,
          request_rating: K.request_rating
        }
      }) : e.value.push({
        message: K.message,
        message_type: "bot",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: "",
        agent_name: K.agent_name,
        stream: !0,
        // live reply → client-side typewriter reveal
        // Knowledge-base citations (display gated by show_citations in the widget)
        sources: Array.isArray(K.sources) && K.sources.length ? K.sources : void 0,
        attributes: {
          end_chat: K.end_chat,
          end_chat_reason: K.end_chat_reason,
          end_chat_description: K.end_chat_description,
          request_rating: K.request_rating
        }
      });
    }), m.on("handle_taken_over", (K) => {
      e.value.push({
        message: `${K.user_name} joined the conversation`,
        message_type: "system",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: K.session_id
      }), d.value = {
        ...d.value,
        human_agent_name: K.user_name,
        human_agent_profile_pic: K.profile_picture
      }, N && N(K);
    }), m.on("session_initialized", (K) => {
      K.session_id && (console.log("Initialized session_id from session_initialized:", K.session_id), w.value = K.session_id);
    }), m.on("error", Xe), m.on("chat_history", Ce), m.on("rating_submitted", be), m.on("display_form", Je), m.on("form_submitted", nt), m.on("workflow_state", lt), m.on("workflow_proceeded", he), m;
  }, L = async () => {
    try {
      return o.value = "connecting", a.value = 0, m && (m.removeAllListeners(), m.disconnect(), m = null), m = S(""), new Promise((q) => {
        m == null || m.on("connect", () => {
          q(!0);
        }), m == null || m.on("connect_error", () => {
          a.value >= l && q(!1);
        });
      });
    } catch (q) {
      return console.error("Socket initialization failed:", q), o.value = "failed", !1;
    }
  }, V = () => (m && m.disconnect(), L()), Y = (q) => {
    N = q;
  }, Se = (q) => {
    M = q;
  }, He = (q) => {
    G = q;
  }, Xe = (q) => {
    t.value = !1, n.value = sd(q), s.value = !0, setTimeout(() => {
      s.value = !1, n.value = "";
    }, 5e3);
  }, Ce = (q) => {
    if (q.type === "chat_history" && Array.isArray(q.messages)) {
      const Me = q.messages.map((ce) => {
        var K, vt;
        const Oe = {
          message: ce.message,
          message_type: ce.message_type,
          created_at: ce.created_at,
          session_id: "",
          agent_name: ce.agent_name || "",
          user_name: ce.user_name || "",
          attributes: ce.attributes || {},
          attachments: ce.attachments || []
          // Include attachments
        };
        return Array.isArray((K = ce.attributes) == null ? void 0 : K.sources) && ce.attributes.sources.length && (Oe.sources = ce.attributes.sources), (vt = ce.attributes) != null && vt.shopify_output && typeof ce.attributes.shopify_output == "object" ? {
          ...Oe,
          message_type: "product",
          shopify_output: ce.attributes.shopify_output
        } : Oe;
      });
      e.value = [
        ...Me.filter(
          (ce) => !e.value.some(
            (Oe) => Oe.message === ce.message && Oe.created_at === ce.created_at
          )
        ),
        ...e.value
      ];
    }
  }, be = (q) => {
    q.success && e.value.push({
      message: "Thank you for your feedback!",
      message_type: "system",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      session_id: ""
    });
  }, Je = (q) => {
    var Me;
    console.log("Form display handler in composable:", q), t.value = !1, u.value = q.form_data, console.log("Set currentForm in handleDisplayForm:", u.value), ((Me = q.form_data) == null ? void 0 : Me.form_full_screen) === !0 ? (console.log("Full screen form detected, triggering workflow state callback"), M && M({
      type: "form",
      form_data: q.form_data,
      session_id: q.session_id
    })) : e.value.push({
      message: "",
      message_type: "form",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      session_id: q.session_id,
      attributes: {
        form_data: q.form_data
      }
    });
  }, nt = (q) => {
    console.log("Form submitted confirmation received, clearing currentForm"), u.value = null, q.success && console.log("Form submitted successfully");
  }, lt = (q) => {
    console.log("Workflow state received in composable:", q), (q.type === "form" || q.type === "display_form") && (console.log("Setting currentForm from workflow state:", q.form_data), u.value = q.form_data), M && M(q);
  }, he = (q) => {
    console.log("Workflow proceeded in composable:", q), G && G(q);
  }, ge = async (q, Me) => {
    !m || !q || m.emit("submit_rating", {
      rating: q,
      feedback: Me
    });
  }, le = async (q) => {
    var Oe;
    if (console.log("Submitting form in socket:", q), console.log("Current form in socket:", u.value), console.log("Socket in socket:", m), !m) {
      console.error("No socket available for form submission");
      return;
    }
    if (!q || Object.keys(q).length === 0) {
      console.error("No form data to submit");
      return;
    }
    const ce = ((Oe = u.value) == null ? void 0 : Oe.form_type) === "contact" ? "submit_contact_info" : "submit_form";
    console.log(`Emitting ${ce} event with data:`, q), m.emit(ce, {
      form_data: q
    }), u.value = null;
  }, Te = async () => {
    m && (console.log("Getting workflow state 12"), m.emit("get_workflow_state"));
  }, st = async () => {
    m && m.emit("proceed_workflow", {});
  }, ae = async (q, Me, ce = []) => {
    if (!m || !q.trim() && ce.length === 0) return;
    d.value.human_agent_name || (t.value = !0);
    const Oe = {
      message: q,
      message_type: "user",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      session_id: ""
    };
    ce.length > 0 && (Oe.attachments = ce.map((K, vt) => {
      let g = "";
      if (K.content_type.startsWith("image/")) {
        const _ = atob(K.content), A = new Array(_.length);
        for (let I = 0; I < _.length; I++)
          A[I] = _.charCodeAt(I);
        const F = new Uint8Array(A), R = new Blob([F], { type: K.content_type });
        g = URL.createObjectURL(R);
      }
      return {
        id: Date.now() * 1e3 + vt,
        // Temporary ID
        filename: K.filename,
        file_url: g,
        // Temporary blob URL, will be replaced
        content_type: K.content_type,
        file_size: K.size,
        _isTemporary: !0
        // Flag to identify temporary attachments
      };
    })), e.value.push(Oe), m.emit("chat", {
      message: q,
      email: Me,
      files: ce
      // Send files with base64 content
    }), r.value = !0;
  }, De = () => {
    e.value = [], r.value = !1, w.value = "", t.value = !1, u.value = null;
  };
  return {
    messages: e,
    loading: t,
    errorMessage: n,
    showError: s,
    loadingHistory: i,
    hasStartedChat: r,
    connectionStatus: o,
    sendMessage: ae,
    endChat: (q = "CUSTOMER_REQUEST") => new Promise((Me) => {
      if (!m || !m.connected) {
        De(), Me();
        return;
      }
      let ce = !1;
      const Oe = () => {
        ce || (ce = !0, clearTimeout(K), m == null || m.off("chat_ended", Oe), De(), Me());
      }, K = setTimeout(Oe, 3e3);
      m.on("chat_ended", Oe), m.emit("end_chat", { reason: q });
    }),
    loadChatHistory: async () => {
      if (m)
        try {
          i.value = !0, m.emit("get_chat_history");
        } catch (q) {
          console.error("Failed to load chat history:", q);
        } finally {
          i.value = !1;
        }
    },
    connect: L,
    reconnect: V,
    cleanup: () => {
      m && (m.removeAllListeners(), m.disconnect(), m = null), N = null, M = null, G = null;
    },
    humanAgent: d,
    onTakeover: Y,
    submitRating: ge,
    currentForm: u,
    submitForm: le,
    getWorkflowState: Te,
    proceedWorkflow: st,
    onWorkflowState: Se,
    onWorkflowProceeded: He,
    currentSessionId: w,
    setToken: _e,
    setWidgetId: ke
  };
}
function Og(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Hr = { exports: {} }, dl;
function Ng() {
  return dl || (dl = 1, function(e) {
    (function() {
      function t(h, v, C) {
        return h.call.apply(h.bind, arguments);
      }
      function n(h, v, C) {
        if (!h) throw Error();
        if (2 < arguments.length) {
          var T = Array.prototype.slice.call(arguments, 2);
          return function() {
            var D = Array.prototype.slice.call(arguments);
            return Array.prototype.unshift.apply(D, T), h.apply(v, D);
          };
        }
        return function() {
          return h.apply(v, arguments);
        };
      }
      function s(h, v, C) {
        return s = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? t : n, s.apply(null, arguments);
      }
      var i = Date.now || function() {
        return +/* @__PURE__ */ new Date();
      };
      function r(h, v) {
        this.a = h, this.o = v || h, this.c = this.o.document;
      }
      var o = !!window.FontFace;
      function a(h, v, C, T) {
        if (v = h.c.createElement(v), C) for (var D in C) C.hasOwnProperty(D) && (D == "style" ? v.style.cssText = C[D] : v.setAttribute(D, C[D]));
        return T && v.appendChild(h.c.createTextNode(T)), v;
      }
      function l(h, v, C) {
        h = h.c.getElementsByTagName(v)[0], h || (h = document.documentElement), h.insertBefore(C, h.lastChild);
      }
      function d(h) {
        h.parentNode && h.parentNode.removeChild(h);
      }
      function u(h, v, C) {
        v = v || [], C = C || [];
        for (var T = h.className.split(/\s+/), D = 0; D < v.length; D += 1) {
          for (var j = !1, ie = 0; ie < T.length; ie += 1) if (v[D] === T[ie]) {
            j = !0;
            break;
          }
          j || T.push(v[D]);
        }
        for (v = [], D = 0; D < T.length; D += 1) {
          for (j = !1, ie = 0; ie < C.length; ie += 1) if (T[D] === C[ie]) {
            j = !0;
            break;
          }
          j || v.push(T[D]);
        }
        h.className = v.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "");
      }
      function w(h, v) {
        for (var C = h.className.split(/\s+/), T = 0, D = C.length; T < D; T++) if (C[T] == v) return !0;
        return !1;
      }
      function m(h) {
        return h.o.location.hostname || h.a.location.hostname;
      }
      function N(h, v, C) {
        function T() {
          ue && D && j && (ue(ie), ue = null);
        }
        v = a(h, "link", { rel: "stylesheet", href: v, media: "all" });
        var D = !1, j = !0, ie = null, ue = C || null;
        o ? (v.onload = function() {
          D = !0, T();
        }, v.onerror = function() {
          D = !0, ie = Error("Stylesheet failed to load"), T();
        }) : setTimeout(function() {
          D = !0, T();
        }, 0), l(h, "head", v);
      }
      function M(h, v, C, T) {
        var D = h.c.getElementsByTagName("head")[0];
        if (D) {
          var j = a(h, "script", { src: v }), ie = !1;
          return j.onload = j.onreadystatechange = function() {
            ie || this.readyState && this.readyState != "loaded" && this.readyState != "complete" || (ie = !0, C && C(null), j.onload = j.onreadystatechange = null, j.parentNode.tagName == "HEAD" && D.removeChild(j));
          }, D.appendChild(j), setTimeout(function() {
            ie || (ie = !0, C && C(Error("Script load timeout")));
          }, T || 5e3), j;
        }
        return null;
      }
      function G() {
        this.a = 0, this.c = null;
      }
      function Fe(h) {
        return h.a++, function() {
          h.a--, _e(h);
        };
      }
      function de(h, v) {
        h.c = v, _e(h);
      }
      function _e(h) {
        h.a == 0 && h.c && (h.c(), h.c = null);
      }
      function ke(h) {
        this.a = h || "-";
      }
      ke.prototype.c = function(h) {
        for (var v = [], C = 0; C < arguments.length; C++) v.push(arguments[C].replace(/[\W_]+/g, "").toLowerCase());
        return v.join(this.a);
      };
      function S(h, v) {
        this.c = h, this.f = 4, this.a = "n";
        var C = (v || "n4").match(/^([nio])([1-9])$/i);
        C && (this.a = C[1], this.f = parseInt(C[2], 10));
      }
      function L(h) {
        return Se(h) + " " + (h.f + "00") + " 300px " + V(h.c);
      }
      function V(h) {
        var v = [];
        h = h.split(/,\s*/);
        for (var C = 0; C < h.length; C++) {
          var T = h[C].replace(/['"]/g, "");
          T.indexOf(" ") != -1 || /^\d/.test(T) ? v.push("'" + T + "'") : v.push(T);
        }
        return v.join(",");
      }
      function Y(h) {
        return h.a + h.f;
      }
      function Se(h) {
        var v = "normal";
        return h.a === "o" ? v = "oblique" : h.a === "i" && (v = "italic"), v;
      }
      function He(h) {
        var v = 4, C = "n", T = null;
        return h && ((T = h.match(/(normal|oblique|italic)/i)) && T[1] && (C = T[1].substr(0, 1).toLowerCase()), (T = h.match(/([1-9]00|normal|bold)/i)) && T[1] && (/bold/i.test(T[1]) ? v = 7 : /[1-9]00/.test(T[1]) && (v = parseInt(T[1].substr(0, 1), 10)))), C + v;
      }
      function Xe(h, v) {
        this.c = h, this.f = h.o.document.documentElement, this.h = v, this.a = new ke("-"), this.j = v.events !== !1, this.g = v.classes !== !1;
      }
      function Ce(h) {
        h.g && u(h.f, [h.a.c("wf", "loading")]), Je(h, "loading");
      }
      function be(h) {
        if (h.g) {
          var v = w(h.f, h.a.c("wf", "active")), C = [], T = [h.a.c("wf", "loading")];
          v || C.push(h.a.c("wf", "inactive")), u(h.f, C, T);
        }
        Je(h, "inactive");
      }
      function Je(h, v, C) {
        h.j && h.h[v] && (C ? h.h[v](C.c, Y(C)) : h.h[v]());
      }
      function nt() {
        this.c = {};
      }
      function lt(h, v, C) {
        var T = [], D;
        for (D in v) if (v.hasOwnProperty(D)) {
          var j = h.c[D];
          j && T.push(j(v[D], C));
        }
        return T;
      }
      function he(h, v) {
        this.c = h, this.f = v, this.a = a(this.c, "span", { "aria-hidden": "true" }, this.f);
      }
      function ge(h) {
        l(h.c, "body", h.a);
      }
      function le(h) {
        return "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + V(h.c) + ";" + ("font-style:" + Se(h) + ";font-weight:" + (h.f + "00") + ";");
      }
      function Te(h, v, C, T, D, j) {
        this.g = h, this.j = v, this.a = T, this.c = C, this.f = D || 3e3, this.h = j || void 0;
      }
      Te.prototype.start = function() {
        var h = this.c.o.document, v = this, C = i(), T = new Promise(function(ie, ue) {
          function Ie() {
            i() - C >= v.f ? ue() : h.fonts.load(L(v.a), v.h).then(function(Qe) {
              1 <= Qe.length ? ie() : setTimeout(Ie, 25);
            }, function() {
              ue();
            });
          }
          Ie();
        }), D = null, j = new Promise(function(ie, ue) {
          D = setTimeout(ue, v.f);
        });
        Promise.race([j, T]).then(function() {
          D && (clearTimeout(D), D = null), v.g(v.a);
        }, function() {
          v.j(v.a);
        });
      };
      function st(h, v, C, T, D, j, ie) {
        this.v = h, this.B = v, this.c = C, this.a = T, this.s = ie || "BESbswy", this.f = {}, this.w = D || 3e3, this.u = j || null, this.m = this.j = this.h = this.g = null, this.g = new he(this.c, this.s), this.h = new he(this.c, this.s), this.j = new he(this.c, this.s), this.m = new he(this.c, this.s), h = new S(this.a.c + ",serif", Y(this.a)), h = le(h), this.g.a.style.cssText = h, h = new S(this.a.c + ",sans-serif", Y(this.a)), h = le(h), this.h.a.style.cssText = h, h = new S("serif", Y(this.a)), h = le(h), this.j.a.style.cssText = h, h = new S("sans-serif", Y(this.a)), h = le(h), this.m.a.style.cssText = h, ge(this.g), ge(this.h), ge(this.j), ge(this.m);
      }
      var ae = { D: "serif", C: "sans-serif" }, De = null;
      function Be() {
        if (De === null) {
          var h = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
          De = !!h && (536 > parseInt(h[1], 10) || parseInt(h[1], 10) === 536 && 11 >= parseInt(h[2], 10));
        }
        return De;
      }
      st.prototype.start = function() {
        this.f.serif = this.j.a.offsetWidth, this.f["sans-serif"] = this.m.a.offsetWidth, this.A = i(), Le(this);
      };
      function At(h, v, C) {
        for (var T in ae) if (ae.hasOwnProperty(T) && v === h.f[ae[T]] && C === h.f[ae[T]]) return !0;
        return !1;
      }
      function Le(h) {
        var v = h.g.a.offsetWidth, C = h.h.a.offsetWidth, T;
        (T = v === h.f.serif && C === h.f["sans-serif"]) || (T = Be() && At(h, v, C)), T ? i() - h.A >= h.w ? Be() && At(h, v, C) && (h.u === null || h.u.hasOwnProperty(h.a.c)) ? Me(h, h.v) : Me(h, h.B) : q(h) : Me(h, h.v);
      }
      function q(h) {
        setTimeout(s(function() {
          Le(this);
        }, h), 50);
      }
      function Me(h, v) {
        setTimeout(s(function() {
          d(this.g.a), d(this.h.a), d(this.j.a), d(this.m.a), v(this.a);
        }, h), 0);
      }
      function ce(h, v, C) {
        this.c = h, this.a = v, this.f = 0, this.m = this.j = !1, this.s = C;
      }
      var Oe = null;
      ce.prototype.g = function(h) {
        var v = this.a;
        v.g && u(v.f, [v.a.c("wf", h.c, Y(h).toString(), "active")], [v.a.c("wf", h.c, Y(h).toString(), "loading"), v.a.c("wf", h.c, Y(h).toString(), "inactive")]), Je(v, "fontactive", h), this.m = !0, K(this);
      }, ce.prototype.h = function(h) {
        var v = this.a;
        if (v.g) {
          var C = w(v.f, v.a.c("wf", h.c, Y(h).toString(), "active")), T = [], D = [v.a.c("wf", h.c, Y(h).toString(), "loading")];
          C || T.push(v.a.c("wf", h.c, Y(h).toString(), "inactive")), u(v.f, T, D);
        }
        Je(v, "fontinactive", h), K(this);
      };
      function K(h) {
        --h.f == 0 && h.j && (h.m ? (h = h.a, h.g && u(h.f, [h.a.c("wf", "active")], [h.a.c("wf", "loading"), h.a.c("wf", "inactive")]), Je(h, "active")) : be(h.a));
      }
      function vt(h) {
        this.j = h, this.a = new nt(), this.h = 0, this.f = this.g = !0;
      }
      vt.prototype.load = function(h) {
        this.c = new r(this.j, h.context || this.j), this.g = h.events !== !1, this.f = h.classes !== !1, _(this, new Xe(this.c, h), h);
      };
      function g(h, v, C, T, D) {
        var j = --h.h == 0;
        (h.f || h.g) && setTimeout(function() {
          var ie = D || null, ue = T || null || {};
          if (C.length === 0 && j) be(v.a);
          else {
            v.f += C.length, j && (v.j = j);
            var Ie, Qe = [];
            for (Ie = 0; Ie < C.length; Ie++) {
              var Ae = C[Ie], dt = ue[Ae.c], pt = v.a, Ge = Ae;
              if (pt.g && u(pt.f, [pt.a.c("wf", Ge.c, Y(Ge).toString(), "loading")]), Je(pt, "fontloading", Ge), pt = null, Oe === null) if (window.FontFace) {
                var Ge = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent), tn = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);
                Oe = Ge ? 42 < parseInt(Ge[1], 10) : !tn;
              } else Oe = !1;
              Oe ? pt = new Te(s(v.g, v), s(v.h, v), v.c, Ae, v.s, dt) : pt = new st(s(v.g, v), s(v.h, v), v.c, Ae, v.s, ie, dt), Qe.push(pt);
            }
            for (Ie = 0; Ie < Qe.length; Ie++) Qe[Ie].start();
          }
        }, 0);
      }
      function _(h, v, C) {
        var D = [], T = C.timeout;
        Ce(v);
        var D = lt(h.a, C, h.c), j = new ce(h.c, v, T);
        for (h.h = D.length, v = 0, C = D.length; v < C; v++) D[v].load(function(ie, ue, Ie) {
          g(h, j, ie, ue, Ie);
        });
      }
      function A(h, v) {
        this.c = h, this.a = v;
      }
      A.prototype.load = function(h) {
        function v() {
          if (j["__mti_fntLst" + T]) {
            var ie = j["__mti_fntLst" + T](), ue = [], Ie;
            if (ie) for (var Qe = 0; Qe < ie.length; Qe++) {
              var Ae = ie[Qe].fontfamily;
              ie[Qe].fontStyle != null && ie[Qe].fontWeight != null ? (Ie = ie[Qe].fontStyle + ie[Qe].fontWeight, ue.push(new S(Ae, Ie))) : ue.push(new S(Ae));
            }
            h(ue);
          } else setTimeout(function() {
            v();
          }, 50);
        }
        var C = this, T = C.a.projectId, D = C.a.version;
        if (T) {
          var j = C.c.o;
          M(this.c, (C.a.api || "https://fast.fonts.net/jsapi") + "/" + T + ".js" + (D ? "?v=" + D : ""), function(ie) {
            ie ? h([]) : (j["__MonotypeConfiguration__" + T] = function() {
              return C.a;
            }, v());
          }).id = "__MonotypeAPIScript__" + T;
        } else h([]);
      };
      function F(h, v) {
        this.c = h, this.a = v;
      }
      F.prototype.load = function(h) {
        var v, C, T = this.a.urls || [], D = this.a.families || [], j = this.a.testStrings || {}, ie = new G();
        for (v = 0, C = T.length; v < C; v++) N(this.c, T[v], Fe(ie));
        var ue = [];
        for (v = 0, C = D.length; v < C; v++) if (T = D[v].split(":"), T[1]) for (var Ie = T[1].split(","), Qe = 0; Qe < Ie.length; Qe += 1) ue.push(new S(T[0], Ie[Qe]));
        else ue.push(new S(T[0]));
        de(ie, function() {
          h(ue, j);
        });
      };
      function R(h, v) {
        h ? this.c = h : this.c = I, this.a = [], this.f = [], this.g = v || "";
      }
      var I = "https://fonts.googleapis.com/css";
      function B(h, v) {
        for (var C = v.length, T = 0; T < C; T++) {
          var D = v[T].split(":");
          D.length == 3 && h.f.push(D.pop());
          var j = "";
          D.length == 2 && D[1] != "" && (j = ":"), h.a.push(D.join(j));
        }
      }
      function z(h) {
        if (h.a.length == 0) throw Error("No fonts to load!");
        if (h.c.indexOf("kit=") != -1) return h.c;
        for (var v = h.a.length, C = [], T = 0; T < v; T++) C.push(h.a[T].replace(/ /g, "+"));
        return v = h.c + "?family=" + C.join("%7C"), 0 < h.f.length && (v += "&subset=" + h.f.join(",")), 0 < h.g.length && (v += "&text=" + encodeURIComponent(h.g)), v;
      }
      function U(h) {
        this.f = h, this.a = [], this.c = {};
      }
      var P = { latin: "BESbswy", "latin-ext": "çöüğş", cyrillic: "йяЖ", greek: "αβΣ", khmer: "កខគ", Hanuman: "កខគ" }, X = { thin: "1", extralight: "2", "extra-light": "2", ultralight: "2", "ultra-light": "2", light: "3", regular: "4", book: "4", medium: "5", "semi-bold": "6", semibold: "6", "demi-bold": "6", demibold: "6", bold: "7", "extra-bold": "8", extrabold: "8", "ultra-bold": "8", ultrabold: "8", black: "9", heavy: "9", l: "3", r: "4", b: "7" }, H = { i: "i", italic: "i", n: "n", normal: "n" }, W = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
      function te(h) {
        for (var v = h.f.length, C = 0; C < v; C++) {
          var T = h.f[C].split(":"), D = T[0].replace(/\+/g, " "), j = ["n4"];
          if (2 <= T.length) {
            var ie, ue = T[1];
            if (ie = [], ue) for (var ue = ue.split(","), Ie = ue.length, Qe = 0; Qe < Ie; Qe++) {
              var Ae;
              if (Ae = ue[Qe], Ae.match(/^[\w-]+$/)) {
                var dt = W.exec(Ae.toLowerCase());
                if (dt == null) Ae = "";
                else {
                  if (Ae = dt[2], Ae = Ae == null || Ae == "" ? "n" : H[Ae], dt = dt[1], dt == null || dt == "") dt = "4";
                  else var pt = X[dt], dt = pt || (isNaN(dt) ? "4" : dt.substr(0, 1));
                  Ae = [Ae, dt].join("");
                }
              } else Ae = "";
              Ae && ie.push(Ae);
            }
            0 < ie.length && (j = ie), T.length == 3 && (T = T[2], ie = [], T = T ? T.split(",") : ie, 0 < T.length && (T = P[T[0]]) && (h.c[D] = T));
          }
          for (h.c[D] || (T = P[D]) && (h.c[D] = T), T = 0; T < j.length; T += 1) h.a.push(new S(D, j[T]));
        }
      }
      function J(h, v) {
        this.c = h, this.a = v;
      }
      var xe = { Arimo: !0, Cousine: !0, Tinos: !0 };
      J.prototype.load = function(h) {
        var v = new G(), C = this.c, T = new R(this.a.api, this.a.text), D = this.a.families;
        B(T, D);
        var j = new U(D);
        te(j), N(C, z(T), Fe(v)), de(v, function() {
          h(j.a, j.c, xe);
        });
      };
      function ve(h, v) {
        this.c = h, this.a = v;
      }
      ve.prototype.load = function(h) {
        var v = this.a.id, C = this.c.o;
        v ? M(this.c, (this.a.api || "https://use.typekit.net") + "/" + v + ".js", function(T) {
          if (T) h([]);
          else if (C.Typekit && C.Typekit.config && C.Typekit.config.fn) {
            T = C.Typekit.config.fn;
            for (var D = [], j = 0; j < T.length; j += 2) for (var ie = T[j], ue = T[j + 1], Ie = 0; Ie < ue.length; Ie++) D.push(new S(ie, ue[Ie]));
            try {
              C.Typekit.load({ events: !1, classes: !1, async: !0 });
            } catch {
            }
            h(D);
          }
        }, 2e3) : h([]);
      };
      function Ze(h, v) {
        this.c = h, this.f = v, this.a = [];
      }
      Ze.prototype.load = function(h) {
        var v = this.f.id, C = this.c.o, T = this;
        v ? (C.__webfontfontdeckmodule__ || (C.__webfontfontdeckmodule__ = {}), C.__webfontfontdeckmodule__[v] = function(D, j) {
          for (var ie = 0, ue = j.fonts.length; ie < ue; ++ie) {
            var Ie = j.fonts[ie];
            T.a.push(new S(Ie.name, He("font-weight:" + Ie.weight + ";font-style:" + Ie.style)));
          }
          h(T.a);
        }, M(this.c, (this.f.api || "https://f.fontdeck.com/s/css/js/") + m(this.c) + "/" + v + ".js", function(D) {
          D && h([]);
        })) : h([]);
      };
      var Re = new vt(window);
      Re.a.c.custom = function(h, v) {
        return new F(v, h);
      }, Re.a.c.fontdeck = function(h, v) {
        return new Ze(v, h);
      }, Re.a.c.monotype = function(h, v) {
        return new A(v, h);
      }, Re.a.c.typekit = function(h, v) {
        return new ve(v, h);
      }, Re.a.c.google = function(h, v) {
        return new J(v, h);
      };
      var ct = { load: s(Re.load, Re) };
      e.exports ? e.exports = ct : (window.WebFont = ct, window.WebFontConfig && Re.load(window.WebFontConfig));
    })();
  }(Hr)), Hr.exports;
}
var Pg = Ng();
const Mg = /* @__PURE__ */ Og(Pg), pl = [
  "Space Grotesk:400,500,600,700",
  "Instrument Sans:400,500,600",
  "JetBrains Mono:400,500,600"
], Fg = (e) => {
  const t = [...pl], n = (e == null ? void 0 : e.split(",")[0].trim().replace(/['"]/g, "")) || "", s = pl.some(
    (i) => i.toLowerCase().startsWith(n.toLowerCase())
  );
  n && !s && t.push(n), Mg.load({
    google: { families: t },
    active: () => {
      if (!e) return;
      const i = document.querySelector(".chat-container");
      i && (i.style.fontFamily = e.includes(",") ? e : `"${e}", system-ui, sans-serif`);
    }
  });
};
function Dg() {
  const e = re({}), t = re(""), n = (i) => {
    var r;
    e.value = i, i.photo_url && (e.value.photo_url = i.photo_url), Fg(i.font_family), window.parent.postMessage({
      type: "CUSTOMIZATION_UPDATE",
      data: {
        chat_bubble_color: i.chat_bubble_color || "#C9F24E",
        chat_style: i.chat_style,
        chat_initiation_messages: i.chat_initiation_messages || [],
        // Dashboard "Widget placement" defaults — the embed loader merges these
        // under any options the installing developer set.
        widget_display: (r = i.customization_metadata) == null ? void 0 : r.widget_display
      }
    }, "*");
  };
  return {
    customization: e,
    agentName: t,
    applyCustomization: n,
    initializeFromData: () => {
      const i = window.__INITIAL_DATA__;
      i && (n(i.customization || {}), t.value = i.agentName || "");
    }
  };
}
const Bg = 13, $g = 24;
function Ug(e, t) {
  const n = tr({}), s = [];
  let i = null;
  const r = typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, o = (u) => {
    i || s.length === 0 || (i = setTimeout(a, u));
  }, a = () => {
    i = null;
    const u = s[0];
    if (u === void 0) return;
    const w = e.value[u], m = n[u], N = (w == null ? void 0 : w.message) ?? "";
    if (!m || !w) {
      s.shift(), o(0);
      return;
    }
    if (m.shown >= N.length) {
      m.done = !0, s.shift(), o(0);
      return;
    }
    m.shown += 1;
    const M = N[m.shown - 1];
    t == null || t(), o(M === " " ? $g : Bg);
  };
  Vt(() => e.value.length, (u, w) => {
    w !== void 0 && u < w && (Object.keys(n).forEach((m) => {
      delete n[Number(m)];
    }), s.length = 0);
    for (let m = w ?? 0; m < u; m++) {
      const N = e.value[m];
      if (!N || !N.stream || m in n) continue;
      const M = N.message ?? "";
      r || !M ? n[m] = { shown: M.length, done: !0 } : (n[m] = { shown: 0, done: !1 }, s.push(m));
    }
    o(0);
  });
  const l = (u, w) => {
    const m = n[u];
    return m ? w.slice(0, m.shown) : w;
  }, d = (u) => {
    const w = n[u];
    return !!w && !w.done;
  };
  return li(() => {
    i && clearTimeout(i);
  }), { displayText: l, isStreaming: d };
}
function zg(e) {
  const t = re(!0);
  let n = 0;
  const s = () => {
    window.parent.postMessage({ type: "UNREAD_COUNT", count: n }, "*");
  }, i = (r) => {
    var o;
    ((o = r == null ? void 0 : r.data) == null ? void 0 : o.type) === "WIDGET_VISIBILITY" && (t.value = !!r.data.open, t.value && n !== 0 && (n = 0, s()));
  };
  Vt(() => e.value.length, (r, o) => {
    if (r <= (o ?? 0) || t.value) return;
    const a = e.value[r - 1];
    a && (a.message_type === "bot" || a.message_type === "agent") && (n += 1, s());
  }), ir(() => window.addEventListener("message", i)), li(() => window.removeEventListener("message", i));
}
const Hg = {
  light: !1,
  mono: !1,
  radius: 22,
  bubble: 16,
  glow: "rgba(157,140,255,.26)",
  border: "rgba(157,140,255,.32)",
  card: "linear-gradient(180deg,rgba(28,26,40,.94),rgba(15,14,22,.97))",
  text: "#ECEAFA",
  muted: "#9C97BE",
  agentBg: "rgba(255,255,255,.06)",
  accent: "#9D8CFF"
}, qg = {
  light: !1,
  mono: !1,
  radius: 26,
  bubble: 18,
  glow: "rgba(157,140,255,.32)",
  border: "rgba(157,140,255,.40)",
  card: "linear-gradient(180deg,#16131F,#0A0910)",
  text: "#F2F3F8",
  muted: "#A7A0CC",
  agentBg: "rgba(255,255,255,.05)",
  accent: "#9D8CFF"
}, Wg = {
  light: !1,
  mono: !0,
  radius: 8,
  bubble: 4,
  glow: "rgba(201,242,78,.20)",
  border: "rgba(201,242,78,.30)",
  card: "#070907",
  text: "#D7F7C8",
  muted: "#7F9B57",
  agentBg: "rgba(201,242,78,.045)",
  accent: "#C9F24E"
}, jg = {
  light: !1,
  mono: !1,
  radius: 18,
  bubble: 14,
  glow: "rgba(95,227,214,.22)",
  border: "rgba(95,227,214,.30)",
  card: "linear-gradient(180deg,#0E1A1A,#0A1414)",
  text: "#DDF7F3",
  muted: "#6FAFA8",
  agentBg: "rgba(255,255,255,.05)",
  accent: "#5FE3D6"
}, Vg = {
  light: !0,
  mono: !1,
  radius: 28,
  bubble: 20,
  glow: "rgba(255,138,115,.30)",
  border: "rgba(0,0,0,.07)",
  card: "#FFFFFF",
  text: "#2A2730",
  muted: "#9A93A3",
  agentBg: "#F4F1F6",
  accent: "#FF8A73"
}, Bi = {
  light: !0,
  mono: !1,
  radius: 24,
  bubble: 16,
  glow: "rgba(255,138,115,.22)",
  border: "rgba(0,0,0,.08)",
  card: "#FFFFFF",
  text: "#2A2A33",
  muted: "#8A8A99",
  agentBg: "#F3F3F6",
  accent: "#FF8A73"
}, Kg = {
  GLASS: Hg,
  AURORA: qg,
  TERMINAL: Wg,
  CALM_MINT: jg,
  PLAYFUL: Vg,
  SUNRISE: Bi,
  CHATBOT: Bi,
  ASK_ANYTHING: Bi
}, Gg = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", gl = "'Instrument Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";
function Yg(e) {
  return Math.max(4, Math.round(e * 0.3));
}
function ml(e) {
  const t = (e || "").replace("#", "");
  if (t.length < 6) return "#0B0C10";
  const n = parseInt(t.slice(0, 2), 16), s = parseInt(t.slice(2, 4), 16), i = parseInt(t.slice(4, 6), 16);
  return (0.299 * n + 0.587 * s + 0.114 * i) / 255 > 0.62 ? "#0B0C10" : "#FFFFFF";
}
function Xg(e) {
  return Kg[e || ""] || Bi;
}
const Zg = "#212529";
function Jg(e, t) {
  const n = Xg(e), s = (t == null ? void 0 : t.chat_background_color) || "", i = /^#[0-9a-fA-F]{6}$/.test(s), r = s || n.card, o = (t == null ? void 0 : t.chat_text_color) || "", l = /^#[0-9a-fA-F]{6}$/.test(o) && o.toLowerCase() !== Zg ? o : i ? ys(s) ? "#FFFFFF" : "#111111" : n.text, d = i ? ys(s) ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" : n.muted, u = i ? nd(s, 20) : n.agentBg, w = (t == null ? void 0 : t.accent_color) || n.accent, m = i ? !ys(s) : n.light, N = ml(w) === "#0B0C10", M = m === N ? d : w, G = n.mono ? Gg : t != null && t.font_family ? `${t.font_family}, ${gl}` : gl;
  return {
    "--cm-card": r,
    "--cm-text": l,
    "--cm-muted": d,
    "--cm-agent-bg": u,
    "--cm-accent": w,
    "--cm-on-accent": ml(w),
    "--cm-presence": M,
    "--cm-border": n.border,
    "--cm-glow": n.glow,
    "--cm-radius": `${n.radius}px`,
    "--cm-bubble": `${n.bubble}px`,
    "--cm-bubble-tail": `${Yg(n.bubble)}px`,
    "--cm-field-radius": n.mono ? "7px" : "12px",
    "--cm-avatar-radius": n.mono ? "28%" : "50%",
    "--cm-hairline": n.light ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)",
    "--cm-body-font": G
  };
}
function Qg() {
  const e = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CAD: "CA$",
    AUD: "A$",
    CNY: "¥",
    CHF: "CHF",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    NZD: "NZ$",
    SGD: "S$",
    HKD: "HK$",
    KRW: "₩",
    MXN: "MX$",
    BRL: "R$",
    ZAR: "R",
    RUB: "₽",
    TRY: "₺",
    THB: "฿",
    PLN: "zł",
    AED: "د.إ",
    SAR: "﷼",
    ILS: "₪",
    MYR: "RM"
  };
  return {
    formatCurrency: (s, i) => {
      if (!s && s !== 0) return "";
      const r = i ? e[i] || i : "", o = typeof s == "string" ? s : s.toString();
      return r ? `${r}${o}` : o;
    },
    getCurrencySymbol: (s) => e[s] || s,
    currencySymbols: e
  };
}
const em = {
  key: 0,
  class: "widget-unavailable-overlay"
}, tm = {
  key: 1,
  class: "auth-error-overlay"
}, nm = { class: "auth-error-card" }, sm = { class: "auth-error-message" }, im = {
  key: 0,
  class: "initializing-overlay"
}, rm = {
  key: 0,
  class: "connecting-message"
}, om = {
  key: 1,
  class: "failed-message"
}, am = { class: "welcome-content" }, lm = { class: "welcome-header" }, cm = ["src", "alt"], um = { class: "welcome-title" }, fm = { class: "welcome-subtitle" }, hm = { class: "welcome-input-container" }, dm = {
  key: 0,
  class: "email-input"
}, pm = ["disabled"], gm = { class: "welcome-message-input" }, mm = ["placeholder", "disabled"], _m = ["disabled"], vm = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, ym = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, bm = { class: "landing-page-content" }, wm = { class: "landing-page-header" }, km = { class: "landing-page-heading" }, xm = { class: "landing-page-text" }, Am = { class: "landing-page-actions" }, Sm = { class: "form-fullscreen-content" }, Tm = {
  key: 0,
  class: "form-header"
}, Em = {
  key: 0,
  class: "form-title"
}, Cm = {
  key: 1,
  class: "form-description"
}, Rm = { class: "form-fields" }, Im = ["for"], Lm = {
  key: 0,
  class: "required-indicator"
}, Om = ["id", "type", "placeholder", "required", "minlength", "maxlength", "value", "onInput", "onBlur", "autocomplete", "inputmode"], Nm = ["id", "placeholder", "required", "min", "max", "value", "onInput"], Pm = ["id", "placeholder", "required", "minlength", "maxlength", "value", "onInput"], Mm = ["id", "required", "value", "onChange"], Fm = { value: "" }, Dm = ["value"], Bm = {
  key: 4,
  class: "checkbox-field"
}, $m = ["id", "required", "checked", "onChange"], Um = { class: "checkbox-label" }, zm = {
  key: 5,
  class: "radio-group"
}, Hm = ["name", "value", "required", "checked", "onChange"], qm = { class: "radio-label" }, Wm = {
  key: 6,
  class: "field-error"
}, jm = { class: "form-actions" }, Vm = ["disabled"], Km = {
  key: 0,
  class: "loading-spinner-inline"
}, Gm = { key: 1 }, Ym = { class: "header-content" }, Xm = ["src", "alt"], Zm = { class: "header-info" }, Jm = { class: "header-actions" }, Qm = ["title", "aria-label"], e_ = ["disabled", "title", "aria-label"], t_ = {
  key: 0,
  class: "new-chat-hint"
}, n_ = { key: 0 }, s_ = { class: "ask-anything-header" }, i_ = ["src", "alt"], r_ = { class: "header-info" }, o_ = {
  key: 3,
  class: "loading-history"
}, a_ = { class: "cm-email-gate-title" }, l_ = ["disabled"], c_ = {
  key: 0,
  class: "cm-email-gate-error"
}, u_ = ["disabled"], f_ = {
  key: 0,
  class: "cm-welcome-block"
}, h_ = { class: "message agent-message cm-welcome-row" }, d_ = ["src", "alt"], p_ = {
  key: 0,
  class: "cm-msg-avatar",
  "aria-hidden": "true"
}, g_ = ["src"], m_ = ["src"], __ = { class: "message-col" }, v_ = {
  key: 0,
  class: "rating-content"
}, y_ = { class: "rating-prompt" }, b_ = ["onMouseover", "onMouseleave", "onClick", "disabled"], w_ = {
  key: 0,
  class: "feedback-wrapper"
}, k_ = { class: "feedback-section" }, x_ = ["onUpdate:modelValue", "disabled"], A_ = { class: "feedback-counter" }, S_ = ["onClick", "disabled"], T_ = {
  key: 1,
  class: "submitted-feedback-wrapper"
}, E_ = { class: "submitted-feedback" }, C_ = { class: "submitted-feedback-text" }, R_ = {
  key: 2,
  class: "submitted-message"
}, I_ = {
  key: 1,
  class: "form-content"
}, L_ = {
  key: 0,
  class: "form-header"
}, O_ = {
  key: 0,
  class: "form-title"
}, N_ = {
  key: 1,
  class: "form-description"
}, P_ = { class: "form-fields" }, M_ = ["for"], F_ = {
  key: 0,
  class: "required-indicator"
}, D_ = ["id", "type", "placeholder", "required", "minlength", "maxlength", "value", "onInput", "onBlur", "disabled", "autocomplete", "inputmode"], B_ = ["id", "placeholder", "required", "min", "max", "value", "onInput", "disabled"], $_ = ["id", "placeholder", "required", "minlength", "maxlength", "value", "onInput", "disabled"], U_ = ["id", "required", "value", "onChange", "disabled"], z_ = { value: "" }, H_ = ["value"], q_ = {
  key: 4,
  class: "checkbox-field"
}, W_ = ["id", "checked", "onChange", "disabled"], j_ = ["for"], V_ = {
  key: 5,
  class: "radio-field"
}, K_ = ["id", "name", "value", "checked", "onChange", "disabled"], G_ = ["for"], Y_ = {
  key: 6,
  class: "field-error"
}, X_ = { class: "form-actions" }, Z_ = ["onClick", "disabled"], J_ = {
  key: 2,
  class: "user-input-content"
}, Q_ = {
  key: 0,
  class: "user-input-prompt"
}, ev = {
  key: 1,
  class: "user-input-form"
}, tv = ["onUpdate:modelValue", "onKeydown"], nv = ["onClick", "disabled"], sv = {
  key: 2,
  class: "user-input-submitted"
}, iv = {
  key: 0,
  class: "user-input-confirmation"
}, rv = {
  key: 3,
  class: "product-message-container"
}, ov = ["innerHTML"], av = {
  key: 1,
  class: "products-carousel"
}, lv = { class: "carousel-items" }, cv = {
  key: 0,
  class: "product-image-compact"
}, uv = ["src", "alt"], fv = { class: "product-info-compact" }, hv = { class: "product-text-area" }, dv = { class: "product-title-compact" }, pv = {
  key: 0,
  class: "product-variant-compact"
}, gv = { class: "product-price-compact" }, mv = { class: "product-actions-compact" }, _v = ["onClick"], vv = {
  key: 2,
  class: "no-products-message"
}, yv = {
  key: 3,
  class: "no-products-message"
}, bv = ["innerHTML"], wv = ["innerHTML"], kv = {
  key: 2,
  class: "message-attachments"
}, xv = {
  key: 0,
  class: "attachment-image-container"
}, Av = ["src", "alt", "onClick"], Sv = { class: "attachment-image-info" }, Tv = ["href"], Ev = { class: "attachment-size" }, Cv = ["href"], Rv = { class: "attachment-size" }, Iv = {
  key: 0,
  class: "citation-chips"
}, Lv = ["title"], Ov = { class: "message-info" }, Nv = {
  key: 0,
  class: "agent-name"
}, Pv = {
  key: 5,
  class: "cm-quick-actions-bar"
}, Mv = ["disabled", "onClick"], Fv = {
  key: 0,
  class: "file-previews-widget"
}, Dv = {
  class: "file-preview-content-widget",
  style: { cursor: "pointer" }
}, Bv = ["src", "alt", "onClick"], $v = ["onClick"], Uv = { class: "file-preview-info-widget" }, zv = { class: "file-preview-name-widget" }, Hv = { class: "file-preview-size-widget" }, qv = ["onClick"], Wv = {
  key: 1,
  class: "upload-progress-widget"
}, jv = { class: "message-input" }, Vv = ["placeholder", "disabled"], Kv = ["disabled", "title"], Gv = ["disabled"], Yv = {
  key: 7,
  class: "new-conversation-section"
}, Xv = { class: "conversation-ended-message" }, Zv = {
  key: 8,
  class: "rating-dialog"
}, Jv = { class: "rating-content" }, Qv = { class: "star-rating" }, ey = ["onClick"], ty = { class: "rating-actions" }, ny = ["disabled"], sy = {
  key: 0,
  class: "preview-modal-image-container"
}, iy = ["src", "alt"], ry = { class: "preview-modal-filename" }, oy = {
  key: 3,
  class: "widget-loading"
}, Ws = "ctid", _l = 3, ay = "image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls", ly = /* @__PURE__ */ Kl({
  __name: "WidgetBuilder",
  props: {
    widgetId: {},
    token: {},
    initialAuthError: {}
  },
  setup(e) {
    var ra;
    const t = e, n = fe(() => {
      var f;
      return t.widgetId || ((f = window.__INITIAL_DATA__) == null ? void 0 : f.widgetId);
    }), {
      customization: s,
      agentName: i,
      applyCustomization: r,
      initializeFromData: o
    } = Dg(), { formatCurrency: a } = Qg(), {
      messages: l,
      loading: d,
      errorMessage: u,
      showError: w,
      loadingHistory: m,
      hasStartedChat: N,
      connectionStatus: M,
      sendMessage: G,
      endChat: Fe,
      loadChatHistory: de,
      connect: _e,
      reconnect: ke,
      cleanup: S,
      humanAgent: L,
      onTakeover: V,
      submitRating: Y,
      submitForm: Se,
      currentForm: He,
      getWorkflowState: Xe,
      proceedWorkflow: Ce,
      onWorkflowState: be,
      onWorkflowProceeded: Je,
      currentSessionId: nt,
      setToken: lt,
      setWidgetId: he
    } = Lg(), { displayText: ge, isStreaming: le } = Ug(l, () => _s(() => ot()));
    zg(l);
    const Te = re(""), st = re(!0), ae = re(""), De = re(!1), Be = (f) => {
      const p = f.target;
      Te.value = p.value;
    };
    let At = null;
    const Le = () => {
      At && At.disconnect(), At = new MutationObserver((p) => {
        let c = !1, Z = !1;
        p.forEach((pe) => {
          if (pe.type === "childList") {
            const se = Array.from(pe.addedNodes).some(
              (Ye) => {
                var Ne;
                return Ye.nodeType === Node.ELEMENT_NODE && (Ye.matches("input, textarea") || ((Ne = Ye.querySelector) == null ? void 0 : Ne.call(Ye, "input, textarea")));
              }
            ), it = Array.from(pe.removedNodes).some(
              (Ye) => {
                var Ne;
                return Ye.nodeType === Node.ELEMENT_NODE && (Ye.matches("input, textarea") || ((Ne = Ye.querySelector) == null ? void 0 : Ne.call(Ye, "input, textarea")));
              }
            );
            se && (Z = !0, c = !0), it && (c = !0);
          }
        }), c && (clearTimeout(Le.timeoutId), Le.timeoutId = setTimeout(() => {
          Me();
        }, Z ? 50 : 100));
      });
      const f = document.querySelector(".widget-container") || document.body;
      At.observe(f, {
        childList: !0,
        subtree: !0
      });
    };
    Le.timeoutId = null;
    let q = [];
    const Me = () => {
      ce();
      const f = [
        '.widget-container input[type="text"]',
        '.chat-container input[type="text"]',
        ".message-input input",
        ".welcome-message-field",
        ".ask-anything-field",
        'input[placeholder*="message"]',
        'input[placeholder*="Type"]',
        'input[placeholder*="Ask"]',
        "input.message-input",
        "textarea",
        // More specific selectors for the widget context
        ".widget-container input",
        ".chat-input input",
        "input"
      ];
      let p = [];
      for (const c of f) {
        const Z = document.querySelectorAll(c);
        if (Z.length > 0) {
          p = Array.from(Z);
          break;
        }
      }
      p.length !== 0 && (q = p, p.forEach((c) => {
        c.addEventListener("input", K, !0), c.addEventListener("keyup", K, !0), c.addEventListener("change", K, !0), c.addEventListener("keypress", vt, !0), c.addEventListener("keydown", g, !0);
      }));
    }, ce = () => {
      q.forEach((f) => {
        f.removeEventListener("input", K), f.removeEventListener("keyup", K), f.removeEventListener("change", K), f.removeEventListener("keypress", vt), f.removeEventListener("keydown", g);
      }), q = [];
    }, Oe = (f) => !!(f && f.closest && f.closest(".form-message, .form-fullscreen, .cm-email-gate")), K = (f) => {
      if (Oe(f.target)) return;
      const p = f.target;
      Te.value = p.value;
    }, vt = (f) => {
      Oe(f.target) || f.key === "Enter" && !f.shiftKey && (f.preventDefault(), f.stopPropagation(), nn());
    }, g = (f) => {
      Oe(f.target) || f.key === "Enter" && !f.shiftKey && (f.preventDefault(), f.stopPropagation(), nn());
    }, _ = (f) => {
      const p = f.target, c = document.querySelector(".header-menu-container");
      document.querySelector(".header-menu-btn");
      const Z = document.querySelector(".header-dropdown-menu");
      Z && !(c != null && c.contains(p)) && (Z.style.display = "none");
    }, A = re(!0), F = (f) => !f || f === "undefined" || f === "null" || typeof f == "string" && f.trim() === "" ? null : f, R = re(F(((ra = window.__INITIAL_DATA__) == null ? void 0 : ra.initialToken) || localStorage.getItem(Ws)));
    fe(() => !!R.value);
    const I = re(null), B = re(!1), z = re(!1), U = re(!1), P = re(!1), X = re("Ready to talk"), H = re("");
    let W = null, te = null, J = null, xe = null, ve = null, Ze = 0;
    t.initialAuthError && (I.value = t.initialAuthError, B.value = !0, A.value = !1), o();
    const Re = window.__INITIAL_DATA__;
    if (Re != null && Re.initialToken) {
      const f = F(Re.initialToken);
      f && (R.value = f, window.parent.postMessage({
        type: "TOKEN_UPDATE",
        token: f
      }, "*"), De.value = !0);
    }
    const ct = re(!1);
    (Re == null ? void 0 : Re.allowAttachments) !== void 0 && (ct.value = Re.allowAttachments);
    const h = re(null), {
      chatStyles: v,
      chatIconStyles: C,
      agentBubbleStyles: T,
      userBubbleStyles: D,
      messageNameStyles: j,
      headerBorderStyles: ie,
      photoUrl: ue,
      shadowStyle: Ie
    } = Mp(s), Qe = re(null), {
      uploadedAttachments: Ae,
      previewModal: dt,
      previewFile: pt,
      formatFileSize: Ge,
      isImageAttachment: tn,
      getDownloadUrl: ns,
      getPreviewUrl: xs,
      handleFileSelect: ss,
      handleDrop: As,
      handleDragOver: Ss,
      handleDragLeave: fi,
      handlePaste: Bt,
      removeAttachment: Sn,
      openPreview: is,
      closePreview: Un,
      openFilePicker: rs,
      isImage: Ts
    } = Bp(R, Qe);
    fe(() => l.value.some(
      (f) => f.message_type === "form" && (!f.isSubmitted || f.isSubmitted === !1)
    ));
    const gt = fe(() => {
      var f;
      return N.value && De.value || !yr.value ? M.value === "connected" && !d.value : Ms(ae.value.trim()) && M.value === "connected" && !d.value || ((f = window.__INITIAL_DATA__) == null ? void 0 : f.workflow);
    }), os = fe(() => M.value === "connected" ? zt.value ? "Ask me anything..." : "Type a message..." : "Connecting..."), nn = async () => {
      if (!Te.value.trim() && Ae.value.length === 0) return;
      !N.value && ae.value && await qe();
      const f = Ae.value.map((c) => ({
        content: c.content,
        // base64 content
        filename: c.filename,
        content_type: c.type,
        size: c.size
      }));
      await G(Te.value, ae.value, f), Ae.value.forEach((c) => {
        c.url && c.url.startsWith("blob:") && URL.revokeObjectURL(c.url), c.file_url && c.file_url.startsWith("blob:") && URL.revokeObjectURL(c.file_url);
      }), Te.value = "", Ae.value = [];
      const p = document.querySelector('input[placeholder*="Type a message"]');
      p && (p.value = ""), setTimeout(() => {
        Me();
      }, 500);
    }, Es = (f) => {
      gt.value && (Te.value = f, nn());
    }, zn = () => {
      window.parent.postMessage({ type: "WIDGET_MINIMIZE" }, "*");
    }, hr = (f, p, c = 16e3) => {
      const Z = p / c, pe = new Int16Array(Math.max(1, Math.floor(f.length / Z)));
      for (let se = 0; se < pe.length; se++) {
        const it = Math.floor(se * Z), Ye = Math.min(f.length, Math.floor((se + 1) * Z));
        let Ne = 0;
        for (let dn = it; dn < Ye; dn++) Ne += f[dn];
        const Vn = Math.max(-1, Math.min(1, Ne / Math.max(1, Ye - it)));
        pe[se] = Vn < 0 ? Vn * 32768 : Vn * 32767;
      }
      return pe.buffer;
    }, oe = async (f) => {
      if (!J) return;
      const p = new Int16Array(f), c = J.createBuffer(1, p.length, 24e3), Z = c.getChannelData(0);
      for (let se = 0; se < p.length; se++) Z[se] = p[se] / 32768;
      const pe = J.createBufferSource();
      pe.buffer = c, pe.connect(J.destination), Ze = Math.max(Ze, J.currentTime), pe.start(Ze), Ze += c.duration;
    }, y = () => {
      (W == null ? void 0 : W.readyState) === WebSocket.OPEN && (W.send(JSON.stringify({ type: "audio_stream_end" })), W.close(1e3, "Call ended")), xe == null || xe.disconnect(), ve == null || ve.disconnect(), te == null || te.getTracks().forEach((f) => f.stop()), J == null || J.close(), W = null, xe = null, ve = null, te = null, J = null, Ze = 0, P.value = !1, X.value = "Ready to talk";
    }, $ = async () => {
      if (P.value) {
        y();
        return;
      }
      if (!n.value || !R.value) {
        X.value = "Open the chat first, then try again.";
        return;
      }
      try {
        X.value = "Requesting microphone…", te = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } }), J = new AudioContext(), await J.resume(), Ze = J.currentTime;
        const f = bs.WS_URL.replace(/^http/, "ws").replace(/\/$/, "");
        W = new WebSocket(`${f}/api/v1/widgets/${n.value}/voice`), W.binaryType = "arraybuffer", W.onmessage = async (p) => {
          if (p.data instanceof ArrayBuffer) {
            await oe(p.data);
            return;
          }
          const c = JSON.parse(p.data);
          c.type === "ready" && (X.value = "Listening…"), c.type === "transcript" && (H.value = c.text, X.value = c.role === "assistant" ? "Speaking…" : "Thinking…"), c.type === "interrupted" && (Ze = (J == null ? void 0 : J.currentTime) || 0, X.value = "Listening…"), c.type === "error" && (X.value = c.message);
        }, W.onclose = () => {
          (te || J) && y();
        }, await new Promise((p, c) => {
          W.onopen = () => {
            W.send(JSON.stringify({ type: "auth", token: R.value })), p();
          }, W.onerror = () => c(new Error("Voice connection failed"));
        }), ve = J.createMediaStreamSource(te), xe = J.createScriptProcessor(4096, 1, 1), xe.onaudioprocess = (p) => {
          (W == null ? void 0 : W.readyState) !== WebSocket.OPEN || !J || W.send(hr(p.inputBuffer.getChannelData(0), J.sampleRate));
        }, ve.connect(xe), xe.connect(J.destination), P.value = !0, X.value = "Listening…";
      } catch (f) {
        console.error("Unable to start voice call", f), y(), X.value = "Microphone or voice connection unavailable.";
      }
    }, Q = (f) => {
      f.key === "Enter" && !f.shiftKey && (f.preventDefault(), f.stopPropagation(), nn());
    }, qe = async () => {
      var f, p, c, Z, pe;
      try {
        if (!n.value)
          return console.error("Widget ID is not available"), I.value = "Widget ID is not available. Please refresh and try again.", B.value = !0, !1;
        const se = new URL(`${bs.API_URL}/widgets/${n.value}`);
        ae.value.trim() && Ms(ae.value.trim()) && se.searchParams.append("email", ae.value.trim());
        const it = {
          Accept: "application/json",
          "Content-Type": "application/json"
        };
        R.value && (it.Authorization = `Bearer ${R.value}`);
        const Ye = await fetch(se, {
          headers: it
        });
        if (Ye.status === 401) {
          De.value = !1;
          try {
            const cs = (await Ye.json()).detail || "";
            (cs.includes("generate-token") || cs.includes("API key") || cs.includes("Token required")) && (z.value = !0, I.value = "Widget authentication not configured. Please contact the website administrator.", B.value = !0, localStorage.removeItem(Ws), R.value = null);
          } catch {
            I.value = "Authentication required. Your token has expired or is invalid. Please refresh the page.", B.value = !0, localStorage.removeItem(Ws), R.value = null;
          }
          return !1;
        }
        if (!Ye.ok) {
          try {
            const dn = await Ye.json();
            I.value = dn.detail || `Error: ${Ye.statusText}`;
          } catch {
            I.value = `Error: ${Ye.statusText}. Please try again.`;
          }
          return B.value = !0, !1;
        }
        const Ne = await Ye.json();
        return Ne.token && (R.value = Ne.token, localStorage.setItem(Ws, Ne.token), window.parent.postMessage({ type: "TOKEN_UPDATE", token: Ne.token }, "*")), De.value = !0, I.value = null, B.value = !1, lt(R.value || void 0), await _e() ? (await yt(), (f = Ne.agent) != null && f.customization && r(Ne.agent.customization), Ne.agent && !(Ne != null && Ne.human_agent) && (i.value = Ne.agent.name), Ne != null && Ne.human_agent && (L.value = Ne.human_agent), ((p = Ne.agent) == null ? void 0 : p.allow_attachments) !== void 0 && (ct.value = Ne.agent.allow_attachments), U.value = !!((c = Ne.agent) != null && c.voice_enabled), ((Z = Ne.agent) == null ? void 0 : Z.workflow) !== void 0 && (window.__INITIAL_DATA__ = window.__INITIAL_DATA__ || {}, window.__INITIAL_DATA__.workflow = Ne.agent.workflow), (pe = Ne.agent) != null && pe.workflow && await Xe(), !0) : (console.error("Failed to connect to chat service"), I.value = "Failed to connect to chat service. Please try again.", B.value = !0, !1);
      } catch (se) {
        return console.error("Error checking authorization:", se), I.value = "An unexpected error occurred. Please try again.", B.value = !0, De.value = !1, !1;
      } finally {
        A.value = !1;
      }
    }, yt = async () => {
      !N.value && De.value && (N.value = !0, await de());
    }, ot = () => {
      h.value && (h.value.scrollTop = h.value.scrollHeight);
    };
    Vt(() => l.value, (f) => {
      _s(() => {
        ot();
      });
    }, { deep: !0 }), Vt(M, (f, p) => {
      f === "connected" && p !== "connected" && setTimeout(Me, 100);
    }), Vt(() => l.value.length, (f, p) => {
      f > 0 && p === 0 && setTimeout(Me, 100);
    });
    let bt = null;
    Vt(() => l.value, (f) => {
      const p = f[f.length - 1];
      !rl(p) || p === bt || (bt = p, su(p));
    }, { deep: !0 });
    const Xt = async () => {
      await ke() && await qe();
    }, Tn = re(!1), En = re(0), ut = re(""), $t = re(0), Ut = re(!1), mt = re({}), wt = re(!1), _t = re({}), Hn = re(!1), Cs = re(null), jo = re("Start Chat"), qn = re(!1), Ct = re(null);
    fe(() => {
      var p;
      const f = l.value[l.value.length - 1];
      return ((p = f == null ? void 0 : f.attributes) == null ? void 0 : p.request_rating) || !1;
    });
    const Rs = fe(() => {
      var p;
      if (!((p = window.__INITIAL_DATA__) != null && p.workflow))
        return !1;
      const f = l.value.find((c) => c.message_type === "rating");
      return (f == null ? void 0 : f.isSubmitted) === !0;
    }), Wn = fe(
      () => Yi(L.value.human_agent_profile_pic)
    ), su = async (f) => {
      var p, c, Z, pe, se;
      if (rl(f)) {
        try {
          if (f.session_id && R.value && n.value) {
            const it = new URL(`${bs.API_URL}/widgets/${n.value}/end-chat`);
            it.searchParams.append("session_id", f.session_id), (p = f.attributes) != null && p.end_chat_reason && it.searchParams.append("reason", f.attributes.end_chat_reason), (c = f.attributes) != null && c.end_chat_description && it.searchParams.append("description", f.attributes.end_chat_description);
            const Ye = await fetch(it, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${R.value}`,
                "Content-Type": "application/json"
              }
            });
            if (Ye.ok) {
              const Ne = await Ye.json();
              console.info(`✓ Chat session closed on backend: ${Ne.session_id}`);
            } else
              console.warn(`Failed to close session on backend: ${Ye.status}`);
          }
        } catch (it) {
          console.error("Error calling end-chat API:", it);
        }
        if ((Z = f.attributes) != null && Z.end_chat && ((pe = f.attributes) != null && pe.request_rating)) {
          const it = f.agent_name || ((se = L.value) == null ? void 0 : se.human_agent_name) || i.value || "our agent";
          l.value.push({
            message: `Rate the chat session that you had with ${it}`,
            message_type: "rating",
            created_at: (/* @__PURE__ */ new Date()).toISOString(),
            session_id: f.session_id,
            agent_name: it,
            showFeedback: !1
          }), nt.value = f.session_id;
        }
      }
    }, iu = (f) => {
      Ut.value || ($t.value = f);
    }, ru = () => {
      if (!Ut.value) {
        const f = l.value[l.value.length - 1];
        $t.value = (f == null ? void 0 : f.selectedRating) || 0;
      }
    }, ou = async (f) => {
      if (!Ut.value) {
        $t.value = f;
        const p = l.value[l.value.length - 1];
        p && p.message_type === "rating" && (p.showFeedback = !0, p.selectedRating = f);
      }
    }, au = async (f, p, c = null) => {
      try {
        Ut.value = !0, await Y(p, c);
        const Z = l.value.find((pe) => pe.message_type === "rating");
        Z && (Z.isSubmitted = !0, Z.finalRating = p, Z.finalFeedback = c);
      } catch (Z) {
        console.error("Failed to submit rating:", Z);
      } finally {
        Ut.value = !1;
      }
    }, lu = (f) => {
      const p = {};
      for (const c of f.fields) {
        const Z = mt.value[c.name], pe = dr(c, Z);
        pe && (p[c.name] = pe);
      }
      return _t.value = p, Object.keys(p).length === 0;
    }, cu = async (f) => {
      if (!(wt.value || !lu(f)))
        try {
          wt.value = !0, await Se(mt.value);
          const c = l.value.findIndex(
            (Z) => Z.message_type === "form" && (!Z.isSubmitted || Z.isSubmitted === !1)
          );
          c !== -1 && l.value.splice(c, 1), mt.value = {}, _t.value = {};
        } catch (c) {
          console.error("Failed to submit form:", c);
        } finally {
          wt.value = !1;
        }
    }, Ft = (f, p) => {
      var c, Z;
      if (mt.value[f] = p, p && p.toString().trim() !== "") {
        let pe = null;
        if ((c = Ct.value) != null && c.fields && (pe = Ct.value.fields.find((se) => se.name === f)), !pe && ((Z = He.value) != null && Z.fields) && (pe = He.value.fields.find((se) => se.name === f)), pe) {
          const se = dr(pe, p);
          se ? (_t.value[f] = se, console.log(`Validation error for ${f}:`, se)) : delete _t.value[f];
        }
      } else
        delete _t.value[f], console.log(`Cleared error for ${f}`);
    }, uu = (f) => {
      const p = f.replace(/\D/g, "");
      return p.length >= 7 && p.length <= 15;
    }, dr = (f, p) => {
      if (f.required && (!p || p.toString().trim() === ""))
        return `${f.label} is required`;
      if (!p || p.toString().trim() === "")
        return null;
      if (f.type === "email" && !Ms(p))
        return "Please enter a valid email address";
      if (f.type === "tel" && !uu(p))
        return "Please enter a valid phone number";
      if ((f.type === "text" || f.type === "textarea") && f.minLength && p.length < f.minLength)
        return `${f.label} must be at least ${f.minLength} characters`;
      if ((f.type === "text" || f.type === "textarea") && f.maxLength && p.length > f.maxLength)
        return `${f.label} must not exceed ${f.maxLength} characters`;
      if (f.type === "number") {
        const c = parseFloat(p);
        if (isNaN(c))
          return `${f.label} must be a valid number`;
        if (f.minLength && c < f.minLength)
          return `${f.label} must be at least ${f.minLength}`;
        if (f.maxLength && c > f.maxLength)
          return `${f.label} must not exceed ${f.maxLength}`;
      }
      return null;
    }, fu = async () => {
      if (!(wt.value || !Ct.value))
        try {
          wt.value = !0, _t.value = {};
          let f = !1;
          for (const p of Ct.value.fields || []) {
            const c = mt.value[p.name], Z = dr(p, c);
            Z && (_t.value[p.name] = Z, f = !0, console.log(`Validation error for field ${p.name}:`, Z));
          }
          if (f) {
            wt.value = !1, console.log("Validation failed, not submitting");
            return;
          }
          await Se(mt.value), qn.value = !1, Ct.value = null, mt.value = {};
        } catch (f) {
          console.error("Failed to submit full screen form:", f);
        } finally {
          wt.value = !1, console.log("Full screen form submission completed");
        }
    }, hu = (f, p) => {
      if (console.log("handleViewDetails called with:", { product: f, shopDomain: p }), !f) {
        console.error("No product provided to handleViewDetails");
        return;
      }
      let c = null;
      if (f.handle && p)
        c = `https://${p}/products/${f.handle}`;
      else if (f.id && p)
        c = `https://${p}/products/${f.id}`;
      else if (p) {
        if (!f.handle && !f.id) {
          console.error("Product handle and ID are both missing! Product:", f), alert("Unable to open product: Product information incomplete.");
          return;
        }
      } else {
        console.error("Shop domain is missing! Product:", f), alert("Unable to open product: Shop domain not available. Please contact support.");
        return;
      }
      c && (console.log("Opening product URL:", c), window.open(c, "_blank"));
    }, du = (f) => {
      if (!f) return "";
      let p = f.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "");
      const c = [];
      return p = p.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (Z, pe, se) => {
        const it = `__MARKDOWN_LINK_${c.length}__`;
        return console.log("Found markdown link:", Z, "-> placeholder:", it), c.push(Z), it;
      }), console.log("After replacing markdown links with placeholders:", p), console.log("Markdown links array:", c), p = p.replace(/https?:\/\/[^\s\)]+/g, "[link removed]"), console.log("After removing standalone URLs:", p), c.forEach((Z, pe) => {
        p = p.replace(`__MARKDOWN_LINK_${pe}__`, Z), console.log(`Restored markdown link ${pe}:`, Z);
      }), p = p.replace(/\n\s*\n\s*\n/g, `

`).trim(), p;
    }, Vo = re(!1);
    re(!1);
    const Ko = fe(() => {
      var f;
      return !!((f = L.value) != null && f.human_agent_name);
    }), pu = fe(() => ct.value && Ko.value && Ae.value.length < _l), gu = async () => {
      try {
        Hn.value = !1, Cs.value = null, await Ce();
      } catch (f) {
        console.error("Failed to proceed workflow:", f);
      }
    }, pr = async (f) => {
      try {
        if (!f.userInputValue || !f.userInputValue.trim())
          return;
        const p = f.userInputValue.trim();
        f.isSubmitted = !0, f.submittedValue = p, await G(p, ae.value);
      } catch (p) {
        console.error("Failed to submit user input:", p), f.isSubmitted = !1, f.submittedValue = null;
      }
    }, gr = async () => {
      var f, p, c;
      try {
        let Z = 0;
        const pe = 50;
        for (; !((f = window.__INITIAL_DATA__) != null && f.widgetId) && Z < pe; )
          await new Promise((it) => setTimeout(it, 100)), Z++;
        return (p = window.__INITIAL_DATA__) != null && p.widgetId ? (he(window.__INITIAL_DATA__.widgetId), await qe() ? ((c = window.__INITIAL_DATA__) != null && c.workflow && De.value && await Xe(), !0) : (M.value = "connected", !1)) : (console.error("Widget data not available after waiting"), !1);
      } catch (Z) {
        return console.error("Failed to initialize widget:", Z), !1;
      }
    };
    window.addEventListener("message", (f) => {
      f.source === window.parent && (!f.data || typeof f.data.type != "string" || (f.data.type === "SCROLL_TO_BOTTOM" && ot(), f.data.type === "TOKEN_RECEIVED" && localStorage.setItem(Ws, f.data.token), f.data.type === "WIDGET_VISIBILITY" && (sa.value = !!f.data.open), f.data.type === "WIDGET_DISPLAY" && (br.value = {
        mode: f.data.mode,
        width: f.data.width,
        height: f.data.height,
        hotkey: f.data.hotkey
      }), f.data.type === "PREFILL_MESSAGE" && typeof f.data.text == "string" && (Te.value = f.data.text.slice(0, 2e3), _s(() => {
        const p = document.querySelector(
          ".message-input input, .welcome-message-field"
        );
        p == null || p.focus();
      }))));
    });
    const mu = () => {
      V(async () => {
        await qe();
      }), be((f) => {
        var p;
        if (jo.value = f.button_text || "Start Chat", f.type === "landing_page")
          Cs.value = f.landing_page_data, Hn.value = !0, qn.value = !1;
        else if (f.type === "form" || f.type === "display_form")
          if (((p = f.form_data) == null ? void 0 : p.form_full_screen) === !0)
            Ct.value = f.form_data, qn.value = !0, Hn.value = !1;
          else {
            const c = {
              message: "",
              message_type: "form",
              attributes: {
                form_data: f.form_data
              },
              created_at: (/* @__PURE__ */ new Date()).toISOString(),
              isSubmitted: !1
            };
            l.value.findIndex(
              (pe) => pe.message_type === "form" && !pe.isSubmitted
            ) === -1 && l.value.push(c), Hn.value = !1, qn.value = !1;
          }
        else
          Hn.value = !1, qn.value = !1;
      }), Je((f) => {
        console.log("Workflow proceeded:", f);
      });
    }, _u = async () => {
      try {
        await gr(), await Xe();
      } catch (f) {
        throw console.error("Failed to start new conversation:", f), f;
      }
    }, Go = fe(
      () => {
        var f;
        return s.value.allow_new_chat === !0 && l.value.length > 0 && !((f = L.value) != null && f.human_agent_name) && !jn.value;
      }
    ), as = re(!1), Cn = re(!1);
    let hi = null;
    const di = () => {
      Cn.value = !1, hi && (clearTimeout(hi), hi = null);
    }, Yo = () => {
      if (!as.value) {
        if (!Cn.value) {
          Cn.value = !0, hi = setTimeout(di, 8e3);
          return;
        }
        di(), vu();
      }
    }, vu = async () => {
      if (!as.value) {
        as.value = !0;
        try {
          await Fe(), L.value = {}, Te.value = "", Ae.value = [], await gr();
        } catch (f) {
          console.error("Failed to start a new chat:", f);
        } finally {
          as.value = !1;
        }
      }
    }, yu = async () => {
      Rs.value = !1, l.value = [], L.value = {}, await _u();
    };
    ir(async () => {
      await gr(), mu(), Le(), document.addEventListener("click", _), (() => {
        const p = l.value.length > 0, c = M.value === "connected", Z = document.querySelector('input[type="text"], textarea') !== null;
        return p || c || Z;
      })() && setTimeout(Me, 100);
    }), li(() => {
      y(), window.removeEventListener("message", (f) => {
        f.data.type === "SCROLL_TO_BOTTOM" && ot();
      }), document.removeEventListener("click", _), At && (At.disconnect(), At = null), Le.timeoutId && (clearTimeout(Le.timeoutId), Le.timeoutId = null), ce(), S();
    });
    const ls = fe(() => s.value.chat_style === "AURORA"), zt = fe(() => s.value.chat_style === "ASK_ANYTHING" || ls.value), Xo = fe(() => s.value.customization_metadata), pi = fe(() => {
      var p;
      const f = (p = Xo.value) == null ? void 0 : p.avatar_style;
      return f === "orb" ? !0 : f === "photo" ? !1 : ls.value && !s.value.photo_url;
    }), Is = fe(() => {
      var f;
      return Op(i.value || "", (f = Xo.value) == null ? void 0 : f.orb_variant);
    }), bu = {
      GLASS: "theme-glass",
      TERMINAL: "theme-terminal",
      PLAYFUL: "theme-playful",
      CALM_MINT: "theme-calm",
      SUNRISE: "theme-sunrise"
    }, wu = fe(() => bu[s.value.chat_style] || ""), ku = fe(() => Jg(s.value.chat_style, {
      chat_background_color: s.value.chat_background_color,
      chat_text_color: s.value.chat_text_color,
      accent_color: s.value.accent_color,
      font_family: s.value.font_family
    })), mr = fe(
      () => Array.isArray(s.value.quick_actions) ? s.value.quick_actions.filter((f) => !!f && f.trim().length > 0) : []
    ), Zo = fe(() => (s.value.welcome_message || "").trim()), Jo = fe(
      () => !zt.value && l.value.length === 0 && !m.value && !jn.value
    ), xu = fe(
      () => Jo.value && Zo.value.length > 0
    ), Au = fe(
      () => Jo.value && !Rs.value && mr.value.length > 0
    ), gi = fe(() => s.value.show_citations === !0), Qo = fe(() => Np(s.value.show_ai_disclaimer, Ko.value)), Su = (f) => /^[0-9a-f]{16,}$/i.test(f) || /^[0-9a-f-]{32,}$/i.test(f), _r = (f) => {
      const p = (f || "").trim().toLowerCase();
      return !p || p === "unknown" ? "Knowledge base" : p.charAt(0).toUpperCase() + p.slice(1);
    }, vr = (f) => {
      let p = ((f == null ? void 0 : f.name) || "").trim();
      return !p || (p = p.replace(/^[0-9a-f]{16,}[_-]/i, "").replace(/\.(pdf|txt|md|html?|docx?|csv|json)$/i, ""), !p || Su(p)) ? _r(f == null ? void 0 : f.type) : p;
    }, ea = (f) => {
      const p = vr(f), c = _r(f == null ? void 0 : f.type);
      return p === c ? c : `${p} · ${c}`;
    }, yr = fe(() => s.value.collect_email === !0 && !zt.value), ta = re(!1), Rn = re(""), Ls = re(!1), jn = fe(() => !N.value && yr.value && !ta.value), na = async () => {
      const f = ae.value.trim();
      if (!f) {
        Rn.value = "Please enter your email address.";
        return;
      }
      if (!Ms(f)) {
        Rn.value = "Please enter a valid email address.";
        return;
      }
      Rn.value = "", Ls.value = !0;
      try {
        await qe(), ta.value = !0;
      } catch {
        Rn.value = "Something went wrong. Please try again.";
      } finally {
        Ls.value = !1;
      }
    }, br = re(null), sa = re(!0), wr = { mode: "floating", width: 400, height: 560 }, mi = fe(
      () => {
        var f;
        return br.value || ((f = s.value.customization_metadata) == null ? void 0 : f.widget_display) || null;
      }
    ), Tu = fe(() => {
      const f = mi.value;
      return f ? typeof f.mode == "string" && f.mode !== wr.mode || typeof f.width == "number" && f.width !== wr.width || typeof f.height == "number" && f.height !== wr.height : !1;
    }), Eu = fe(() => {
      var p;
      const f = {
        width: "100%",
        height: "100%",
        borderRadius: "var(--radius-lg)"
      };
      if (Tu.value) {
        const c = (p = mi.value) == null ? void 0 : p.mode;
        return c === "sidebar-left" || c === "sidebar-right" ? { ...f, borderRadius: "0" } : f;
      }
      return zt.value ? window.innerWidth <= 768 ? {
        ...f,
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        minWidth: "unset",
        borderRadius: "0"
      } : window.innerWidth <= 1024 ? {
        ...f,
        width: "95%",
        maxWidth: "700px",
        minWidth: "500px",
        height: "650px"
      } : {
        ...f,
        width: "100%",
        maxWidth: "400px",
        minWidth: "400px",
        height: "580px"
      } : f;
    }), ia = fe(() => zt.value && l.value.length === 0), Cu = ["form", "user_input", "rating", "product", "shopify_output"], Ru = fe(
      () => l.value.some(
        (f) => Cu.includes(f.message_type) || Array.isArray(f.attachments) && f.attachments.length > 0
      )
    ), Iu = fe(() => {
      var p, c;
      return zt.value ? !0 : (((p = mi.value) == null ? void 0 : p.mode) === "ask-ai" || ((c = mi.value) == null ? void 0 : c.mode) === "search-bar") && !ct.value;
    }), kr = fe(
      () => Iu.value && st.value && !Hn.value && !qn.value && !jn.value && !Rs.value && !Ru.value
    );
    Vt(kr, (f) => {
      window.parent.postMessage({ type: "WIDGET_SURFACE", palette: f }, "*");
    }, { immediate: !0 });
    const Lu = fe(
      () => s.value.welcome_subtitle || `Ask a question — ${i.value || "the assistant"} answers from what it knows.`
    ), Ou = fe(() => {
      var f;
      return ((f = br.value) == null ? void 0 : f.hotkey) !== !1;
    });
    return (f, p) => B.value && z.value ? (k(), x("div", em, [
      b("button", {
        type: "button",
        class: "cm-error-close",
        "aria-label": "Close chat",
        title: "Close",
        onClick: zn
      }, "×"),
      p[20] || (p[20] = Yn('<div class="widget-unavailable-card" data-v-4cd43bc2><div class="widget-unavailable-icon-wrapper" data-v-4cd43bc2><svg class="widget-unavailable-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-4cd43bc2><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" data-v-4cd43bc2></path><path d="M9 12l2 2 4-4" data-v-4cd43bc2></path></svg></div><h2 class="widget-unavailable-title" data-v-4cd43bc2>Chat Unavailable</h2><p class="widget-unavailable-message" data-v-4cd43bc2> This chat widget is not currently configured. Please contact the website administrator to enable chat support. </p><div class="widget-unavailable-footer" data-v-4cd43bc2><svg class="chattermate-logo-small" width="14" height="14" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4cd43bc2><path d="M19 3H41A16 16 0 0 1 57 19V41A16 16 0 0 1 41 57H9A6 6 0 0 1 3 51V19A16 16 0 0 1 19 3Z" fill="#C9F24E" data-v-4cd43bc2></path><circle cx="19.7" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="30" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="40.3" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle></svg><a class="cm-powered-link" href="https://chattermate.chat" target="_blank" rel="noopener" data-v-4cd43bc2><span class="cm-powered-prefix" data-v-4cd43bc2>Powered by </span><strong class="cm-brand" data-v-4cd43bc2>Growmiq mini</strong></a></div></div>', 1))
    ])) : B.value ? (k(), x("div", tm, [
      b("button", {
        type: "button",
        class: "cm-error-close",
        "aria-label": "Close chat",
        title: "Close",
        onClick: zn
      }, "×"),
      b("div", nm, [
        p[21] || (p[21] = Yn('<div class="auth-error-header" data-v-4cd43bc2><svg class="auth-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-4cd43bc2><circle cx="12" cy="12" r="10" data-v-4cd43bc2></circle><line x1="12" y1="8" x2="12" y2="12" data-v-4cd43bc2></line><line x1="12" y1="16" x2="12.01" y2="16" data-v-4cd43bc2></line></svg><h2 data-v-4cd43bc2>Authentication Error</h2></div>', 1)),
        b("p", sm, ee(I.value), 1),
        b("button", {
          class: "auth-error-refresh-btn",
          onClick: p[0] || (p[0] = () => f.window.location.reload())
        }, " Refresh Page ")
      ])
    ])) : n.value && !B.value ? (k(), x("div", {
      key: 2,
      class: $e(["chat-container cm-surface", [{ collapsed: !st.value, "ask-anything-style": zt.value, aurora: ls.value }, wu.value]]),
      style: we({ ...E(Ie), ...Eu.value, ...ku.value })
    }, [
      A.value ? (k(), x("div", im, p[22] || (p[22] = [
        Yn('<div class="loading-spinner" data-v-4cd43bc2><div class="dot" data-v-4cd43bc2></div><div class="dot" data-v-4cd43bc2></div><div class="dot" data-v-4cd43bc2></div></div><div class="loading-text" data-v-4cd43bc2>Initializing chat...</div>', 2)
      ]))) : ne("", !0),
      !A.value && E(M) !== "connected" ? (k(), x("div", {
        key: 1,
        class: $e(["connection-status", E(M)])
      }, [
        E(M) === "connecting" ? (k(), x("div", rm, p[23] || (p[23] = [
          gn(" Connecting to chat service... ", -1),
          b("div", { class: "loading-dots" }, [
            b("div", { class: "dot" }),
            b("div", { class: "dot" }),
            b("div", { class: "dot" })
          ], -1)
        ]))) : E(M) === "failed" ? (k(), x("div", om, [
          p[24] || (p[24] = gn(" Connection failed. ", -1)),
          b("button", {
            onClick: Xt,
            class: "reconnect-button"
          }, " Click here to reconnect ")
        ])) : ne("", !0)
      ], 2)) : ne("", !0),
      E(w) ? (k(), x("div", {
        key: 2,
        class: "error-alert",
        style: we(E(C))
      }, ee(E(u)), 5)) : ne("", !0),
      kr.value ? (k(), mc(Rp, {
        key: 3,
        messages: E(l),
        draft: Te.value,
        "agent-name": E(i),
        suggestions: mr.value,
        "welcome-title": E(s).welcome_title,
        "welcome-subtitle": Lu.value,
        placeholder: os.value,
        "input-enabled": gt.value,
        loading: E(d),
        "show-citations": gi.value,
        disclaimer: Qo.value ? E(ol) : "",
        active: sa.value,
        hotkey: Ou.value,
        "can-start-new-chat": Go.value,
        "starting-new-chat": as.value,
        "new-chat-armed": Cn.value,
        onNewChat: Yo,
        onCancelNewChat: di,
        "citation-label": vr,
        "citation-tooltip": ea,
        "display-text": E(ge),
        "is-streaming": E(le),
        "onUpdate:draft": p[1] || (p[1] = (c) => Te.value = c),
        onSend: nn,
        onAsk: Es,
        onClose: zn
      }, null, 8, ["messages", "draft", "agent-name", "suggestions", "welcome-title", "welcome-subtitle", "placeholder", "input-enabled", "loading", "show-citations", "disclaimer", "active", "hotkey", "can-start-new-chat", "starting-new-chat", "new-chat-armed", "display-text", "is-streaming"])) : ia.value ? (k(), x("div", {
        key: 4,
        class: $e(["welcome-message-section", { aurora: ls.value }]),
        style: we(E(v))
      }, [
        b("div", am, [
          b("div", lm, [
            pi.value ? (k(), x("div", {
              key: 0,
              class: "welcome-orb",
              style: we(Is.value)
            }, null, 4)) : E(ue) ? (k(), x("img", {
              key: 1,
              src: E(ue),
              alt: E(i),
              class: "welcome-avatar"
            }, null, 8, cm)) : ne("", !0),
            b("h1", um, ee(E(s).welcome_title || `Welcome to ${E(i)}`), 1),
            b("p", fm, ee(E(s).welcome_subtitle || "I'm here to help you with anything you need. What can I assist you with today?"), 1)
          ])
        ]),
        b("div", hm, [
          !E(N) && !De.value && yr.value ? (k(), x("div", dm, [
            In(b("input", {
              "onUpdate:modelValue": p[2] || (p[2] = (c) => ae.value = c),
              type: "email",
              placeholder: "Enter your email address",
              disabled: E(d) || E(M) !== "connected",
              class: $e([{
                invalid: ae.value.trim() && !E(Ms)(ae.value.trim()),
                disabled: E(M) !== "connected"
              }, "welcome-email-input"])
            }, null, 10, pm), [
              [Xn, ae.value]
            ])
          ])) : ne("", !0),
          b("div", gm, [
            In(b("input", {
              "onUpdate:modelValue": p[3] || (p[3] = (c) => Te.value = c),
              type: "text",
              placeholder: os.value,
              onKeypress: Q,
              onInput: Be,
              onChange: Be,
              disabled: !gt.value,
              class: $e([{ disabled: !gt.value }, "welcome-message-field"])
            }, null, 42, mm), [
              [Xn, Te.value]
            ]),
            b("button", {
              class: $e(["welcome-send-button", { "aurora-send": ls.value }]),
              style: we(E(D)),
              onClick: nn,
              disabled: !Te.value.trim() || !gt.value
            }, [
              ls.value ? (k(), x("svg", vm, p[25] || (p[25] = [
                b("path", {
                  d: "M12 19V5M12 5L5 12M12 5L19 12",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, null, -1)
              ]))) : (k(), x("svg", ym, p[26] || (p[26] = [
                b("path", {
                  d: "M5 12L3 21L21 12L3 3L5 12ZM5 12L13 12",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])))
            ], 14, _m)
          ])
        ]),
        b("div", {
          class: "powered-by-welcome",
          style: we(E(j))
        }, p[27] || (p[27] = [
          Yn('<svg class="chattermate-logo" width="16" height="16" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4cd43bc2><path d="M19 3H41A16 16 0 0 1 57 19V41A16 16 0 0 1 41 57H9A6 6 0 0 1 3 51V19A16 16 0 0 1 19 3Z" fill="#C9F24E" data-v-4cd43bc2></path><circle cx="19.7" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="30" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="40.3" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle></svg><a class="cm-powered-link" href="https://chattermate.chat" target="_blank" rel="noopener" data-v-4cd43bc2><span class="cm-powered-prefix" data-v-4cd43bc2>Powered by </span><strong class="cm-brand" data-v-4cd43bc2>Growmiq mini</strong></a>', 2)
        ]), 4)
      ], 6)) : ne("", !0),
      Hn.value && Cs.value ? (k(), x("div", {
        key: 5,
        class: "landing-page-fullscreen",
        style: we(E(v))
      }, [
        b("div", bm, [
          b("div", wm, [
            b("h2", km, ee(Cs.value.heading), 1),
            b("div", xm, ee(Cs.value.content), 1)
          ]),
          b("div", Am, [
            b("button", {
              class: "landing-page-button",
              onClick: gu
            }, ee(jo.value), 1)
          ])
        ]),
        b("div", {
          class: "powered-by-landing",
          style: we(E(j))
        }, p[28] || (p[28] = [
          Yn('<svg class="chattermate-logo" width="16" height="16" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4cd43bc2><path d="M19 3H41A16 16 0 0 1 57 19V41A16 16 0 0 1 41 57H9A6 6 0 0 1 3 51V19A16 16 0 0 1 19 3Z" fill="#C9F24E" data-v-4cd43bc2></path><circle cx="19.7" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="30" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="40.3" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle></svg><a class="cm-powered-link" href="https://chattermate.chat" target="_blank" rel="noopener" data-v-4cd43bc2><span class="cm-powered-prefix" data-v-4cd43bc2>Powered by </span><strong class="cm-brand" data-v-4cd43bc2>Growmiq mini</strong></a>', 2)
        ]), 4)
      ], 4)) : qn.value && Ct.value ? (k(), x("div", {
        key: 6,
        class: "form-fullscreen",
        style: we(E(v))
      }, [
        b("div", Sm, [
          Ct.value.title || Ct.value.description ? (k(), x("div", Tm, [
            Ct.value.title ? (k(), x("h2", Em, ee(Ct.value.title), 1)) : ne("", !0),
            Ct.value.description ? (k(), x("p", Cm, ee(Ct.value.description), 1)) : ne("", !0)
          ])) : ne("", !0),
          b("div", Rm, [
            (k(!0), x(Ue, null, kt(Ct.value.fields, (c) => {
              var Z, pe;
              return k(), x("div", {
                key: c.name,
                class: "form-field"
              }, [
                b("label", {
                  for: `fullscreen-form-${c.name}`,
                  class: "field-label"
                }, [
                  gn(ee(c.label) + " ", 1),
                  c.required ? (k(), x("span", Lm, "*")) : ne("", !0)
                ], 8, Im),
                c.type === "text" || c.type === "email" || c.type === "tel" ? (k(), x("input", {
                  key: 0,
                  id: `fullscreen-form-${c.name}`,
                  type: c.type,
                  placeholder: c.placeholder || "",
                  required: c.required,
                  minlength: c.minLength,
                  maxlength: c.maxLength,
                  value: mt.value[c.name] || "",
                  onInput: (se) => Ft(c.name, se.target.value),
                  onBlur: (se) => Ft(c.name, se.target.value),
                  class: $e(["form-input", { error: _t.value[c.name] }]),
                  autocomplete: c.type === "email" ? "email" : c.type === "tel" ? "tel" : "off",
                  inputmode: c.type === "tel" ? "tel" : c.type === "email" ? "email" : "text"
                }, null, 42, Om)) : c.type === "number" ? (k(), x("input", {
                  key: 1,
                  id: `fullscreen-form-${c.name}`,
                  type: "number",
                  placeholder: c.placeholder || "",
                  required: c.required,
                  min: c.minLength,
                  max: c.maxLength,
                  value: mt.value[c.name] || "",
                  onInput: (se) => Ft(c.name, se.target.value),
                  class: $e(["form-input", { error: _t.value[c.name] }])
                }, null, 42, Nm)) : c.type === "textarea" ? (k(), x("textarea", {
                  key: 2,
                  id: `fullscreen-form-${c.name}`,
                  placeholder: c.placeholder || "",
                  required: c.required,
                  minlength: c.minLength,
                  maxlength: c.maxLength,
                  value: mt.value[c.name] || "",
                  onInput: (se) => Ft(c.name, se.target.value),
                  class: $e(["form-textarea", { error: _t.value[c.name] }]),
                  rows: "4"
                }, null, 42, Pm)) : c.type === "select" ? (k(), x("select", {
                  key: 3,
                  id: `fullscreen-form-${c.name}`,
                  required: c.required,
                  value: mt.value[c.name] || "",
                  onChange: (se) => Ft(c.name, se.target.value),
                  class: $e(["form-select", { error: _t.value[c.name] }])
                }, [
                  b("option", Fm, ee(c.placeholder || "Please select..."), 1),
                  (k(!0), x(Ue, null, kt((Array.isArray(c.options) ? c.options : ((Z = c.options) == null ? void 0 : Z.split(`
`)) || []).filter((se) => se.trim()), (se) => (k(), x("option", {
                    key: se,
                    value: se.trim()
                  }, ee(se.trim()), 9, Dm))), 128))
                ], 42, Mm)) : c.type === "checkbox" ? (k(), x("label", Bm, [
                  b("input", {
                    id: `fullscreen-form-${c.name}`,
                    type: "checkbox",
                    required: c.required,
                    checked: mt.value[c.name] || !1,
                    onChange: (se) => Ft(c.name, se.target.checked),
                    class: "form-checkbox"
                  }, null, 40, $m),
                  b("span", Um, ee(c.label), 1)
                ])) : c.type === "radio" ? (k(), x("div", zm, [
                  (k(!0), x(Ue, null, kt((Array.isArray(c.options) ? c.options : ((pe = c.options) == null ? void 0 : pe.split(`
`)) || []).filter((se) => se.trim()), (se) => (k(), x("label", {
                    key: se,
                    class: "radio-field"
                  }, [
                    b("input", {
                      type: "radio",
                      name: `fullscreen-form-${c.name}`,
                      value: se.trim(),
                      required: c.required,
                      checked: mt.value[c.name] === se.trim(),
                      onChange: (it) => Ft(c.name, se.trim()),
                      class: "form-radio"
                    }, null, 40, Hm),
                    b("span", qm, ee(se.trim()), 1)
                  ]))), 128))
                ])) : ne("", !0),
                _t.value[c.name] ? (k(), x("div", Wm, ee(_t.value[c.name]), 1)) : ne("", !0)
              ]);
            }), 128))
          ]),
          b("div", jm, [
            b("button", {
              onClick: p[4] || (p[4] = () => {
                console.log("Submit button clicked!"), fu();
              }),
              disabled: wt.value,
              class: "submit-form-button",
              style: we(E(D))
            }, [
              wt.value ? (k(), x("span", Km, p[29] || (p[29] = [
                b("div", { class: "dot" }, null, -1),
                b("div", { class: "dot" }, null, -1),
                b("div", { class: "dot" }, null, -1)
              ]))) : (k(), x("span", Gm, ee(Ct.value.submit_button_text || "Submit"), 1))
            ], 12, Vm)
          ])
        ]),
        b("div", {
          class: "powered-by-landing",
          style: we(E(j))
        }, p[30] || (p[30] = [
          Yn('<svg class="chattermate-logo" width="16" height="16" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4cd43bc2><path d="M19 3H41A16 16 0 0 1 57 19V41A16 16 0 0 1 41 57H9A6 6 0 0 1 3 51V19A16 16 0 0 1 19 3Z" fill="#C9F24E" data-v-4cd43bc2></path><circle cx="19.7" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="30" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="40.3" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle></svg><a class="cm-powered-link" href="https://chattermate.chat" target="_blank" rel="noopener" data-v-4cd43bc2><span class="cm-powered-prefix" data-v-4cd43bc2>Powered by </span><strong class="cm-brand" data-v-4cd43bc2>Growmiq mini</strong></a>', 2)
        ]), 4)
      ], 4)) : !ia.value && st.value && !kr.value ? (k(), x("div", {
        key: 7,
        class: $e(["chat-panel", { "ask-anything-chat": zt.value }]),
        style: we(E(v))
      }, [
        zt.value ? ne("", !0) : (k(), x("div", {
          key: 0,
          class: "chat-header",
          style: we(E(ie))
        }, [
          b("div", {
            class: "cm-header-sheen",
            style: we({ background: "linear-gradient(90deg, transparent, " + (E(s).accent_color || "#C9F24E") + ", transparent)" })
          }, null, 4),
          b("div", Ym, [
            !Wn.value && (pi.value || !E(ue)) ? (k(), x("div", {
              key: 0,
              class: "header-orb",
              style: we(Is.value)
            }, null, 4)) : Wn.value || E(ue) ? (k(), x("img", {
              key: 1,
              src: Wn.value || E(ue),
              alt: E(L).human_agent_name || E(i),
              class: "header-avatar"
            }, null, 8, Xm)) : ne("", !0),
            b("div", Zm, [
              b("h3", {
                style: we(E(j))
              }, ee(E(L).human_agent_name || E(i)), 5),
              p[31] || (p[31] = b("div", { class: "status" }, [
                b("span", { class: "status-indicator online" }),
                b("span", { class: "status-text cm-presence" }, "Online · replies instantly")
              ], -1))
            ])
          ]),
          b("div", Jm, [
            U.value ? (k(), x("button", {
              key: 0,
              type: "button",
              class: $e(["header-call", { active: P.value }]),
              style: we(E(j)),
              title: P.value ? "End voice call" : "Start voice call",
              "aria-label": P.value ? "End voice call" : "Start voice call",
              onClick: $
            }, p[32] || (p[32] = [
              b("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                b("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" })
              ], -1)
            ]), 14, Qm)) : ne("", !0),
            Go.value ? (k(), x("button", {
              key: 1,
              type: "button",
              class: $e(["header-new-chat", { armed: Cn.value }]),
              style: we(E(j)),
              disabled: as.value,
              title: Cn.value ? "This ends the current chat — click again to confirm" : "Start a new chat",
              "aria-label": Cn.value ? "Confirm starting a new chat" : "Start a new chat",
              onClick: Yo,
              onBlur: di
            }, [
              p[33] || (p[33] = b("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                b("path", { d: "M12 20h9" }),
                b("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" })
              ], -1)),
              Cn.value ? (k(), x("span", t_, "Click again to start a new chat")) : ne("", !0)
            ], 46, e_)) : ne("", !0),
            b("button", {
              type: "button",
              class: "header-minimize",
              style: we(E(j)),
              title: "Minimize",
              "aria-label": "Minimize chat",
              onClick: zn
            }, p[34] || (p[34] = [
              b("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2.5",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                b("path", { d: "M6 9l6 6 6-6" })
              ], -1)
            ]), 4)
          ])
        ], 4)),
        P.value ? (k(), x("div", {
          key: 1,
          class: "voice-call-strip",
          style: we(E(j))
        }, [
          p[35] || (p[35] = b("span", { class: "voice-pulse" }, null, -1)),
          b("div", null, [
            b("strong", null, ee(X.value), 1),
            H.value ? (k(), x("small", n_, ee(H.value), 1)) : ne("", !0)
          ]),
          b("button", {
            type: "button",
            onClick: y,
            "aria-label": "End voice call"
          }, "End")
        ], 4)) : ne("", !0),
        zt.value ? (k(), x("div", {
          key: 2,
          class: "ask-anything-top",
          style: we(E(ie))
        }, [
          b("div", s_, [
            Wn.value || E(ue) ? (k(), x("img", {
              key: 0,
              src: Wn.value || E(ue),
              alt: E(L).human_agent_name || E(i),
              class: "header-avatar"
            }, null, 8, i_)) : ne("", !0),
            b("div", r_, [
              b("h3", {
                style: we(E(j))
              }, ee(E(i)), 5),
              b("p", {
                class: "ask-anything-subtitle",
                style: we(E(j))
              }, ee(E(s).welcome_subtitle || "Ask me anything. I'm here to help."), 5)
            ])
          ])
        ], 4)) : ne("", !0),
        E(m) ? (k(), x("div", o_, p[36] || (p[36] = [
          b("div", { class: "loading-spinner" }, [
            b("div", { class: "dot" }),
            b("div", { class: "dot" }),
            b("div", { class: "dot" })
          ], -1)
        ]))) : ne("", !0),
        jn.value ? (k(), x("div", {
          key: 4,
          class: "cm-email-gate",
          style: we(E(v))
        }, [
          b("div", {
            class: "cm-email-gate-orb",
            style: we(Is.value)
          }, null, 4),
          b("h3", a_, ee(E(s).welcome_title || "Before we start"), 1),
          p[37] || (p[37] = b("p", { class: "cm-email-gate-text" }, "Enter your email and we'll continue the chat.", -1)),
          In(b("input", {
            "onUpdate:modelValue": p[5] || (p[5] = (c) => ae.value = c),
            type: "email",
            inputmode: "email",
            autocomplete: "email",
            placeholder: "you@example.com",
            class: $e(["cm-email-gate-input", { invalid: !!Rn.value }]),
            disabled: Ls.value,
            onKeyup: Ii(na, ["enter"]),
            onInput: p[6] || (p[6] = (c) => Rn.value = "")
          }, null, 42, l_), [
            [Xn, ae.value]
          ]),
          Rn.value ? (k(), x("p", c_, ee(Rn.value), 1)) : ne("", !0),
          b("button", {
            type: "button",
            class: "cm-email-gate-btn",
            style: we(E(D)),
            disabled: Ls.value,
            onClick: na
          }, ee(Ls.value ? "Please wait…" : "Continue to chat"), 13, u_)
        ], 4)) : ne("", !0),
        In(b("div", {
          class: "chat-messages",
          ref_key: "messagesContainer",
          ref: h
        }, [
          xu.value ? (k(), x("div", f_, [
            b("div", h_, [
              pi.value || !E(ue) ? (k(), x("div", {
                key: 0,
                class: "cm-welcome-orb",
                style: we(Is.value)
              }, null, 4)) : (k(), x("img", {
                key: 1,
                src: E(ue),
                alt: E(i),
                class: "cm-welcome-avatar"
              }, null, 8, d_)),
              b("div", {
                class: "message-bubble cm-welcome-bubble",
                style: we(E(T))
              }, ee(Zo.value), 5)
            ])
          ])) : ne("", !0),
          (k(!0), x(Ue, null, kt(E(l), (c, Z) => {
            var pe, se, it, Ye, Ne, Vn, dn, cs, oa, aa, la, ca, ua, fa, ha, da, pa, ga, ma;
            return k(), x("div", {
              key: Z,
              class: $e([
                "message",
                c.message_type === "bot" || c.message_type === "agent" ? "agent-message" : c.message_type === "system" ? "system-message" : c.message_type === "rating" ? "rating-message" : c.message_type === "form" ? "form-message" : c.message_type === "product" || c.shopify_output ? "product-message" : "user-message"
              ])
            }, [
              c.message_type === "bot" || c.message_type === "agent" ? (k(), x("div", p_, [
                Wn.value ? (k(), x("img", {
                  key: 0,
                  src: Wn.value,
                  class: "cm-msg-avatar-img",
                  alt: ""
                }, null, 8, g_)) : !pi.value && E(ue) ? (k(), x("img", {
                  key: 1,
                  src: E(ue),
                  class: "cm-msg-avatar-img",
                  alt: ""
                }, null, 8, m_)) : (k(), x("div", {
                  key: 2,
                  class: "cm-msg-avatar-orb",
                  style: we(Is.value)
                }, null, 4))
              ])) : ne("", !0),
              b("div", __, [
                b("div", {
                  class: "message-bubble",
                  style: we(c.message_type === "system" || c.message_type === "rating" || c.message_type === "form" || c.message_type === "product" || c.shopify_output ? {} : c.message_type === "user" ? E(D) : E(T))
                }, [
                  c.message_type === "rating" ? (k(), x("div", v_, [
                    b("p", y_, "Rate the chat session that you had with " + ee(c.agent_name || E(L).human_agent_name || E(i) || "our agent"), 1),
                    b("div", {
                      class: $e(["star-rating", { submitted: Ut.value || c.isSubmitted }])
                    }, [
                      (k(), x(Ue, null, kt(5, (O) => b("button", {
                        key: O,
                        class: $e(["star-button", {
                          warning: O <= (c.isSubmitted ? c.finalRating : $t.value || c.selectedRating) && (c.isSubmitted ? c.finalRating : $t.value || c.selectedRating) <= 3,
                          success: O <= (c.isSubmitted ? c.finalRating : $t.value || c.selectedRating) && (c.isSubmitted ? c.finalRating : $t.value || c.selectedRating) > 3,
                          selected: O <= (c.isSubmitted ? c.finalRating : $t.value || c.selectedRating)
                        }]),
                        onMouseover: (Zt) => !c.isSubmitted && iu(O),
                        onMouseleave: (Zt) => !c.isSubmitted && ru,
                        onClick: (Zt) => !c.isSubmitted && ou(O),
                        disabled: Ut.value || c.isSubmitted
                      }, " ★ ", 42, b_)), 64))
                    ], 2),
                    c.showFeedback && !c.isSubmitted ? (k(), x("div", w_, [
                      b("div", k_, [
                        In(b("input", {
                          "onUpdate:modelValue": (O) => c.feedback = O,
                          placeholder: "Please share your feedback (optional)",
                          disabled: Ut.value,
                          maxlength: "500",
                          class: "feedback-input"
                        }, null, 8, x_), [
                          [Xn, c.feedback]
                        ]),
                        b("div", A_, ee(((pe = c.feedback) == null ? void 0 : pe.length) || 0) + "/500", 1)
                      ]),
                      b("button", {
                        onClick: (O) => au(c.session_id, $t.value, c.feedback),
                        disabled: Ut.value || !$t.value,
                        class: "submit-rating-button",
                        style: we({ backgroundColor: E(s).accent_color || "var(--accent-solid)" })
                      }, ee(Ut.value ? "Submitting..." : "Submit Rating"), 13, S_)
                    ])) : ne("", !0),
                    c.isSubmitted && c.finalFeedback ? (k(), x("div", T_, [
                      b("div", E_, [
                        b("p", C_, ee(c.finalFeedback), 1)
                      ])
                    ])) : c.isSubmitted ? (k(), x("div", R_, " Thank you for your rating! ")) : ne("", !0)
                  ])) : c.message_type === "form" ? (k(), x("div", I_, [
                    (it = (se = c.attributes) == null ? void 0 : se.form_data) != null && it.title || (Ne = (Ye = c.attributes) == null ? void 0 : Ye.form_data) != null && Ne.description ? (k(), x("div", L_, [
                      (dn = (Vn = c.attributes) == null ? void 0 : Vn.form_data) != null && dn.title ? (k(), x("h3", O_, ee(c.attributes.form_data.title), 1)) : ne("", !0),
                      (oa = (cs = c.attributes) == null ? void 0 : cs.form_data) != null && oa.description ? (k(), x("p", N_, ee(c.attributes.form_data.description), 1)) : ne("", !0)
                    ])) : ne("", !0),
                    b("div", P_, [
                      (k(!0), x(Ue, null, kt((la = (aa = c.attributes) == null ? void 0 : aa.form_data) == null ? void 0 : la.fields, (O) => {
                        var Zt, xr;
                        return k(), x("div", {
                          key: O.name,
                          class: "form-field"
                        }, [
                          b("label", {
                            for: `form-${O.name}`,
                            class: "field-label"
                          }, [
                            gn(ee(O.label) + " ", 1),
                            O.required ? (k(), x("span", F_, "*")) : ne("", !0)
                          ], 8, M_),
                          O.type === "text" || O.type === "email" || O.type === "tel" ? (k(), x("input", {
                            key: 0,
                            id: `form-${O.name}`,
                            type: O.type,
                            placeholder: O.placeholder || "",
                            required: O.required,
                            minlength: O.minLength,
                            maxlength: O.maxLength,
                            value: mt.value[O.name] || "",
                            onInput: (We) => Ft(O.name, We.target.value),
                            onBlur: (We) => Ft(O.name, We.target.value),
                            class: $e(["form-input", { error: _t.value[O.name] }]),
                            disabled: wt.value,
                            autocomplete: O.type === "email" ? "email" : O.type === "tel" ? "tel" : "off",
                            inputmode: O.type === "tel" ? "tel" : O.type === "email" ? "email" : "text"
                          }, null, 42, D_)) : O.type === "number" ? (k(), x("input", {
                            key: 1,
                            id: `form-${O.name}`,
                            type: "number",
                            placeholder: O.placeholder || "",
                            required: O.required,
                            min: O.min,
                            max: O.max,
                            value: mt.value[O.name] || "",
                            onInput: (We) => Ft(O.name, We.target.value),
                            class: $e(["form-input", { error: _t.value[O.name] }]),
                            disabled: wt.value
                          }, null, 42, B_)) : O.type === "textarea" ? (k(), x("textarea", {
                            key: 2,
                            id: `form-${O.name}`,
                            placeholder: O.placeholder || "",
                            required: O.required,
                            minlength: O.minLength,
                            maxlength: O.maxLength,
                            value: mt.value[O.name] || "",
                            onInput: (We) => Ft(O.name, We.target.value),
                            class: $e(["form-textarea", { error: _t.value[O.name] }]),
                            disabled: wt.value,
                            rows: "3"
                          }, null, 42, $_)) : O.type === "select" ? (k(), x("select", {
                            key: 3,
                            id: `form-${O.name}`,
                            required: O.required,
                            value: mt.value[O.name] || "",
                            onChange: (We) => Ft(O.name, We.target.value),
                            class: $e(["form-select", { error: _t.value[O.name] }]),
                            disabled: wt.value
                          }, [
                            b("option", z_, ee(O.placeholder || "Select an option"), 1),
                            (k(!0), x(Ue, null, kt((Array.isArray(O.options) ? O.options : ((Zt = O.options) == null ? void 0 : Zt.split(`
`)) || []).filter((We) => We.trim()), (We) => (k(), x("option", {
                              key: We.trim(),
                              value: We.trim()
                            }, ee(We.trim()), 9, H_))), 128))
                          ], 42, U_)) : O.type === "checkbox" ? (k(), x("div", q_, [
                            b("input", {
                              id: `form-${O.name}`,
                              type: "checkbox",
                              checked: mt.value[O.name] || !1,
                              onChange: (We) => Ft(O.name, We.target.checked),
                              class: "form-checkbox",
                              disabled: wt.value
                            }, null, 40, W_),
                            b("label", {
                              for: `form-${O.name}`,
                              class: "checkbox-label"
                            }, ee(O.placeholder || O.label), 9, j_)
                          ])) : O.type === "radio" ? (k(), x("div", V_, [
                            (k(!0), x(Ue, null, kt((Array.isArray(O.options) ? O.options : ((xr = O.options) == null ? void 0 : xr.split(`
`)) || []).filter((We) => We.trim()), (We) => (k(), x("div", {
                              key: We.trim(),
                              class: "radio-option"
                            }, [
                              b("input", {
                                id: `form-${O.name}-${We.trim()}`,
                                name: `form-${O.name}`,
                                type: "radio",
                                value: We.trim(),
                                checked: mt.value[O.name] === We.trim(),
                                onChange: (dy) => Ft(O.name, We.trim()),
                                class: "form-radio",
                                disabled: wt.value
                              }, null, 40, K_),
                              b("label", {
                                for: `form-${O.name}-${We.trim()}`,
                                class: "radio-label"
                              }, ee(We.trim()), 9, G_)
                            ]))), 128))
                          ])) : ne("", !0),
                          _t.value[O.name] ? (k(), x("div", Y_, ee(_t.value[O.name]), 1)) : ne("", !0)
                        ]);
                      }), 128))
                    ]),
                    b("div", X_, [
                      b("button", {
                        onClick: () => {
                          var O;
                          console.log("Regular form submit button clicked!"), cu((O = c.attributes) == null ? void 0 : O.form_data);
                        },
                        disabled: wt.value,
                        class: "form-submit-button",
                        style: we(E(D))
                      }, ee(wt.value ? "Submitting..." : ((ua = (ca = c.attributes) == null ? void 0 : ca.form_data) == null ? void 0 : ua.submit_button_text) || "Submit"), 13, Z_)
                    ])
                  ])) : c.message_type === "user_input" ? (k(), x("div", J_, [
                    (fa = c.attributes) != null && fa.prompt_message && c.attributes.prompt_message.trim() ? (k(), x("div", Q_, ee(c.attributes.prompt_message), 1)) : ne("", !0),
                    c.isSubmitted ? (k(), x("div", sv, [
                      p[38] || (p[38] = b("strong", null, "Your input:", -1)),
                      gn(" " + ee(c.submittedValue) + " ", 1),
                      (ha = c.attributes) != null && ha.confirmation_message && c.attributes.confirmation_message.trim() ? (k(), x("div", iv, ee(c.attributes.confirmation_message), 1)) : ne("", !0)
                    ])) : (k(), x("div", ev, [
                      In(b("textarea", {
                        "onUpdate:modelValue": (O) => c.userInputValue = O,
                        class: "user-input-textarea",
                        placeholder: "Type your message here...",
                        rows: "3",
                        onKeydown: [
                          Ii(Jn((O) => pr(c), ["ctrl"]), ["enter"]),
                          Ii(Jn((O) => pr(c), ["meta"]), ["enter"])
                        ]
                      }, null, 40, tv), [
                        [Xn, c.userInputValue]
                      ]),
                      b("button", {
                        class: "user-input-submit-button",
                        onClick: (O) => pr(c),
                        disabled: !c.userInputValue || !c.userInputValue.trim()
                      }, " Submit ", 8, nv)
                    ]))
                  ])) : c.shopify_output || c.message_type === "product" ? (k(), x("div", rv, [
                    c.message ? (k(), x("div", {
                      key: 0,
                      innerHTML: E(Ni)(((pa = (da = c.shopify_output) == null ? void 0 : da.products) == null ? void 0 : pa.length) > 0 ? du(c.message) : c.message),
                      class: "product-message-text"
                    }, null, 8, ov)) : ne("", !0),
                    (ga = c.shopify_output) != null && ga.products && c.shopify_output.products.length > 0 ? (k(), x("div", av, [
                      p[40] || (p[40] = b("h3", { class: "carousel-title" }, "Products", -1)),
                      b("div", lv, [
                        (k(!0), x(Ue, null, kt(c.shopify_output.products, (O) => {
                          var Zt;
                          return k(), x("div", {
                            key: O.id,
                            class: "product-card-compact carousel-item"
                          }, [
                            (Zt = O.image) != null && Zt.src ? (k(), x("div", cv, [
                              b("img", {
                                src: O.image.src,
                                alt: O.title,
                                class: "product-thumbnail"
                              }, null, 8, uv)
                            ])) : ne("", !0),
                            b("div", fv, [
                              b("div", hv, [
                                b("div", dv, ee(O.title), 1),
                                O.variant_title && O.variant_title !== "Default Title" ? (k(), x("div", pv, ee(O.variant_title), 1)) : ne("", !0),
                                b("div", gv, ee(O.price_formatted || E(a)(O.price, O.currency)), 1)
                              ]),
                              b("div", mv, [
                                b("button", {
                                  class: "view-details-button-compact",
                                  onClick: (xr) => {
                                    var We;
                                    return hu(O, (We = c.shopify_output) == null ? void 0 : We.shop_domain);
                                  }
                                }, p[39] || (p[39] = [
                                  gn(" View product ", -1),
                                  b("span", { class: "external-link-icon" }, "↗", -1)
                                ]), 8, _v)
                              ])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])) : !c.message && ((ma = c.shopify_output) != null && ma.products) && c.shopify_output.products.length === 0 ? (k(), x("div", vv, p[41] || (p[41] = [
                      b("p", null, "No products found.", -1)
                    ]))) : !c.message && c.shopify_output && !c.shopify_output.products ? (k(), x("div", yv, p[42] || (p[42] = [
                      b("p", null, "No products to display.", -1)
                    ]))) : ne("", !0)
                  ])) : (k(), x(Ue, { key: 4 }, [
                    E(le)(Z) ? (k(), x("div", {
                      key: 0,
                      class: "message-streaming",
                      innerHTML: E(Ni)(E(ge)(Z, c.message))
                    }, null, 8, bv)) : (k(), x("div", {
                      key: 1,
                      innerHTML: E(Ni)(c.message)
                    }, null, 8, wv)),
                    c.attachments && c.attachments.length > 0 ? (k(), x("div", kv, [
                      (k(!0), x(Ue, null, kt(c.attachments, (O) => (k(), x("div", {
                        key: O.id,
                        class: "attachment-item"
                      }, [
                        E(tn)(O.content_type) ? (k(), x("div", xv, [
                          b("img", {
                            src: E(ns)(O.file_url),
                            alt: O.filename,
                            class: "attachment-image",
                            onClick: Jn((Zt) => E(is)({ url: O.file_url, filename: O.filename, type: O.content_type, file_url: E(ns)(O.file_url), size: void 0 }), ["stop"]),
                            style: { cursor: "pointer" }
                          }, null, 8, Av),
                          b("div", Sv, [
                            b("a", {
                              href: E(ns)(O.file_url),
                              target: "_blank",
                              class: "attachment-link"
                            }, [
                              p[43] || (p[43] = b("svg", {
                                width: "14",
                                height: "14",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round"
                              }, [
                                b("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                                b("polyline", { points: "7 10 12 15 17 10" }),
                                b("line", {
                                  x1: "12",
                                  y1: "15",
                                  x2: "12",
                                  y2: "3"
                                })
                              ], -1)),
                              gn(" " + ee(O.filename) + " ", 1),
                              b("span", Ev, "(" + ee(E(Ge)(O.file_size)) + ")", 1)
                            ], 8, Tv)
                          ])
                        ])) : (k(), x("a", {
                          key: 1,
                          href: E(ns)(O.file_url),
                          target: "_blank",
                          class: "attachment-link"
                        }, [
                          p[44] || (p[44] = b("svg", {
                            width: "14",
                            height: "14",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }, [
                            b("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" })
                          ], -1)),
                          gn(" " + ee(O.filename) + " ", 1),
                          b("span", Rv, "(" + ee(E(Ge)(O.file_size)) + ")", 1)
                        ], 8, Cv))
                      ]))), 128))
                    ])) : ne("", !0)
                  ], 64))
                ], 4),
                gi.value && (c.message_type === "bot" || c.message_type === "agent") && c.sources && c.sources.length ? (k(), x("div", Iv, [
                  p[45] || (p[45] = b("span", { class: "citation-label" }, "Sources", -1)),
                  (k(!0), x(Ue, null, kt(c.sources, (O, Zt) => (k(), x("span", {
                    key: Zt,
                    class: "citation-chip",
                    title: ea(O)
                  }, ee(vr(O)), 9, Lv))), 128))
                ])) : ne("", !0),
                b("div", Ov, [
                  c.message_type === "user" ? (k(), x("span", Nv, " You ")) : ne("", !0)
                ])
              ])
            ], 2);
          }), 128)),
          E(d) ? (k(), x("div", {
            key: 1,
            class: $e(["typing-indicator", { "reading-indicator": gi.value }])
          }, [
            gi.value ? (k(), x(Ue, { key: 0 }, [
              p[46] || (p[46] = b("div", {
                class: "reading-bars",
                "aria-hidden": "true"
              }, [
                b("span"),
                b("span"),
                b("span")
              ], -1)),
              p[47] || (p[47] = b("span", { class: "reading-label" }, "reading knowledge base", -1))
            ], 64)) : (k(), x("div", {
              key: 1,
              class: "cm-typing-bubble",
              style: we(E(T))
            }, p[48] || (p[48] = [
              b("span", { class: "cm-typing-dot" }, null, -1),
              b("span", { class: "cm-typing-dot" }, null, -1),
              b("span", { class: "cm-typing-dot" }, null, -1)
            ]), 4))
          ], 2)) : ne("", !0)
        ], 512), [
          [Nh, !jn.value]
        ]),
        Au.value ? (k(), x("div", Pv, [
          (k(!0), x(Ue, null, kt(mr.value, (c) => (k(), x("button", {
            key: c,
            type: "button",
            class: "cm-quick-action",
            disabled: !gt.value,
            onClick: (Z) => Es(c)
          }, ee(c), 9, Mv))), 128))
        ])) : ne("", !0),
        !Rs.value && !jn.value ? (k(), x("div", {
          key: 6,
          class: $e(["chat-input", { "ask-anything-input": zt.value }])
        }, [
          b("input", {
            ref_key: "fileInputRef",
            ref: Qe,
            type: "file",
            accept: ay,
            multiple: "",
            style: { display: "none" },
            onChange: p[7] || (p[7] = //@ts-ignore
            (...c) => E(ss) && E(ss)(...c))
          }, null, 544),
          E(Ae).length > 0 ? (k(), x("div", Fv, [
            (k(!0), x(Ue, null, kt(E(Ae), (c, Z) => (k(), x("div", {
              key: Z,
              class: "file-preview-widget"
            }, [
              b("div", Dv, [
                E(Ts)(c.type) ? (k(), x("img", {
                  key: 0,
                  src: E(xs)(c),
                  alt: c.filename,
                  class: "file-preview-image-widget",
                  onClick: Jn((pe) => E(is)(c), ["stop"]),
                  style: { cursor: "pointer" }
                }, null, 8, Bv)) : (k(), x("div", {
                  key: 1,
                  class: "file-preview-icon-widget",
                  onClick: Jn((pe) => E(is)(c), ["stop"]),
                  style: { cursor: "pointer" }
                }, p[49] || (p[49] = [
                  b("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    b("path", { d: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" }),
                    b("polyline", { points: "13 2 13 9 20 9" })
                  ], -1)
                ]), 8, $v))
              ]),
              b("div", Uv, [
                b("div", zv, ee(c.filename), 1),
                b("div", Hv, ee(E(Ge)(c.size)), 1)
              ]),
              b("button", {
                type: "button",
                class: "file-preview-remove-widget",
                onClick: (pe) => E(Sn)(Z),
                title: "Remove file"
              }, " × ", 8, qv)
            ]))), 128))
          ])) : ne("", !0),
          Vo.value ? (k(), x("div", Wv, p[50] || (p[50] = [
            b("div", { class: "upload-spinner-widget" }, null, -1),
            b("span", { class: "upload-text-widget" }, "Uploading files...", -1)
          ]))) : ne("", !0),
          b("div", jv, [
            In(b("input", {
              "onUpdate:modelValue": p[8] || (p[8] = (c) => Te.value = c),
              type: "text",
              placeholder: os.value,
              onKeypress: Q,
              onInput: Be,
              onChange: Be,
              onPaste: p[9] || (p[9] = //@ts-ignore
              (...c) => E(Bt) && E(Bt)(...c)),
              onDrop: p[10] || (p[10] = //@ts-ignore
              (...c) => E(As) && E(As)(...c)),
              onDragover: p[11] || (p[11] = //@ts-ignore
              (...c) => E(Ss) && E(Ss)(...c)),
              onDragleave: p[12] || (p[12] = //@ts-ignore
              (...c) => E(fi) && E(fi)(...c)),
              disabled: !gt.value,
              class: $e({ disabled: !gt.value, "ask-anything-field": zt.value })
            }, null, 42, Vv), [
              [Xn, Te.value]
            ]),
            pu.value ? (k(), x("button", {
              key: 0,
              type: "button",
              class: "attach-button",
              disabled: Vo.value,
              onClick: p[13] || (p[13] = //@ts-ignore
              (...c) => E(rs) && E(rs)(...c)),
              title: `Attach files (${E(Ae).length}/${_l} used) or paste screenshots`
            }, p[51] || (p[51] = [
              b("svg", {
                width: "22",
                height: "22",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, [
                b("path", {
                  d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
                  stroke: "currentColor",
                  "stroke-width": "2.2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ], -1),
              b("span", { class: "attach-button-glow" }, null, -1)
            ]), 8, Kv)) : ne("", !0),
            b("button", {
              class: $e(["send-button", { "ask-anything-send": zt.value }]),
              style: we(E(D)),
              onClick: nn,
              disabled: !Te.value.trim() && E(Ae).length === 0 || !gt.value
            }, p[52] || (p[52] = [
              b("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, [
                b("path", {
                  d: "M12 19V5M5 12l7-7 7 7",
                  stroke: "currentColor",
                  "stroke-width": "2.2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ], -1)
            ]), 14, Gv)
          ])
        ], 2)) : Rs.value && !jn.value ? (k(), x("div", Yv, [
          b("div", Xv, [
            p[53] || (p[53] = b("p", { class: "ended-text" }, "This chat has ended.", -1)),
            b("button", {
              class: "start-new-conversation-button",
              style: we(E(D)),
              onClick: yu
            }, " Click here to start a new conversation ", 4)
          ])
        ])) : ne("", !0),
        Qo.value ? (k(), x("div", {
          key: 8,
          class: "ai-disclaimer",
          style: we(E(j))
        }, ee(E(ol)), 5)) : ne("", !0),
        b("div", {
          class: "powered-by",
          style: we(E(j))
        }, p[54] || (p[54] = [
          Yn('<svg class="chattermate-logo" width="16" height="16" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4cd43bc2><path d="M19 3H41A16 16 0 0 1 57 19V41A16 16 0 0 1 41 57H9A6 6 0 0 1 3 51V19A16 16 0 0 1 19 3Z" fill="#C9F24E" data-v-4cd43bc2></path><circle cx="19.7" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="30" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle><circle cx="40.3" cy="30" r="4.3" fill="#0B0C10" data-v-4cd43bc2></circle></svg><a class="cm-powered-link" href="https://chattermate.chat" target="_blank" rel="noopener" data-v-4cd43bc2><span class="cm-powered-prefix" data-v-4cd43bc2>Powered by </span><strong class="cm-brand" data-v-4cd43bc2>Growmiq mini</strong></a>', 2)
        ]), 4)
      ], 6)) : ne("", !0),
      Tn.value ? (k(), x("div", Zv, [
        b("div", Jv, [
          p[55] || (p[55] = b("h3", null, "Rate your conversation", -1)),
          b("div", Qv, [
            (k(), x(Ue, null, kt(5, (c) => b("button", {
              key: c,
              onClick: (Z) => En.value = c,
              class: $e([{ active: c <= En.value }, "star-button"])
            }, " ★ ", 10, ey)), 64))
          ]),
          In(b("textarea", {
            "onUpdate:modelValue": p[14] || (p[14] = (c) => ut.value = c),
            placeholder: "Additional feedback (optional)",
            class: "rating-feedback"
          }, null, 512), [
            [Xn, ut.value]
          ]),
          b("div", ty, [
            b("button", {
              onClick: p[15] || (p[15] = (c) => f.submitRating(En.value, ut.value)),
              disabled: !En.value,
              class: "submit-button",
              style: we(E(D))
            }, " Submit ", 12, ny),
            b("button", {
              onClick: p[16] || (p[16] = (c) => Tn.value = !1),
              class: "skip-rating"
            }, " Skip ")
          ])
        ])
      ])) : ne("", !0),
      E(dt) ? (k(), x("div", {
        key: 9,
        class: "preview-modal-overlay",
        onClick: p[19] || (p[19] = //@ts-ignore
        (...c) => E(Un) && E(Un)(...c))
      }, [
        b("div", {
          class: "preview-modal-content",
          onClick: p[18] || (p[18] = Jn(() => {
          }, ["stop"]))
        }, [
          b("button", {
            class: "preview-modal-close",
            onClick: p[17] || (p[17] = //@ts-ignore
            (...c) => E(Un) && E(Un)(...c))
          }, "×"),
          E(pt) && E(Ts)(E(pt).type) ? (k(), x("div", sy, [
            b("img", {
              src: E(xs)(E(pt)),
              alt: E(pt).filename,
              class: "preview-modal-image"
            }, null, 8, iy),
            b("div", ry, ee(E(pt).filename), 1)
          ])) : ne("", !0)
        ])
      ])) : ne("", !0)
    ], 6)) : (k(), x("div", oy));
  }
}), cy = /* @__PURE__ */ $c(ly, [["__scopeId", "data-v-4cd43bc2"]]);
window.process || (window.process = { env: { NODE_ENV: "production" } });
const jt = window.__INITIAL_DATA__, eu = new URL(window.location.href), tu = eu.searchParams.get("preview") === "true", nu = (e) => {
  const t = eu.searchParams.get(e);
  if (!(!t || t === "undefined" || t.trim() === ""))
    return t;
}, uy = tu ? nu("widget_id") || (jt == null ? void 0 : jt.widgetId) || void 0 : (jt == null ? void 0 : jt.widgetId) || void 0, fy = tu ? (jt == null ? void 0 : jt.initialToken) || nu("token") || void 0 : (jt == null ? void 0 : jt.initialToken) || void 0, hy = Qh(cy, {
  widgetId: uy,
  token: fy || void 0,
  initialAuthError: null
  // Let backend determine if auth is required
});
hy.mount("#app");
