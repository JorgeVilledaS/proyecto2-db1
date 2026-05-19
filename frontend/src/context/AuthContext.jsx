import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(() => localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; }
  });

  const login = (tokenRecibido, datosUsuario) => {
    localStorage.setItem('token',   tokenRecibido);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    setToken(tokenRecibido);
    setUsuario(datosUsuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  // true si el usuario tiene alguno de los roles indicados
  const tieneRol = (...roles) => usuario && roles.includes(usuario.rol);

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, tieneRol }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
