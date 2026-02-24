const Doctor = require("../models/DoctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Doctor Signup
exports.signupDoctor = async (req, res) => {
  try {
    const {
      doctorId,
      fullName,
      email,
      password,
      specialization,
      hospital,
    } = req.body;

    // Check existing doctor
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { doctorId }],
    });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already exists with this email or ID.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = new Doctor({
      doctorId,
      fullName,
      email,
      password: hashedPassword,
      specialization,
      hospital,
    });

    await doctor.save();

    res.status(201).json({
      message: "Doctor registered successfully.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Signup failed.",
      error: error.message,
    });
  }
};


// Doctor Login

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: doctor._id,
        doctorId: doctor.doctorId,
        role: doctor.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        fullName: doctor.fullName,
        email: doctor.email,
        specialization: doctor.specialization,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
};