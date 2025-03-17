import { useState } from "react";
import { useForm } from 'react-hook-form';
import * as UxTestHubAPI from '../../../services/api-service';
import { useAuthContext } from '../../../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";  

function LoginForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (user) => {
    try {
      const data = await UxTestHubAPI.login(user);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); 

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      login(data); 
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => navigate('/'), 2000);
      
    } catch (error) {
      if (error.response?.status === 401) {
        const { data } = error.response;
        Object.keys(data.errors).forEach((inputName) => setError(inputName, { message: data.errors[inputName] }));
      } else {
        console.error("❌ Error en login:", error);
      }
    }
  };

  return (
    <div>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="input-group mb-1">
          <span className="input-group-text"><i className='fa fa-user fa-fw'></i></span>
          <input 
            type="email" 
            className={`form-control ${(errors.email) ? 'is-invalid' : ''}`} 
            placeholder="user@example.org" 
            {...register('email', { required: 'Mandatory field' })} 
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        <div className="input-group mb-2">
          <span className="input-group-text"><i className='fa fa-lock fa-fw'></i></span>
          <input 
            type="password" 
            className={`form-control ${(errors.password) ? 'is-invalid' : ''}`} 
            placeholder="****" 
            {...register('password', { required: 'Mandatory field' })} 
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>
        <div className="d-grid">
          <button className='btn btn-primary' type='submit'>Login</button>
        </div>
      </form>
     
    </div>
  );
}

export default LoginForm;
