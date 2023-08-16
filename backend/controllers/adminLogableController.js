const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AdminToken = require("../models/adminTokenModel");
const crypto = require("crypto");
const sendEmail = require("../util/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Por favor, adicione o email e a senha.");
  }

  // Check if admin exists
  const admin = await Admin.findOne({ email });

  if (!admin) {
    res.status(400);
    throw new Error("Administrador não encontrado. Por favor, cadastre-se!");
  }

  // Admin exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, admin.password);

  // Generate Token
  const token = generateToken(admin._id);

  // Send HTTP-only cookie
  if (passwordIsCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
  }

  if (admin && passwordIsCorrect) {
    const { _id, name, email } = admin;
    res.status(200).json({
      _id,
      name,
      email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Email ou Senha inválido!");
  }
});

// Logout Admin
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "Deslogado com sucesso!",
  });
}); 

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Update Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;
  const { id } = req.params;
  const admin = await Admin.findById(id);

  // Validate
  if (!admin) {
    res.status(400);
    throw new Error("Administrador não encontrado! Por favor, cadastre-se.");
  }

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Por favor, adicione a antiga e nova senha.");
  }

  // Chech if old password matched password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, admin.password);

  // Save new password
  if (admin && passwordIsCorrect) {
    admin.password = password;
    await admin.save();
    res.status(200).send("A senha foi atualizada com sucesso!");
  } else {
    res.status(400);
    throw new Error("A senha antiga está incorreta!");
  }
});

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    res.status(400);
    throw new Error("Usuário não existe!");
  }

  // Delete Token if it exists in DB
  let adminToken = await AdminToken.findOne({ adminId: admin._id });
  if (adminToken) {
    await adminToken.deleteOne();
  }

  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + admin._id;
  console.log(resetToken);

  // Hash Token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new AdminToken({
    adminId: admin._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 30 minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
      <h2> Olá Administrador ${admin.name} </h2>
  
      <p>Por favor, use o link abaixo para mudar a sua senha.<p>
      <p>Este link apenas será valido por 30 minutos!<p>
  
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
  
      <p>Atenciosamente;</p>
      <p>Time de Desenvolvimento;</p>
      `;
  const subject = "Redefinição de Senha";
  const send_to = admin.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);
    res
      .status(200)
      .json({ success: true, message: "Email de Redefinição Enviado!" });
  } catch (error) {
    res.status(500);
    throw new Error("Email não enviado. Por favor, tente novamente!");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash Token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find Token in DB
  const adminToken = await AdminToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!adminToken) {
    res.status(404);
    throw new Error("Token Inválido ou Expirado!");
  }

  // Find admin
  const admin = await Admin.findOne({
    _id: adminToken.adminId,
  });
  admin.password = password;
  await admin.save();
  res.status(200).json({
    message: "Senha Redefinida com Sucesso! Por Favor, Entre em sua Conta.",
  });
});

module.exports = {
  loginAdmin,
  logout,
  loginStatus,
  changePassword,
  forgotPassword,
  resetPassword,
};
