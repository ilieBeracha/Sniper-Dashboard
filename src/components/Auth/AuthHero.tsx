import img from "../../assets/auth.png";
export default function AuthHero() {
  return (
    <div className="px-12 flex justify-center items-center md:flex md:w-2/2 bg-gradient-to-br from-[#0A0A0A] to-[#121212] relative overflow-hidden">
      <div className="max-w-2xlh-full">
        <img src={img} alt="Auth Hero" className="w-full h-full rounded-lg opacity-65" />
      </div>
    </div>
  );
}
