import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LogoutButton() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore errors, still navigate
      console.error(err);
    }
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </Button>
    </div>
  );
}
