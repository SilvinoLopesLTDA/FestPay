const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../util/sendEmail");
const { CronJob } = require("cron");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const cleanExpiredAccounts = async () => {
  console.log("Verificando contas...");
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() - 24);

  try {
    const expiredUsers = await User.find({
      isConfirmed: false,
      confirmationTokenExpires: { $lte: expirationDate },
    });

    for (const user of expiredUsers) {
      await User.findByIdAndRemove(user._id);
      console.log(`Conta de usuário expirada excluída: ${user.email}`);
    }
  } catch (error) {
    console.error("Erro ao limpar contas de usuário expiradas:", error);
  }
};

const job = new CronJob(
  "* */12 * * *",
  cleanExpiredAccounts,
  null,
  true,
  "UTC"
);

job.start();

const sendConfirmationEmail = asyncHandler(
  async (toEmail, confirmationToken) => {
    const confirmLink = `${process.env.FRONTEND_URL}/confirm-email/${confirmationToken}`;

    const message = `
    <html>
    <head>
      <title>Boas vindas ao FestPay! Confirme o seu email</title>
    </head>
    <body>
      <div style="font-family: Arial, sans-serif;">
        <div style="background-color: #1e1b4b; color: #fff; text-align: center; padding: 10px;">
          <h1>Boas vindas ao FestPay!</h1>
        </div>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Olá,</p>
          <p>
            Bem-vindo ao FestPay! Para começar a usar sua conta, precisamos confirmar o seu e-mail.
          </p>
          <p>
            Clique no link abaixo para confirmar seu e-mail:
            <a href="${confirmLink}" style="font-size: 10px;">Confirmar meu e-mail</a>
          </p>
          <p style="font-size: 10px;">
            Ou cole este link no seu navegador: ${confirmLink}
          </p>
          <p>
            Se você não se cadastrou no FestPay, pode ignorar este e-mail.
          </p>
          <p>Obrigado!</p>
        </div>
        <div style="background-color: #1e1b4b; color: #fff; padding: 10px; text-align: center;">
          <p>Atenciosamente,</p>
          <p>Time de Desenvolvimento FestPay.</p>
        </div>
      </div>
    </body>
  </html>
  `;
    const subject = `Boas vindas ao FestPay! Confirme o seu email!`;
    const send_to = toEmail;
    const send_from = `Staff - FestPay 👨‍🔧 <${process.env.EMAIL_USER}>`;

    try {
      await sendEmail(subject, message, send_to, send_from);
    } catch (error) {
      throw new Error(
        "Email não enviado para à conta. Por favor, tente novamente!"
      );
    }
  }
);

const confirmEmail = asyncHandler(async (req, res) => {
  const confirmationToken = req.params.token;

  const user = await User.findOne({ confirmationToken });

  if (!user) {
    return res.status(400).json({ message: "Token de confirmação inválido." });
  }

  const currentTime = new Date();
  if (user.emailVerificationTokenExpires <= currentTime) {
    return res.status(400).json({ message: "Token de confirmação expirado." });
  }

  user.isEmailVerified = true;
  user.confirmationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Email confirmado com sucesso." });
});

