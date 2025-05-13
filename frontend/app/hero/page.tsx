import Footer from "../components/Footer";

export default function SellerBanner() {
  return (
   <div className="pt-20">
         <section className="w-full bg-orange-500 text-white py-12 px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-8 rounded-b">
      
      {/* Texte à gauche */}
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold uppercase">
          Des milliers de vendeurs nous ont rejoints, <br />
          <span className="text-black">Faites comme eux !</span>
        </h2>
        <p className="mt-4 text-lg">Rejoignez-nous et ouvrez votre boutique gratuitement.</p>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
          <a
            href="/auth/register"
            className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Inscrivez-vous
          </a>
          <a
            href="/auth/login"
            className="bg-gradient-to-r from-yellow-400 to-green-400 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Commencer à vendre
          </a>
        </div>
      </div>

      {/* Illustration à droite */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/images/seller-banner-illustration.png"
          alt="Illustration e-commerce"
          className="w-full max-w-md"
        />
      </div>
    </section>
    <Footer/>
   </div>
  );
}
