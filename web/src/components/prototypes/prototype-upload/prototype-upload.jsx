
import React, { useState, useContext } from "react";
import apiService from "../../../services/api-service";
import { AuthContext } from "../../../contexts/auth-context";

const PrototypeUpload = () => {
  const [file, setFile] = useState(null);
  const { auth } = useContext(AuthContext); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (!auth || !auth.user || !auth.user._id) {
      console.error("No se ha encontrado el usuario logueado");
      return;
    }

    const formData = new FormData();
    formData.append("capture", file);
    formData.append("userId", auth.user._id);

    try {
      const response = await apiService.uploadCapture(formData);
      console.log("Captura subida:", response);
    } catch (error) {
      console.error("Error al subir la captura:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir captura</button>
    </div>
  );
};

export default PrototypeUpload;
