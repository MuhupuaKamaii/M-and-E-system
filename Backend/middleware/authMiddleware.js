// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabaseClient");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    
    // Fetch user from Supabase using decoded.user_id
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", decoded.user_id)
      .single();

    if (error || !user) {
      console.log('User not found in database:', error);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Export both as named export and default export for compatibility
module.exports = authenticate;
module.exports.authenticate = authenticate;
