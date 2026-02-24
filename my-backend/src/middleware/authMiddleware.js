const jwt = require("jsonwebtoken");
const Doctor = require("../models/DoctorModel");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await Doctor.findById(decoded.id).select("-password");

    if (!doctor) {
      return res.status(401).json({
        message: "Doctor not found.",
      });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized. Invalid token.",
    });
  }
};