const checkAccess = (requiredRoles) => {
  return (req, res, next) => {
    const subUserRoles = req.subaccount ? req.subaccount.role : null; 

    if (!subUserRoles && !req.user) {
      res.status(403).json({ error: "Acesso negado." });
      return;
    }

    if (
      !subUserRoles ||
      requiredRoles.some((role) => subUserRoles.includes(role))
    ) {
      next(); 
    } else {
      res.status(403).json({ error: "Acesso negado." });
    }
  };
};

module.exports = checkAccess;
