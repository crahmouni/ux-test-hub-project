import { useState, useEffect, useRef } from "react";
import axios from "axios";
import externalApi from "../services/external-api";
import { useNavigate } from "react-router-dom"; 

const UXTestPage = () => {
  const [url, setUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [lighthouseReport, setLighthouseReport] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [urlHistory, setUrlHistory] = useState([]);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [featuredPrototypes, setFeaturedPrototypes] = useState(
    JSON.parse(localStorage.getItem("featuredPrototypes")) || []
  );
  const intervalRef = useRef(null);
  const navigate = useNavigate(); 

  const handleLoadTest = () => {
    const formattedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    setIframeUrl(formattedUrl);
    setTimeSpent(0);
    setReloadCount((prev) => prev + 1);
    setUrlHistory((prev) => [...new Set([formattedUrl, ...prev])]);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleLighthouseTest = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${iframeUrl}`);
      setLighthouseReport(response.data.lighthouseResult.categories);
    } catch (error) {
      console.error("Error al analizar la web", error);
    }
  };

  const handleScreenshot = async () => {
    if (!iframeUrl) return;
    try {
      const apiKey = "3186ff"; 
      const screenshotAxios = axios.create({
        baseURL: "https://api.screenshotmachine.com",
        headers: {}
      });

      screenshotAxios.interceptors.request.use(config => {
        if (config.headers && config.headers.Authorization) {
          delete config.headers.Authorization;
        }
        return config;
      });
  
      const response = await screenshotAxios.get(
        `?key=${apiKey}&url=${encodeURIComponent(iframeUrl)}&dimension=1024x768`,
        { responseType: "blob" }
      );
  
      console.log("Screenshot response:", response);
  
      const blob = response.data;
      const file = new File([blob], "screenshot.png", { type: blob.type });
      const formData = new FormData();
      formData.append("capture", file);
      formData.append("originalUrl", iframeUrl);
  
      const saveResponse = await axios.post("http://localhost:5000/api/v1/captures", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      console.log("Prototipo guardado en MongoDB:", saveResponse.data);
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al capturar la pantalla", error);
    }
  };

  return (
    <div className="pt-5">
      <div className="container py-4">
        <h1 className="text-center fw-bold">UX Test</h1>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            placeholder="Ingresa la URL de la web a testear"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 w-50 mt-2 rounded"
          />
        </div>
        <div className="d-flex justify-content-center mt-2">
          <button onClick={handleLoadTest} className="btn btn-primary text-white p-3 mt-2 mx-2 rounded-pill">
            Cargar Web
          </button>
          <button onClick={handleScreenshot} className="btn btn-primary text-white p-3 mt-2 mx-2 rounded-pill">
            Capturar Pantalla
          </button>
        </div>

        {iframeUrl && (
          <div className="mt-4 border relative">
            <iframe
              src={iframeUrl}
              width="100%"
              height="500px"
              sandbox="allow-scripts allow-same-origin"
              className="rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UXTestPage;