// Register Subaccount (Admin or Worker)
const registerSubaccount = asyncHandler(async (req, res) => {
  const { name, email, password, role, workerFunction } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Preencha os campos corretamente.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("A senha deve conter mais de 6 caracteres.");
  }

  // Check if user email already exists
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("Usuário não encontrado.");
  }

  const emailExistsAsMaster = await User.findOne({ email });

  const emailExistsAsSubaccount = user.subaccounts.some(
    (sub) => sub.email === email
  );

  if (emailExistsAsMaster || emailExistsAsSubaccount) {
    res.status(400);
    throw new Error("O email já está cadastrado!");
  }

  // Create new subaccount
  user.subaccounts.push({
    user: req.user.id,
    name,
    email,
    password,
    role,
    workerFunction: role === "worker" ? workerFunction : null,
  });

  await user.save();

  // Confirmation email
  if (role === "worker") {
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Parabéns! Você foi nomeado(a) como trabalhador da festa! 🎉</title>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
    
            h2 {
                color: #fff;
                font-size: 30px;
            }

            h3 {
                margin-top: 40px;
                font-size: 25px;
            }
    
            p {
                font-size: 14px;
            }
    
            ul {
                list-style-type: none;
                padding: 0;
                margin: 15px 0;
            }
    
            li {
                margin-bottom: 10px;
            }
    
            strong {
                font-weight: bold;
            }
    
            .header {
                background-color: #1e1b4b;
                color: #fff;
                padding: 20px;
            }
    
            .content {
                padding: 20px;
            }

            .content h4 {
                font-size: 20px;
            }

            .content h5 {
                font-size: 18px;
                margin: 17px 0 0 0;
            }

            .function {
              margin: 10px 0;
            }

            hr {
                margin: 30px 0;
            }
    
            .footer {
                background-color: #1e1b4b;
                color: #fff;
                padding: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>Olá, ${name}!</h2>
        </div>
    
        <div class="content">
            <h4>Parabéns. Você foi definido(a) como <strong>"${workerFunction}"</strong> do sistema FestPay.</h4>
            <p>Esperamos que esta mensagem o encontre bem. Gostaríamos de informar que você foi designado para desempenhar uma função essencial durante nosso próximo evento. Sua dedicação é fundamental para garantir o sucesso da festa, e estamos confiantes de que você contribuirá de maneira significativa.</p>
            <p>Siga as instruções abaixo para encontrar detalhes da sua função dos trabalhadores:</p>
    
            <h3>1. Confira os detalhes do seu cadastro:</h3>
            <ul>
                <li><strong>Nome:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Senha:</strong> ${password}</li>
            </ul>
    
            <h3>2. Funções:</h3>
            <ul>
                <li class="function">
                    <strong><h5>Função: Caixa</h5></strong>
                    <p>Nesta função, você será responsável por realizar o cadastro dos clientes e gerenciar as recargas dos QR Codes. Sua precisão e atenção aos detalhes serão cruciais para garantir um processo suave e eficiente. Contamos com sua habilidade para proporcionar uma experiência positiva aos participantes do evento.</p>
                </li>
    
                <li class="function">
                    <strong><h5>Função: Barraca</h5></strong>
                    <p>Nesta função, você será responsável por realizar a venda dos itens na barraca. Sua simpatia e habilidade em lidar com os clientes serão fundamentais para garantir uma experiência agradável de compra. Contamos com sua disposição para atender às necessidades dos participantes da festa.</p>
                </li>
    
                <li class="function">
                    <strong><h5>Função: Almoxarifado</h5></strong>
                    <p>Nesta função, você será responsável por cadastrar todos os itens do inventário da festa para que os usuários da barraca possam integrar seus itens. Sua organização e atenção aos detalhes serão essenciais para manter um controle eficiente dos produtos. Contamos com seu compromisso para garantir um fluxo de trabalho fluido.</p>
                </li>
            </ul>
            <hr/>
            <div>
            <p>Lembramos que o seu papel é fundamental para o funcionamento harmonioso do evento, e agradecemos desde já o seu compromisso. Caso tenha alguma dúvida ou precise de orientações adicionais, não hesite em entrar em contato com a equipe de coordenação.</p>

            <h4 style="text-align:center;">Acesse o site por aqui: 
            <a href="${process.env.FRONTEND_URL}">link de redirecionamento</a>
            ou o colando este link no seu navegador ${process.env.FRONTEND_URL}</h4>

            <p>Agradecemos antecipadamente pelo seu empenho e esperamos contar com sua dedicação durante todo o evento.</p>
            </div>
        </div>
    
        <div class="footer">
            <p>Atenciosamente,</p>
            <p>Time de Desenvolvimento FestPay.</p>
        </div>
    </body>
    </html>
          `;
    const subject = `Parabéns! Você foi nomeado(a) Trabalhador(a) da festa! 🎉`;
    const send_to = email;
    const send_from = `Staff - FestPay 👨‍🔧 <${process.env.EMAIL_USER}>`;

    try {
      await sendEmail(subject, message, send_to, send_from);
    } catch (error) {
      res.status(500);
      throw new Error(
        "Email não enviado para o trabalhador. Por favor, tente novamente!"
      );
    }
  } else if (role === "admin") {
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Parabéns! Você foi nomeado(a) como trabalhador da festa! 🎉</title>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
    
            h2 {
                color: #fff;
                font-size: 30px;
            }

            h3 {
                margin-top: 40px;
                font-size: 25px;
            }
    
            p {
                font-size: 14px;
            }
    
            ul {
                list-style-type: none;
                padding: 0;
                margin: 15px 0;
            }
    
            li {
                margin-bottom: 10px;
            }
    
            strong {
                font-weight: bold;
            }
    
            .header {
                background-color: #1e1b4b;
                color: #fff;
                padding: 20px;
            }
    
            .content {
                padding: 20px;
            }

            .content h4 {
                font-size: 20px;
            }

            .content h5 {
                font-size: 18px;
                margin: 17px 0 0 0;
            }

            .function {
              margin: 10px 0;
            }

            hr {
                margin: 30px 0;
            }
    
            .footer {
                background-color: #1e1b4b;
                color: #fff;
                padding: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>Olá, Administrador(a) ${name}!</h2>
        </div>
    
        <div class="content">
            <h4>Parabéns! Você foi definido(a) como administrador(a) do sistema FestPay.</h4>
            <p>Agora você pode começar a configurar o sistema criando as barracas/pontos de venda e configurando os trabalhadores nas funções apropriadas.</p>
            <p>Siga as instruções abaixo para configurar as barracas e as funções dos trabalhadores:</p>
    
            <h3>1. Confira os detalhes do seu cadastro:</h3>
            <ul>
                <li><strong>Nome:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Senha:</strong> ${password}</li>
            </ul>
    
            <h3>2. Criar Barracas/Pontos de Venda:</h3>
            <p>Para criar uma barraca/ponto de venda, acesse a seção "Barracas" localizada na sidebar do sistema FestPay e procure a opção de criação de barracas. Preencha as informações necessárias, como nome da barraca, custo e outras informações relevantes. Certifique-se de salvar as configurações.</p>

            <h3>3. Configurar Trabalhadores:</h3>
            <p>Para configurar os trabalhadores nas funções corretas, siga estas etapas:</p>
            <ul>
                <li class="function">
                    <strong><h5>Caixa:</h5></strong> Defina um trabalhador como caixa se ele for responsável pelas transações financeiras e pelo registro das vendas. Atribua as permissões adequadas para o caixa no sistema;
                </li>
    
                <li class="function">
                  <strong><h5>Barraca:</h5></strong> Atribua a função de barraca aos trabalhadores responsáveis por gerenciar e atender os clientes na barraca/ponto de venda. Eles devem ter acesso aos produtos disponíveis, aos preços e aos registros de vendas da barraca;
                </li>
    
                <li class="function">
                    <strong><h5>Almoxarifado:</h5></h5></strong> Os trabalhadores designados para o almoxarifado devem ter acesso ao controle de estoque e gerenciar os produtos disponíveis para venda nas barracas.
                </li>
            </ul>
            <hr/>
            <div>
            <p>Lembre-se de fornecer as informações necessárias e orientações adicionais para os trabalhadores de acordo com as funções atribuídas.</p>

            <h4 style="text-align:center;">Acesse o site por aqui: 
            <a href="${process.env.FRONTEND_URL}">link de redirecionamento</a>
            ou o colando este link no seu navegador ${process.env.FRONTEND_URL}</h4>
    
            <p>Se você tiver alguma dúvida ou precisar de assistência, não hesite em entrar em contato com a equipe de suporte do FestPay.</p>
            </div>
        </div>
    
        <div class="footer">
            <p>Atenciosamente,</p>
            <p>Time de Desenvolvimento FestPay.</p>
        </div>
    </body>
    </html>
      `;
    const subject =
      "Parabéns! Você foi nomeado(a) Administrador(a) da festa! 🎉";
    const send_to = email;
    const send_from = `Staff - FestPay 👨‍🔧 <${process.env.EMAIL_USER}>`;

    try {
      await sendEmail(subject, message, send_to, send_from);
    } catch (error) {
      res.status(500);
      throw new Error(
        "Email não enviado para o administrador. Por favor, tente novamente!"
      );
    }
  }

  res.status(201).json({
    message: "Subconta cadastrada com sucesso!",
  });
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Preencha os campos corretamente.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("A senha deve conter mais de 6 caracteres.");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("O email já está cadastrado!");
  }

  const confirmationToken = generateToken();
  const tokenFormatted = confirmationToken.replace(/\./g, "");

  const tokenExpires = new Date();
  tokenExpires.setDate(tokenExpires.getDate() + 1);

  const user = await User.create({
    name,
    email,
    password,
    confirmationToken: tokenFormatted,
    emailVerificationTokenExpires: tokenExpires,
  });

  sendConfirmationEmail(user.email, tokenFormatted);

  res.status(201).json({
    message:
      "Usuário registrado com sucesso. Verifique seu e-mail para confirmar.",
  });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate Request
    if (!email || !password) {
      throw new Error("Por favor, adicione o email e a senha.");
    }

    // Check if user exists (master user or subaccount)
    const user = await User.findOne({
      $or: [{ email }, { "subaccounts.email": email }],
    });

    if (!user) {
      throw new Error("Usuário não encontrado. Por favor, cadastre-se!");
    }

    // Check if the user's email is confirmed
    if (!user.isEmailVerified) {
      throw new Error(
        "Você precisa confirmar seu e-mail antes de fazer login."
      );
    }

    // Check if password is correct for the user
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      throw new Error("Email ou Senha incorretos! Tente novamente.");
    }

    // Generate a new token with an extended expiration
    let token;

    let responseData;

    if (user.email === email) {
      token = generateToken(user._id);
      const {
        _id,
        name,
        email: userEmail,
        photo,
        phone,
        bio,
        subaccounts,
        role,
      } = user;
      responseData = {
        _id,
        name,
        email: userEmail,
        photo,
        phone,
        bio,
        subaccounts,
        role,
        token,
      };
    } else {
      const subaccount = user.subaccounts.find((sub) => sub.email === email);
      token = generateToken(subaccount._id);

      if (!subaccount) {
        throw new Error("Subconta não encontrada.");
      }

      const {
        _id,
        name,
        email: subEmail,
        photo,
        phone,
        bio,
        role,
        workerFunction,
      } = subaccount;

      responseData = {
        _id,
        name,
        email: subEmail,
        photo,
        phone,
        bio,
        role,
        workerFunction,
        token,
      };
    }

    // Send the new token as an HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    res.status(200).json(responseData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "Deslogado com sucesso!",
  });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  try {
    let userData;
    if (req.subaccount) {
      userData = req.subaccount;
    } else if (req.user) {
      userData = req.user;
    } else {
      throw new Error("Usuário não encontrado!");
    }

    if (userData) {
      const {
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        subaccounts,
        role,
        workerFunction,
      } = userData;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        subaccounts,
        role,
        workerFunction,
      });
    } else {
      res.status(400);
      throw new Error("Usuário não encontrado!");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get subaccounts
const listSubaccounts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Usuário não encontrado.");
  }

  const subaccounts = user.subaccounts.map((subaccount) => ({
    _id: subaccount._id,
    name: subaccount.name,
    email: subaccount.email,
    role: subaccount.role,
    workerFunction: subaccount.workerFunction,
  }));

  res.status(200).json(subaccounts);
});

