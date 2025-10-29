import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, LogIn } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("¡Inicio de sesión exitoso!");
      navigate("/posts");
    } catch (error) {
      console.error("Login error:", String(error));
      toast.error(
        error?.response?.data?.message ||
          "Error al iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#0b0f14] via-[#0f1418] to-[#0b0f14] p-6">
      <Card className="w-full max-w-sm bg-[#111316]/60 border border-[#1f2933] shadow-2xl backdrop-blur-sm">
        <CardHeader className="pt-8 pb-4 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-[#2b3aef] flex items-center justify-center text-white">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V5a2 2 0 00-2-2H6a2 2 0 00-2 2v6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 11a4 4 0 008 0"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-extrabold text-white">
            Sistema de Autenticación
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Bienvenido al sistema de gestión de usuarios
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-[#0b0d10] text-white"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm text-muted-foreground"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-[#0b0d10] text-white"
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col px-6 pb-8 space-y-3">
            <Button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#2b6edb] text-white border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                "Iniciando sesión..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar sesión
                </>
              )}
            </Button>

            <Link to="/register" className="w-full">
              <Button
                variant="outline"
                className="w-full bg-[#0b0d10] border border-[#22262a] text-white"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V5a2 2 0 00-2-2H6a2 2 0 00-2 2v6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 11a4 4 0 008 0"
                  />
                </svg>
                Crear cuenta
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
