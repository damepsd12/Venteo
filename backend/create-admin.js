const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGODB_URI = "mongodb+srv://fg422824:pADUgQ4EmMO8M5vM@cluster0.gqhouhb.mongodb.net/essaie1?retryWrites=true&w=majority";

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connexion MongoDB réussie");

    const email = "fg422824@gmail.com";
    const password = "APBH8ocdi"; // Mot de passe fort à changer ensuite

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("❌ Un administrateur avec cet e-mail existe déjà.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
        name: "Fatou GUEYE",
        email,
        password: hashedPassword,
        role: "admin",
        isSeller: false,
        pending: false,
        termsAccepted: true, // ✅ important
      });
    await admin.save();
    console.log("✅ Administrateur créé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'administrateur :", error.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();