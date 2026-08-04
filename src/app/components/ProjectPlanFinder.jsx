"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Upload, Search, Trash2, Pencil, Eye, FileText,
  X, Check, AlertTriangle, Layers, MapPin, Ruler, Home, Car, Sparkles,
  Database, ShieldAlert, ChevronDown, Send
} from "lucide-react";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;

const SPECIAL_ROOMS = [
  "Theater", "Gym", "Office", "Sauna", "Wine Cellar",
  "Dirty Kitchen", "Guest Room",
];

const LOT_SHAPES = ["Rectangular", "Irregular", "Flag", "Corner", "Pie"];
const SITE_CONDITIONS = ["Flat", "Sloped", "Hillside"];
const STYLES = [
  "Modern", "Contemporary", "Traditional", "Mediterranean",
  "Farmhouse", "Spanish", "Transitional", "Craftsman",
];
const GARAGE_ORIENT = ["Front", "Side", "Rear", "Detached"];

const LA_RESIDENTIAL_ZONES = [
  "RA", "RE40", "RE20", "RE15", "RE11", "RE9", "RS",
  "R1", "R1V1", "R1V2", "R1V3", "R1F", "R1R1", "R1H1",
  "RU", "RZ2.5", "RZ3", "RZ4", "RW1",
  "R2", "RD1.5", "RD2", "RD3", "RD4", "RD5", "RD6", "RMP",
  "R3", "RAS3", "R4", "RAS4", "R5",
];

const DEFAULT_RESIDENTIAL_ZONES = [
  "RA", "RE", "RR", "R-1", "R-2", "R-3", "R-4", "RM", "RH", "RMH", "PRD",
];

const LA_COMMUNITIES = [
  "Studio City", "Toluca Lake", "Sherman Oaks", "Encino", "Tarzana", "Van Nuys",
  "North Hollywood", "Valley Village", "Woodland Hills", "Northridge", "Granada Hills",
  "Reseda", "Canoga Park", "Winnetka", "West Hills", "Chatsworth", "Porter Ranch",
  "Sun Valley", "Sylmar", "Pacoima", "Mission Hills", "Sunland", "Tujunga", "Shadow Hills",
  "Hollywood", "West Los Angeles", "Brentwood", "Pacific Palisades", "Venice",
  "Mar Vista", "Playa del Rey", "Playa Vista", "Westwood", "Bel Air", "Beverly Crest",
  "Silver Lake", "Echo Park", "Los Feliz", "Eagle Rock", "Highland Park", "San Pedro",
  "Wilmington", "Harbor City", "Boyle Heights",
];

const CA_CITIES = [...new Set([
  "Adelanto","Agoura Hills","Alameda","Albany","Alhambra","Aliso Viejo","American Canyon","Anaheim",
  "Anderson","Antioch","Apple Valley","Arcadia","Arcata","Arroyo Grande","Artesia","Arvin","Atascadero",
  "Atherton","Atwater","Auburn","Avalon","Avenal","Azusa","Bakersfield","Baldwin Park","Banning","Barstow",
  "Beaumont","Bell","Bell Gardens","Bellflower","Belmont","Belvedere","Benicia","Berkeley","Beverly Hills",
  "Big Bear Lake","Bishop","Blue Lake","Blythe","Brawley","Brea","Brentwood","Brisbane","Buellton",
  "Buena Park","Burbank","Burlingame","Calabasas","Calexico","California City","Calimesa","Calipatria",
  "Calistoga","Camarillo","Campbell","Canyon Lake","Capitola","Carlsbad","Carmel-by-the-Sea","Carpinteria",
  "Carson","Cathedral City","Ceres","Cerritos","Chico","Chino","Chino Hills","Chowchilla","Chula Vista",
  "Citrus Heights","Claremont","Clayton","Clearlake","Cloverdale","Clovis","Coachella","Coalinga","Colfax",
  "Colma","Colton","Colusa","Commerce","Compton","Concord","Corcoran","Corning","Corona","Coronado",
  "Corte Madera","Costa Mesa","Cotati","Covina","Crescent City","Cudahy","Culver City","Cupertino","Cypress",
  "Daly City","Dana Point","Danville","Davis","Del Mar","Del Rey Oaks","Delano","Desert Hot Springs",
  "Diamond Bar","Dinuba","Dixon","Dorris","Dos Palos","Downey","Duarte","Dublin","Dunsmuir","East Palo Alto",
  "Eastvale","El Cajon","El Centro","El Cerrito","El Monte","El Segundo","Elk Grove","Emeryville","Encinitas",
  "Escalon","Escondido","Etna","Eureka","Exeter","Fairfax","Fairfield","Farmersville","Ferndale","Fillmore",
  "Firebaugh","Folsom","Fontana","Fort Bragg","Fort Jones","Fortuna","Foster City","Fountain Valley","Fowler",
  "Fremont","Fresno","Fullerton","Galt","Garden Grove","Gardena","Gilroy","Glendale","Glendora","Goleta",
  "Gonzales","Grand Terrace","Grass Valley","Greenfield","Gridley","Grover Beach","Guadalupe","Gustine",
  "Half Moon Bay","Hanford","Hawaiian Gardens","Hawthorne","Hayward","Healdsburg","Hemet","Hercules",
  "Hermosa Beach","Hesperia","Hidden Hills","Highland","Hollister","Holtville","Hughson","Huntington Beach",
  "Huntington Park","Huron","Imperial","Imperial Beach","Indian Wells","Indio","Industry","Inglewood","Ione",
  "Irvine","Irwindale","Isleton","Jackson","Jurupa Valley","Kerman","King City","Kingsburg","La Cañada Flintridge",
  "La Habra","La Habra Heights","La Mesa","La Mirada","La Palma","La Puente","La Quinta","La Verne","Lafayette",
  "Laguna Beach","Laguna Hills","Laguna Niguel","Laguna Woods","Lake Elsinore","Lake Forest","Lakeport",
  "Lakewood","Lancaster","Larkspur","Lathrop","Lawndale","Lemon Grove","Lemoore","Lincoln","Lindsay","Live Oak",
  "Livermore","Livingston","Lodi","Loma Linda","Lomita","Lompoc","Long Beach","Loomis","Los Alamitos","Los Altos",
  "Los Altos Hills","Los Angeles","Los Banos","Los Gatos","Loyalton","Lynwood","Madera","Malibu","Mammoth Lakes",
  "Manhattan Beach","Manteca","Maricopa","Marina","Martinez","Marysville","Maywood","McFarland","Mendota","Menifee",
  "Menlo Park","Merced","Mill Valley","Millbrae","Milpitas","Mission Viejo","Modesto","Monrovia","Montague",
  "Montclair","Monte Sereno","Montebello","Monterey","Monterey Park","Moorpark","Moraga","Moreno Valley",
  "Morgan Hill","Morro Bay","Mountain View","Murrieta","Napa","National City","Needles","Nevada City","Newark",
  "Newman","Newport Beach","Norco","Norwalk","Novato","Oakdale","Oakland","Oakley","Oceanside","Ojai","Ontario",
  "Orange","Orange Cove","Orinda","Orland","Oroville","Oxnard","Pacific Grove","Pacifica","Palm Desert",
  "Palm Springs","Palmdale","Palo Alto","Palos Verdes Estates","Paradise","Paramount","Parlier","Pasadena",
  "Paso Robles","Patterson","Perris","Petaluma","Pico Rivera","Piedmont","Pinole","Pismo Beach","Pittsburg",
  "Placentia","Placerville","Pleasant Hill","Pleasanton","Plymouth","Point Arena","Pomona","Port Hueneme",
  "Porterville","Poway","Rancho Cordova","Rancho Cucamonga","Rancho Mirage","Rancho Palos Verdes",
  "Rancho Santa Margarita","Red Bluff","Redding","Redlands","Redondo Beach","Redwood City","Reedley","Rialto",
  "Richmond","Ridgecrest","Rio Dell","Rio Vista","Ripon","Riverbank","Riverside","Rocklin","Rohnert Park",
  "Rolling Hills","Rolling Hills Estates","Rosemead","Roseville","Ross","Sacramento","Salinas","San Anselmo",
  "San Bernardino","San Bruno","San Carlos","San Clemente","San Diego","San Dimas","San Fernando","San Francisco",
  "San Gabriel","San Jacinto","San Joaquin","San Jose","San Juan Bautista","San Juan Capistrano","San Leandro",
  "San Luis Obispo","San Marcos","San Marino","San Mateo","San Pablo","San Rafael","San Ramon","Sand City",
  "Sanger","Santa Ana","Santa Barbara","Santa Clara","Santa Clarita","Santa Cruz","Santa Fe Springs","Santa Maria",
  "Santa Monica","Santa Paula","Santa Rosa","Santee","Saratoga","Sausalito","Scotts Valley","Seal Beach","Seaside",
  "Sebastopol","Selma","Shafter","Shasta Lake","Sierra Madre","Signal Hill","Simi Valley","Solana Beach","Soledad",
  "Solvang","Sonoma","Sonora","South El Monte","South Gate","South Lake Tahoe","South Pasadena","South San Francisco",
  "Stanton","Stockton","Suisun City","Sunnyvale","Susanville","Sutter Creek","Taft","Tehachapi","Tehama","Temecula",
  "Temple City","Thousand Oaks","Tiburon","Torrance","Tracy","Trinidad","Truckee","Tulare","Turlock","Tustin",
  "Twentynine Palms","Ukiah","Union City","Upland","Vacaville","Vallejo","Ventura","Vernon","Victorville","Villa Park",
  "Visalia","Vista","Walnut","Walnut Creek","Wasco","Waterford","Watsonville","Weed","West Covina","West Hollywood",
  "West Sacramento","Westlake Village","Westminster","Westmorland","Wheatland","Whittier","Wildomar","Williams",
  "Willits","Willows","Windsor","Winters","Woodlake","Woodland","Yorba Linda","Yreka","Yuba City","Yucaipa",
  "Yucca Valley",
  ...LA_COMMUNITIES,
])].sort();

// City-specific residential zoning where dependable; everything else uses the generic set.
const ZONING_BY_CITY = {
  "Los Angeles": LA_RESIDENTIAL_ZONES,
  "Long Beach": ["R-1-N","R-1-S","R-1-L","R-2-N","R-2-S","R-2-I","R-3-S","R-3-T","R-4-N","R-4-R","R-4-U"],
  "Pasadena": ["RS-1","RS-2","RS-4","RS-6","RM-12","RM-16","RM-32","RM-48","RM-63"],
  "Glendale": ["R1R","R1","ROS","R-3050","R-2250","R-1650","R-1250"],
  "Burbank": ["R-1","R-1-H","R-2","R-3","R-4"],
  "Santa Monica": ["R1","R2","R3","R4","OP-1","OP-2","OP-3","OP-4","OPD"],
  "Beverly Hills": ["R-1","R-1.5X","R-1.8","R-3","R-4","R-4X","R-4X2","RMCP"],
  "San Diego": ["RS-1-1","RS-1-7","RS-1-14","RX-1-2","RM-1-1","RM-1-2","RM-2-4","RM-2-5","RM-3-7","RM-4-10"],
  "San Francisco": ["RH-1","RH-1(D)","RH-1(S)","RH-2","RH-3","RM-1","RM-2","RM-3","RM-4","RTO","RC-3","RC-4"],
};
LA_COMMUNITIES.forEach((c) => { ZONING_BY_CITY[c] = LA_RESIDENTIAL_ZONES; });

