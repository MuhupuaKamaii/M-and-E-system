const jwt = require("jsonwebtoken");
const supabase = require("../config/supabaseClient");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from("users")
      .select(`
        user_id,
        full_name,
        username,
        organisation_id,
        focus_area_id,
        role_id,
        roles(role_name)
      `)
      .eq("user_id", decoded.user_id)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user.user_id,
      full_name: user.full_name,
      username: user.username,
      role: user.roles.role_name,
      organisation_id: user.organisation_id,
      focus_area_id: user.focus_area_id,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
