import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as UxTestHubAPI from "../../../services/api-service";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";

function RegisterForm() {
  console.log("RegisterForm renderizado");

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Evento de registro activado");
    
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (user.avatar) { 
      formData.append("avatar", user.avatar);
    }

    console.log('Enviando datos al backend:', formData);

    try {
      console.log("Enviando datos al backend..."); 
      const response = await axios.post("http://localhost:5000/api/v1/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Registro exitoso:", response.data);
      setSuccessMessage("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
      
      reset(); 
      
      console.log("Redirigiendo a /confirm-email");
      navigate("/confirm-email"); 
  
    } catch (error) {
      console.error("Error durante el registro:", error); 
      
      if (error.response?.data?.errors) {
          const { data } = error.response;
          console.log("Errores de validación:", data.errors); 
          
          Object.keys(data.errors).forEach((inputName) =>
            setError(inputName, { message: data.errors[inputName] })
          );
      } else {
          setErrorMessage("Ocurrió un error durante el registro. Por favor, intenta nuevamente.");
      }
    }  
  };

  return (
    <div>
      {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>{errorMessage}</Alert>}
      <form onSubmit={handleSubmit((data) => {
        console.log("Formulario enviado", data);
        handleRegister(data);
      })}>
        <div className="input-group mb-1">
          <span className="input-group-text"><i className="fa fa-user fa-fw"></i></span>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="John Doe"
            {...register("name", { required: "Mandatory field" })}
          />
          {errors.name && (<div className="invalid-feedback">{errors.name.message}</div>)}
        </div>
        <div className="input-group mb-1">
          <span className="input-group-text"><i className="fa fa-user fa-fw"></i></span>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="user@example.org"
            {...register("email", { required: "Mandatory field" })}
          />
          {errors.email && (<div className="invalid-feedback">{errors.email.message}</div>)}
        </div>
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="fa fa-lock fa-fw"></i></span>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""} `}
            placeholder="****"
            {...register("password", { required: "Mandatory field" })}
          />
          {errors.password && (<div className="invalid-feedback">{errors.password.message}</div>)}
        </div>
        <div className="input-group mb-2">
          <span className="input-group-text"><i className="fa fa-lock fa-fw"></i></span>
          <input
            type="file"
            className={`form-control ${errors.avatar ? "is-invalid" : ""} `}
            {...register("avatar", { required: "Mandatory field" })}
          />
          {errors.avatar && (<div className="invalid-feedback">{errors.avatar.message}</div>)}
        </div>
        <div className="d-grid">
          <button className="btn btn-primary" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;