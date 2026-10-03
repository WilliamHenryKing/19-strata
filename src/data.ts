export const materials = [
  {
    id: "travertine",
    name: "Travertine",
    number: "01",
    family: "Earth / stone",
    color: "#d5bc91",
    tone: "#cd785d",
    finish: "Filled & honed",
    character: "Quiet texture. Lasting presence.",
    description:
      "Soft mineral bands, open pores and a beautifully imperfect rhythm. A grounding surface that brings depth to spaces without raising its voice.",
    uses: "Walls · floors · bespoke surfaces",
    consideration:
      "Natural variation is the point. A full-size sample, sealed edges and a considered maintenance plan belong in every specification.",
  },
  {
    id: "clay",
    name: "Clay plaster",
    number: "02",
    family: "Earth / mineral",
    color: "#b56445",
    tone: "#c7806b",
    finish: "Hand-worked matte",
    character: "A surface with a human touch.",
    description:
      "Warm pigment and hand-trowelled movement turn a wall into something you feel. Light travels across the subtle undulations through the day.",
    uses: "Feature walls · niches · ceilings",
    consideration:
      "Substrate preparation and the applicator's sample panel define the result. Wet areas require a suitable tested finishing system.",
  },
  {
    id: "walnut",
    name: "Smoked walnut",
    number: "03",
    family: "Forest / timber",
    color: "#6a3e2b",
    tone: "#be8267",
    finish: "Open-grain oil",
    character: "Rich grain. Gentle contrast.",
    description:
      "Dark ribbons of grain bring a tactile counterpoint to pale stone and mineral finishes. Used with restraint, timber can make an entire room feel settled.",
    uses: "Joinery · wall panelling · furniture",
    consideration:
      "Grain matching, movement allowance and responsibly sourced stock shape the detail. Finish samples should be viewed beside the final stone.",
  },
  {
    id: "aluminium",
    name: "Brushed metal",
    number: "04",
    family: "Element / aluminium",
    color: "#a9a8a4",
    tone: "#c6a49b",
    finish: "Directional brush",
    character: "A little tension. A little light.",
    description:
      "A cool, precise line among softer materials. Brushed aluminium catches light without the glare, adding a restrained industrial edge.",
    uses: "Trims · hardware · custom details",
    consideration:
      "Agree brush direction, edge treatment and handling protection. The junction with its neighbouring surface is as important as the finish itself.",
  },
] as const;
export type MaterialId = (typeof materials)[number]["id"];

export const projects = [
  {
    slug: "the-courtyard-house",
    number: "01",
    name: "The Courtyard House",
    kind: "Residential / full interior",
    year: "Concept 2026",
    location: "A warm-climate retreat",
    image: "interior",
    tagline: "An interior that follows the light.",
    intro:
      "A study in softened thresholds, generous proportions and the everyday pleasure of natural materials. A single palette threads through the house, allowing light and life to lead.",
    challenge:
      "How can a restrained material palette create a home that still feels rich? The answer is in the junctions: warm plaster meeting cool stone, a slender metal reveal, and timber that gathers the rooms together.",
    response:
      "A curved plaster volume defines the social space. Travertine anchors the floor and central table; smoked walnut gives depth to the joinery. Each transition is resolved as part of the architecture, rather than added at the end.",
    scope: [
      "Spatial concept",
      "Interior architecture",
      "Material direction",
      "Joinery & finish details",
    ],
    palette: ["travertine", "clay", "walnut"],
  },
  {
    slug: "a-place-to-gather",
    number: "02",
    name: "A Place to Gather",
    kind: "Hospitality / material study",
    year: "Concept 2026",
    location: "A neighbourhood dining room",
    image: "elevation",
    tagline: "Warmth at every scale.",
    intro:
      "A neighbourhood dining room imagined as a long, warm embrace. A continuous timber bench, mineral walls and a shared table create a generous setting for slow conversations.",
    challenge:
      "Hospitality surfaces have to balance atmosphere with real-world wear. This study explores how repeated elements and clearly defined finishing zones can create character without clutter.",
    response:
      "Ribbed walnut makes the lower half tactile, while rust-toned plaster gives the room its identity. Stone surfaces bring a crisp, durable counterpoint. The drawn elevation tests proportion and repetition before detail development.",
    scope: [
      "Hospitality concept",
      "Elevation studies",
      "Surface palette",
      "Custom furniture direction",
    ],
    palette: ["clay", "walnut", "aluminium"],
  },
  {
    slug: "the-quiet-corner",
    number: "03",
    name: "The Quiet Corner",
    kind: "Workplace / finishing study",
    year: "Concept 2026",
    location: "A small creative workspace",
    image: "board",
    tagline: "Room to think. Space to make.",
    intro:
      "A small workspace with a generous material life. This finishing study pairs chalky mineral surfaces with reflective accents to give everyday work a calmer, more tactile setting.",
    challenge:
      "A compact room needs visual clarity without feeling blank. We asked how a small set of contrasting surfaces could create useful zones and make functional details feel intentional.",
    response:
      "A pale stone work surface meets a soft plaster enclosure. Brushed metal marks edges and shelves, while a walnut storage wall adds warmth. The palette balances focus and character through proportion.",
    scope: ["Workspace concept", "Material sampling", "Joinery direction", "Finishing schedule"],
    palette: ["travertine", "aluminium", "walnut"],
  },
] as const;
export type Project = (typeof projects)[number];

export const process = [
  {
    number: "01",
    title: "Find the feeling.",
    description:
      "Start with how a space should live. The rituals, the light, the practical things. A clear brief gives every later decision a reason.",
  },
  {
    number: "02",
    title: "Build the palette.",
    description:
      "Bring materials together in real light. Test colour, texture and proportion until the whole feels better than its individual parts.",
  },
  {
    number: "03",
    title: "Resolve the details.",
    description:
      "Draw the meeting points. Align the edges. Consider how each surface is made, installed and cared for. Good finishing begins on paper.",
  },
  {
    number: "04",
    title: "Make it coherent.",
    description:
      "Carry one idea through the space, from its broadest gesture to its smallest reveal. Review samples and details against the original intention.",
  },
] as const;