// residential zoning options for a given city (base set; merged with DB values in the form)
function zoningOptionsForCity(city) {
  return ZONING_BY_CITY[city] || DEFAULT_RESIDENTIAL_ZONES;
}

/* ---------- sample project library (curated, high confidence) ------- */

const SAMPLE_PROJECTS = [];


/* ---------- helpers ------------------------------------------------ */

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
};
const fmt = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  return Number.isNaN(n) ? "—" : n.toLocaleString();
};
// Extracted data stores yes/no flags as strings ("Yes"/"No"), not booleans —
// a plain truthy check treats the string "No" as true, so this normalizes it.
const yn = (v) => v === true || (typeof v === "string" && /^(yes|y|true)$/i.test(v.trim()));

/* ---------- matching engine --------------------------------------- */

// numeric similarity 0..1 based on proportional difference
function nsim(a, b) {
  if (a == null || b == null) return null;
  if (a === 0 && b === 0) return 1;
  const m = Math.max(Math.abs(a), Math.abs(b));
  if (m === 0) return 1;
  return Math.max(0, 1 - Math.abs(a - b) / m);
}
// banded numeric similarity — within 5% counts as a full match, then falls off
function bsim(a, b) {
  if (a == null || b == null) return null;
  if (a === 0 && b === 0) return 1;
  const m = Math.max(Math.abs(a), Math.abs(b));
  if (m === 0) return 1;
  const diff = Math.abs(a - b) / m;
  if (diff <= 0.05) return 1;                       // within 5% = perfect
  return Math.max(0, 1 - (diff - 0.05) / 0.45);     // reaches 0 at ~50% off
}
// count similarity (beds, baths, stories, garage) — off-by-one stays strong
function csim(a, b) {
  if (a == null || b == null) return null;
  const d = Math.abs(a - b);
  if (d === 0) return 1;
  if (d === 1) return 0.75;
  if (d === 2) return 0.4;
  if (d === 3) return 0.15;
  return 0;
}
const pct = (x) => Math.round(x * 100);

// average only the specified sub-scores; report whether the component is active
function comp(parts) {
  const v = parts.filter((x) => x != null);
  if (!v.length) return { active: false, score: null };
  return { active: true, score: v.reduce((s, x) => s + x, 0) / v.length };
}
const avg = (arr) => {
  const v = arr.filter((x) => x != null);
  if (!v.length) return null;
  return v.reduce((s, x) => s + x, 0) / v.length;
};

const WEIGHTS = {
  lot: 0.22, house: 0.14, footprint: 0.08, storiesBasement: 0.13,
  bedBath: 0.13, garageAdu: 0.09, style: 0.04, poolSpecial: 0.09, location: 0.08,
};

// zoning similarity: exact > same zone family (R1 vs R1) > same first letter > different
function zoneFamily(z) { return (String(z || "").toUpperCase().match(/^[A-Z]+\d*/) || [""])[0]; }
function zoningSim(a, b) {
  const A = String(a || "").toUpperCase().trim(), B = String(b || "").toUpperCase().trim();
  if (!A || !B) return null;
  if (A === B) return 1;
  if (zoneFamily(A) && zoneFamily(A) === zoneFamily(B)) return 0.6;
  if (A[0] === B[0]) return 0.3;
  return 0.2;
}

function scoreProject(q, p) {
  // ---- lot dimensions (25%) ----
  const areaSim = bsim(num(q.lotArea), num(p.lotArea));
  const widthSim = bsim(num(q.lotWidth), num(p.lotWidth));
  const depthSim = bsim(num(q.lotDepth), num(p.lotDepth));
  const shapeMatch = q.lotShape ? (q.lotShape === p.lotShape ? 1 : 0.5) : null;
  const siteMatch = q.siteCondition ? (q.siteCondition === p.siteCondition ? 1 : 0.45) : null;
  const lotDimSub = avg([widthSim, depthSim, shapeMatch, siteMatch]);
  const lot = comp([areaSim, widthSim, depthSim, shapeMatch, siteMatch]);

  // ---- house size (14%) ----
  const houseSim = bsim(num(q.houseSqft), num(p.houseSqft));
  const house = comp([houseSim]);

  // ---- building footprint W×D (8%) ----
  const bWidthSim = bsim(num(q.buildingWidth), num(p.buildingWidth));
  const bDepthSim = bsim(num(q.buildingDepth), num(p.buildingDepth));
  const footprint = comp([bWidthSim, bDepthSim]);

  // ---- location & zoning (8%) ----
  const norm = (s) => String(s || "").trim().toLowerCase();
  const cityMatch = q.city ? (norm(q.city) === norm(p.city) ? 1 : 0.3) : null;
  const zoningMatch = q.zoning ? zoningSim(q.zoning, p.zoning) : null;
  const location = comp([cityMatch, zoningMatch]);

  // ---- stories + basement (15%) ----
  const storiesSim = csim(num(q.stories), num(p.stories));
  const pHasBasement = num(p.basementArea) > 0;
  const basementMatch = q.basementRequired === "" || q.basementRequired == null
    ? null
    : ((q.basementRequired === "yes") === pHasBasement ? 1 : 0);
  const storiesBasement = comp([storiesSim, basementMatch]);

  // ---- beds + baths (15%) ----
  const bedSim = csim(num(q.bedrooms), num(p.bedrooms));
  const bathSim = csim(num(q.bathrooms), num(p.bathrooms));
  const bedBath = comp([bedSim, bathSim]);

  // ---- garage + ADU (10%) ----
  const garageTypeMatch = q.garageType ? (q.garageType === p.garageType ? 1 : 0) : null;
  const garageSpacesSim = csim(num(q.garageSpaces), num(p.garageSpaces));
  const garageOrientMatch = q.garageOrientation
    ? (q.garageOrientation === p.garageOrientation ? 1 : 0.4) : null;
  const aduMatch = q.aduRequired === "" || q.aduRequired == null
    ? null
    : ((q.aduRequired === "yes") === yn(p.aduAvailable) ? 1 : 0);
  const garageAdu = comp([garageTypeMatch, garageSpacesSim, garageOrientMatch, aduMatch]);

  // ---- style (5%) ----
  const styleSub = q.style ? (q.style === p.style ? 1 : 0.4) : null;
  const style = comp([styleSub]);

  // ---- pool, spa, roof deck + special rooms (10%) ----
  const poolMatch = q.poolRequired === "" || q.poolRequired == null
    ? null
    : ((q.poolRequired === "yes") === yn(p.pool) ? 1 : 0);
  const spaMatch = q.spaRequired === "" || q.spaRequired == null
    ? null
    : ((q.spaRequired === "yes") === yn(p.spa) ? 1 : 0);
  const roofDeckMatch = q.roofDeckRequired === "" || q.roofDeckRequired == null
    ? null
    : ((q.roofDeckRequired === "yes") === yn(p.roofDeck) ? 1 : 0);
  const have = new Set(p.specialRooms || []);
  const reqRooms = Object.keys(q.specialRooms || {}).filter((r) => q.specialRooms[r] === "req");
  const niceRooms = Object.keys(q.specialRooms || {}).filter((r) => q.specialRooms[r] === "nice");
  const reqMatched = reqRooms.filter((r) => have.has(r));
  const niceMatched = niceRooms.filter((r) => have.has(r));
  const reqFrac = reqRooms.length ? reqMatched.length / reqRooms.length : null;
  const niceFrac = niceRooms.length ? niceMatched.length / niceRooms.length : null;
  let specialSub = null;
  if (reqFrac != null && niceFrac != null) specialSub = 0.7 * reqFrac + 0.3 * niceFrac;
  else if (reqFrac != null) specialSub = reqFrac;                 // required: missing hurts
  else if (niceFrac != null) specialSub = 0.5 + 0.5 * niceFrac;   // nice-to-have: only adds, never below neutral
  const poolSpecial = comp([poolMatch, spaMatch, roofDeckMatch, specialSub]);

  // ---- weighted overall, renormalized over the criteria you specified ----
  const components = [
    ["lot", lot], ["house", house], ["footprint", footprint], ["storiesBasement", storiesBasement],
    ["bedBath", bedBath], ["garageAdu", garageAdu], ["style", style],
    ["poolSpecial", poolSpecial], ["location", location],
  ];
  let wsum = 0, acc = 0, activeGroups = 0;
  components.forEach(([k, c]) => {
    if (c.active) { wsum += WEIGHTS[k]; acc += WEIGHTS[k] * c.score; activeGroups++; }
  });
  const rawOverall = wsum > 0 ? acc / wsum : 0;

  // ---- hard transferability gates: structural dealbreakers cap the score ----
  // A plan that matches cosmetically but can't physically transfer should not rank high.
  let cap = 100;
  let capReason = null;
  const setCap = (c, why) => { if (c < cap) { cap = c; capReason = why; } };
  const siteRank = { Flat: 0, Sloped: 1, Hillside: 2 };
  if (q.siteCondition && p.siteCondition && q.siteCondition !== p.siteCondition) {
    const d = Math.abs((siteRank[q.siteCondition] ?? 0) - (siteRank[p.siteCondition] ?? 0));
    setCap(d >= 2 ? 68 : 84, `${p.siteCondition} site vs ${q.siteCondition} requested — foundation & grading redesign`);
  }
  if (num(q.stories) != null && num(p.stories) != null && num(q.stories) !== num(p.stories)) {
    const d = Math.abs(num(q.stories) - num(p.stories));
    setCap(d >= 2 ? 70 : 84, `${p.stories}-story plan vs ${q.stories}-story requested`);
  }
  if (q.basementRequired && q.basementRequired !== "" && (q.basementRequired === "yes") !== (num(p.basementArea) > 0)) {
    setCap(86, q.basementRequired === "yes" ? "no basement in this plan" : "plan includes a basement not requested");
  }

  const overall = Math.min(pct(rawOverall), cap);
  const capped = cap < 100 && pct(rawOverall) > cap;

  // footprint-fit: informational flag only (building/lot dims are often approximate), not a hard cap
  const bW = num(p.buildingWidth), bD = num(p.buildingDepth);
  const qW = num(q.lotWidth), qD = num(q.lotDepth);
  const footprintTight =
    (bW != null && qW != null && bW > qW) ? `footprint ~${bW} ft wide is wider than the ${qW} ft lot — check buildable width` :
    (bD != null && qD != null && bD > qD) ? `footprint ~${bD} ft deep exceeds the ${qD} ft lot depth — check buildable depth` : null;

  // ---- reasons & differences ----
  const reasons = [];
  const diffs = [];

  if (areaSim === 1) reasons.push("Lot area within 5%");
  else if (areaSim != null && areaSim > 0.85) reasons.push("Comparable lot area");
  if (widthSim != null && depthSim != null && widthSim > 0.85 && depthSim > 0.85)
    reasons.push("Similar lot width and depth");
  if (houseSim === 1) reasons.push("House size is within 5%");
  else if (houseSim != null && houseSim > 0.8) reasons.push("Comparable house square footage");
  if (bWidthSim != null && bDepthSim != null && bWidthSim > 0.85 && bDepthSim > 0.85)
    reasons.push("Building footprint is a close match");
  if (cityMatch === 1) reasons.push(`Same city (${p.city})`);
  if (zoningMatch === 1) reasons.push(`Same zoning (${p.zoning})`);
  else if (zoningMatch != null && zoningMatch >= 0.6) reasons.push(`Same zone family (${zoneFamily(p.zoning)})`);
  if (storiesSim === 1 && basementMatch === 1)
    reasons.push(`Same ${p.stories}-story ${pHasBasement ? "plus basement" : "configuration"}`);
  else if (storiesSim === 1) reasons.push(`Same ${p.stories}-story configuration`);
  if (garageSpacesSim === 1) reasons.push(`Same ${p.garageSpaces}-car ${String(p.garageType || "").toLowerCase()} garage`.trim());
  if (bedSim === 1) reasons.push("Same bedroom count");
  else if (bedSim != null && bedSim >= 0.75) reasons.push("Similar bedroom count");
  if (styleSub === 1) reasons.push(`Same architectural style (${p.style})`);
  if (reqMatched.length) reasons.push("Includes required " + reqMatched.join(", ").toLowerCase());
  if (niceMatched.length) reasons.push("Also has " + niceMatched.join(", ").toLowerCase() + " (nice to have)");
  if (aduMatch === 1 && yn(p.aduAvailable)) reasons.push(`Includes an ADU (${fmt(p.aduSize)} sf)`);
  if (poolMatch === 1 && yn(p.pool)) reasons.push("Includes a pool");

  if (q.siteCondition && q.siteCondition !== p.siteCondition)
    diffs.push(`Existing project is on a ${String(p.siteCondition).toLowerCase()} lot`);
  if (q.garageOrientation && q.garageOrientation !== p.garageOrientation)
    diffs.push(`Garage is oriented to the ${String(p.garageOrientation).toLowerCase()}`);
  if (q.lotShape && q.lotShape !== p.lotShape)
    diffs.push(`Lot shape differs (${p.lotShape})`);
  if (houseSim != null && houseSim < 0.85)
    diffs.push(`House size differs (${fmt(p.houseSqft)} sf vs ${fmt(q.houseSqft)} sf requested)`);
  if (storiesSim != null && storiesSim < 1)
    diffs.push(`${p.stories}-story rather than ${q.stories}-story`);
  if (aduMatch === 0)
    diffs.push(yn(p.aduAvailable) ? "Has an ADU not requested" : "No ADU — would need to be added");
  if (basementMatch === 0)
    diffs.push(pHasBasement ? "Has a basement not requested" : "No basement — would need to be added");
  if (bedSim != null && bedSim < 1)
    diffs.push(`Bedroom count differs (${p.bedrooms} vs ${q.bedrooms})`);
  const reqMissing = reqRooms.filter((r) => !have.has(r));
  if (reqMissing.length)
    diffs.push(`Missing required ${reqMissing.join(", ").toLowerCase()} — would need to be added`);
  if (q.city && cityMatch !== 1)
    diffs.push(`Different city (${p.city})`);
  if (q.zoning && zoningMatch != null && zoningMatch < 0.6)
    diffs.push(`Different zoning (${p.zoning} vs ${q.zoning} requested)`);
  if (bWidthSim != null && bWidthSim < 0.8)
    diffs.push(`Footprint width differs (${fmt(p.buildingWidth)} ft vs ${fmt(q.buildingWidth)} ft requested)`);
  if (bDepthSim != null && bDepthSim < 0.8)
    diffs.push(`Footprint depth differs (${fmt(p.buildingDepth)} ft vs ${fmt(q.buildingDepth)} ft requested)`);
  if (footprintTight) diffs.push(footprintTight);
  if (garageTypeMatch === 0) diffs.push(`${p.garageType} garage rather than ${q.garageType} requested`);
  if (roofDeckMatch === 0) diffs.push(yn(p.roofDeck) ? "Has a roof deck (not requested)" : "No roof deck (one was requested)");
  if (spaMatch === 0) diffs.push(yn(p.spa) ? "Has a spa (not requested)" : "No spa (one was requested)");
  if (!reasons.length) reasons.push("Closest available match on the weighted criteria");
  if (capped && capReason) diffs.unshift(`Dealbreaker — ${capReason}`);

  return {
    overall,
    rawOverall: pct(rawOverall),
    capped,
    capReason,
    activeGroups,
    breakdown: {
      lotSize: areaSim == null ? null : pct(areaSim),
      lotDimension: lotDimSub == null ? null : pct(lotDimSub),
      houseSize: house.active ? pct(house.score) : null,
      footprint: footprint.active ? pct(footprint.score) : null,
      bedBath: bedBath.active ? pct(bedBath.score) : null,
      garage: (garageSpacesSim == null && garageOrientMatch == null) ? null : pct(avg([garageSpacesSim, garageOrientMatch])),
      basementAdu: (basementMatch == null && aduMatch == null) ? null : pct(avg([basementMatch, aduMatch])),
      style: style.active ? pct(style.score) : null,
      special: poolSpecial.active ? pct(poolSpecial.score) : null,
      location: location.active ? pct(location.score) : null,
    },
    reasons: reasons.slice(0, 8),
    diffs: diffs.slice(0, 7),
  };
}

