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

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    res.status(400);
    throw new Error("Preencha os campos corretamente.");
  }

  // Check if admin email already exist
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error("O email já está cadastrado!");
  }

  // Create new admin
  const admin = await Admin.create({
    user: req.user._id,
    name,
    email,
  });

  const createPasswordUrl = `${process.env.FRONTEND_URL}/create-password/${admin._id}`;

  // Confirmation Email
  const message = `
      <h2> Olá Administrador ${admin.name} </h2>
  
      <p>Parabéns! Você foi definido como administrador do sistema FestPay.</p>
      <p>Agora você pode começar a configurar o sistema criando as barracas/pontos de venda e configurando os trabalhadores nas funções apropriadas.</p>
      <p>Siga as instruções abaixo para configurar as barracas e as funções dos trabalhadores:</p>

      <h3>1. Confirme os detalhes do seu cadastro:</h3>
        <ul>
          <li><strong>Nome:</strong> ${admin.name}</li>
          <li><strong>Email:</strong> ${admin.email}</li>
        </ul>
        <p> Para obter sua senha e concluir o seu cadastro clique no link abaixo:</p>
        <a href="${createPasswordUrl}" clicktracking=off>${createPasswordUrl}</a>

      <h3>2. Criar Barracas/Pontos de Venda:</h3>
      <p>Para criar uma barraca/ponto de venda, acesse a seção "Barracas" localizada na sidebar do sistema FestPay e procure a opção de criação de barracas. Preencha as informações necessárias, como nome da barraca, custo e outras informações relevantes. Certifique-se de salvar as configurações.</p>
      
      <h3>3. Configurar Trabalhadores:</h3>
      <p>Para configurar os trabalhadores nas funções corretas, siga estas etapas:</p>
      <ul>
        <li><strong>Caixa:</strong> Defina um trabalhador como caixa se ele for responsável pelas transações financeiras e pelo registro das vendas. Atribua as permissões adequadas para o caixa no sistema.</li>
        <li><strong>Barraca:</strong> Atribua a função de barraca aos trabalhadores responsáveis por gerenciar e atender os clientes na barraca/ponto de venda. Eles devem ter acesso aos produtos disponíveis, aos preços e aos registros de vendas da barraca.</li>
        <li><strong>Almoxarifado:</strong> Os trabalhadores designados para o almoxarifado devem ter acesso ao controle de estoque e gerenciar os produtos disponíveis para venda nas barracas.</li>
      </ul>
      
      <p>Lembre-se de fornecer as informações necessárias e orientações adicionais para os trabalhadores de acordo com as funções atribuídas.</p>
    
      <p>Se você tiver alguma dúvida ou precisar de assistência, não hesite em entrar em contato com a equipe de suporte do FestPay.</p>
      
      <p>Atenciosamente,</p>
      <p>Time de Desenvolvimento FestPay</p>
        `;
  const subject = "Parabéns! Você foi nomeado Administrador";
  const send_to = admin.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);
  } catch (error) {
    res.status(500);
    throw new Error("Email não enviado. Por favor, tente novamente!");
  }

  // // Generate Token
  // const token = generateToken(admin._id);

  // // Send HTTP-only cookie
  // res.cookie("token", token, {
  //   path: "/",
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 1000 * 86400), // 1 day
  //   sameSite: "none",
  //   secure: true,
  // });

  if (admin) {
    const { _id, name, email } = admin;
    res.status(201).json({
      _id,
      name,
      email,
      // token,
    });
  } else {
    res.status(400);
    throw new Error("Dados de Administrador invalidos!");
  }
});

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

// Get all Admins
const getAdmins = asyncHandler(async (req, res) => {
  const shops = await Admin.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(shops);
});

// Get Admin Data
const getAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);

  if (admin) {
    const { _id, name, email } = admin;
    res.status(200).json({
      _id,
      name,
      email,
    });
  } else {
    res.status(400);
    throw new Error("Administrador não encontrado!");
  }
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

const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);

  if (!admin) {
    res.status(404);
    throw new Error("Administrador não encontrado.");
  }

  if (admin.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error({ message: "Administrador Deletado com Sucesso." });
  }

  await admin.remove();
  res.status(200).json(admin);
});

// Update Admin
const updateAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.params;
  const admin = await Admin.findById(id);

  if (admin) {
    admin.email = email;
    admin.password = password;
    admin.name = req.body.name || name;

    const updatedAdmin = await admin.save();
    res.status(200).json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      password: updatedAdmin.password,
    });
  } else {
    res.status(404);
    throw new Error("Administrador não encontrado!");
  }
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
  registerAdmin,
  loginAdmin,
  logout,
  getAdmins,
  getAdmin,
  loginStatus,
  deleteAdmin,
  updateAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
};
