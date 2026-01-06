const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({}, { strict: false });
const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema, "employees");

async function isAuthorizedUser(contact) {
  try {
    let normalizedContact = contact.trim();
    if (!normalizedContact.startsWith("+")) {
      normalizedContact = "+" + normalizedContact;
    }

    const user = await Employee.findOne({ contact: normalizedContact });
    console.log(`Authorization check for ${contact} (normalized: ${normalizedContact}):`, !!user);
    return !!user;
  } catch (err) {
    console.error("Error checking authorization:", err);
    return false;
  }
}

module.exports = { isAuthorizedUser };
