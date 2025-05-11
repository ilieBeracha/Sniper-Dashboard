import img from "../../assets/auth.png";
export default function AuthHero() {
  return (
    <div className="hidden md:flex px-12 justify-center items-center md:w-2/2 justify-self-center bg-gradient-to-br from-[#0A0A0A] to-[#121212] relative overflow-hidden">
      <div className="max-w-2xl h-full">
        <img src={img} alt="Auth Hero" className="w-full h-full rounded-lg opacity-65 object-contain min-w-[1500px]" />
      </div>
    </div>
  );
}
