const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $("#app");
const inr = n => "\u20B9" + n.toLocaleString("en-IN");
const SRC = (new URLSearchParams(location.search).get("src") || "web").slice(0, 2).toUpperCase(); // index.html?src=ig#/
const wa = m => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m)}`;
const rid = () => Math.random().toString(36).slice(2, 5).toUpperCase();
const ref = (t, b) => `EV-${SRC}-${t.code}${b.code}-${rid()}`;
const img = f => `--img:url('${new URL(`media/${f}`, document.baseURI).href}')`;
const title = t => (document.title = t ? `${t} | Everroam` : "Everroam, the journey never ends");
const minP = p => Array.isArray(p.pricing) && p.pricing.length
  ? Math.min(...p.pricing.map(x => x.price)) : (p.price || 0);
const roomLabel = n =>
  n === 1 ? "Single room" : n === 2 ? "Twin sharing" :
  n === 3 ? "Triple sharing" : n === 4 ? "Quad sharing" : `${n} sharing`;
const roomDesc = n => n === 1 ? "A room to yourself"
  : `Share with ${n - 1} other traveller${n - 1 > 1 ? "s" : ""}`;

const priceTable = t => {
  if (!Array.isArray(t.pricing) || !t.pricing.length) return "";
  const rows = [...t.pricing].sort((a, b) => a.sharing - b.sharing);
  return `<div class="pricing"><h2>Room &amp; pricing</h2>
    <table class="pt"><tbody>${rows.map(p => `<tr>
        <td class="pt-label">
          <div class="pt-share">${roomLabel(p.sharing)}</div>
          <div class="pt-desc">${roomDesc(p.sharing)}</div>
        </td>
        <td class="pt-price">${inr(p.price)}</td>
      </tr>`).join("")}</tbody></table></div>`;
};
const WAI = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2z"/><path style="fill:var(--hs,#1EBE5A)" d="M7.5 6.5H10L11 9 9.6 10.2C10.4 11.8 12.2 13.6 13.8 14.4L15 13 17.5 14V16.5C17.5 17.1 17 17.6 16.4 17.6 11.2 17.3 6.7 12.8 6.4 7.6 6.4 7 6.9 6.5 7.5 6.5Z"/></svg>';
const DL_ICON = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="flex:none"><circle cx="12" cy="12" r="11" fill="var(--ac,#34D186)"/><path d="M12 6.5v7.5m-3-3L12 14l3-3M7.5 17.5h9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
let cur = "", sel = { b: 0, q: 2, a: null, e: null }, bike = false, ride = null;
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const P = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtD = s => P(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtS = s => P(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const span = () => Math.round((P(sel.e) - P(sel.a)) / 864e5) + 1;
const dLine = () => !sel.a ? "" : !sel.e || sel.e === sel.a ? `\nDates: ${fmtD(sel.a)}` : `\nDates: ${fmtD(sel.a)} to ${fmtD(sel.e)} (${span()} days)`;
const msg = (t, b, n) => t.live
  ? `Hi Everroam! I want to reserve a spot on the ${t.name} ${t.kind || "trip"}.${sel.a ? dLine() : t.batches.length === 1 ? `\nBatch: ${b.label} \u00B7 ${b.dates}` : ""}\nTravellers: ${n}\nRef: ${ref(t, b)}`
  : `Hi Everroam! Please add me to the ${t.name}${t.kind ? " bike" : ""} waitlist.${dLine()}\nTravellers: ${n}\nRef: ${ref(t, b)}`;

/* ---------- date-range calendar (today onwards) ---------- */
let calv = null;
function calReset() { const n = new Date(); calv = { y: n.getFullYear(), m: n.getMonth() }; }
function calBody() {
  const { y, m } = calv, first = new Date(y, m, 1), n = new Date(y, m + 1, 0).getDate();
  const td = new Date(), today = iso(td.getFullYear(), td.getMonth(), td.getDate());
  const cells = Array((first.getDay() + 6) % 7).fill("<span></span>");   // weeks start on Monday
  for (let d = 1; d <= n; d++) {
    const s = iso(y, m, d), past = s < today;
    const cls = ["d", past ? "off" : "", s === today ? "today" : "", sel.a && sel.e && s > sel.a && s < sel.e ? "in" : "", s === sel.a ? "s" : "", s === (sel.e || sel.a) ? "e" : ""].join(" ");
    cells.push(`<button type="button" class="${cls}" data-d="${s}"${past ? " disabled" : ""} aria-label="${fmtD(s)}">${d}</button>`);
  }
  const sum = !sel.a ? "Tap a start date, then an end date."
    : !sel.e ? `Start: <b>${fmtD(sel.a)}</b>. Now tap your end date. <button type="button" class="clr" data-cal="x">Clear</button>`
    : `<b>${fmtD(sel.a)}</b> to <b>${fmtD(sel.e)}</b> \u00B7 ${span()} ${span() === 1 ? "day" : "days"} <button type="button" class="clr" data-cal="x">Clear</button>`;
  return `<div class="calh"><button type="button" data-cal="-1" aria-label="Previous month"${y * 12 + m <= td.getFullYear() * 12 + td.getMonth() ? " disabled" : ""}>\u2190</button>
    <b>${first.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</b><button type="button" data-cal="1" aria-label="Next month">\u2192</button></div>
    <div class="calw">${"MTWTFSS".split("").map(x => `<span>${x}</span>`).join("")}</div><div class="calg">${cells.join("")}</div><p class="calsum">${sum}</p>`;
}
const calLabel = () => !sel.a ? "Select your dates" : !sel.e || sel.e === sel.a ? fmtD(sel.a) : `${fmtS(sel.a)} \u2013 ${fmtD(sel.e)} \u00B7 ${span()} days`;
const calCard = () => `<div class="cal" id="cal"><button type="button" class="calf" data-calopen aria-expanded="false" aria-controls="calbody"><span class="cl">Dates</span><span class="clab" id="callabel">${calLabel()}</span><i aria-hidden="true">\u25BE</i></button><div class="calpop" id="calbody" hidden>${calBody()}</div></div>`;

const words = s => s.split(" ").map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ");
// landscape screens (laptops, phones turned sideways) try NAME-wide.mp4 first; if that file is missing the portrait video is used
const heroSrc = n => {
  // landscape (laptop, landscape phone) prefers the big file; portrait prefers the small one
  const order = matchMedia("(min-aspect-ratio: 1/1)").matches ? ["-1080", "-720"] : ["-720", "-1080"];
  return order.map(s => `<source src="media/${n}${s}.mp4" type="video/mp4">`).join("");
};
const vid = n => {
  const order = matchMedia("(min-aspect-ratio: 1/1)").matches ? ["-1080", "-720"] : ["-720", "-1080"];
  return `<video class="cv" muted loop playsinline preload="none" aria-hidden="true">` +
    order.map(s => `<source data-src="media/${n}${s}.mp4" type="video/mp4">`).join("") + `</video>`;
};
const card = (t, i) => `<a class="tcard ph g${i % 3}" style="${img(t.slug + ".jpg")}" href="#/trips/${t.slug}">${vid(t.slug)}
  <span class="eyebrow">${t.live ? t.days + " days" : "Coming soon"}</span><h3>${t.name}</h3><p>${t.live ? "Starting from " + inr(minP(t)) + " · " + t.tag : t.tag}</p></a>`;
const page = (eb, h, body) => `<section class="pg"><div class="wrap"><span class="eyebrow">${eb}</span><h1>${h}</h1>${body}</div></section>`;

/* ---------- views ----------
   Home = full-screen "slides". On phones the browser snaps one slide per swipe (CSS scroll-snap),
   and a slide's text animates in when it becomes active (IntersectionObserver). */
function home() {
  title("");
  const AR = ["3/4", "1/1", "4/5", "4/3", "3/4", "1/1", "4/5", "3/4"];
  // endless strip: the same 8 photos twice, then CSS slides the track by exactly half
  const row = (from, rev) => `<div class="strip${rev ? " rev" : ""}" aria-hidden="true"><div>${[0, 1].map(() => AR.map((r, i) =>
    `<span class="ph g${i % 3}" style="${img("strip-" + (from + i) + ".jpg")};--ar:${r}"></span>`).join("")).join("")}</div></div>`;
  const PILLARS = [
    ["Twelve, tops", "Small on purpose, so nobody is a stranger by day two."],
    ["A friend with the map", "Your trip lead eats with you, laughs with you and sorts the rest."],
    ["One chat, start to finish", "Everything runs on WhatsApp, from the first hello to the last goodbye."],
    ["Your people", "18 to 35, solo or with a friend. You will fit right in."]];
  return `
  <section class="hero" data-bg="#030705">
    <div class="hv ph g0"><video autoplay muted loop playsinline preload="metadata" poster="media/hero-poster.jpg">${heroSrc("hero")}</video></div>
<div class="hc"><div class="cap"><span class="eyebrow">Small groups \u00B7 Big trips</span><h1>The journey never ends.</h1>
  <a class="btn hero-cta-btn" href="#/trips">All trips <span aria-hidden="true">\u2192</span></a></div>
      <button class="cue" type="button" aria-label="Scroll down">Scroll</button></div></section>
  <div class="after">
  <section class="sec" data-bg="#050E09">
    <div class="wrap"><p class="stmt wr">${words("Twelve strangers. One road. By day three you are a crew, and by day seven you are planning the next trip.")}</p></div>
    ${row(1, false)}${row(9, true)}</section>

  <section class="sec" data-bg="#07160F">
    <div class="wrap"><span class="eyebrow">The shortlist</span><h2 style="margin-top:1rem">Pick your <em>road</em></h2>
      <div class="cctl"><button class="cb" data-cr="-1" aria-label="Previous">\u2190</button><button class="cb" data-cr="1" aria-label="Next">\u2192</button></div>
      <div class="cr trs" tabindex="0" aria-label="Trips">${TRIPS.map(card).join("")}</div></div></section>

  <section class="sec" data-bg="#030705"><div class="wrap">
    <a class="bn2" href="#/bike"><div class="bn2-tx"><span class="bn2-tag">${BIKE_PAGE.promo.tag}</span><h2>${BIKE_PAGE.promo.line1}<br><em>${BIKE_PAGE.promo.line2}</em></h2><span class="bn2-btn"><span>${BIKE_PAGE.promo.cta}</span></span></div>
      <div class="bn2-sc" aria-hidden="true"><i class="bn2-sun"></i><i class="bn2-rg a"></i><i class="bn2-rg b"></i><i class="bn2-rd"></i><div class="bn2-bike">${BIKE.replace('class="bk"', 'class="bl-svg"')}</div></div></a></div></section>

  <section class="sec help" data-bg="#08190F"><div class="wrap rv">
    <h2>Not sure <em>where</em> to go?</h2>
    <p class="sub">Tell us your dates and your mood. A real person from the crew will help you pick.</p>
    <a class="btn" href="${wa("Hi Everroam! I need help choosing a trip.")}" target="_blank" rel="noopener">${WAI}Talk to a trip expert</a></div></section>

  <section class="sec pil" data-bg="#050E09"><div class="wrap">
    <span class="eyebrow">How we do trips</span><h2 style="margin-top:1rem">Small things we <em>care</em> about.</h2>
    <ol>${PILLARS.map((p, i) => `<li class="rv" style="--d:${i * .08}s"><b>0${i + 1}</b><div><h3>${p[0]}</h3><p>${p[1]}</p></div></li>`).join("")}</ol></div></section>

  <section class="sec" data-bg="#07160F"><div class="wrap crw">
    <div class="rv"><span class="eyebrow">Meet the crews</span><h2 style="margin-top:1rem">Strangers on day one. <em>Family</em> by day seven.</h2>
      <p class="sub">Swipe through a few of ours. Yours could be next.</p>
      <div class="cctl"><button class="cb" data-cr="-1" aria-label="Previous">\u2190</button><button class="cb" data-cr="1" aria-label="Next">\u2192</button></div></div>
    <div class="cr" tabindex="0" aria-label="Group photos">${GROUPS.map((g, i) => `
      <figure class="gc" style="--r:${i % 2 ? 2 : -2}deg"><div class="ph g${i % 3}" style="${img(g[0])}"></div><figcaption>${g[1]}</figcaption></figure>`).join("")}</div></div></section>

  <section class="sec fin" data-bg="#030705"><div class="wrap rv"><img class="mark" src="media/emblem-white.png" alt="">
    <h2>Your seat is <em>waiting</em>.</h2>
    <div class="acts"><a class="btn" href="#/trips">Pick a trip</a><a class="btn line" href="#/plan">Plan a custom trip</a></div></div></section></div>`;
}

function trips() {
  title("Trips");
  const sh = (eb, h, hot) => `<div class="sh"><div><span class="eyebrow${hot ? " hot" : ""}">${eb}</span><h2>${h}</h2></div>
    <div class="cctl"><button class="cb" data-cr="-1" aria-label="Previous">\u2190</button><button class="cb" data-cr="1" aria-label="Next">\u2192</button></div></div>`;
  return `<section class="pg pgh"><div class="wrap"><span class="eyebrow">All trips</span><h1>Where to <em>next</em>?</h1></div></section>
  <section class="tsec"><div class="wrap">${sh("Road trips", "Small groups, <em>big</em> roads")}
    <div class="cr trs" tabindex="0" aria-label="Road trips">${TRIPS.map(card).join("")}</div></div></section>
  <section class="tsec bk"><div class="wrap">${sh("Bike trips", "Same roads. <em>Two wheels.</em>", true)}
    <div class="cr trs" tabindex="0" aria-label="Bike trips">${TRIPS.map(bcard).join("")}</div></div></section>`;
}

function trip(slug) {
  const i = TRIPS.findIndex(x => x.slug === slug);
  if (i < 0) return nf();
  const t = TRIPS[i];
  title(t.name); cur = slug; sel = { b: 0, q: 2, a: null, e: null }; calReset(); document.body.classList.add("trip");
  const others = TRIPS.filter(x => x.slug !== slug);
  return `
  <div class="thero ph g${i % 3}" style="${img(t.slug + ".jpg")}"><div class="wrap">
    ${modeSw(t.slug, false)}
    <h1>${t.name}</h1><p class="sub">${t.blurb}</p></div></div>
  <div class="wrap tbody">
    <div class="chips">${t.highlights.map(h => `<span>${h}</span>`).join("")}</div>
    ${calCard()}
    ${t.live ? `<div class="pick"><div class="qty"><span>Travellers</span><div><button type="button" data-q="-1" aria-label="Fewer">\u2212</button><b id="qn">2</b><button type="button" data-q="1" aria-label="More">+</button></div></div></div>` : ""}
    <div><h2>Day by day</h2>${t.itinerary.map((d, k) =>
      `<details${k === 0 ? " open" : ""}><summary><small>${d[0]}</small>${d[1]}</summary><p>${d[2]}</p></details>`).join("")}</div>
    <a class="btn ghost dl-btn" href="media/Everroam-${t.name}.pdf" download="Everroam-${t.name}.pdf">${DL_ICON} Download itinerary</a>
    ${priceTable(t)}
    <div><h2>Gallery</h2><div class="gal">${[1, 2, 3, 4].map(n => `<div class="ph g${(i + n) % 3} rv" style="${img(t.slug + "-" + n + ".jpg")}"></div>`).join("")}</div></div>
    <div class="two"><div><h2>Included</h2><ul class="tick">${t.inc.map(x => `<li>${x}</li>`).join("")}</ul></div>
      <div><h2>Not included</h2><ul class="tick no">${t.exc.map(x => `<li>${x}</li>`).join("")}</ul></div></div>
    <div class="more">
          <section class="more-sec"><h2>More road trips</h2>
        <div class="cr trs" tabindex="0" aria-label="Road trips">${others.map(card).join("")}</div>
      </section>
      <section class="more-sec"><h2>More bike trips</h2>
        <div class="cr trs" tabindex="0" aria-label="Bike trips">${others.map(bcard).join("")}</div>
      </section>
    </div>
  </div>
  <div class="rbar"><div class="price"><small>Starting from</small>${inr(minP(t))}<small>per person</small></div>
    <a class="btn" id="rwa" href="${wa(msg(t, t.batches[0], 2))}" target="_blank" rel="noopener">${WAI}${t.live ? "Reserve" : "Join waitlist"}</a></div>`;
}

function plan() {
  title("Plan a trip");
  return page("Custom and private trips", "Plan a <em>trip</em>", `
    <p class="sub">Tell us a little. We open WhatsApp with it ready to send.</p>
    <form class="stack" id="plan" novalidate>
      <label>Name<input name="name" autocomplete="name" required></label>
      <label>Where<select name="where">${TRIPS.map(t => `<option>${t.name}</option>`).join("")}<option>Somewhere else</option></select></label>
      <label>Travellers<input name="n" type="number" min="1" max="30" value="4" inputmode="numeric"></label>
      <label>Preferred dates<input name="when" placeholder="For example, mid January"></label>
      <label>Anything else<textarea name="note"></textarea></label>
      <button class="btn" type="submit">${WAI}Continue on WhatsApp</button>
      <p class="msg" id="msg" role="status"></p></form>`);
}

function about() {
  title("About");
  return page("About", "Small groups, <em>big</em> trips", `
    <div class="prose"><p>Everroam runs small-group trips for 18 to 35 year olds. Replace this with your own story: why you started, who leads the trips and what a good day looks like.</p></div>
    <h2 style="margin:2.5rem 0 1rem">Questions</h2>${FAQ.map(f => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}`);
}

function links() {
  title("Links");
  return `<section class="pg"><div class="lk"><img src="media/emblem.png" alt="Everroam"><h2>everroam</h2><p class="sub">The journey never ends.</p>
    ${TRIPS.map(t => `<a class="btn" href="#/trips/${t.slug}">${t.live ? "Reserve " : "Waitlist: "}${t.name}</a>`).join("")}
    <a class="btn ghost" href="#/plan">Plan a custom trip</a></div></section>`;
}
function nf() { title("Not found"); return page("404", "Lost the <em>trail</em>", `<p class="sub">That page doesn\u2019t exist. Try the <a href="#/trips">trips</a>.</p>`); }

/* ---------- bike world ---------- */
const BIKE = '<svg class="bk" viewBox="0 0 244 140" aria-hidden="true"><g class="wh"><circle cx="196" cy="100" r="31" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="196" cy="100" r="35.5" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="2.4 2"/><circle cx="196" cy="100" r="24" fill="none" stroke="currentColor" stroke-width="2"/><path d="M173.0 100.0L219.0 100.0M176.1 88.5L215.9 111.5M184.5 80.1L207.5 119.9M196.0 77.0L196.0 123.0M207.5 80.1L184.5 119.9M215.9 88.5L176.1 111.5" stroke="currentColor" stroke-width="1.3"/><circle cx="196" cy="100" r="5" fill="currentColor"/></g><g class="wh"><circle cx="46" cy="104" r="27" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="46" cy="104" r="31.5" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="2.4 2"/><circle cx="46" cy="104" r="20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M27.0 104.0L65.0 104.0M29.5 94.5L62.5 113.5M36.5 87.5L55.5 120.5M46.0 85.0L46.0 123.0M55.5 87.5L36.5 120.5M62.5 94.5L29.5 113.5" stroke="currentColor" stroke-width="1.3"/><circle cx="46" cy="104" r="5" fill="currentColor"/></g><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M126 104L42 86" stroke-width="8"/><path d="M15 86A36 36 0 0 1 64 73" stroke-width="4"/><path d="M157 79A44 44 0 0 1 231 73M228 70L238 78" stroke-width="6"/><path d="M168 34L190 84" stroke-width="5"/><path d="M186 78L196 100" stroke-width="8"/><path d="M169 31L152 24L140 24" stroke-width="4"/><path d="M140 24L131 24" stroke-width="6"/><path d="M135 17L152 15L156 27" stroke-width="3"/><path d="M150 24L146 10" stroke-width="2.5"/><path d="M166 48L112 60M164 52L148 98M112 62L58 102M118 108L46 104" stroke-width="4"/><path d="M104 66L110 102" stroke-width="6" stroke-dasharray="2.2 1.6" stroke-linecap="butt"/><path d="M16 62L66 58" stroke-width="4"/><path d="M26 62L36 86M56 58L54 84" stroke-width="3"/><path d="M166 44C152 34 122 34 106 52" stroke-width="3"/><path d="M160 66C170 88 164 110 146 120L108 120" stroke-width="4"/><path d="M124 76C110 80 106 100 114 110L128 114" stroke-width="4"/><path d="M106 124H150" stroke-width="5"/></g><g fill="currentColor"><g transform="rotate(12 132 98)"><rect x="121" y="74" width="26" height="3" rx="1"/><rect x="121" y="80" width="26" height="3" rx="1"/><rect x="121" y="86" width="26" height="3" rx="1"/><path d="M126 70H142V96H126Z"/><path d="M122 63H146V71H122Z"/></g><path d="M110 96H146Q151 96 151 101V112H108V100Q108 96 110 96Z"/><path d="M104 58C104 42 134 38 160 44L168 56C158 62 128 64 108 62Z"/><path d="M62 60C68 54 100 54 112 58L110 64L64 66C60 64 60 62 62 60Z"/><circle cx="183" cy="42" r="11"/><circle cx="14" cy="62" r="3"/></g><circle cx="186" cy="42" r="6.5" fill="#FFF1E0"/><path style="stroke:var(--acc,none)" d="M110 48C124 44 144 46 160 50" fill="none" stroke-width="2.4" stroke-linecap="round"/></svg>';
const modeSw = (slug, bk) => `<div class="mode" role="group" aria-label="Trip style"><a class="${bk ? "" : "on"}" href="#/trips/${slug}">Road trip</a><a class="${bk ? "on" : ""}" href="#/bike/trips/${slug}">Bike trip</a></div>`;
const bcard = (t, i) => `<a class="tcard hot ph g${(i + 1) % 3}" style="${img(t.slug + "-bike.jpg")}" href="#/bike/trips/${t.slug}">${vid(t.slug + "-bike")}
  <span class="eyebrow">${t.bike.live ? t.bike.days + " days" : "Coming soon"}</span><h3>${t.name}</h3><p>${t.bike.live ? "Starting From " + inr(minP(t.bike)) : "Join the waitlist"}</p></a>`;

const bikeKm = b => b.km || b.itinerary.reduce((n, r) => n + (r[3] || 0), 0);
const bikeCard = (t, i) => { const b = t.bike, k = bikeKm(b), R = BIKE_PAGE.rides, bt = b.batches && b.batches[0];
  return `<article class="bl-card g${(i + 1) % 3} rv" style="${img(b.photo || t.slug + "-bike.jpg")};--d:${i * .08}s">${vid(t.slug + "-bike")}
  <div class="bl-cs"><div class="bl-top"><span class="bl-chip">${b.grade}</span><span class="bl-l lt">${b.live && bt ? bt.label + " \u00B7 " + bt.dates : "Dates soon"}</span></div>
  <h3>${t.name}</h3><p>${b.blurb}</p>
  <div class="bl-nm"><div><b data-n="${b.days}">${b.days}</b><span class="bl-l">days</span></div><div><b>~<i data-n="${k}">${k.toLocaleString("en-IN")}</i></b><span class="bl-l">km</span></div></div>
  <div class="bl-bt"><div><span class="bl-l">From</span><b class="bl-pr">${inr(minP(b))}</b><span class="bl-l">per rider</span></div>
  <a class="bl-btn" href="#/bike/trips/${t.slug}"><span>${b.live ? R.cta : R.waitlist}</span></a></div></div></article>`; };

const matchHTML = ans => { const M = BIKE_PAGE.match, n = ans.length, gears = M.steps.map((_, i) => `<i class="${i < n ? "done" : i === n ? "on" : ""}">${i + 1}</i>`).join("");
  if (n < M.steps.length) { const st = M.steps[n];
    return `<div class="bl-gear" aria-hidden="true"><i>N</i>${gears}</div><h3 class="bl-q">${st.q}</h3><div class="bl-opts">${st.opts.map((o, i) => `<button class="bl-opt" data-opt="${i}"><b>${o.label}</b>${o.sub ? `<span>${o.sub}</span>` : ""}</button>`).join("")}</div>${n ? `<button class="bl-back" data-back>\u2190 Back</button>` : ""}`; }
  const sc = {}; ans.forEach((a, i) => { const pt = M.steps[i].opts[a].pts || {}; for (const k in pt) sc[k] = (sc[k] || 0) + pt[k]; });
  const t = TRIPS.filter(x => x.bike).sort((x, y) => (sc[y.slug] || 0) - (sc[x.slug] || 0))[0], b = t.bike, km = bikeKm(b);
  const msg = `Hi Everroam! I ride like this: ${ans.map((a, i) => M.steps[i].opts[a].label).join(" / ")}. The ${t.name} bike trip looks like my match. Can you tell me more?`;
  return `<div class="bl-gear" aria-hidden="true"><i>N</i>${gears}<i class="on">GO</i></div><span class="bl-l">${M.result}</span><h3 class="bl-win">${t.name}</h3><p class="bl-wp">${b.blurb}</p>
  <div class="bl-nm"><div><b data-n="${b.days}">${b.days}</b><span class="bl-l">days</span></div><div><b>~<i data-n="${km}">${km.toLocaleString("en-IN")}</i></b><span class="bl-l">km</span></div></div>
  <div class="bl-acts"><a class="bl-btn" href="#/bike/trips/${t.slug}"><span>${M.cta}</span></a><a class="bl-btn o" href="${wa(msg)}" target="_blank" rel="noopener"><span>${M.cta2}</span></a></div><button class="bl-back" data-reset>${M.again}</button>`; };

function bikeHome() {
  title("Bike trips");
  const P = BIKE_PAGE, H = P.hero;
  const tape = (rev) => `<div class="bl-tape${rev ? " rev" : ""}" aria-hidden="true"><div>${[0, 1].map(() => Array(4).fill(P.tape.map(w => `<span>${w}</span><span class="x">//</span>`).join("")).join("")).join("")}</div></div>`;
  return `<div class="bl">
  <section class="bl-hero"><div class="wrap bl-hc"><span class="bl-l lt">${H.eyebrow}</span>
    <h1>${H.line1}<br><em>${H.line2}</em></h1><p class="bl-sub">${H.sub}</p>
    <div class="bl-acts"><a class="bl-btn" href="#/bike" data-scroll="#bl-rides"><span>${H.cta}</span></a><a class="bl-btn o" href="${wa(H.wa)}" target="_blank" rel="noopener"><span>${H.cta2}</span></a></div>
    <ul class="bl-st">${P.stats.map(x => `<li><b>${x[0]}</b><span class="bl-l">${x[1]}</span></li>`).join("")}</ul></div>
    <div class="bl-sc" aria-hidden="true"><div class="bl-sun"></div><div class="bl-rg a"></div><div class="bl-rg b"></div><div class="bl-rd"></div><div class="bl-bike">${BIKE.replace('class="bk"', 'class="bl-svg"')}</div></div></section>
  <div class="bl-haz" aria-hidden="true"></div>${tape(false)}${tape(true)}
  <section class="bl-sec" id="bl-rides"><div class="wrap"><span class="bl-l">${P.rides.eyebrow}</span><h2>${P.rides.h}</h2><div class="bl-cards">${TRIPS.map(bikeCard).join("")}</div></div></section>
  <section class="bl-sec bl-mt"><div class="wrap"><span class="bl-l">${P.match.eyebrow}</span><h2>${P.match.h}</h2><p class="bl-sub">${P.match.sub}</p><div class="bl-mbox" id="bl-mbox" data-ans="[]" aria-live="polite">${matchHTML([])}</div></div></section>
  <section class="bl-sec"><div class="wrap"><span class="bl-l">${P.facts.eyebrow}</span><h2>${P.facts.h}</h2>
    <ol class="bl-fx">${P.facts.items.map((f, i) => `<li class="rv" style="--d:${i * .08}s"><b>0${i + 1}</b><div><h3>${f[0]}</h3><p>${f[1]}</p></div></li>`).join("")}</ol></div></section>
  <section class="bl-fin" data-w="${P.fin.mark}"><div class="wrap rv"><h2>${P.fin.h}</h2><div class="bl-acts"><a class="bl-btn" href="${wa(P.fin.wa)}" target="_blank" rel="noopener"><span>${P.fin.cta}</span></a><a class="bl-btn o" href="#/"><span>${P.fin.alt}</span></a></div></div></section></div>`;
}

function btrip(slug) {
  const i = TRIPS.findIndex(x => x.slug === slug);
  if (i < 0) return nf();
  const t = TRIPS[i], b = t.bike, bt = { ...t, ...b, kind: "bike trip" };
  title(t.name + " by bike"); cur = slug; bike = true; sel = { b: 0, q: 2, a: null, e: null }; calReset(); document.body.classList.add("trip");
  const others = TRIPS.filter(x => x.slug !== slug);
  return `
  <div class="thero ph g${(i + 1) % 3}" style="${img(b.photo || t.slug + "-bike.jpg")}"><div class="wrap">
    ${modeSw(t.slug, true)}
    <h1>${t.name}</h1><p class="sub">${b.blurb}</p>
    <ul class="bt-st"><li><b>${b.days}</b><span>days</span></li><li><b>~${bikeKm(b).toLocaleString("en-IN")}</b><span>km</span></li><li><b>${b.grade}</b><span>grade</span></li></ul></div></div>
  <div class="wrap tbody">
    <div class="chips">${b.highlights.map(h => `<span>${h}</span>`).join("")}</div>
    ${calCard()}
    ${b.live ? `<div class="pick"><div class="qty"><span>Riders</span><div><button type="button" data-q="-1" aria-label="Fewer">\u2212</button><b id="qn">2</b><button type="button" data-q="1" aria-label="More">+</button></div></div></div>` : ""}
    <div><h2>The ride, day by day</h2><div class="ride" id="ride"><div class="road"><div class="bike">${BIKE}</div></div>
      ${b.itinerary.map(d => `<article class="stop"><small>${d[0]}</small>${d[3] ? `<b class="km">${d[3]}<i> km</i></b>` : ""}<h3>${d[1]}</h3><p>${d[2]}</p></article>`).join("")}</div></div>
    <a class="btn ghost dl-btn" href="media/Everroam-${t.name}-biking.pdf" download="Everroam-${t.name}-biking.pdf">${DL_ICON} Download itinerary</a>
    ${priceTable(b)}
    <div><h2>Gallery</h2><div class="gal">${[1, 2, 3, 4].map(n => `<div class="ph g${(i + n) % 3} rv" style="${img(t.slug + "-bike-" + n + ".jpg")}"></div>`).join("")}</div></div>
    <div class="two"><div><h2>Included</h2><ul class="tick">${b.inc.map(x => `<li>${x}</li>`).join("")}</ul></div>
      <div><h2>Not included</h2><ul class="tick no">${b.exc.map(x => `<li>${x}</li>`).join("")}</ul></div></div>
    <div class="more">
      <section class="more-sec"><h2>More bike trips</h2>
        <div class="cr trs" tabindex="0" aria-label="Bike trips">${others.map(bcard).join("")}</div>
      </section>
      <section class="more-sec"><h2>More road trips</h2>
        <div class="cr trs" tabindex="0" aria-label="Road trips">${others.map(card).join("")}</div>
      </section>
    </div>
  </div>
  <div class="rbar"><div class="price"><small>Starting from</small>${inr(minP(b))}<small>per rider</small></div>
    <a class="btn" id="rwa" href="${wa(msg(bt, b.batches[0], 2))}" target="_blank" rel="noopener">${WAI}${b.live ? "Reserve" : "Join waitlist"}</a></div>`;
}

/* ---------- router ---------- */
const routes = [[/^\/?$/, home], [/^\/trips\/?$/, trips], [/^\/trips\/([\w-]+)\/?$/, trip], [/^\/plan\/?$/, plan], [/^\/about\/?$/, about], [/^\/links\/?$/, links],
  [/^\/bike\/?$/, bikeHome], [/^\/bike\/trips\/([\w-]+)\/?$/, btrip]];

const ioS = new IntersectionObserver(es => es.forEach(e => {            // slides: active when crossing the middle band
  e.target.classList.toggle("on", e.isIntersecting);
  if (e.isIntersecting) { const k = $$(".slide").indexOf(e.target); $$(".dots i").forEach((d, j) => d.classList.toggle("on", j === k)); }
}), { rootMargin: "-35% 0px -35% 0px" });
const ioR = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); ioR.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });

// start downloading a card video (its <source>s only get a src once it is needed)
const prime = v => {
  if (v.dataset.loaded === "1") return;
  v.querySelectorAll("source").forEach(s => { s.src = s.dataset.src; });
  v.dataset.loaded = "1";
  v.preload = "auto";
  v.load();                           // browser now walks the source list
};

const ioV = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting) {
    prime(v);
    v.play().catch(() => {});
  } else v.pause();
}), { threshold: .3 });

const ioN = new IntersectionObserver(es => es.forEach(e => {       // bike landing: trip-meter numbers roll up when a card scrolls in
  if (!e.isIntersecting) return; ioN.unobserve(e.target);
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  $$("[data-n]", e.target).forEach(el => { const to = +el.dataset.n, t0 = performance.now(); const f = t => { const p = clamp((t - t0) / 1000); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN"); if (p < 1) requestAnimationFrame(f); }; f(t0); });
}), { threshold: .6 });

function render() {
  const path = location.hash.replace(/^#/, "") || "/";
  document.body.classList.remove("trip", "menu");
  const hm = path === "/";
  document.body.classList.toggle("bikemode", path === "/bike" || path.startsWith("/bike/"));
  document.body.classList.toggle("home", hm); document.body.classList.toggle("bikeland", path === "/bike");
  if (!hm) { secs = []; ["--bg", "--fg"].forEach(p => document.body.style.removeProperty(p)); document.body.classList.remove("scrolled"); }
  $("#menu").setAttribute("aria-expanded", "false");
  cur = ""; bike = false; ride = null; ioS.disconnect(); ioV.disconnect(); ioN.disconnect();
  let v = nf, a = [];
  for (const [re, f] of routes) { const m = path.match(re); if (m) { v = f; a = m.slice(1); break; } }
  app.innerHTML = v(...a);
  $$("nav a").forEach(x => x.classList.toggle("on", path.startsWith(x.dataset.p)));
  scrollTo({ top: 0, behavior: "instant" });
  $$(".slide").forEach(s => ioS.observe(s));
  $$(".rv,.wr").forEach(s => ioR.observe(s));
  if (hm) colorSetup();
  rideSetup();
  $$(".cv").forEach(v => ioV.observe(v));
  $$(".bl-nm").forEach(x => ioN.observe(x));
  $$(".cr").forEach(crFx);
}
addEventListener("hashchange", render);

/* ---------- events ---------- */
function crFx(c) {                                                       // centre photo biggest, edges shrink
  const b = c.getBoundingClientRect(), mid = b.left + b.width / 2;
  [...c.children].forEach(g => {
    const r = g.getBoundingClientRect(), d = clamp(Math.abs(r.left + r.width / 2 - mid) / b.width, 0, .8);
    g.style.setProperty("--k", 1 - d * .14); g.style.opacity = 1 - d * .3;
  });
}
document.addEventListener("scroll", e => { if (e.target.classList && e.target.classList.contains("cr")) crFx(e.target); }, true);
function upd() {
  const t0 = TRIPS.find(x => x.slug === cur); if (!t0) return;
  const t = bike ? { ...t0, ...t0.bike, kind: "bike trip" } : t0;
  $("#rwa").href = wa(msg(t, t.batches[sel.b], sel.q));
  const sm = $(".rbar .price small");
  if (sm) sm.textContent = sel.a ? fmtS(sel.a) + (sel.e && sel.e !== sel.a ? " \u2013 " + fmtS(sel.e) : "") : (bike ? "per rider" : "per person");
}
document.addEventListener("click", e => {
  if (e.target.closest(".cue")) scrollTo({ top: innerHeight, behavior: "smooth" });
  const p = e.target.closest(".pill"), q = e.target.closest("[data-q]"), c = e.target.closest("[data-cr]");
  if (p) { sel.b = +p.dataset.b; $$(".pill").forEach(x => x.classList.toggle("on", x === p)); upd(); }
  if (q) { sel.q = clamp(sel.q + +q.dataset.q, 1, 12); $("#qn").textContent = sel.q; upd(); }
  if (c) { const r = c.closest("section").querySelector(".cr"); r.scrollBy({ left: +c.dataset.cr * (r.firstElementChild.offsetWidth + 16), behavior: "smooth" }); }
});
document.addEventListener("submit", e => {
  if (e.target.id !== "plan") return;
  e.preventDefault();
  const f = e.target, m = $("#msg");
  if (!f.name.value.trim()) { m.className = "msg err"; m.textContent = "Enter your name to continue."; return; }
  const text = `Hi Everroam! I\u2019m ${f.name.value.trim()}. I\u2019d like to plan a trip to ${f.where.value} for ${f.n.value} traveller(s)` +
    (f.when.value.trim() ? `, around ${f.when.value.trim()}` : "") + "." + (f.note.value.trim() ? ` ${f.note.value.trim()}` : "") + `\nRef: EV-${SRC}-PLAN-${rid()}`;
  try { const k = "er_enquiries", l = JSON.parse(localStorage.getItem(k) || "[]"); l.push({ t: Date.now(), text }); localStorage.setItem(k, JSON.stringify(l)); } catch (_) {}
  const url = wa(text);
  m.className = "msg"; m.innerHTML = `Opening WhatsApp. If nothing opens, <a href="${url}" target="_blank" rel="noopener">tap here</a>.`;
  open(url, "_blank", "noopener");
});
$("#menu").addEventListener("click", () => { const o = document.body.classList.toggle("menu"); $("#menu").setAttribute("aria-expanded", o); });
$("#fab").href = wa("Hi Everroam! I\u2019d like to know more about your trips.");
/* ---------- landing: the page background melts between section colours ----------
   Each section declares data-bg. Between two sections we blend their colours by scroll position
   and pick white or forest text depending on how dark the blended colour is. */
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const smooth = t => t * t * t * (t * (6 * t - 15) + 10);
let secs = [], ticking = false;
function colorSetup() { secs = $$("[data-bg]").map(el => ({ el, c: hex(el.dataset.bg) })); paint(); }
function paint() {
  ticking = false;
  if (!document.body.classList.contains("home") || !secs.length) return;
  const vh = innerHeight; let i = 0;
  const vid = $(".hv video");                       // stop decoding the video once it is covered
  if (vid) { if (scrollY > vh * 1.05) { if (!vid.paused) vid.pause(); } else if (vid.paused) vid.play().catch(() => {}); }
  secs.forEach((s, k) => { if (s.el.getBoundingClientRect().top <= vh * .15) i = k; });
  const nx = secs[i + 1];
  const t = nx ? smooth(clamp((vh - nx.el.getBoundingClientRect().top) / (vh * .85))) : 0;
  const c = mixc(secs[i].c, nx ? nx.c : secs[i].c, t);
  const dark = (.2126 * c[0] + .7152 * c[1] + .0722 * c[2]) / 255 < .45;
  const st = document.body.style;
  st.setProperty("--bg", `rgb(${c})`); st.setProperty("--fg", dark ? (document.body.classList.contains("bikemode") ? "#FFF1EE" : "#E6F2EA") : "#064734");
  document.body.classList.toggle("scrolled", scrollY > vh * .8);
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
addEventListener("resize", paint);

/* ---------- bike itinerary: the bike rides down the road as you scroll ---------- */
function rideSetup() {
  const el = $("#ride");
  ride = el ? { el, road: $(".road", el), bike: $(".bike", el), svg: $(".bike svg", el), stops: $$(".stop", el) } : null;
  ridePaint();
}
function ridePaint() {
  if (!ride) return;
  const r = ride.el.getBoundingClientRect(), h = r.height;
  const p = clamp((innerHeight * .55 - r.top) / h), y = 24 + p * (h - 48);   // 0..1 through the itinerary
  ride.bike.style.transform = `translate3d(0,${y}px,0)`;
  ride.road.style.setProperty("--y", y + "px");                              // road turns solid behind the bike
  ride.svg.style.setProperty("--sp", scrollY * .6 + "deg");                  // wheels spin with the scroll
  ride.stops.forEach(s => s.classList.toggle("hit", y >= s.offsetTop + 12));
}
addEventListener("scroll", () => { if (ride) requestAnimationFrame(ridePaint); }, { passive: true });
addEventListener("resize", ridePaint);

/* calendar clicks: first tap = start, second tap = end (earlier date restarts the range) */
document.addEventListener("click", e => {
  const d = e.target.closest(".calg .d"), c = e.target.closest("[data-cal]");
  if (!d && !c) return;
  if (d) {
    const s = d.dataset.d;
    if (!sel.a || sel.e) { sel.a = s; sel.e = null; }
    else if (s < sel.a) { sel.e = sel.a; sel.a = s; }
    else sel.e = s;
  } else if (c.dataset.cal === "x") { sel.a = sel.e = null; }
  else { calv.m += +c.dataset.cal; if (calv.m > 11) { calv.m = 0; calv.y++; } if (calv.m < 0) { calv.m = 11; calv.y--; } }
  $("#calbody").innerHTML = calBody(); upd(); calLabelUpdate();
  if (d && sel.e) setTimeout(closeCal, 350);
});

document.addEventListener("error", e => { const v = e.target; if (v.classList && v.classList.contains("cv")) v.remove(); }, true);   // no video file? keep the photo
document.addEventListener("playing", e => { const v = e.target; if (v.classList && v.classList.contains("cv")) v.classList.add("on"); }, true);
/* dates dropdown: tap the field to open, tap outside / Esc / finish a range to close */
function calLabelUpdate() { const l = $("#callabel"); if (l) l.textContent = calLabel(); }
function closeCal() {
  const c = $("#cal"); if (!c) return;
  c.classList.remove("open"); $("#calbody").hidden = true; $(".calf", c).setAttribute("aria-expanded", "false");
}
document.addEventListener("click", e => {
  const f = e.target.closest("[data-calopen]");
  if (f) { const o = $("#cal").classList.toggle("open"); $("#calbody").hidden = !o; f.setAttribute("aria-expanded", o); return; }
  if (!e.composedPath().some(n => n.id === "cal")) closeCal();     // composedPath: the tapped day may already be re-rendered
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCal(); });
/* download itinerary PDFs in the background — never leave the page */
document.addEventListener("click", async e => {
  const a = e.target.closest(".dl-btn");
  if (!a) return;
  e.preventDefault();
  const url  = a.getAttribute("href");
  const name = a.getAttribute("download") || url.split("/").pop();
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    const blob = await r.blob();
    const u = URL.createObjectURL(blob);
    const tmp = document.createElement("a");
    tmp.href = u;
    tmp.download = name;
    document.body.appendChild(tmp);
    tmp.click();
    tmp.remove();
    setTimeout(() => URL.revokeObjectURL(u), 1500);
  } catch (err) {
    window.open(url, "_blank", "noopener");   // file:// fallback: new tab, site stays put
  }
});
/* in-page scroll links (the router owns the URL hash, so a plain #anchor would change the route) */
document.addEventListener("click", e => { const a = e.target.closest("[data-scroll]"); if (!a) return; e.preventDefault(); const t = $(a.dataset.scroll); if (t) t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth" }); });
document.addEventListener("click", e => { const box = e.target.closest("#bl-mbox"), bt = box && e.target.closest("button"); if (!bt) return;
  let ans = JSON.parse(box.dataset.ans);
  if (bt.dataset.opt !== undefined) ans.push(+bt.dataset.opt); else if (bt.hasAttribute("data-back")) ans.pop(); else if (bt.hasAttribute("data-reset")) ans = []; else return;
  box.dataset.ans = JSON.stringify(ans); box.innerHTML = matchHTML(ans); box.classList.remove("bl-in"); void box.offsetWidth; box.classList.add("bl-in");
  const nm = $(".bl-nm", box); if (nm) ioN.observe(nm); (box.querySelector(".bl-opt,.bl-btn") || box).focus({ preventScroll: true }); });
/* bike landing: the sun and ridges drift at different speeds as you scroll */
addEventListener("scroll", () => { const h = $(".bl-hero"); if (h && scrollY < innerHeight * 1.2) requestAnimationFrame(() => h.style.setProperty("--sy", scrollY)); }, { passive: true });

/* loading screen (#boot in index.html). index.html decides when it becomes visible (only if loading is still going on after 0.5 s, or at once on
   Instagram's in-app browser / 2g-3g). This hides it as soon as the landing hero video, the first trip-card videos and the fonts can play,
   and never later than CAP ms after the page started loading, however slow the connection is. */
function bootWait() {
  const el = document.getElementById("boot"); if (!el) return;       // index.html removed it (Data Saver or ?boot=0)
  const CAP = 3000, KEEP = 300;                      // CAP = hard limit from page start; KEEP = once visible, the shortest it stays (no flicker)
  const hero = $(".hv video"), cards = $$(".cv").slice(0, 4);
  const total = (hero ? 1 : 0) + cards.length + 1;   // +1 = fonts
  let done = 0, over = false, started = false;
  const hide = () => {
    if (over) return; over = true;
    document.documentElement.classList.remove("boot-shown");
    if (!el.classList.contains("show")) { el.remove(); return; }     // never became visible (fast load): nothing to fade
    el.classList.add("out"); setTimeout(() => el.remove(), 700);
  };
  const finish = () => setTimeout(hide, window.__bootShown ? Math.max(0, KEEP - (performance.now() - window.__bootShown)) : 0);
  const tick = () => { done++; el.style.setProperty("--p", Math.max(.06, Math.min(1, done / total))); if (done >= total) finish(); };
  const track = v => {                               // "ready" = enough buffered to play, or every source failed
    let fin = false, errs = 0; const n = Math.max(1, v.querySelectorAll("source").length);
    const end = () => { if (!fin) { fin = true; tick(); } };
    if (v.readyState >= 3) return end();
    v.addEventListener("canplay", end, { once: true });
    v.addEventListener("error", () => { if (++errs >= n) end(); }, true);   // capture: <source> errors do not bubble
  };
  const startCards = () => { if (started) return; started = true; cards.forEach(c => { prime(c); track(c); }); };
  if (hero) { track(hero); if (hero.readyState >= 3) startCards(); else hero.addEventListener("canplay", startCards, { once: true }); } else startCards();
  setTimeout(startCards, 900);                       // hero is slow? start the cards anyway
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(tick, tick);
  setTimeout(hide, Math.max(0, CAP - performance.now()));
}
render();
bootWait();
