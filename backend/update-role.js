const mongoose = require('mongoose');
const User = require('./models/User'); // adapte selon ton chemin

mongoose.connect('mongodb+srv://fg422824:pADUgQ4EmMO8M5vM@cluster0.gqhouhb.mongodb.net/essaie1?retryWrites=true&w=majority'); // ta connexion MongoDB

async function updateRole() {
  const user = await User.findOne({ email: "fg422824@gmail.com" });

  if (user) {
    user.role = "admin";
    user.pending = false;
    await user.save();
    console.log("Rôle mis à jour avec succès !");
  } else {
    console.log("Utilisateur non trouvé.");
  }

  mongoose.disconnect();
}

updateRole();
