const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const sendEmail = require("../util/sendEmail");

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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
    password
  });

  const createPasswordUrl = `${process.env.FRONTEND_URL}/${admin._id}`;

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
          <li><strong>Senha:</strong> ${admin.password}</li>
        </ul>
        <p> Para concluir o seu cadastro clique no link abaixo e faça o seu Login:</p>
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
      password
      // token,
    });
  } else {
    res.status(400);
    throw new Error("Dados de Administrador invalidos!");
  }
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

  if (!admin) {
    res.status(404);
    throw new Error("Administrador não encontrado.");
  }

  // Update Admin
  const updatedAdmin = await Admin.findByIdAndUpdate(
    { _id: id },
    {
      name,
      email,
      password,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedAdmin);
});

// Create Password
const createPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // Validation
  if (!password) {
    res.status(400);
    throw new Error("Por favor, preencha os campos corretamente!");
  }

  if (password.length > 4) {
    res.status(400);
    throw new Error("A senha não pode conter mais de 4 caracteres!");
  }

  if (password.length < 4) {
    res.status(400);
    throw new Error("A senha não pode conter menos de 4 caracteres!");
  }

  // Create Password
  const pass = await Admin.create({
    user: req.user.id,
    password,
  });

  res.status(201).json({ _id: pass._id, password});
});


module.exports = {
  registerAdmin,
  getAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
  createPassword,
};
