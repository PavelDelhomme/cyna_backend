let users = []; // Stockage temporaire des utilisateurs en mémoire

exports.getAllUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const { name, mail, password } = req.body;

  if (!name || !mail || !password) {
    return res.status(400).json({ error: 'Veuillez fournir un nom, un mail et un mot de passe.' });
  }

  const newUser = { id: users.length + 1, name, mail, password };
  users.push(newUser);
  res.status(201).json(newUser);
};
