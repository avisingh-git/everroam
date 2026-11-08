// Digits only, with country code. Replace with the real number.
const WA_NUMBER = "+917047009700";

// PLACEHOLDER content: edit prices, dates, routes and itineraries.
// live:false shows a waitlist button instead of Reserve.
const TRIPS = [
 {slug:"tawang", code:"TAW", name:"Tawang", live:true, tag:"Monasteries above the clouds", days:7, pricing:[{sharing:1, price:25999}, {sharing:2, price:21999}, {sharing:3, price:19999}],
  route:"Guwahati, Bomdila, Tawang",
  blurb:"High passes, a giant monastery and a valley that stays with you.",
  batches:[{label:"Christmas batch",dates:"19–25 Dec",code:"2612"},{label:"New Year batch",dates:"28 Dec–3 Jan",code:"2701"}],
  highlights:["Sela Pass","Tawang Monastery","Group bonfire night", "Madhuri Lake","Bum-La Pass","Dirang Monastery"],
  itinerary:[["Day 1","Guwahati to Dirang","Early pickup and a long scenic drive. First night in Dirang."],
   ["Day 2","Dirang to Tawang","Scenic 5–6 hour drive to Tawang through the Himalayan mountains. Visit Dirang Monastery and Sela Pass on the way."],
   ["Day 3","Bum-La Pass and Madhuri Lake","After breakfast, excursion to Bum-La Pass to see the China border and Madhuri Lake. Return to Tawang for the night."],
   ["Day 4","Tawang Local Sightseeing","Visit Tawang Monastery, Tawang War Memorial and the local market. Evening bonfire and dinner."],
   ["Day 5","Tawang to Dirang","Visit the Nurang Waterfall and drive back to Dirang. Evening at leisure."],
     ["Day 6","Dirang to Guwahati","Drive back to Guwahati through the Bhutan border."],
     ["Day 7","Departure","Drop at Guwahati airport or railway station. End of the trip."],
],
  inc:["6 nights stay, breakfast and dinner","Transport and trip lead","Permits", "Tolls and parking charges"], exc:["Travel to Guwahati","Lunches","Personal expenses", "Any detour or extra stay not mentioned in the itinerary","Union cab for Bum-La Pass and Madhuri Lake","Any other expenses not mentioned in inclusions"]},

 {slug:"bhutan", code:"BHU", name:"Bhutan", live:true, tag:"Dzongs, prayer flags and quiet roads", days:8, pricing:[{sharing:1, price:47999}, {sharing:2, price:39999}, {sharing:3, price:37999}],
  route:"Phuentsholing, Thimphu, Paro",
  blurb:"A country that measures happiness.",
  batches:[{label:"February batch",dates:"13–18 Feb",code:"2702"}],
  highlights:["Tiger\u2019s Nest hike","Thimphu Night Life","Paro valley","Dochula Pass","Punakha Suspension Bridge","Chimi Lhakhang"],
  itinerary:[["Day 1","Phuentsholing","Land in Bagdogra, meet the team, start your transfer toward BhutanCross the border and wind up into the capital."],
   ["Day 2","Thimphu","Drive from Phuentsholing to Thimphu.Stop at Chuzom Bridge, where the Paro and Thimphu rivers meet below a mural of the King and Queen"],
   ["Day 3","Punakha","Check out and stop at the Buddha Dordenma. Drive on to Punakha via Dochula Pass, pausing for tea with Himalayan views. See the 108 Druk Wangyal Chortens. Walk the Punakha Suspension Bridge before heading back. Overnight in Punakha."],
   ["Day 4","Phobjikha","A short hike to Chimi Lhakhang afterwards, continue on to Phobjikha Valley. Check in and spend the rest of the day at leisure."],
  ["Day 5","Paro","The most relaxing day of the trip. Drive to Paro. Evening at leisure."],
   ["Day 6","Tiger\u2019s Nest","Drive to the trailhead, 11 km from Paro, for Taktsang Monastery. Hike through pine forest for 2 to 4 hours depending on pace. Tiger's Nest, clinging to a cliff 900 meters above the valley. "],
   ["Day 7","Siliguri","Cross back through Phuentsholing into India. Reach Siliguri by evening and check in. Overnight in Siliguri."],
  ["Day 8","Return","Check out after breakfast and transfer to Bagdogra airport or Siliguri railway station on your own for return."],],
  inc:["7 night stays","7 day Bhutan Permit","Pickup from Bagdogra airport","Entire transport from Siliguri to Siliguri", "Breakfast and Dinner", "SDF (Bhutan Sustainable Development Fees)","Local English speaking guide"], exc:["Airport drop-offnot included","Lunches","Personal expenses","Airport drop"]},
 {slug:"anini", code:"ANI", name:"Anini", live:true, tag:"Far east, barely visited", days:7, pricing:[{sharing:2, price:29999}, {sharing:3, price:27999}],
  route:"Dibrugarh, Roing, Anini",
  blurb:"Anini sits at the edge of the map. Dates open.",
  batches:[{label:"January",dates:"14-19",code:"2727"}],
  highlights:["Mishmi hills","Chigu Camp","Emuli Grasslands","Anini Viewpoint","River crossings","Village homestays"],
  itinerary:[["Day 1","Dibrugarh to Roing","Everroam crew picks you up from the airport or railway station at 12 PM. Drive to Roing, the last town before Anini."],
   ["Day 2","Roing to Anini","After breakfast, drive to Anini. The road is rough and remote, with river crossings and mountain views. Overnight in Anini."],
   ["Day 3","Explore Anini","After breakfast, leave for  surreal Bruni and Chigu Camp roads. Pause at Chigu Eco Camp for valley views and a warm red tea. Touch the Indo-China border and return to Anini for overnight stay."],
     ["Day 4","Emuli Grasslands ","A slow breakfast, then a short ride to the local Kiwi farms. Explore the Emuli grasslands and the surrounding Mishmi hills. Return to Anini for overnight stay."],
    ["Day 5","A day of culture and stay ","Sit down to a traditional Idu Mishmi lunch of bamboo shoot dishes. Head to Anini Viewpoint for an unforgettable sunset over the mountains. Return to Anini for overnight stay."],
  ["Day 6","Anini to Roing","Have breakfast, then begin the long, reflective journey back to Roing. Arrive at Roing homestay for a cosy dinner and relaxing stay"],
["Day 7","Roing to Dibrugarh","After breakfast, drive back to Dibrugarh for your onward journey. End of the trip."],],
  inc:["6 nights stay","Transport and trip lead","Permits", "SUV Cab","Local Guide","Dibrugarh Airport Pick and Drop"], exc:["Anything not mentioned in the inclusions.","Lunches and dinners","Personal expenses"]}
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
 tawang:{photo:"tawang-bike-card.jpg", days:8, price:42500, grade:"Moderate to hard", route:"Guwahati, Bomdila, Tawang",
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
 bhutan:{photo:"bhutan-bike-card.jpg", days:7, price:52000, grade:"Moderate", route:"Phuentsholing, Thimphu, Paro",
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
 anini:{photo:"anini-bike-card.jpg", days:7, price:39500, grade:"Hard", route:"Dibrugarh, Roing, Anini", live:false,
  blurb:"Remote roads, river crossings and a destination few riders reach. Dates open soon.",
  batches:[{label:"Waitlist",dates:"Dates soon",code:"B0000"}],
  highlights:["River crossings","Remote mountain roads","Village homestays"],
  itinerary:[["Day 1","Dibrugarh","Meet the crew and get the bikes sorted.",25],
   ["Day 2–3","Dibrugarh to Roing","Highway first, then the road starts to tighten.",220],
   ["Day 4–5","Roing to Anini","The remote stretch, with a homestay night on the way.",190],
   ["Day 6–7","Anini and back","A slow day, then the ride out.",200]],
  inc:["Bike and fuel plan","Stays and breakfast","Riding lead and backup vehicle","Permits"], exc:["Travel to Dibrugarh","Riding gear","Lunches and dinners","Personal expenses"]}
};
// ===== Bike landing page (#/bike): every word and number on it comes from here =====
// Trip cards read BIKE_TRIPS above: photo (media/ file), days, grade, price, blurb, batches. km is added up from itinerary rows [label,title,text,km], or set km:1234 on a trip to override.
// Use <em>word</em> for the red word in a headline.
const BIKE_PAGE = {
  hero: { eyebrow: "Everroam \u00B7 On two wheels", line1: "Same roads.", line2: "Ridden loud.",
    sub: "Mountain passes, empty highways and a backup vehicle always behind you. Bring the nerve, we will bring the rest.",
    cta: "See the rides", cta2: "Message us", wa: "Hi Everroam! I want to join a bike trip." },
  stats: [["3", "routes"], ["7\u20138", "days each"], ["Always", "backup vehicle"]],   // [big word, small label]
  tape: ["Ride", "Roam", "Repeat"],
  rides: { eyebrow: "Bike trips", h: "Pick your <em>ride</em>", cta: "See the ride", waitlist: "Join waitlist" },
  facts: { eyebrow: "How we ride", h: "Built for <em>riders</em>, and for first timers.", items: [
    ["Bikes sorted", "A ride that fits you, serviced and ready on day one."],
    ["Never alone on the road", "A lead rides ahead and a backup vehicle follows, always."],
    ["Pace over racing", "Rest stops, photo stops and zero heroics."],
    ["A proper briefing", "Day one starts with a briefing, then we ride together."]] },
  itin: { slug: "tawang", h: "The ride, <em>day by day</em>", cta: "Full itinerary and dates" },   // rows come from that trip's bike itinerary
  help: { h: "Never ridden in the <em>mountains</em>?", sub: "Tell us your riding experience. We will match you to the right trip.", cta: "Talk to a ride lead", wa: "Hi Everroam! I have a question about the bike trips." },
  fin: { h: "Ready to <em>ride</em>?", mark: "RIDE", cta: "Message us", wa: "Hi Everroam! I want to join a bike trip.", alt: "Prefer four wheels?" }
};
TRIPS.forEach(t => (t.bike = { live: t.live, ...BIKE_TRIPS[t.slug] }));
