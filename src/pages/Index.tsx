import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, UserPlus, User } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/posts");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Sistema de Autenticación
          </CardTitle>
          <CardDescription className="text-base">
            Bienvenido al sistema de gestión de usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => navigate("/login")}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Iniciar Sesión
          </Button>
          <Button
            onClick={() => navigate("/register")}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Crear Cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
