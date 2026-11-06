// Digits only, with country code. Replace with the real number.
const WA_NUMBER = "+918250109700";

// PLACEHOLDER content: edit prices, dates, routes and itineraries.
// live:false shows a waitlist button instead of Reserve.
const TRIPS = [
 {slug:"tawang", code:"TAW", name:"Tawang", live:true, tag:"Monasteries above the clouds", days:7, price:24500,
  route:"Guwahati, Bomdila, Tawang",
  blurb:"High passes, a giant monastery and a valley that stays with you.",
  batches:[{label:"Christmas batch",dates:"19–25 Dec",code:"2612"},{label:"New Year batch",dates:"28 Dec–3 Jan",code:"2701"}],
  highlights:["Sela Pass","Tawang Monastery","Group bonfire night"],
  itinerary:[["Day 1","Guwahati to Bomdila","Early pickup and a long scenic drive. First night in Bomdila."],
   ["Day 2","Bomdila to Tawang","Cross Sela Pass and get the first view of the valley."],
   ["Day 3–4","Tawang","Monastery morning, market walk, a lake trip and a group dinner."],
   ["Day 5–6","The road back","Slow drive south with photo stops and a last night together."],
   ["Day 7","Guwahati","Drop-off by evening."]],
  inc:["Stays and breakfast","Transport and trip lead","Permits"], exc:["Travel to Guwahati","Lunches and dinners","Personal expenses"]},
 {slug:"bhutan", code:"BHU", name:"Bhutan", live:true, tag:"Dzongs, prayer flags and quiet roads", days:6, price:38000,
  route:"Phuentsholing, Thimphu, Paro",
  blurb:"A country that measures happiness. Six days of monasteries, mountain roads and long dinners.",
  batches:[{label:"February batch",dates:"13–18 Feb",code:"2702"}],
  highlights:["Tiger\u2019s Nest hike","Thimphu weekend market","Paro valley"],
  itinerary:[["Day 1","Phuentsholing to Thimphu","Cross the border and wind up into the capital."],
   ["Day 2","Thimphu","Buddha Dordenma, market and a local cooking session."],
   ["Day 3","Punakha","Dochula Pass, the dzong and a river walk."],
   ["Day 4","Paro","Valley drive and a free evening."],
   ["Day 5","Tiger\u2019s Nest","The big hike, with a long lunch after."],
   ["Day 6","Return","Back to the border by evening."]],
  inc:["Stays and breakfast","Transport and trip lead","Permits and entry fees"], exc:["Travel to Phuentsholing","Lunches and dinners","Personal expenses"]},
 {slug:"anini", code:"ANI", name:"Anini", live:false, tag:"Far east, barely visited", days:6, price:29500,
  route:"Dibrugarh, Roing, Anini",
  blurb:"Anini sits at the edge of the map. Dates open soon, so join the waitlist and we\u2019ll message you first.",
  batches:[{label:"Waitlist",dates:"Dates soon",code:"0000"}],
  highlights:["Mishmi hills","River crossings","Village homestays"],
  itinerary:[["Day 1–2","Dibrugarh to Roing","Meet the group and head east."],
   ["Day 3–4","Roing to Anini","Mountain roads, rivers and a homestay night."],
   ["Day 5–6","Anini and back","Slow days, then the drive out."]],
  inc:["Stays and breakfast","Transport and trip lead","Permits"], exc:["Travel to Dibrugarh","Lunches and dinners","Personal expenses"]}
];

const FAQ = [
 ["How does booking work?","Press Reserve and WhatsApp opens with your trip, batch and travellers filled in. We reply in the chat and share a payment link for the booking amount."],
 ["Is there online payment on this site?","No. Everything happens in the WhatsApp chat so you can ask questions before you pay."],
 ["Who travels with Everroam?","Mostly 18 to 35 year olds, in small groups. Solo travellers are welcome and most people arrive alone."],
 ["Can we do a private or custom trip?","Yes. Use the Plan a trip page and we\u2019ll open a chat about your dates and group."]
];

