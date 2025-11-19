const { createClient } = require('@supabase/supabase-js');
const jwt = require("jsonwebtoken");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
async function getProposalsdata(req, res)  {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.user_id;
    
    console.log(userId)// From auth middleware
    
    // Get user's organization
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('user_id', userId)
      .single();

    if (userError) {
      return res.status(500).json({ message: 'Error fetching user data', error: userError.message });
    }

    const organisationId = userData.organisation_id;

    // Fetch pillars (not organization-specific, but needed for hierarchy)
    const { data: pillars, error: pillarError } = await supabase
      .from('pillar')
      .select('*')
      .order('name');

    if (pillarError) {
      return res.status(500).json({ message: 'Error fetching pillars', error: pillarError.message });
    }

    // Fetch themes linked to pillars
    const { data: themes, error: themeError } = await supabase
      .from('theme')
      .select('*')
      .order('name');

    if (themeError) {
      return res.status(500).json({ message: 'Error fetching themes', error: themeError.message });
    }

    // Fetch focus areas for the user's organization
    const { data: focusAreas, error: focusAreaError } = await supabase
      .from('focus_area')
      .select('*')
      .eq('organisation_id', organisationId)
      .order('name');

    if (focusAreaError) {
      return res.status(500).json({ message: 'Error fetching focus areas', error: focusAreaError.message });
    }

    // Get focus area IDs
    const focusAreaIds = focusAreas.map(fa => fa.id);

    // Fetch programmes linked to the organization's focus areas
    const { data: programmes, error: programmeError } = await supabase
      .from('programme')
      .select('*')
      .in('focus_area_id', focusAreaIds)
      .order('name');

    if (programmeError) {
      return res.status(500).json({ message: 'Error fetching programmes', error: programmeError.message });
    }

    // Get unique strategy IDs from focus areas
    const strategyIds = [...new Set(focusAreas.map(fa => fa.strategy_id).filter(Boolean))];

    // Fetch strategies
    const { data: strategies, error: strategyError } = await supabase
      .from('strategy')
      .select('*')
      .in('id', strategyIds)
      .order('name');

    if (strategyError) {
      return res.status(500).json({ message: 'Error fetching strategies', error: strategyError.message });
    }
    res.json({
      pillars,
      themes,
      focusAreas,
      programmes,
      strategies,
      organisationId
    });

  } catch (error) {
    console.error('Error in getFormData:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  propalsController: {
    getProposalsdata
  }
};