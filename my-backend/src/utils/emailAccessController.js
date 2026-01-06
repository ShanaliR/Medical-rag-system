const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema, "users");

async function isAuthorizedEmailUser(email) {
  try {
    const normalized = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalized });
    console.log(`📧 Email auth check for ${normalized}:`, !!user);
    return !!user;
  } catch (err) {
    console.error("❌ Email authorization error:", err);
    return false;
  }
}

module.exports = { isAuthorizedEmailUser };
