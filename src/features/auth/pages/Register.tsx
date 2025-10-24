import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
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
import { User, Mail, Phone, Lock, UserPlus, FileText } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    document_number: "",
    name: "",
    paternal_lastname: "",
    maternal_lastname: "",
    email: "",
    phone: "",
    user_name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        document_number: formData.document_number,
        name: formData.name,
        paternal_lastname: formData.paternal_lastname,
        maternal_lastname: formData.maternal_lastname,
        email: formData.email,
        phone: formData.phone,
        user_name: formData.user_name,
        password: formData.password,
        last_session: new Date().toISOString().split("T")[0],
        account_statement: true,
        document_type_id: 1,
        country_id: 179,
      };

      await authService.register(registerData);
      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Register error:", error);

      interface AxiosError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }

      const err = error as AxiosError;

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in err &&
        typeof err.response?.data?.message === "string"
      ) {
        toast.error(err.response!.data!.message!);
      } else {
        toast.error("Error al registrar usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#0b0f14] via-[#0f1418] to-[#0b0f14] p-6">
      <Card className="w-full max-w-2xl bg-[#111316] border border-[#1f2933] shadow-2xl">
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
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Completa el formulario para registrarte
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="document_number"
                  className="text-sm text-muted-foreground"
                >
                  Número de Documento
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="document_number"
                    name="document_number"
                    placeholder="12345678"
                    value={formData.document_number}
                    onChange={handleChange}
                    className="pl-9 bg-[#0b0d10] text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-muted-foreground">
                  Nombre
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Juan"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-9 bg-[#0b0d10] text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="paternal_lastname"
                  className="text-sm text-muted-foreground"
                >
                  Apellido Paterno
                </Label>
                <Input
                  id="paternal_lastname"
                  name="paternal_lastname"
                  placeholder="Pérez"
                  value={formData.paternal_lastname}
                  onChange={handleChange}
                  className="bg-[#0b0d10] text-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="maternal_lastname"
                  className="text-sm text-muted-foreground"
                >
                  Apellido Materno
                </Label>
                <Input
                  id="maternal_lastname"
                  name="maternal_lastname"
                  placeholder="García"
                  value={formData.maternal_lastname}
                  onChange={handleChange}
                  className="bg-[#0b0d10] text-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm text-muted-foreground"
                >
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9 bg-[#0b0d10] text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm text-muted-foreground"
                >
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="999888777"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-9 bg-[#0b0d10] text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="user_name"
                  className="text-sm text-muted-foreground"
                >
                  Nombre de Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="user_name"
                    name="user_name"
                    placeholder="juanperez"
                    value={formData.user_name}
                    onChange={handleChange}
                    className="pl-9 bg-[#0b0d10] text-white"
                    required
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
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 bg-[#0b0d10] text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm text-muted-foreground"
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-9 bg-[#0b0d10] text-white"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col px-6 pb-6 space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#2b6edb] text-white border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                "Registrando..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrarse
                </>
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
