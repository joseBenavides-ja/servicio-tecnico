import { useState } from "react";

export default function LoginRegister({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);
  
  // Formulario de login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Formulario de registro
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    rut: "",
    phone: "",
    companyName: "",
    logo: null,
  });

  // Manejo de cambios en login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de cambios en registro
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de subida de logo
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target.result);
      setLogoBase64(event.target.result);
    };
    reader.readAsDataURL(file);

    setRegisterData((prev) => ({ ...prev, logo: file.name }));
  };

  // Validar RUT (formato básico)
  const isValidRut = (rut) => {
    const cleanRut = rut.replace(/[.-]/g, "");
    return /^\d{7,8}-?[0-9K]$/.test(rut) && cleanRut.length >= 8;
  };

  // Validar email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Submit Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular delay
    setTimeout(() => {
      const { email, password } = loginData;

      if (!email || !password) {
        alert("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      // Buscar usuario en localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.email === email && u.password === password);

      if (!user) {
        alert("Email o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // Login exitoso
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLoginSuccess(user);
      setLoading(false);
    }, 500);
  };

  // Submit Registro
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const { email, password, passwordConfirm, name, rut, phone, companyName } = registerData;

      // Validaciones
      if (!email || !password || !passwordConfirm || !name || !rut || !phone || !companyName) {
        alert("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        alert("Email no válido");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }

      if (password !== passwordConfirm) {
        alert("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }

      if (!isValidRut(rut)) {
        alert("RUT no válido. Formato: 12.345.678-9");
        setLoading(false);
        return;
      }

      // Verificar si email ya existe
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u) => u.email === email)) {
        alert("Este email ya está registrado");
        setLoading(false);
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        rut,
        phone,
        companyName,
        logo: logoBase64 || null,
        policies: "", // Campo para políticas del servicio técnico
        createdAt: new Date().toISOString(),
      };

      // Guardar usuario
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      onLoginSuccess(newUser);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="h1">Servicio Técnico</h1>

        {isLogin ? (
          // FORMULARIO DE LOGIN
          <form onSubmit={handleLoginSubmit}>
            <h2 className="h2">Iniciar Sesión</h2>

            <label>
              Correo Electrónico
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="correo@ejemplo.com"
                disabled={loading}
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Contraseña"
                disabled={loading}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>

            <p className="auth-toggle">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setIsLogin(false);
                  setLoginData({ email: "", password: "" });
                }}
              >
                Registrarse
              </button>
            </p>
          </form>
        ) : (
          // FORMULARIO DE REGISTRO
          <form onSubmit={handleRegisterSubmit}>
            <h2 className="h2">Crear Nueva Cuenta</h2>

            <label>
              Correo Electrónico
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="correo@ejemplo.com"
                disabled={loading}
              />
            </label>

            <label>
              Nombre Completo
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Tu nombre completo"
                disabled={loading}
              />
            </label>

            <label>
              RUT
              <input
                type="text"
                name="rut"
                value={registerData.rut}
                onChange={handleRegisterChange}
                placeholder="12.345.678-9"
                disabled={loading}
              />
            </label>

            <label>
              Teléfono
              <input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                placeholder="+56 9 1234 5678"
                disabled={loading}
              />
            </label>

            <label>
              Nombre de Empresa
              <input
                type="text"
                name="companyName"
                value={registerData.companyName}
                onChange={handleRegisterChange}
                placeholder="Tu empresa"
                disabled={loading}
              />
            </label>

            <label>
              Logo Personalizado
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={loading}
              />
            </label>

            {logoPreview && (
              <div className="logo-preview">
                <img src={logoPreview} alt="Logo preview" />
                <p>Logo seleccionado</p>
              </div>
            )}

            <label>
              Contraseña
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </label>

            <label>
              Confirmar Contraseña
              <input
                type="password"
                name="passwordConfirm"
                value={registerData.passwordConfirm}
                onChange={handleRegisterChange}
                placeholder="Repite la contraseña"
                disabled={loading}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>

            <p className="auth-toggle">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setIsLogin(true);
                  setRegisterData({
                    email: "",
                    password: "",
                    passwordConfirm: "",
                    name: "",
                    rut: "",
                    phone: "",
                    companyName: "",
                    logo: null,
                  });
                  setLogoPreview(null);
                  setLogoBase64(null);
                }}
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
