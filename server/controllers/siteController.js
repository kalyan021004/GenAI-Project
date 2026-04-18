const Site = require('../models/Site');
const { chatCompletion } = require('../lib/openrouter');
const generateImages=require("../lib/imageGenerator.js")
const GENERATE_SYSTEM = `You are HeritageAI. When given a heritage site name, return ONLY valid JSON — no markdown, no explanation:
{
  "name": "full name",
  "slug": "lowercase-hyphenated-slug",
  "also_known_as": [],
  "location": { "city": "", "state": "", "country": "", "lat": 0.0, "lng": 0.0 },
  "category": "Temple|Fort|Palace|Monument|Cave|Ruins|Mosque|Church|Other",
  "dynasty_or_period": "",
  "year_built": "",
  "built_by": "",
  "architectural_style": "",
  "historical_background": "3-4 sentences",
  "cultural_significance": "2-3 sentences",
  "architectural_highlights": ["4-6 items"],
  "legends_and_stories": "1-2 stories",
  "virtual_tour_links": [],
  "virtual_tour_hotspots": [
    { "name": "spot", "description": "2 sentences" }
  ],
  "visitor_info": {
    "timings": "", "entry_fee": "", "best_time_to_visit": "", "how_to_reach": "", "accessibility": ""
  },
  "nearby_sites": ["3-5 sites"],
  "conservation_status": "Well-preserved|Partially restored|Ruins|UNESCO protected",
  "data_source": "ai_generated"
}
Use "approximately" when uncertain. Fill every field.`;

// GET /api/sites/search?q=
const searchSites = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json({ results: [], found_in_db: false });

    const results = await Site.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' }, name: 1, slug: 1, location: 1, category: 1, conservation_status: 1 }
    ).sort({ score: { $meta: 'textScore' } }).limit(10);

    res.json({ results, found_in_db: results.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/sites/all
const getAllSites = async (req, res) => {
  try {
    const sites = await Site.find({}, {
      name: 1, slug: 1, location: 1, category: 1, conservation_status: 1,
    });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/sites/:slug
const getSiteBySlug = async (req, res) => {
  try {
    const site = await Site.findOne({ slug: req.params.slug });
    if (!site) return res.status(404).json({ error: 'Site not found' });
    res.json(site);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateSite = async (req, res) => {
  try {
    const { place_name } = req.body;

    if (!place_name) {
      return res.status(400).json({
        error: "place_name required"
      });
    }

    /* CREATE SLUG */

    const slug = place_name
      .toLowerCase()
      .replace(/\s+/g, "-");

    console.log("Slug:", slug);

    /* FIRST CHECK — RETURN EXISTING */

    let existing = await Site.findOne({ slug });

    if (existing) {
      console.log("Returning existing site");
      return res.json(existing);
    }

    /* GENERATE AI DATA */

    const raw = await chatCompletion(
      GENERATE_SYSTEM,
      `Generate heritage profile for: ${place_name}`
    );

    let siteData;

    try {
      const cleaned = raw
        .replace(/```json|```/g, "")
        .trim();

      siteData = JSON.parse(cleaned);

    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON"
      });
    }

    /* FORCE REQUIRED FIELDS */

    siteData.name = place_name;
    siteData.slug = slug;

    /* FIX virtual_tour_links FORMAT */

    if (!Array.isArray(siteData.virtual_tour_links)) {
      if (typeof siteData.virtual_tour_links === "string") {
        siteData.virtual_tour_links = [
          {
            url: siteData.virtual_tour_links,
            type: "maps",
            label: "Virtual Tour"
          }
        ];
      } else {
        siteData.virtual_tour_links = [];
      }
    }

    /* GENERATE IMAGES */

    let images = [];

    try {
      images = await generateImages(place_name);
    } catch {
      console.log("Image generation failed");
    }

    siteData.images = images || [];

    console.log("Saving site...");

    const site = await Site.create(siteData);

    console.log("Saved successfully");

    return res.json(site);

  } catch (err) {

    /* SECOND SAFETY — HANDLE DUPLICATE */

    if (err.code === 11000) {

      console.log("Duplicate detected — returning existing");

      const slug =
        req.body.place_name
          .toLowerCase()
          .replace(/\s+/g, "-");

      const existing =
        await Site.findOne({ slug });

      return res.json(existing);
    }

    console.error("SERVER ERROR:", err);

    res.status(500).json({
      error: err.message
    });

  }
};
const getSiteSection = async (req, res) => {

  try {

    const { slug, section } = req.params;

    const site = await Site.findOne({ slug });

    if (!site) {
      return res.status(404).json({
        error: "Site not found"
      });
    }

    let fieldName;

    if (section === "history")
      fieldName = "history_full";

    if (section === "architecture")
      fieldName = "architecture_full";

    if (section === "culture")
      fieldName = "culture_full";

    if (section === "visitor")
      fieldName = "visitor_full";



    /* If already exists → return immediately */

    if (site[fieldName]) {

      return res.json({
        content: site[fieldName],
        keywords: `${site.name} ${section}`
      });

    }



    /* Generate detailed content */

    const prompt = `
Write a detailed educational article about:

Site: ${site.name}
Section: ${section}

Minimum 300 words.
Clear paragraphs.
Educational tone.
Include historical facts.
`;

    const content = await chatCompletion(
      "You are a heritage historian.",
      prompt
    );



    /* Save to database */

    site[fieldName] = content;

    await site.save();



    res.json({
      content,
      keywords: `${site.name} ${section}`
    });

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


module.exports = { searchSites, getAllSites, getSiteBySlug, generateSite,getSiteSection };