// Group photos for the landing-page carousel. Put files in media/ and edit names/captions.
const GROUPS = [
 ["group-1.jpg","Tawang, Christmas crew"],["group-2.jpg","Bhutan, February crew"],["group-3.jpg","Anini scouting crew"],["group-4.jpg","Tawang, New Year crew"],
 ["group-5.jpg","Bhutan, spring crew"],["group-6.jpg","Tawang, monsoon crew"],["group-7.jpg","Bhutan, autumn crew"],["group-8.jpg","Anini, first crew"]
];

// Bike version of every trip. PLACEHOLDER content (prices, dates, km): edit freely.
// itinerary rows: [label, title, text, km]
const BIKE_TRIPS = {
 tawang:{days:8, price:42500, grade:"Moderate to hard", route:"Guwahati, Bomdila, Tawang",
  blurb:"Sela Pass, long open roads and a monastery at the end of the line, all on two wheels.",
  batches:[{label:"Spring ride",dates:"6–13 Apr",code:"B2604"}],
  highlights:["Sela Pass on two wheels","Backup vehicle follows","Rider briefing on day one"],
  itinerary:[["Day 1","Bikes and briefing","Meet the crew, pick your bike and ride a short loop to settle in.",30],
   ["Day 2","Guwahati to Bomdila","The first big ride day with tea stops and a mountain sunset.",270],
   ["Day 3","Bomdila to Tawang","Over Sela Pass, the high point of the trip.",180],
   ["Day 4","Tawang loop","Light bags, a lake ride and the monastery.",90],
   ["Day 5–6","The long way back","Retrace the road with a bonfire night on the way.",250],
   ["Day 7–8","Back to Guwahati","Last ride, last chai, bikes handed back.",300]],
  inc:["Bike and fuel plan","Stays and breakfast","Riding lead and backup vehicle","Permits"], exc:["Travel to Guwahati","Riding gear","Lunches and dinners","Personal expenses"]},
 bhutan:{days:7, price:52000, grade:"Moderate", route:"Phuentsholing, Thimphu, Paro",
  blurb:"Prayer-flag passes and smooth mountain roads, ridden at a pace that lets you look around.",
  batches:[{label:"February ride",dates:"13–19 Feb",code:"B2702"}],
  highlights:["Dochula Pass","Paro valley","Backup vehicle follows"],
  itinerary:[["Day 1","Border and briefing","Cross over, meet your bike and ride a gentle first stretch.",70],
   ["Day 2","Phuentsholing to Thimphu","Climb into the capital through changing forests.",170],
   ["Day 3","Thimphu to Punakha","Over Dochula Pass and down to the river valley.",85],
   ["Day 4","Punakha to Paro","A scenic ride day with long photo stops.",125],
   ["Day 5","Tiger\u2019s Nest day","Ride to the trailhead, then hike. Bikes rest.",30],
   ["Day 6–7","Return","Back to the border for the goodbye dinner.",190]],
  inc:["Bike and fuel plan","Stays and breakfast","Riding lead and backup vehicle","Permits and entry fees"], exc:["Travel to Phuentsholing","Riding gear","Lunches and dinners","Personal expenses"]},
 anini:{days:7, price:39500, grade:"Hard", route:"Dibrugarh, Roing, Anini", live:false,
  blurb:"Remote roads, river crossings and a destination few riders reach. Dates open soon.",
  batches:[{label:"Waitlist",dates:"Dates soon",code:"B0000"}],
  highlights:["River crossings","Remote mountain roads","Village homestays"],
  itinerary:[["Day 1","Dibrugarh","Meet the crew and get the bikes sorted.",25],
   ["Day 2–3","Dibrugarh to Roing","Highway first, then the road starts to tighten.",220],
   ["Day 4–5","Roing to Anini","The remote stretch, with a homestay night on the way.",190],
   ["Day 6–7","Anini and back","A slow day, then the ride out.",200]],
  inc:["Bike and fuel plan","Stays and breakfast","Riding lead and backup vehicle","Permits"], exc:["Travel to Dibrugarh","Riding gear","Lunches and dinners","Personal expenses"]}
};
TRIPS.forEach(t => (t.bike = { live: t.live, ...BIKE_TRIPS[t.slug] }));
