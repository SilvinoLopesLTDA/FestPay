const asyncHandler = require("express-async-handler");
const Worker = require("../models/workersModel");
const sendEmail = require("../util/sendEmail");

// Register Worker
const registerWorker = asyncHandler(async (req, res) => {
  const { name, email, password, func } = req.body;

  // Validation
  if (!name || !email || !password || !func) {
    res.status(400);
    throw new Error("Preencha os campos corretamente.");
  }

  // Check if worker email already exist
  const workerExists = await Worker.findOne({ email });

  if (workerExists) {
    res.status(400);
    throw new Error("O email já está cadastrado!");
  }

  // Create new worker
  const worker = await Worker.create({
    user: req.user._id,
    name,
    email,
    password,
    func,
  });

  const createPasswordUrl = `${process.env.FRONTEND_URL}/${worker._id}`;

  // Confirmation Email
  const message = `
  <h2> Parabéns ${worker.name} </h2>

  <p>Parabéns! Você foi definido como "${worker.func}" do sistema FestPay.</p>
  <p>Esperamos que esta mensagem o encontre bem. Gostaríamos de informar que você foi designado para desempenhar uma função essencial durante nosso próximo evento. Sua dedicação é fundamental para garantir o sucesso da festa, e estamos confiantes de que você contribuirá de maneira significativa.</p>
  <p>Siga as instruções abaixo para encontrar detalhes da sua função dos trabalhadores:</p>

  <h3>1. Confirme os detalhes do seu cadastro:</h3>
  <ul>
    <li><strong>Nome:</strong> ${worker.name}</li>
    <li><strong>Email:</strong> ${worker.email}</li>
    <li><strong>Senha:</strong> ${worker.password}</li>
  </ul>
  <p> Para concluir o seu cadastro clique no link abaixo e faça o seu Login:   <a href="${createPasswordUrl}" clicktracking=off>${createPasswordUrl}</a></p>

  <strong>Função: Caixa</strong>
    <p>Nesta função, você será responsável por realizar o cadastro dos clientes e gerenciar as recargas dos QR Codes. Sua precisão e atenção aos detalhes serão cruciais para garantir um processo suave e eficiente. Contamos com sua habilidade para proporcionar uma experiência positiva aos participantes do evento.</p>
    
    <strong>Função: Barraca</strong>
    <p>Nesta função, você será responsável por realizar a venda dos itens na barraca. Sua simpatia e habilidade em lidar com os clientes serão fundamentais para garantir uma experiência agradável de compra. Contamos com sua disposição para atender às necessidades dos participantes da festa.</p>
    
    <strong>Função: Almoxarifado</strong>
    <p>Nesta função, você será responsável por cadastrar todos os itens do inventário da festa para que os usuários da barraca possam integrar seus itens. Sua organização e atenção aos detalhes serão essenciais para manter um controle eficiente dos produtos. Contamos com seu compromisso para garantir um fluxo de trabalho fluido.</p>
    
    <p>Lembramos que o seu papel é fundamental para o funcionamento harmonioso do evento, e agradecemos desde já o seu compromisso. Caso tenha alguma dúvida ou precise de orientações adicionais, não hesite em entrar em contato com a equipe de coordenação.</p>
    
    <p>Agradecemos antecipadamente pelo seu empenho e esperamos contar com sua dedicação durante todo o evento.</p>
    

  <p>Atenciosamente,</p>
  <p>Time de Desenvolvimento FestPay</p>
        `;
  const subject = `Parabéns! Você foi nomeado como: ${worker.func}`;
  const send_to = worker.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);
  } catch (error) {
    res.status(500);
    throw new Error("Email não enviado. Por favor, tente novamente!");
  }

  // // Generate Token
  // const token = generateToken(worker._id);

  // // Send HTTP-only cookie
  // res.cookie("token", token, {
  //   path: "/",
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 1000 * 86400), // 1 day
  //   sameSite: "none",
  //   secure: true,
  // });

  if (worker) {
    const { _id, name, email } = worker;
    res.status(201).json({
      _id,
      name,
      email,
      password,
      func,
      // token,
    });
  } else {
    res.status(400);
    throw new Error("Dados de operário invalidos!");
  }
});

// Get all workers
const getWorkers = asyncHandler(async (req, res) => {
  const shops = await Worker.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(shops);
});

// Get Worker Data
const getWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.params.id);

  if (worker) {
    const { _id, name, email, func } = worker;
    res.status(200).json({
      _id,
      name,
      email,
      func,
    });
  } else {
    res.status(400);
    throw new Error("Operário não encontrado!");
  }
});

const deleteWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.params.id);

  if (!worker) {
    res.status(404);
    throw new Error("Operário não encontrado.");
  }

  if (worker.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error({ message: "Operário Deletado com Sucesso." });
  }

  await worker.remove();
  res.status(200).json(worker);
});

// Update Worker
const updateWorker = asyncHandler(async (req, res) => {
  const { name, email, password, func } = req.body;
  const { id } = req.params;
  const worker = await Worker.findById(id);

  if (!worker) {
    res.status(404);
    throw new Error("Operário não encontrado.");
  }

  // Update Worker
  const updatedWorker = await Worker.findByIdAndUpdate(
    { _id: id },
    {
      name,
      email,
      password,
      func,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedWorker);
});

module.exports = {
  registerWorker,
  getWorkers,
  getWorker,
  deleteWorker,
  updateWorker,
};
