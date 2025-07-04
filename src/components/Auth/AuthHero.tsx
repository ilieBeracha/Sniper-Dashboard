import img from "../../assets/auth.png";
import { useTheme } from "@/contexts/ThemeContext";

export default function AuthHero() {
  const { theme } = useTheme();
  return (
    <div className={`hidden md:flex px-12 justify-center items-center md:w-2/2 justify-self-center relative overflow-hidden transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#0A0A0A] to-[#121212]' 
        : 'bg-gradient-to-br from-gray-100 to-gray-200'
    }`}>
      <div className="max-w-2xl h-full">
        <img src={img} alt="Auth Hero" className="w-full h-full rounded-lg opacity-65 object-contain min-w-[1500px]" />
      </div>
    </div>
  );
}
