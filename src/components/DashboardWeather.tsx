import { useEffect, useState } from "react";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Eye, Compass, Thermometer, MapPin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { WaveLoader } from "./ui/loader";

interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    visibility: number;
    pressure: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  };
}

const getWindDirection = (deg: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

const getWeatherIcon = (main: string) => {
  switch (main.toLowerCase()) {
    case "clear":
      return <Sun className="w-12 h-12" />;
    case "clouds":
      return <Cloud className="w-12 h-12" />;
    case "rain":
    case "drizzle":
      return <CloudRain className="w-12 h-12" />;
    case "snow":
      return <CloudSnow className="w-12 h-12" />;
    default:
      return <Cloud className="w-12 h-12" />;
  }
};

export default function DashboardWeather() {
  const { theme } = useTheme();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  useEffect(() => {
    const fetchWeatherByCoords = async (lat: number, lon: number) => {
      try {
        // Using OpenWeatherMap API (you'll need to get an API key)
        const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || "YOUR_API_KEY_HERE";

        // First get location name from coordinates
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
        const geoData = await geoResponse.json();

        // Then get weather data
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === 200) {
          setWeather({
            location: {
              name: geoData[0]?.name || weatherData.name,
              country: geoData[0]?.country || weatherData.sys.country,
              lat,
              lon,
            },
            current: {
              temp: Math.round(weatherData.main.temp),
              feels_like: Math.round(weatherData.main.feels_like),
              humidity: weatherData.main.humidity,
              wind_speed: weatherData.wind.speed,
              wind_deg: weatherData.wind.deg,
              visibility: weatherData.visibility / 1000, // Convert to km
              pressure: weatherData.main.pressure,
              weather: {
                main: weatherData.weather[0].main,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
              },
            },
          });
        } else {
          setError("Failed to fetch weather data");
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationPermission("granted");
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocationPermission("denied");
            setError("Location access denied");
            setLoading(false);
          },
        );
      } else {
        setError("Geolocation not supported");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const handleRetryLocation = () => {
    setLoading(true);
    setError(null);
    window.location.reload(); // Simple way to retry permission
  };

  return (
    <BaseDashboardCard
      header="Weather Conditions"
      tooltipContent="Current weather at your location"
      withFilter={[]}
      onClearFilters={() => {}}
      currentFilterValues={{}}
    >
      <div className="w-full h-full p-4">
        {true ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className={`w-4 h-4 `} />
              <span className={`text-sm font-medium `}>Weather coming soon...</span>
            </div>
          </div>
        ) : null}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <WaveLoader />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <MapPin className={`w-12 h-12 `} />
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
            {locationPermission === "denied" && (
              <button
                onClick={handleRetryLocation}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  theme === "dark" ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Enable Location
              </button>
            )}
          </div>
        ) : weather ? (
          <div className="flex flex-col h-full">
            {/* Location */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
              <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {weather.location.name}, {weather.location.country}
              </span>
            </div>

            {/* Main Weather Display */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={theme === "dark" ? "text-blue-400" : "text-blue-600"}>{getWeatherIcon(weather.current.weather.main)}</div>
                <div>
                  <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{weather.current.temp}°C</div>
                  <div className={`text-sm capitalize ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {weather.current.weather.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {/* Feels Like */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <Thermometer className={`w-4 h-4 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                <div>
                  <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Feels like</div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{weather.current.feels_like}°C</div>
                </div>
              </div>

              {/* Wind */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <Wind className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                <div>
                  <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Wind</div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{weather.current.wind_speed} m/s</div>
                </div>
              </div>

              {/* Humidity */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <Droplets className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Humidity</div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{weather.current.humidity}%</div>
                </div>
              </div>

              {/* Wind Direction */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <Compass className={`w-4 h-4 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
                <div>
                  <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Direction</div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {getWindDirection(weather.current.wind_deg)}
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <Eye className={`w-4 h-4 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                <div>
                  <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Visibility</div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{weather.current.visibility} km</div>
                </div>
              </div>

              {/* Pressure */}
              <div className={`flex items-center gap-2 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <div className={`w-4 h-4 flex items-center justify-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <span className="text-xs font-bold">hPa</span>
                </div>
                <div>
                  <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Pressure</div>
                  <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{weather.current.pressure}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </BaseDashboardCard>
  );
}