// Get Specific Subaccount
const getSubaccountById = asyncHandler(async (req, res) => {
  const subaccountIdToGet = req.params.id; // ID da subconta a ser obtida

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Usuário não encontrado.");
  }

  // Encontre a subconta com o ID especificado
  const subaccountToGet = user.subaccounts.find(
    (subaccount) => subaccount._id.toString() === subaccountIdToGet
  );

  if (!subaccountToGet) {
    res.status(404);
    throw new Error("Subconta não encontrada.");
  }

  // Retorne a subconta encontrada
  res.status(200).json(subaccountToGet);
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

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const isSubaccount = req.subaccount ? req.subaccount._id.toString() : null;

  let user;

  if (isSubaccount) {
    user = await User.findOne({ "subaccounts._id": isSubaccount });
  } else {
    user = await User.findById(userId);
  }

  if (!user) {
    res.status(400);
    throw new Error("Usuário não encontrado! Por favor, cadastre-se.");
  }

  if (user) {
    // eslint-disable-next-line no-unused-vars
    const { _id, name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("Usuário não encontrado!");
  }
});

// Update Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user ? req.user._id : null;
  const isSubaccount = req.subaccount ? req.subaccount._id.toString() : null;

  let user;

  if (isSubaccount) {
    user = await User.findOne({ "subaccounts._id": isSubaccount });
  } else {
    user = await User.findById(userId);
  }
  if (!user) {
    res.status(400);
    throw new Error("Usuário não encontrado! Por favor, cadastre-se.");
  }

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Por favor, adicione a antiga e nova senha.");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  if (user && isPasswordCorrect) {
    user.password = newPassword;
    await user.save();
    res.status(200).send("A senha foi atualizada com sucesso!");
  } else {
    res.status(400);
    throw new Error("A senha antiga está incorreta!");
  }
});

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Usuário não existe!");
  }

  // Delete Token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Hash Token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 30 minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Reset Email
  const message = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Redefinição de Senha</title>
      <style>
          /* Estilos CSS para o email */
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          }
  
          h2 {
              color: #333;
          }
  
          p {
              color: #555;
          }
  
          a {
              color: #007bff;
              text-decoration: none;
          }

          .content {
            padding: 20px;
          }

          .footer {
            background-color: #1e1b4b;
            color: #fff;
            padding: 10px;
            text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="content">
            <h2>Olá, ${user.name}!</h2>
            <p>Por favor, use o link abaixo para mudar a sua senha.</p>
            <p>Este link apenas será válido por 30 minutos!</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
          </div>
          <div class="footer">
            <p>Atenciosamente,</p>
            <p>Time de Desenvolvimento</p>
          </div>
      </div>
  </body>
  </html>  
`;
  const subject = "Redefinição de Senha!";
  const send_to = user.email;
  const send_from = `Staff - FestPay 👨‍🔧 <${process.env.EMAIL_USER}>`;

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
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Token Inválido ou Expirado!");
  }

  // Find user
  const user = await User.findOne({
    _id: userToken.userId,
  });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Senha Redefinida com Sucesso! Por Favor, Entre em sua Conta.",
  });
});

// Update Subaccount
const updateSubaccount = asyncHandler(async (req, res) => {
  const subaccountIdToUpdate = req.params.id;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Usuário não encontrado.");
  }

  const subaccountToUpdate = user.subaccounts.find(
    (subaccount) => subaccount._id.toString() === subaccountIdToUpdate
  );

  if (!subaccountToUpdate) {
    res.status(404);
    throw new Error("Subconta não encontrada.");
  }

  const { name, password, role, workerFunction } = req.body;

  if (!role) {
    res.status(400);
    throw new Error("A função (role) é obrigatória para atualizar a subconta.");
  }

  if (name) {
    subaccountToUpdate.name = name;
  }

  if (password) {
    subaccountToUpdate.password = password;
  }

  subaccountToUpdate.role = role;

  if (role === "worker" && workerFunction) {
    subaccountToUpdate.workerFunction = workerFunction;
  } else {
    subaccountToUpdate.workerFunction = null;
  }

  await user.save();

  res.status(200).json({
    message: "Subconta atualizada com sucesso!",
  });
});

// Delete Subaccount
const deleteSubaccount = asyncHandler(async (req, res) => {
  const subaccountIdToDelete = req.params.id;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Usuário não encontrado.");
  }

  const subaccountToDelete = user.subaccounts.find(
    (subaccount) => subaccount._id.toString() === subaccountIdToDelete
  );

  if (!subaccountToDelete) {
    res.status(404);
    throw new Error("Subconta não encontrada.");
  }

  user.subaccounts = user.subaccounts.filter(
    (subaccount) => subaccount._id.toString() !== subaccountIdToDelete
  );

  await user.save();

  res.status(200).json({
    message: "Subconta excluída com sucesso!",
  });
});

// Delete Account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.subaccount ? req.subaccount.user : req.user.id;
    const { password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Senha incorreta. A conta não foi excluída." });
    }

    await user.remove();

    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0), // 1 day
      sameSite: "none",
      secure: true,
    });

    return res
      .status(200)
      .json({ message: "Sua conta foi excluída com sucesso." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao excluir a conta." });
  }
};

module.exports = {
  registerSubaccount,
  registerUser,
  confirmEmail,
  loginUser,
  logout,
  getUser,
  listSubaccounts,
  getSubaccountById,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  updateSubaccount,
  deleteSubaccount,
  deleteAccount,
};
