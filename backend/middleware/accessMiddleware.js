const checkAccess = (requiredRoles) => {
  return (req, res, next) => {
    const subUserRoles = req.subaccount ? req.subaccount.role : null; // Obtenha as funções do usuário subconta, se existirem

    // Se não houver uma função de usuário subconta e não for um usuário mestre, negue o acesso
    if (!subUserRoles && !req.user) {
      res.status(403).json({ error: "Acesso negado." });
      return;
    }

    // Se o usuário for um usuário mestre ou tiver pelo menos uma das funções necessárias, permita o acesso
    if (
      !subUserRoles ||
      requiredRoles.some((role) => subUserRoles.includes(role))
    ) {
      next(); // O usuário tem permissão, siga em frente
    } else {
      res.status(403).json({ error: "Acesso negado." }); // Usuário não autorizado
    }
  };
};

module.exports = checkAccess;