/* ================================================================== *
 *  UI
 * ================================================================== */

const CONF_META = {
  high:   { label: "High confidence",  color: "var(--ok)",   short: "High" },
  medium: { label: "Medium confidence",color: "var(--warn)", short: "Medium" },
  low:    { label: "Needs verification",color: "var(--bad)", short: "Verify" },
};

function ConfDot({ level }) {
  const m = CONF_META[level] || CONF_META.high;
  return (
    <span className="confdot" title={m.label}>
      <span className="confdot__dot" style={{ background: m.color }} />
    </span>
  );
}

function Field({ label, value, conf, mono }) {
  return (
    <div className="field">
      <div className="field__label">
        {label}
        {conf && conf !== "high" && <ConfDot level={conf} />}
      </div>
      <div className={"field__value" + (mono ? " mono" : "")}>{value}</div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("database");
  const [projects, setProjects] = useState(null); // null = loading
  const [storageOk, setStorageOk] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const skipNextPersist = useRef(true);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      const mapped = data.map((p) => ({ ...p, id: p.id || p._id }));
      skipNextPersist.current = true; // a fetched snapshot shouldn't be written straight back
      setProjects(mapped);
      setStorageOk(true);
    } catch (e) {
      setStorageOk(false);
      setProjects((prev) => prev ?? SAMPLE_PROJECTS);
    }
  }, []);

  // load from MongoDB on mount
  useEffect(() => { (async () => { await loadProjects(); })(); }, [loadProjects]);

  const sendPlanFile = useCallback(async (file) => {
    if (!WEBHOOK_URL || !file) return;
    setIsUploading(true);
    setUploadError("");
    setView("database");
    try {
      const form = new FormData();
      form.append("filename", file.name);
      form.append("file", file, file.name);
      const res = await fetch(WEBHOOK_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadProjects();
    } catch (err) {
      setUploadError(err.message || "Send failed");
    } finally {
      setIsUploading(false);
    }
  }, [loadProjects]);

  // persist to MongoDB
  useEffect(() => {
    if (projects == null) return;
    if (skipNextPersist.current) { skipNextPersist.current = false; return; }
    (async () => {
      try {
        const res = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projects),
        });
        if (!res.ok) throw new Error("request failed");
        setStorageOk(true);
      } catch (e) {
        setStorageOk(false);
      }
    })();
  }, [projects]);

  const list = projects || [];

  return (
    <div className="app">
      <style>{CSS}</style>

      <header className="topbar">
        <div className="brand">
          <div className="brand__mark"><Layers size={18} /></div>
          <div>
            <div className="brand__name">Completed Project Plan Finder</div>
            <div className="brand__sub">Approved plan-set reference · residential design-build</div>
          </div>
        </div>
      </header>

      <main className="main">
        {projects == null ? (
          <div className="loading">Loading project library…</div>
        ) : view === "database" ? (
          <DatabaseView projects={list} setProjects={setProjects} go={setView} storageOk={storageOk} isUploading={isUploading} uploadError={uploadError} view={view} loadProjects={loadProjects} />
        ) : view === "upload" ? (
          <UploadView onSend={sendPlanFile} isUploading={isUploading} uploadError={uploadError} go={setView} view={view} loadProjects={loadProjects} />
        ) : (
          <SearchView projects={list} go={setView} view={view} isUploading={isUploading} loadProjects={loadProjects} />
        )}
      </main>

      <footer className="foot">
        {!storageOk && <span className="foot__warn">Persistent storage unavailable in this preview — records are kept in memory for this session only.</span>}
      </footer>
    </div>
  );
}

function NavButtons({ view, go, isUploading, loadProjects }) {
  return (
    <nav className="nav">
      <button className={"nav__btn" + (view === "database" ? " is-active" : "")} onClick={() => { go("database"); loadProjects(); }}>
        <Database size={15} /> Projects
      </button>
      <button
        className={"nav__btn" + (view === "upload" ? " is-active" : "")}
        onClick={() => go("upload")}
        disabled={isUploading}
        title={isUploading ? "A plan set is still processing" : undefined}
      >
        <Upload size={15} /> Upload Plans
      </button>
      <button className={"nav__btn" + (view === "search" ? " is-active" : "")} onClick={() => go("search")}>
        <Search size={15} /> Find Similar Project
      </button>
    </nav>
  );
}

/* ------------------------------- Database --------------------------- */

