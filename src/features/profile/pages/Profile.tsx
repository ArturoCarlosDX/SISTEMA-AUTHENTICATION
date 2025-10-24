import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, Mail, Phone, User, Globe, Shield } from "lucide-react";
import { toast } from "sonner";

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  if (!user) {
    return null;
  }

  const getInitials = () => {
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f0f0f] via-[#0f0f0f] to-[#0b0b0b] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="bg-[#151515] shadow-2xl border-0">
          <CardHeader className="px-8 pt-8">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-[#00ff33] flex items-center justify-center shadow-md mb-4">
                <span className="font-extrabold text-black">do</span>
              </div>
              <CardTitle className="text-2xl text-[#00ff33] tracking-wide">
                PERFIL DE USUARIO
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Información de tu cuenta
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Nombre
                  </label>
                  <div className="bg-[#2a2a2a] rounded-md px-4 py-3 text-white">
                    {user.name}
                  </div>

                  <label className="text-xs text-muted-foreground uppercase tracking-wide mt-2">
                    Correo electrónico
                  </label>
                  <div className="bg-[#2a2a2a] rounded-md px-4 py-3 text-white break-words">
                    {user.email}
                  </div>

                  <label className="text-xs text-muted-foreground uppercase tracking-wide mt-2">
                    Rol
                  </label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center bg-[#00ff33] text-black rounded-full px-4 py-2 font-medium">
                      {user.role.name}
                    </span>
                  </div>

                  <label className="text-xs text-muted-foreground uppercase tracking-wide mt-2">
                    ID de usuario
                  </label>
                  <div className="bg-[#2a2a2a] rounded-md px-4 py-3 text-white">
                    {user.id}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-[#00ff33] text-black text-3xl font-bold flex items-center justify-center">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Nombre de usuario
                      </p>
                      <p className="text-base text-white">@{user.user_name}</p>
                    </div>
                  </div>

                  <label className="text-xs text-muted-foreground uppercase tracking-wide mt-2">
                    Teléfono
                  </label>
                  <div className="bg-[#2a2a2a] rounded-md px-4 py-3 text-white">
                    {user.phone}
                  </div>

                  <label className="text-xs text-muted-foreground uppercase tracking-wide mt-2">
                    País
                  </label>
                  <div className="bg-[#2a2a2a] rounded-md px-4 py-3 text-white">
                    {user.country.name}
                  </div>
                </div>
              </div>

              <div>
                <Separator />
              </div>

              <div>
                <Button
                  onClick={handleLogout}
                  className="w-full bg-[#00ff33] hover:bg-[#00e02d] text-black border-0"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
