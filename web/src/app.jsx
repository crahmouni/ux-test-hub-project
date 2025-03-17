import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/ui/navbar/navbar";
import Footer from "./components/footer/footer";
import HomePage from "./pages/home";
import SearchPage from "./pages/search";
import PrototypeDetailPage from "./pages/prototype-detail";
import LoginPage from "./pages/login";
import RegisterPage from "../src/pages/register";
import CreatePrototypePage from "./pages/creat-prototype";
import ConfirmEmailPage from "../src/pages/confirm-email";
import UxTestPage from "./pages/ux-test-page";
import Dashboard from "./pages/dashboard";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prototypes/:id" element={<PrototypeDetailPage />} />
          <Route path="/create-prototype" element={<CreatePrototypePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} /> 
          <Route path="/ux-tests" element={<UxTestPage />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