function DatabaseView({ projects, setProjects, go, storageOk, isUploading, uploadError, view, loadProjects }) {
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const [dialog, setDialog] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.projectName, p.address, p.jobNumber, p.apn, p.city, p.style, p.zoning, p.fileName]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [projects, query]);

  // keep selection in sync if projects change underneath it
  useEffect(() => {
    setSelected((sel) => {
      const ids = new Set(projects.map((p) => p.id));
      const next = new Set([...sel].filter((id) => ids.has(id)));
      return next.size === sel.size ? sel : next;
    });
  }, [projects]);

  const toggleOne = (id) =>
    setSelected((sel) => {
      const next = new Set(sel);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filteredIds = filtered.map((p) => p.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));
  const someFilteredSelected = filteredIds.some((id) => selected.has(id));

  const toggleAllFiltered = () =>
    setSelected((sel) => {
      const next = new Set(sel);
      if (allFilteredSelected) filteredIds.forEach((id) => next.delete(id));
      else filteredIds.forEach((id) => next.add(id));
      return next;
    });

  const clearSelection = () => setSelected(new Set());

  const remove = (id) => {
    const p = projects.find((x) => x.id === id);
    setDialog({
      title: "Delete project",
      message: `Delete “${p ? p.projectName : "this project"}” from the database? This can't be undone.`,
      actions: [
        { label: "Cancel", kind: "ghost" },
        { label: "Delete", kind: "danger", icon: <Trash2 size={15} />, onClick: () => setProjects((ps) => ps.filter((x) => x.id !== id)) },
      ],
    });
  };

  const deleteSelected = () => {
    const n = selected.size;
    if (!n) return;
    setDialog({
      title: "Delete selected projects",
      message: `Delete ${n} selected project${n > 1 ? "s" : ""} from the database? This can't be undone.`,
      actions: [
        { label: "Cancel", kind: "ghost" },
        { label: `Delete ${n}`, kind: "danger", icon: <Trash2 size={15} />, onClick: () => { setProjects((ps) => ps.filter((p) => !selected.has(p.id))); setSelected(new Set()); } },
      ],
    });
  };

  const saveEdit = (updated) => {
    setProjects((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
    setViewing(updated);
  };

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <div className="eyebrow">Drawing index</div>
          <h1 className="h1">Projects</h1>
        </div>
        <NavButtons view={view} go={go} isUploading={isUploading} loadProjects={loadProjects} />
      </div>

      {isUploading && (
        <div className="sim-banner"><Sparkles size={15} /><div>Processing uploaded plan set — this may take a moment…</div></div>
      )}
      {!isUploading && uploadError && (
        <div className="sim-banner"><AlertTriangle size={15} /><div>Upload failed: {uploadError}</div></div>
      )}

      <div className="searchbar">
        <Search size={16} />
        <input
          placeholder="Search by name, address, job no., APN, city, style…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && <button className="searchbar__clear" onClick={() => setQuery("")}><X size={14} /></button>}
      </div>

      {selected.size > 0 && (
        <div className="bulkbar">
          <span className="bulkbar__count">{selected.size} selected</span>
          <div className="bulkbar__actions">
            <button className="btn btn--ghost" onClick={clearSelection}>Clear</button>
            <button className="btn btn--danger" onClick={deleteSelected}><Trash2 size={15} /> Delete selected</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty">
          <FileText size={28} />
          <p>{projects.length === 0 ? "No projects yet — upload an approved plan set to begin." : "No projects match your search."}</p>
          {projects.length === 0 && <button className="btn" onClick={() => go("upload")}><Upload size={15} /> Upload plans</button>}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="check-col">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allFilteredSelected}
                    ref={(el) => { if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected; }}
                    onChange={toggleAllFiltered}
                  />
                </th>
                <th>Project</th>
                <th>City</th>
                <th className="num">Lot&nbsp;area</th>
                <th className="num">House&nbsp;sf</th>
                <th className="num">Bd/Ba</th>
                <th className="ta-c">Stories</th>
                <th>Style</th>
                <th className="ta-r">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={selected.has(p.id) ? "is-selected" : ""}>
                  <td className="check-col">
                    <input
                      type="checkbox"
                      aria-label={`Select ${p.projectName}`}
                      checked={selected.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                    />
                  </td>
                  <td>
                    <div className="cell-name">
                      {p.projectName}
                      {p.simulated && <span className="pill pill--sim">simulated</span>}
                    </div>
                  </td>
                  <td>{p.city || "—"}</td>
                  <td className="num mono">{fmt(p.lotArea)}</td>
                  <td className="num mono">{fmt(p.houseSqft)}</td>
                  <td className="num mono">{fmt(p.bedrooms)}/{fmt(p.bathrooms)}</td>
                  <td className="ta-c mono">{fmt(p.stories)}</td>
                  <td>{p.style || "—"}</td>
                  <td className="ta-r">
                    <div className="rowbtns">
                      <button className="iconbtn" title="View" onClick={() => setViewing(p)}><Eye size={15} /></button>
                      <button className="iconbtn" title="Edit" onClick={() => setEditing(p)}><Pencil size={15} /></button>
                      <button className="iconbtn iconbtn--danger" title="Delete" onClick={() => remove(p.id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && !editing && (
        <ProjectModal project={viewing} onClose={() => setViewing(null)} onEdit={() => setEditing(viewing)} />
      )}
      {editing && (
        <EditModal project={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      )}
      <ConfirmDialog dialog={dialog} onClose={() => setDialog(null)} />
    </section>
  );
}

/* ----------------------------- View modal --------------------------- */

function ProjectModal({ project: p, onClose, onEdit }) {
  return (
    <Modal onClose={onClose} title={p.projectName} subtitle={p.address}
      headerExtra={p.simulated && <span className="pill pill--sim">simulated extraction</span>}
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Close</button>
        <button className="btn" onClick={onEdit}><Pencil size={15} /> Edit</button>
      </>}>
      <ProjectDetails p={p} />
    </Modal>
  );
}

function ProjectDetails({ p }) {
  return (
    <>
      <div className="legend">
        <span><span className="confdot__dot" style={{ background: "var(--warn)" }} /> Medium confidence</span>
        <span><span className="confdot__dot" style={{ background: "var(--bad)" }} /> Needs verification</span>
        <span className="legend__note">Fields without a dot are high confidence.</span>
      </div>

      <Group icon={<FileText size={14} />} title="Identification">
        <Field label="APN" value={p.apn || "—"} conf={p.confidence?.apn} mono />
        <Field label="City" value={p.city || "—"} conf={p.confidence?.city} />
        <Field label="Jurisdiction" value={p.jurisdiction || "—"} conf={p.confidence?.jurisdiction} />
        <Field label="Zoning" value={p.zoning || "—"} conf={p.confidence?.zoning} mono />
        <Field label="Approval date" value={p.approvalDate || "—"} conf={p.confidence?.approvalDate} mono />
        <Field label="Source file" value={p.fileName} mono />
      </Group>

      <Group icon={<MapPin size={14} />} title="Site & lot">
        <Field label="Lot area (sf)" value={fmt(p.lotArea)} conf={p.confidence?.lotArea} mono />
        <Field label="Lot width (ft)" value={fmt(p.lotWidth)} conf={p.confidence?.lotWidth} mono />
        <Field label="Lot depth (ft)" value={fmt(p.lotDepth)} conf={p.confidence?.lotDepth} mono />
        <Field label="Lot shape" value={p.lotShape || "—"} conf={p.confidence?.lotShape} />
      </Group>

      <Group icon={<Home size={14} />} title="Building">
        <Field label="House (sf)" value={fmt(p.houseSqft)} conf={p.confidence?.houseSqft} mono />
        <Field label="First floor (sf)" value={fmt(p.firstFloorArea)} conf={p.confidence?.firstFloorArea} mono />
        <Field label="Second floor (sf)" value={fmt(p.secondFloorArea)} conf={p.confidence?.secondFloorArea} mono />
        <Field label="Basement (sf)" value={fmt(p.basementArea)} conf={p.confidence?.basementArea} mono />
        <Field label="Stories" value={fmt(p.stories)} conf={p.confidence?.stories} mono />
        <Field label="Building width (ft)" value={fmt(p.buildingWidth)} conf={p.confidence?.buildingWidth} mono />
        <Field label="Building depth (ft)" value={fmt(p.buildingDepth)} conf={p.confidence?.buildingDepth} mono />
        <Field label="Bedrooms" value={fmt(p.bedrooms)} conf={p.confidence?.bedrooms} mono />
        <Field label="Bathrooms" value={fmt(p.bathrooms)} conf={p.confidence?.bathrooms} mono />
        <Field label="Architectural style" value={p.style || "—"} conf={p.confidence?.style} />
      </Group>

      <Group icon={<Car size={14} />} title="Garage, ADU & amenities">
        <Field label="Garage type" value={p.garageType || "—"} conf={p.confidence?.garageType} />
        <Field label="Garage spaces" value={fmt(p.garageSpaces)} conf={p.confidence?.garageSpaces} mono />
        <Field label="Garage orientation" value={p.garageOrientation || "—"} conf={p.confidence?.garageOrientation} />
        <Field label="ADU" value={yn(p.aduAvailable) ? "Yes" : "No"} conf={p.confidence?.aduAvailable} />
        <Field label="ADU size (sf)" value={yn(p.aduAvailable) ? fmt(p.aduSize) : "—"} conf={p.confidence?.aduSize} mono />
        <Field label="Roof deck" value={yn(p.roofDeck) ? "Yes" : "No"} conf={p.confidence?.roofDeck} />
        <Field label="Pool" value={yn(p.pool) ? "Yes" : "No"} conf={p.confidence?.pool} />
        <Field label="Spa" value={yn(p.spa) ? "Yes" : "No"} conf={p.confidence?.spa} />
        <Field label="Special rooms" value={(p.specialRooms && p.specialRooms.length) ? p.specialRooms.join(", ") : "—"} />
      </Group>

      <BuildingByFloor p={p} />
    </>
  );
}

// The extraction pipeline stores per-floor data under `roomsByFloor`
// (firstFloor/secondFloor/basement/adu/other), independent of the
// basement/first/second/third/adu keys used by the edit form below.
const BUILDING_FLOOR_ORDER = ["basement", "firstFloor", "secondFloor", "other", "adu"];
const BUILDING_FLOOR_LABELS = { basement: "Basement", firstFloor: "First floor", secondFloor: "Second floor", other: "Other", adu: "ADU" };
const BUILDING_FLOOR_AREA_FIELD = { basement: "basementArea", firstFloor: "firstFloorArea", secondFloor: "secondFloorArea" };

function BuildingByFloor({ p }) {
  const roomsByFloor = p.roomsByFloor || {};
  const floors = BUILDING_FLOOR_ORDER
    .map((k) => ({
      key: k,
      area: k === "adu" ? (yn(p.aduAvailable) ? num(p.aduSize) : null) : num(p[BUILDING_FLOOR_AREA_FIELD[k]]),
      rooms: Array.isArray(roomsByFloor[k]) ? roomsByFloor[k] : [],
    }))
    .filter((f) => (f.area != null && f.area > 0) || f.rooms.length > 0);
  if (!floors.length) return null;
  const totalArea = floors.reduce((n, f) => n + (f.area || 0), 0);
  return (
    <div className="group">
      <div className="group__title">
        <Layers size={14} /> Building per floor{totalArea > 0 ? ` · ${fmt(totalArea)} sf total` : ""}
      </div>
      <div className="floors">
        {floors.map((f) => (
          <div key={f.key} className="floor">
            <div className="floor__head">
              {BUILDING_FLOOR_LABELS[f.key]}
              {f.area != null && <span className="floor__count">{fmt(f.area)} sf</span>}
            </div>
            {f.rooms.length > 0 && (
              <div className="floor__rooms">
                {f.rooms.map((r, i) => <span key={i} className="roomtag">{r}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Group({ icon, title, children }) {
  return (
    <div className="group">
      <div className="group__title">{icon} {title}</div>
      <div className="group__grid">{children}</div>
    </div>
  );
}

/* ----------------------------- Edit modal --------------------------- */

const NUM_FIELDS = [
  "lotArea", "lotWidth", "lotDepth", "houseSqft", "firstFloorArea",
  "secondFloorArea", "basementArea", "stories", "buildingWidth", "buildingDepth",
  "garageSpaces", "aduSize", "bedrooms", "bathrooms",
];

const EDIT_FLOOR_LABELS = { basement: "Basement", first: "First floor", second: "Second floor", third: "Third floor", adu: "ADU" };

function EditModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(project)));

  // editing a field marks it verified (high confidence)
  const set = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: value,
      confidence: { ...(f.confidence || {}), [field]: "high" },
    }));

  const toggleRoom = (room) =>
    setForm((f) => {
      const has = (f.specialRooms || []).includes(room);
      return { ...f, specialRooms: has ? f.specialRooms.filter((r) => r !== room) : [...(f.specialRooms || []), room] };
    });

  const renderIn = ({ field, label, type = "text", options }) => {
    const verified = form.confidence?.[field] === "high";
    const needs = form.confidence?.[field] && form.confidence[field] !== "high";
    return (
      <label className="inp">
        <span className="inp__label">
          {label}
          {needs && <ConfDot level={form.confidence[field]} />}
          {verified && project.confidence?.[field] && project.confidence[field] !== "high" &&
            <span className="verified"><Check size={11} /> verified</span>}
        </span>
        {options ? (
          <select value={form[field] ?? ""} onChange={(e) => set(field, e.target.value)}>
            <option value="">—</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={form[field] ?? ""}
            onChange={(e) => set(field, type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
          />
        )}
      </label>
    );
  };

  return (
    <Modal onClose={onClose} title="Edit project" subtitle={form.fileName}
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={() => onSave(form)}><Check size={15} /> Save changes</button>
      </>}>
      <p className="edit-note">Editing a field marks it as verified.</p>

      <div className="group">
        <div className="group__title"><FileText size={14} /> Identification</div>
        <div className="group__grid edit-grid">
          {renderIn({ field: "projectName", label: "Project name" })}
          {renderIn({ field: "address", label: "Address" })}
          {renderIn({ field: "jobNumber", label: "Job number" })}
          {renderIn({ field: "apn", label: "APN" })}
          {renderIn({ field: "city", label: "City" })}
          {renderIn({ field: "jurisdiction", label: "Jurisdiction" })}
          {renderIn({ field: "zoning", label: "Zoning" })}
          {renderIn({ field: "approvalDate", label: "Approval date", type: "date" })}
        </div>
      </div>

      <div className="group">
        <div className="group__title"><MapPin size={14} /> Site & lot</div>
        <div className="group__grid edit-grid">
          {renderIn({ field: "lotArea", label: "Lot area (sf)", type: "number" })}
          {renderIn({ field: "lotWidth", label: "Lot width (ft)", type: "number" })}
          {renderIn({ field: "lotDepth", label: "Lot depth (ft)", type: "number" })}
          {renderIn({ field: "lotShape", label: "Lot shape", options: LOT_SHAPES })}
          {renderIn({ field: "siteCondition", label: "Site condition", options: SITE_CONDITIONS })}
        </div>
      </div>

      <div className="group">
        <div className="group__title"><Home size={14} /> Building</div>
        <div className="group__grid edit-grid">
          {renderIn({ field: "houseSqft", label: "House (sf)", type: "number" })}
          {renderIn({ field: "firstFloorArea", label: "First floor (sf)", type: "number" })}
          {renderIn({ field: "secondFloorArea", label: "Second floor (sf)", type: "number" })}
          {renderIn({ field: "basementArea", label: "Basement (sf)", type: "number" })}
          {renderIn({ field: "stories", label: "Stories", type: "number" })}
          {renderIn({ field: "buildingWidth", label: "Building width (ft)", type: "number" })}
          {renderIn({ field: "buildingDepth", label: "Building depth (ft)", type: "number" })}
          {renderIn({ field: "bedrooms", label: "Bedrooms", type: "number" })}
          {renderIn({ field: "bathrooms", label: "Bathrooms", type: "number" })}
          {renderIn({ field: "style", label: "Architectural style", options: STYLES })}
        </div>
      </div>

      <div className="group">
        <div className="group__title"><Car size={14} /> Garage, ADU & amenities</div>
        <div className="group__grid edit-grid">
          {renderIn({ field: "garageType", label: "Garage type", options: ["Attached", "Detached", "Carport", "None"] })}
          {renderIn({ field: "garageSpaces", label: "Garage spaces", type: "number" })}
          {renderIn({ field: "garageOrientation", label: "Garage orientation", options: GARAGE_ORIENT })}
        </div>
        <div className="checks">
          <label className="chk"><input type="checkbox" checked={yn(form.aduAvailable)} onChange={(e) => set("aduAvailable", e.target.checked)} /> ADU available</label>
          {yn(form.aduAvailable) && <label className="inp inp--inline"><span className="inp__label">ADU size (sf)</span><input type="number" value={form.aduSize ?? ""} onChange={(e) => set("aduSize", e.target.value === "" ? "" : Number(e.target.value))} /></label>}
          <label className="chk"><input type="checkbox" checked={yn(form.roofDeck)} onChange={(e) => set("roofDeck", e.target.checked)} /> Roof deck</label>
          <label className="chk"><input type="checkbox" checked={yn(form.pool)} onChange={(e) => set("pool", e.target.checked)} /> Pool</label>
          <label className="chk"><input type="checkbox" checked={yn(form.spa)} onChange={(e) => set("spa", e.target.checked)} /> Spa</label>
        </div>
        <div className="rooms">
          <div className="rooms__label">Special rooms</div>
          <div className="rooms__grid">
            {SPECIAL_ROOMS.map((r) => (
              <label key={r} className={"roomchip" + ((form.specialRooms || []).includes(r) ? " is-on" : "")}>
                <input type="checkbox" checked={(form.specialRooms || []).includes(r)} onChange={() => toggleRoom(r)} />
                {r}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="group">
        <div className="group__title"><Layers size={14} /> Rooms by floor</div>
        <p className="edit-note" style={{ marginTop: 0 }}>One room per line, or comma-separated. Leave a floor blank if it doesn't apply.</p>
        <div className="floors-edit">
          {["basement", "first", "second", "third", "adu"].map((k) => (
            <label key={k} className="inp">
              <span className="inp__label">{EDIT_FLOOR_LABELS[k]}</span>
              <textarea
                rows={3}
                value={((form.rooms && form.rooms[k]) || []).join("\n")}
                onChange={(e) => setForm((f) => ({
                  ...f,
                  rooms: { ...(f.rooms || {}), [k]: e.target.value.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean) },
                }))}
              />
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------- Upload ----------------------------- */

function UploadView({ onSend, isUploading, go, view, loadProjects }) {
  const [staged, setStaged] = useState(null); // File | null
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const accept = (fileList) => {
    const file = Array.from(fileList).find((f) => /\.pdf$/i.test(f.name));
    if (!file) return;
    setStaged(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    accept(e.dataTransfer.files);
  };

  const removeStaged = () => setStaged(null);

  const send = () => {
    if (!staged) return;
    onSend(staged);
    setStaged(null);
  };

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <div className="eyebrow">Intake</div>
          <h1 className="h1">Upload Approved Plans</h1>
          <p className="lede">Drop an approved PDF plan set and send it off for extraction.</p>
        </div>
        <NavButtons view={view} go={go} isUploading={isUploading} loadProjects={loadProjects} />
      </div>

      <div
        className={"dropzone" + (dragOver ? " is-over" : "")}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={26} />
        <div className="dropzone__title">{staged ? "Drop a PDF to replace it" : "Drop a PDF plan set here"}</div>
        <div className="dropzone__sub">or click to browse</div>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => { accept(e.target.files); e.target.value = ""; }} />
      </div>

      {staged && (
        <div className="staged">
          <div className="staged__head">
            <span className="cell-file mono"><FileText size={13} /> {staged.name}</span>
            <div className="staged__actions">
              <button className="btn btn--ghost" onClick={removeStaged}>Clear</button>
              <button
                className="btn"
                onClick={send}
                disabled={!WEBHOOK_URL || isUploading}
                title={!WEBHOOK_URL ? "NEXT_PUBLIC_WEBHOOK_URL is not configured" : undefined}
              >
                <Send size={15} /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------- Search ----------------------------- */

const blankQuery = {
  city: "", zoning: "",
  lotArea: "", lotWidth: "", lotDepth: "", lotShape: "", siteCondition: "",
  houseSqft: "", buildingWidth: "", buildingDepth: "", stories: "", basementRequired: "",
  bedrooms: "", bathrooms: "",
  garageType: "", garageSpaces: "", garageOrientation: "", aduRequired: "",
  roofDeckRequired: "", poolRequired: "", spaRequired: "",
  style: "", specialRooms: {},
};

function SearchView({ projects, go, view, isUploading, loadProjects }) {
  const [q, setQ] = useState(blankQuery);
  const [results, setResults] = useState(null);

  // Merge base reference lists with every distinct value detected in the database,
  // so anything that comes in on upload (or via editing) becomes a future search option.
  const merge = (base, vals) => [...new Set([...vals, ...base])];
  const dbCities = projects.map((p) => p.city).filter((c) => c && c !== "—");
  const cities = merge(CA_CITIES, dbCities).sort();
  const dbSpecial = projects.flatMap((p) => p.specialRooms || []).filter(Boolean);
  const specialRoomOptions = merge(SPECIAL_ROOMS, dbSpecial);
  const lotShapeOptions = merge(LOT_SHAPES, projects.map((p) => p.lotShape).filter(Boolean));
  const siteOptions = merge(SITE_CONDITIONS, projects.map((p) => p.siteCondition).filter(Boolean));
  const styleOptions = merge(STYLES, projects.map((p) => p.style).filter(Boolean));
  const garageTypeOptions = merge(["Attached", "Detached", "Carport", "None"], projects.map((p) => p.garageType).filter(Boolean));
  // zoning depends on the chosen city: city's base codes + any zonings seen for that city in the DB
  const dbZoningForCity = projects
    .filter((p) => !q.city || p.city === q.city)
    .map((p) => p.zoning).filter(Boolean);
  const zonings = merge(zoningOptionsForCity(q.city), dbZoningForCity);

  const set = (k, v) => setQ((s) => ({ ...s, [k]: v }));
  const toggleRoom = (r) =>
    setQ((s) => {
      const cur = s.specialRooms[r];
      const next = { ...s.specialRooms };
      if (!cur) next[r] = "req";
      else if (cur === "req") next[r] = "nice";
      else delete next[r];
      return { ...s, specialRooms: next };
    });

  const run = () => {
    const all = projects.map((p) => ({ project: p, ...scoreProject(q, p) }))
      .sort((a, b) => b.overall - a.overall);
    const qualified = all.filter((r) => r.overall >= 85);
    setResults({ shown: qualified, best: all[0] || null, total: all.length });
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <div className="eyebrow">Reference search</div>
          <h1 className="h1">Find Similar Project</h1>
          <p className="lede">Enter the new property's requirements. The system ranks the three closest approved projects using a transparent weighted score.</p>
        </div>
        <NavButtons view={view} go={go} isUploading={isUploading} loadProjects={loadProjects} />
      </div>

      {projects.length === 0 ? (
        <div className="empty">
          <FileText size={28} />
          <p>No projects in the database to compare against.</p>
          <button className="btn" onClick={() => go("upload")}><Upload size={15} /> Upload plans</button>
        </div>
      ) : (
        <>
          <div className="form">
            <FormGroup icon={<MapPin size={14} />} title="Location & zoning">
              <Sel label="City" value={q.city} onChange={(v) => setQ((s) => ({ ...s, city: v, zoning: "" }))} options={cities} />
              <Sel label="Zoning" value={q.zoning} onChange={(v) => set("zoning", v)} options={zonings} />
            </FormGroup>

            <FormGroup icon={<Ruler size={14} />} title="Lot">
              <Inp label="Lot area (sf)" type="number" value={q.lotArea} onChange={(v) => set("lotArea", v)} />
              <Inp label="Lot width (ft)" type="number" value={q.lotWidth} onChange={(v) => set("lotWidth", v)} />
              <Inp label="Lot depth (ft)" type="number" value={q.lotDepth} onChange={(v) => set("lotDepth", v)} />
              <Sel label="Lot shape" value={q.lotShape} onChange={(v) => set("lotShape", v)} options={lotShapeOptions} />
              <Sel label="Site condition" value={q.siteCondition} onChange={(v) => set("siteCondition", v)} options={siteOptions} />
            </FormGroup>

            <FormGroup icon={<Home size={14} />} title="House & building">
              <Inp label="House size (sf)" type="number" value={q.houseSqft} onChange={(v) => set("houseSqft", v)} />
              <Inp label="Building width (ft)" type="number" value={q.buildingWidth} onChange={(v) => set("buildingWidth", v)} />
              <Inp label="Building depth (ft)" type="number" value={q.buildingDepth} onChange={(v) => set("buildingDepth", v)} />
              <Inp label="Stories" type="number" value={q.stories} onChange={(v) => set("stories", v)} />
              <Sel label="Basement required" value={q.basementRequired} onChange={(v) => set("basementRequired", v)} options={["yes", "no"]} labels={{ yes: "Yes", no: "No" }} />
              <Inp label="Bedrooms" type="number" value={q.bedrooms} onChange={(v) => set("bedrooms", v)} />
              <Inp label="Bathrooms" type="number" value={q.bathrooms} onChange={(v) => set("bathrooms", v)} />
              <Sel label="Preferred style" value={q.style} onChange={(v) => set("style", v)} options={styleOptions} />
            </FormGroup>

            <FormGroup icon={<Car size={14} />} title="Garage, ADU & amenities">
              <Sel label="Garage type" value={q.garageType} onChange={(v) => set("garageType", v)} options={garageTypeOptions} />
              <Inp label="Garage spaces" type="number" value={q.garageSpaces} onChange={(v) => set("garageSpaces", v)} />
              <Sel label="Garage orientation" value={q.garageOrientation} onChange={(v) => set("garageOrientation", v)} options={GARAGE_ORIENT} />
              <Sel label="ADU required" value={q.aduRequired} onChange={(v) => set("aduRequired", v)} options={["yes", "no"]} labels={{ yes: "Yes", no: "No" }} />
              <Sel label="Roof deck required" value={q.roofDeckRequired} onChange={(v) => set("roofDeckRequired", v)} options={["yes", "no"]} labels={{ yes: "Yes", no: "No" }} />
              <Sel label="Pool required" value={q.poolRequired} onChange={(v) => set("poolRequired", v)} options={["yes", "no"]} labels={{ yes: "Yes", no: "No" }} />
              <Sel label="Spa required" value={q.spaRequired} onChange={(v) => set("spaRequired", v)} options={["yes", "no"]} labels={{ yes: "Yes", no: "No" }} />
            </FormGroup>

            <FormGroup icon={<Sparkles size={14} />} title="Special rooms" wide>
              <p className="rooms__hint">Tap a room once to mark it <strong>required</strong>, again for <strong>nice to have</strong>, again to clear. Required rooms count against a project when missing; nice-to-have rooms only add credit when present.</p>
              <div className="rooms__grid">
                {specialRoomOptions.map((r) => {
                  const state = q.specialRooms[r];
                  return (
                    <button
                      type="button"
                      key={r}
                      className={"roomchip roomchip--btn" + (state === "req" ? " is-req" : state === "nice" ? " is-nice" : "")}
                      onClick={() => toggleRoom(r)}
                    >
                      {state === "req" && <Check size={13} />}
                      {state === "nice" && <span className="roomchip__plus">+</span>}
                      {r}
                      {state && <span className="roomchip__tag">{state === "req" ? "required" : "nice to have"}</span>}
                    </button>
                  );
                })}
              </div>
            </FormGroup>
          </div>

          <div className="form-actions">
            <button className="btn btn--ghost" onClick={() => { setQ(blankQuery); setResults(null); }}>Reset</button>
            <button className="btn btn--lg" onClick={run}><Search size={16} /> Find Closest Projects</button>
          </div>

          <WeightKey />

          {results && (
            <div id="results" className="results">
              <div className="warning">
                <ShieldAlert size={18} />
                <p>Recommended historical plans are for design reference only. The selected project must be reviewed for the new property's survey, zoning, setbacks, building code, structural conditions, and jurisdictional requirements.</p>
              </div>
              <h2 className="h2">Strong matches <span className="h2__sub">(85% or higher)</span></h2>
              {results.shown.length > 0 ? (
                results.shown.map((r, i) => <ResultCard key={r.project.id} rank={i + 1} r={r} />)
              ) : (
                <div className="nomatch">
                  <p className="nomatch__title">No project reached the 85% match threshold.</p>
                  <p className="nomatch__body">
                    {results.best
                      ? `The closest in the database is ${results.best.project.projectName} at ${results.best.overall}%. Try relaxing the criteria — or broaden a dealbreaker (site condition, stories) if one is capping the score.`
                      : "There are no projects in the database to compare against."}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function WeightKey() {
  const rows = [
    ["Lot dimensions", 22], ["House size", 14], ["Building footprint", 8], ["Stories & basement", 13],
    ["Bedrooms & bathrooms", 13], ["Garage & ADU", 9], ["Pool & special rooms", 9],
    ["Location & zoning", 8], ["Architectural style", 4],
  ];
  return (
    <details className="weightkey">
      <summary>How the match score is calculated</summary>
      <div className="weightkey__bar">
        {rows.map(([l, w]) => (
          <div key={l} className="weightkey__seg" style={{ flex: w }} title={`${l} — ${w}%`}>
            <span className="weightkey__seglabel">{w}%</span>
          </div>
        ))}
      </div>
      <ul className="weightkey__list">
        {rows.map(([l, w]) => <li key={l}><span className="mono">{w}%</span> {l}</li>)}
      </ul>
      <p className="weightkey__note">Weights total 100%. Criteria you leave blank are excluded and the remaining weights are rescaled to 100%, so the score reflects only the requirements you actually entered — a project that matches everything you specified can reach 100%.</p>
      <p className="weightkey__note"><strong>Dealbreaker caps:</strong> structural mismatches that make a plan hard to transfer cap the score regardless of cosmetic fit — a different site condition (e.g. flat plan on a hillside lot) caps it at 68–84%, a different story count at 70–84%, and a footprint that won't physically fit the new lot's width or depth at 60%. This keeps the top matches genuinely buildable.</p>
    </details>
  );
}

function ResultCard({ rank, r }) {
  const p = r.project;
  const b = r.breakdown;
  const [open, setOpen] = useState(false);
  const bars = [
    ["Location & zoning", b.location], ["Lot size", b.lotSize], ["Lot dimensions", b.lotDimension],
    ["House size", b.houseSize], ["Building footprint", b.footprint],
    ["Bedrooms & baths", b.bedBath], ["Garage", b.garage], ["Basement & ADU", b.basementAdu],
    ["Architectural style", b.style], ["Pool & special rooms", b.special],
  ];
  return (
    <div className="result">
      <div className="result__head">
        <div className="result__id">
          <div className="result__rank">No. {rank}</div>
          <div>
            <div className="result__name">{p.projectName}{p.simulated && <span className="pill pill--sim">simulated</span>}</div>
            <div className="result__addr"><MapPin size={12} /> {p.address}</div>
            <div className="result__basis">Scored on {r.activeGroups} of 9 criteria groups you specified</div>
            {r.capped && (
              <div className="result__capped"><ShieldAlert size={12} /> Capped at {r.overall}% (cosmetic match {r.rawOverall}%) — {r.capReason}</div>
            )}
          </div>
        </div>
        <MatchRing value={r.overall} />
      </div>

      <div className="result__bars">
        {bars.map(([label, v]) => (
          <div key={label} className="mbar">
            <div className="mbar__top"><span>{label}</span><span className="mono">{v == null ? "—" : v + "%"}</span></div>
            <div className="mbar__track"><div className="mbar__fill" style={{ width: (v ?? 0) + "%", background: barColor(v) }} /></div>
          </div>
        ))}
      </div>

      <div className="result__cols">
        <div className="result__col">
          <div className="result__coltitle"><Check size={13} /> Why it was recommended</div>
          <ul className="reasons">{r.reasons.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
        <div className="result__col">
          <div className="result__coltitle result__coltitle--diff"><AlertTriangle size={13} /> Important differences</div>
          {r.diffs.length ? <ul className="diffs">{r.diffs.map((x, i) => <li key={i}>{x}</li>)}</ul>
            : <p className="nodiff">No significant differences on the specified criteria.</p>}
        </div>
      </div>

      <button className="result__expand" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <ChevronDown size={15} className={"result__chev" + (open ? " is-open" : "")} />
        {open ? "Hide full project details" : "View full project details"}
      </button>
      {open && (
        <div className="result__details">
          <ProjectDetails p={p} />
        </div>
      )}
    </div>
  );
}

function barColor(v) {
  if (v == null) return "var(--line2)";
  if (v >= 85) return "var(--ok)";
  if (v >= 60) return "var(--warn)";
  return "var(--bad)";
}

function MatchRing({ value }) {
  const R = 30, C = 2 * Math.PI * R;
  const off = C * (1 - value / 100);
  return (
    <div className="ring">
      <svg width="78" height="78" viewBox="0 0 78 78">
        <circle cx="39" cy="39" r={R} fill="none" style={{ stroke: "var(--line2)" }} strokeWidth="6" />
        <circle cx="39" cy="39" r={R} fill="none" style={{ stroke: "var(--brass)" }} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
          transform="rotate(-90 39 39)" />
      </svg>
      <div className="ring__label">
        <div className="ring__num mono">{value}<span>%</span></div>
        <div className="ring__cap">match</div>
      </div>
    </div>
  );
}

/* ----------------------------- form bits ---------------------------- */

function FormGroup({ icon, title, children, wide }) {
  return (
    <div className={"formgroup" + (wide ? " formgroup--wide" : "")}>
      <div className="formgroup__title">{icon} {title}</div>
      <div className="formgroup__grid">{children}</div>
    </div>
  );
}
function Inp({ label, value, onChange, type = "text" }) {
  return (
    <label className="inp">
      <span className="inp__label">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={type === "number" ? "—" : ""} />
    </label>
  );
}
function Sel({ label, value, onChange, options, labels }) {
  return (
    <label className="inp">
      <span className="inp__label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Any</option>
        {options.map((o) => <option key={o} value={o}>{labels ? labels[o] : o}</option>)}
      </select>
    </label>
  );
}

/* ------------------------------- Modal ------------------------------ */

function Modal({ title, subtitle, headerExtra, children, footer, onClose, size }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className={"modal" + (size === "sm" ? " modal--sm" : "")} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <div className="modal__title">{title} {headerExtra}</div>
            {subtitle && <div className="modal__sub mono">{subtitle}</div>}
          </div>
          <button className="iconbtn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__foot">{footer}</div>
      </div>
    </div>
  );
}

/* in-app confirm / notice dialog (native window.confirm is blocked in the sandbox) */
function ConfirmDialog({ dialog, onClose }) {
  if (!dialog) return null;
  return (
    <Modal title={dialog.title} onClose={onClose} size="sm"
      footer={(dialog.actions || []).map((a, i) => (
        <button key={i} className={"btn" + (a.kind === "danger" ? " btn--danger" : a.kind === "ghost" ? " btn--ghost" : "")}
          onClick={() => { a.onClick && a.onClick(); onClose(); }}>
          {a.icon}{a.label}
        </button>
      ))}>
      <p className="dialog-msg">{dialog.message}</p>
    </Modal>
  );
}

/* ================================================================== *
 *  Styles — architectural drawing-index system
 * ================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;450;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root{
  --paper:#EBEDEA; --surface:#FBFBF9; --surface2:#F4F5F2;
  --ink:#1A1E20; --ink2:#454B4E; --muted:#7A8084;
  --line:#D8DBD6; --line2:#E6E8E3;
  --accent:#1E3B33;       /* deep estate green */
  --accent2:#274d43;
  --brass:#9B7333;        /* signature accent */
  --brass-soft:#C9A86A;
  --ok:#3F7A55; --warn:#B98427; --bad:#B5512F;
  --font-display:'Fraunces',Georgia,'Times New Roman',serif;
  --font-body:'Inter',system-ui,-apple-system,sans-serif;
  --font-mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
}

*{box-sizing:border-box}
.app{
  font-family:var(--font-body); color:var(--ink); background:var(--paper);
  min-height:100vh; font-size:14px; line-height:1.5;
  background-image:
    linear-gradient(var(--line2) 1px,transparent 1px),
    linear-gradient(90deg,var(--line2) 1px,transparent 1px);
  background-size:28px 28px; background-position:-1px -1px;
}
.mono{font-family:var(--font-mono); font-variant-numeric:tabular-nums; letter-spacing:-0.01em}

/* top bar */
.topbar{
  position:sticky; top:0; z-index:30; background:rgba(251,251,249,0.92);
  backdrop-filter:blur(8px); border-bottom:1px solid var(--line);
  display:flex; align-items:center; justify-content:space-between;
  gap:20px; padding:14px 26px; flex-wrap:wrap;
}
.brand{display:flex; align-items:center; gap:13px}
.brand__mark{
  width:38px; height:38px; border-radius:9px; display:grid; place-items:center;
  background:var(--accent); color:var(--brass-soft);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08);
}
.brand__name{font-family:var(--font-display); font-weight:600; font-size:17px; letter-spacing:-0.01em; line-height:1.1}
.brand__sub{font-size:11px; color:var(--muted); letter-spacing:0.02em; margin-top:2px}

.nav{display:flex; gap:4px; background:var(--surface2); padding:4px; border-radius:11px; border:1px solid var(--line)}
.nav__btn{
  display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border:none;
  background:transparent; color:var(--ink2); font-family:var(--font-body);
  font-size:13px; font-weight:500; border-radius:8px; cursor:pointer; white-space:nowrap;
  transition:background .15s,color .15s;
}
.nav__btn:hover{color:var(--ink)}
.nav__btn.is-active{background:var(--accent); color:#fff; box-shadow:0 1px 2px rgba(0,0,0,.12)}

.main{max-width:1120px; margin:0 auto; padding:30px 26px 10px}
.loading{padding:80px; text-align:center; color:var(--muted)}

/* page header */
.page__head{display:flex; justify-content:space-between; align-items:flex-end; gap:20px; flex-wrap:wrap; margin-bottom:22px}
.eyebrow{font-size:11px; text-transform:uppercase; letter-spacing:.18em; color:var(--brass); font-weight:600; margin-bottom:7px}
.h1{font-family:var(--font-display); font-size:30px; font-weight:600; letter-spacing:-0.02em; margin:0 0 6px}
.h2{font-family:var(--font-display); font-size:21px; font-weight:600; letter-spacing:-0.01em; margin:26px 0 12px}
.h2__sub{font-family:var(--font-mono); font-size:12px; font-weight:400; color:var(--brass); letter-spacing:0}
.nomatch{border:1px solid var(--line); border-radius:12px; padding:22px 24px; background:var(--surface2)}
.nomatch__title{font-family:var(--font-display); font-size:16px; font-weight:600; color:var(--ink); margin:0 0 8px}
.nomatch__body{font-size:13.5px; color:var(--ink2); line-height:1.6; margin:0; max-width:62ch}
.lede{color:var(--ink2); max-width:60ch; margin:0}
.page__actions{display:flex; gap:8px; flex-wrap:wrap}

/* buttons */
.btn{
  display:inline-flex; align-items:center; gap:7px; padding:9px 15px; border-radius:9px;
  border:1px solid var(--accent); background:var(--accent); color:#fff; font-family:var(--font-body);
  font-size:13px; font-weight:500; cursor:pointer; transition:transform .1s,background .15s,box-shadow .15s;
}
.btn:hover{background:var(--accent2); box-shadow:0 2px 8px rgba(30,59,51,.2)}
.btn:active{transform:translateY(1px)}
.btn:disabled{opacity:.5; cursor:not-allowed; transform:none; box-shadow:none}
.btn--ghost{background:var(--surface); color:var(--ink2); border-color:var(--line)}
.btn--ghost:hover{background:var(--surface2); color:var(--ink); box-shadow:none}
.btn--lg{padding:13px 26px; font-size:15px; border-radius:11px}

.iconbtn{
  display:inline-grid; place-items:center; width:32px; height:32px; border-radius:8px;
  border:1px solid var(--line); background:var(--surface); color:var(--ink2); cursor:pointer; transition:.12s;
}
.iconbtn:hover{background:var(--surface2); color:var(--ink); border-color:var(--muted)}
.iconbtn--danger:hover{color:var(--bad); border-color:var(--bad)}

/* search bar */
.searchbar{
  display:flex; align-items:center; gap:10px; padding:11px 15px; background:var(--surface);
  border:1px solid var(--line); border-radius:11px; color:var(--muted); margin-bottom:18px;
}
.searchbar input{flex:1; border:none; background:transparent; font-family:var(--font-body); font-size:14px; color:var(--ink); outline:none}
.searchbar__clear{border:none; background:none; cursor:pointer; color:var(--muted); display:grid; place-items:center}

/* table */
.table-wrap{border:1px solid var(--line); border-radius:13px; overflow:hidden; background:var(--surface)}
.table{width:100%; border-collapse:collapse; font-size:13px}
.table thead th{
  text-align:left; padding:12px 14px; font-size:10.5px; text-transform:uppercase; letter-spacing:.1em;
  color:var(--muted); font-weight:600; background:var(--surface2); border-bottom:1px solid var(--line);
}
.table th.num,.table td.num{text-align:right}
.table th.ta-r,.table td.ta-r{text-align:right}
.table th.ta-c,.table td.ta-c{text-align:center}
.table tbody td{padding:12px 14px; border-bottom:1px solid var(--line2); vertical-align:middle}
.table tbody tr:last-child td{border-bottom:none}
.table tbody tr:hover{background:var(--surface2)}
.cell-name{font-weight:600; display:flex; align-items:center; gap:8px}
.cell-file{font-size:11px; color:var(--muted); display:flex; align-items:center; gap:5px; margin-top:3px}
.rowbtns{display:inline-flex; gap:6px; justify-content:flex-end}

.btn--danger{background:var(--bad); border-color:var(--bad); color:#fff}
.btn--danger:hover{background:#9b4327; box-shadow:0 2px 8px rgba(181,81,47,.25)}

.bulkbar{
  display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;
  padding:11px 16px; margin-bottom:14px; border-radius:11px;
  background:var(--accent); color:#fff; box-shadow:0 2px 10px rgba(30,59,51,.18);
}
.bulkbar__count{font-size:13px; font-weight:600; letter-spacing:.01em}
.bulkbar__actions{display:flex; gap:8px}
.bulkbar .btn--ghost{background:rgba(255,255,255,.12); color:#fff; border-color:rgba(255,255,255,.25)}
.bulkbar .btn--ghost:hover{background:rgba(255,255,255,.2); color:#fff}

.check-col{width:40px; text-align:center !important}
.table input[type="checkbox"]{width:16px; height:16px; accent-color:var(--accent); cursor:pointer; vertical-align:middle}
.table tbody tr.is-selected{background:#eaf0ec}
.table tbody tr.is-selected:hover{background:#e3ebe6}

.pill{font-size:9.5px; text-transform:uppercase; letter-spacing:.08em; font-weight:600; padding:2px 7px; border-radius:20px}
.pill--sim{background:#efe7d6; color:var(--brass); border:1px solid var(--brass-soft)}

/* empty */
.empty{
  border:1px dashed var(--line); border-radius:14px; padding:54px 20px; text-align:center;
  color:var(--muted); display:flex; flex-direction:column; align-items:center; gap:14px; background:var(--surface)
}

/* confidence */
.confdot{display:inline-flex; align-items:center; margin-left:6px}
.confdot__dot{width:7px; height:7px; border-radius:50%; display:inline-block}
.legend{display:flex; gap:18px; flex-wrap:wrap; align-items:center; font-size:11.5px; color:var(--ink2); margin-bottom:18px}
.legend span{display:inline-flex; align-items:center; gap:6px}
.legend__note{color:var(--muted)}

/* groups (view) */
.group{margin-bottom:22px}
.group__title{
  display:flex; align-items:center; gap:8px; font-size:11px; text-transform:uppercase; letter-spacing:.12em;
  color:var(--accent); font-weight:600; padding-bottom:8px; border-bottom:1px solid var(--line); margin-bottom:14px;
}
.group__grid{display:grid; grid-template-columns:repeat(3,1fr); gap:14px 22px}
.field__label{font-size:10.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); display:flex; align-items:center; margin-bottom:3px}
.field__value{font-size:14px; color:var(--ink); font-weight:500}

/* edit */
.edit-note{font-size:12px; color:var(--muted); margin:0 0 18px; padding:9px 12px; background:var(--surface2); border-radius:8px; border:1px solid var(--line2)}
.edit-grid{grid-template-columns:repeat(2,1fr)}
.inp{display:flex; flex-direction:column; gap:5px}
.inp__label{font-size:10.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); display:flex; align-items:center; gap:7px}
.inp input,.inp select{
  font-family:var(--font-body); font-size:13.5px; color:var(--ink); padding:9px 11px;
  border:1px solid var(--line); border-radius:8px; background:var(--surface); outline:none; transition:border .15s,box-shadow .15s;
}
.inp input:focus,.inp select:focus{border-color:var(--accent); box-shadow:0 0 0 3px rgba(30,59,51,.1)}
.inp--inline{flex-direction:row; align-items:center; gap:10px}
.inp--inline input{width:110px}
.verified{display:inline-flex; align-items:center; gap:3px; color:var(--ok); font-size:9.5px; text-transform:none; letter-spacing:0}

.checks{display:flex; flex-wrap:wrap; gap:18px; align-items:center; margin-top:16px}
.chk{display:inline-flex; align-items:center; gap:7px; font-size:13px; cursor:pointer}
.chk input{width:15px; height:15px; accent-color:var(--accent)}
.rooms{margin-top:16px}
.rooms__label{font-size:10.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); margin-bottom:9px}
.rooms__grid{display:flex; flex-wrap:wrap; gap:8px}
.roomchip{
  display:inline-flex; align-items:center; gap:7px; padding:7px 13px; border:1px solid var(--line);
  border-radius:20px; font-size:12.5px; cursor:pointer; background:var(--surface); color:var(--ink2); transition:.12s;
}
.roomchip:hover{border-color:var(--muted)}
.roomchip.is-on{background:var(--accent); color:#fff; border-color:var(--accent)}
.roomchip input{display:none}
.roomchip--btn{font-family:var(--font-body); outline:none}
.roomchip--btn:focus-visible{box-shadow:0 0 0 3px rgba(30,59,51,.18)}
.roomchip.is-req{background:var(--accent); color:#fff; border-color:var(--accent)}
.roomchip.is-nice{background:#f3ecdd; color:#5e4a23; border-color:var(--brass-soft)}
.roomchip__plus{font-weight:700; font-size:14px; line-height:1}
.roomchip__tag{font-size:9px; text-transform:uppercase; letter-spacing:.04em; opacity:.85; margin-left:3px; padding-left:7px; border-left:1px solid currentColor}
.rooms__hint{font-size:12px; color:var(--muted); margin:0 0 13px; line-height:1.55}
.rooms__hint strong{color:var(--ink2); font-weight:600}

.floors{display:flex; flex-direction:column; gap:14px}
.floor{border:1px solid var(--line2); border-radius:10px; padding:12px 14px; background:var(--surface2)}
.floor__head{font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--accent); font-weight:600; margin-bottom:9px; display:flex; align-items:center; gap:8px}
.floor__count{font-family:var(--font-mono); font-size:10px; color:#fff; background:var(--brass); border-radius:20px; padding:1px 7px; letter-spacing:0}
.floor__rooms{display:flex; flex-wrap:wrap; gap:6px}
.roomtag{font-size:11.5px; color:var(--ink2); background:var(--surface); border:1px solid var(--line); border-radius:6px; padding:3px 9px}
.floors-edit{display:grid; grid-template-columns:1fr 1fr; gap:13px}
.floors-edit textarea{font-family:var(--font-body); font-size:12.5px; color:var(--ink); padding:8px 10px; border:1px solid var(--line); border-radius:8px; background:var(--surface); outline:none; resize:vertical; line-height:1.5}
.floors-edit textarea:focus{border-color:var(--accent); box-shadow:0 0 0 3px rgba(30,59,51,.1)}

/* sim banner */
.sim-banner{
  display:flex; gap:12px; align-items:flex-start; padding:14px 16px; border-radius:12px;
  background:linear-gradient(0deg,#f3ecdd,#f8f3e8); border:1px solid var(--brass-soft); color:#5e4a23; margin-bottom:22px; font-size:13px;
}
.sim-banner svg{color:var(--brass); flex-shrink:0; margin-top:1px}

/* dropzone */
.dropzone{
  border:2px dashed var(--line); border-radius:16px; padding:48px 20px; text-align:center;
  background:var(--surface); color:var(--muted); cursor:pointer; transition:.15s;
  display:flex; flex-direction:column; align-items:center; gap:8px;
}
.dropzone:hover{border-color:var(--accent); color:var(--ink2); background:var(--surface2)}
.dropzone.is-over{border-color:var(--accent); background:#eef2ef; color:var(--accent)}
.dropzone.is-full{opacity:.6; cursor:not-allowed}
.dropzone__title{font-family:var(--font-display); font-size:18px; font-weight:600; color:var(--ink)}
.dropzone__sub{font-size:12.5px}

/* staged */
.staged{margin-top:22px}
.staged__head{display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap; margin-bottom:14px; font-size:13px; font-weight:600; color:var(--ink2)}
.staged__actions{display:flex; gap:8px}
.staged-card{border:1px solid var(--line); border-radius:13px; padding:16px; background:var(--surface); margin-bottom:12px}
.staged-card__top{display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:14px}
.staged-card__name{font-family:var(--font-display); font-size:16px; font-weight:600}
.staged-card__grid{display:grid; grid-template-columns:repeat(4,1fr); gap:12px 16px}
.staged-card__hint{margin-top:13px; font-size:11.5px; color:var(--warn)}
.ministat__label{font-size:10px; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); display:flex; align-items:center; margin-bottom:2px}
.ministat__value{font-size:13.5px; font-weight:500}

/* form */
.form{display:grid; grid-template-columns:1fr 1fr; gap:16px}
.formgroup{border:1px solid var(--line); border-radius:13px; padding:18px; background:var(--surface)}
.formgroup--wide{grid-column:1 / -1}
.formgroup__title{display:flex; align-items:center; gap:8px; font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:var(--accent); font-weight:600; margin-bottom:15px}
.formgroup__grid{display:grid; grid-template-columns:1fr 1fr; gap:13px}
.form-actions{display:flex; justify-content:flex-end; gap:10px; margin-top:20px}

/* weight key */
.weightkey{margin-top:20px; border:1px solid var(--line); border-radius:12px; background:var(--surface); padding:0 16px}
.weightkey summary{cursor:pointer; padding:14px 0; font-size:13px; font-weight:600; color:var(--ink2); list-style:none}
.weightkey summary::-webkit-details-marker{display:none}
.weightkey summary::before{content:'+ '; color:var(--brass); font-family:var(--font-mono)}
.weightkey[open] summary::before{content:'– '}
.weightkey__bar{display:flex; gap:2px; height:34px; border-radius:7px; overflow:hidden; margin-bottom:14px}
.weightkey__seg{background:var(--accent); display:grid; place-items:center; min-width:24px}
.weightkey__seg:nth-child(even){background:var(--accent2)}
.weightkey__seglabel{color:#fff; font-size:10px; font-family:var(--font-mono)}
.weightkey__list{columns:2; gap:30px; list-style:none; padding:0; margin:0 0 8px; font-size:12.5px; color:var(--ink2)}
.weightkey__list li{padding:3px 0}
.weightkey__list .mono{color:var(--brass); margin-right:8px; font-weight:500}
.weightkey__note{font-size:11.5px; color:var(--muted); padding-bottom:14px; margin:0}

/* warning */
.warning{
  display:flex; gap:12px; align-items:flex-start; padding:15px 17px; border-radius:12px;
  background:#fbf1ec; border:1px solid #e6b9a6; color:#7a3a22; font-size:13px; margin:24px 0 8px;
}
.warning svg{color:var(--bad); flex-shrink:0; margin-top:1px}
.warning p{margin:0}

/* results */
.results{scroll-margin-top:80px}
.result{border:1px solid var(--line); border-radius:15px; background:var(--surface); padding:20px; margin-bottom:16px; box-shadow:0 1px 2px rgba(0,0,0,.03)}
.result__head{display:flex; justify-content:space-between; align-items:center; gap:16px; padding-bottom:16px; border-bottom:1px solid var(--line2); margin-bottom:16px}
.result__id{display:flex; align-items:center; gap:16px}
.result__rank{font-family:var(--font-mono); font-size:11px; color:#fff; background:var(--accent); padding:6px 9px; border-radius:7px; letter-spacing:.02em}
.result__name{font-family:var(--font-display); font-size:19px; font-weight:600; display:flex; align-items:center; gap:9px}
.result__addr{font-size:12.5px; color:var(--muted); display:flex; align-items:center; gap:5px; margin-top:3px}
.result__basis{font-size:11px; color:var(--brass); margin-top:5px; letter-spacing:.01em}
.result__capped{display:flex; align-items:flex-start; gap:5px; font-size:11px; color:var(--bad); margin-top:6px; max-width:46ch; line-height:1.45}
.result__capped svg{flex-shrink:0; margin-top:1px}

.ring{position:relative; width:78px; height:78px; flex-shrink:0}
.ring__label{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center}
.ring__num{font-size:21px; font-weight:600; color:var(--ink); line-height:1}
.ring__num span{font-size:11px; color:var(--muted)}
.ring__cap{font-size:8.5px; text-transform:uppercase; letter-spacing:.1em; color:var(--brass); margin-top:1px}

.result__bars{display:grid; grid-template-columns:repeat(2,1fr); gap:10px 24px; margin-bottom:18px}
.mbar__top{display:flex; justify-content:space-between; font-size:11.5px; color:var(--ink2); margin-bottom:4px}
.mbar__track{height:6px; background:var(--line2); border-radius:4px; overflow:hidden}
.mbar__fill{height:100%; border-radius:4px; transition:width .5s ease}

.result__cols{display:grid; grid-template-columns:1fr 1fr; gap:22px}
.result__coltitle{display:flex; align-items:center; gap:6px; font-size:11px; text-transform:uppercase; letter-spacing:.08em; font-weight:600; color:var(--ok); margin-bottom:9px}
.result__coltitle--diff{color:var(--warn)}
.reasons,.diffs{margin:0; padding-left:0; list-style:none; font-size:13px}
.reasons li,.diffs li{padding:4px 0 4px 18px; position:relative; color:var(--ink2)}
.reasons li::before{content:''; position:absolute; left:3px; top:11px; width:6px; height:6px; border-radius:50%; background:var(--ok)}
.diffs li::before{content:''; position:absolute; left:3px; top:11px; width:6px; height:6px; border-radius:50%; background:var(--warn)}
.nodiff{font-size:12.5px; color:var(--muted); margin:0}
.result__expand{display:inline-flex; align-items:center; gap:7px; margin-top:16px; padding:9px 14px; border:1px solid var(--line); background:var(--surface2); color:var(--ink2); border-radius:9px; font-family:var(--font-body); font-size:12.5px; font-weight:500; cursor:pointer; transition:.15s}
.result__expand:hover{background:var(--paper); color:var(--ink); border-color:var(--muted)}
.result__chev{transition:transform .2s}
.result__chev.is-open{transform:rotate(180deg)}
.result__details{margin-top:16px; padding-top:18px; border-top:1px solid var(--line)}

/* modal */
.overlay{position:fixed; inset:0; background:rgba(20,24,22,.45); backdrop-filter:blur(3px); z-index:50; display:flex; align-items:flex-start; justify-content:center; padding:40px 18px; overflow-y:auto}
.modal{background:var(--surface); border-radius:16px; width:100%; max-width:760px; border:1px solid var(--line); box-shadow:0 24px 60px rgba(0,0,0,.28); overflow:hidden; margin-bottom:40px}
.modal--sm{max-width:440px}
.dialog-msg{margin:0; font-size:14px; color:var(--ink2); line-height:1.55}
.modal__head{display:flex; justify-content:space-between; align-items:flex-start; gap:14px; padding:20px 22px; border-bottom:1px solid var(--line); background:var(--surface2)}
.modal__title{font-family:var(--font-display); font-size:20px; font-weight:600; display:flex; align-items:center; gap:10px}
.modal__sub{font-size:11.5px; color:var(--muted); margin-top:4px}
.modal__body{padding:22px; max-height:64vh; overflow-y:auto}
.modal__foot{display:flex; justify-content:flex-end; gap:10px; padding:16px 22px; border-top:1px solid var(--line); background:var(--surface2)}

/* footer */
.foot{max-width:1120px; margin:0 auto; padding:18px 26px 30px; display:flex; gap:16px; flex-wrap:wrap; align-items:center; font-size:11.5px; color:var(--muted)}
.sim-tag{display:inline-flex; align-items:center; gap:6px; color:var(--brass)}
.foot__warn{color:var(--bad)}

@media(max-width:820px){
  .form,.result__bars,.result__cols{grid-template-columns:1fr}
  .group__grid{grid-template-columns:1fr 1fr}
  .staged-card__grid{grid-template-columns:repeat(2,1fr)}
  .nav{width:100%; overflow-x:auto}
  .h1{font-size:25px}
}
@media(max-width:520px){
  .group__grid,.edit-grid,.formgroup__grid,.staged-card__grid,.floors-edit{grid-template-columns:1fr}
  .main{padding:22px 16px 10px}
  .table thead{display:none}
  .table tbody td{display:block; text-align:left; padding:6px 14px; border:none}
  .table tbody tr{display:block; border-bottom:1px solid var(--line); padding:10px 0}
  .table td.num,.table td.ta-r{text-align:left}
  .rowbtns{justify-content:flex-start; margin-top:6px}
}`;