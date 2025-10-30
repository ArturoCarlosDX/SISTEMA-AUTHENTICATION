import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LogoutButton() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore errors, still navigate
      console.error(err);
    }
    navigate("/login");
  };

  // Show buttons in development even if not authenticated so you can test the UI.
  if (!isAuthenticated && !import.meta.env.DEV) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2">
        {/* Botón 1: Productos (navega a /producto) */}
        <Button
          variant="ghost"
          onClick={() => {
            // Ir a /producto (o volver a /posts si ya estamos en /producto)
            if (location.pathname === "/producto") navigate("/posts");
            else navigate("/producto");
          }}
          className="flex items-center gap-2"
          aria-label="Productos"
        >
          <Settings className="h-4 w-4" />
          Productos
        </Button>

        {/* Botón 2: Perfil (toggle entre /profile y /posts según la ruta actual) */}
        <Button
          variant="ghost"
          onClick={() => {
            // Si ya estamos en /profile, volver a /posts, si no, ir a /profile
            if (location.pathname === "/profile") navigate("/posts");
            else navigate("/profile");
          }}
          className="flex items-center gap-2"
          aria-label="Perfil"
        >
          <HelpCircle className="h-4 w-4" />
          Perfil
        </Button>

        {/* Botón de cerrar sesión */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
