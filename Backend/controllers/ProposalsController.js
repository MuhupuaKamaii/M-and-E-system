// controllers/ProposalsController.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getProposalsdata(req, res) {
  try {
    console.log('getProposalsdata called, user:', req.user); // Debug log
    
    const userId = req.user.user_id; // From auth middleware
    
    console.log('User ID:', userId);

    // Get user's organization
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('user_id', userId)
      .single();

    if (userError) {
      console.log('Error fetching user data:', userError);
      return res.status(500).json({ message: 'Error fetching user data', error: userError.message });
    }

    const organisationId = userData.organisation_id;
    console.log('Organisation ID:', organisationId);

    // Fetch pillars (not organization-specific, but needed for hierarchy)
    const { data: pillars, error: pillarError } = await supabase
      .from('pillar')
      .select('*')
      .order('name');

    if (pillarError) {
      console.log('Error fetching pillars:', pillarError);
      return res.status(500).json({ message: 'Error fetching pillars', error: pillarError.message });
    }

    // Fetch themes linked to pillars
    const { data: themes, error: themeError } = await supabase
      .from('theme')
      .select('*')
      .order('name');

    if (themeError) {
      console.log('Error fetching themes:', themeError);
      return res.status(500).json({ message: 'Error fetching themes', error: themeError.message });
    }

    // Fetch focus areas for the user's organization
    const { data: focusAreas, error: focusAreaError } = await supabase
      .from('focus_area')
      .select('*')
      .eq('organisation_id', organisationId)
      .order('name');

    if (focusAreaError) {
      console.log('Error fetching focus areas:', focusAreaError);
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
      console.log('Error fetching programmes:', programmeError);
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
      console.log('Error fetching strategies:', strategyError);
      return res.status(500).json({ message: 'Error fetching strategies', error: strategyError.message });
    }

    console.log('Data fetched successfully:', {
      pillars: pillars.length,
      themes: themes.length,
      focusAreas: focusAreas.length,
      programmes: programmes.length,
      strategies: strategies.length
    });

    res.json({
      pillars,
      themes,
      focusAreas,
      programmes,
      strategies,
      organisationId
    });

  } catch (error) {
    console.error('Error in getProposalsdata:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = {
  proposalsController: {
    getProposalsdata
  }
};