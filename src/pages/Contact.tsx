import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import contactApi, {
  sendContact,
  initContactQueue,
  getQueueLength,
  type ContactPayload,
} from "@/api/contactApi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StatsPanel from "@/components/StatsPanel";

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(3, "Asunto muy corto"),
  message: z.string().min(10, "Mensaje muy corto").max(2000),
  budget: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política" }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { register, handleSubmit, formState, reset, watch } = useForm<FormData>(
    { resolver: zodResolver(schema) }
  );
  const { errors, isSubmitting } = formState;
  const toast = useToast();
  const [serverStatus, setServerStatus] = React.useState<
    null | "queued" | "sent" | "error"
  >(null);

  React.useEffect(() => {
    initContactQueue();
  }, []);

  const onSubmit = async (data: FormData) => {
    const idempotencyKey = crypto.randomUUID();
    setServerStatus(null);
    try {
      const result = await sendContact(
        data as unknown as ContactPayload,
        idempotencyKey
      );
      if (result?.status === "queued") {
        // Show inline queued status instead of floating toast
        setServerStatus("queued");
      } else if (result?.status === "sent") {
        toast.toast({
          title: "Enviado",
          description: "Tu mensaje se envió correctamente.",
        });
        setServerStatus("sent");
      } else {
        // Unknown response - treat as sent for UX
        toast.toast({
          title: "Enviado",
          description: "Tu mensaje se envió correctamente.",
        });
        setServerStatus("sent");
      }
      reset();
    } catch (err) {
      toast.toast({
        title: "Error",
        description: "No se pudo enviar el mensaje.",
      });
      setServerStatus("error");
    }
  };

  const messageValue = watch("message") || "";
  const consentValue = !!watch("consent");

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center py-12 px-4">
      <Card className="w-full max-w-4xl bg-[#111316]/60 border border-[#1f2933] shadow-2xl backdrop-blur-sm rounded-2xl">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Contacto</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <label className="block">
                  <span>Nombre</span>
                  <Input {...register("name")} aria-invalid={!!errors.name} />
                  {errors.name && (
                    <small className="text-destructive">
                      {String(errors.name.message)}
                    </small>
                  )}
                </label>

                <label className="block">
                  <span>Email</span>
                  <Input {...register("email")} aria-invalid={!!errors.email} />
                  {errors.email && (
                    <small className="text-destructive">
                      {String(errors.email.message)}
                    </small>
                  )}
                </label>

                <label className="block">
                  <span>Asunto</span>
                  <Input
                    {...register("subject")}
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <small className="text-destructive">
                      {String(errors.subject.message)}
                    </small>
                  )}
                </label>

                <label className="block">
                  <span>Mensaje</span>
                  <Textarea
                    {...register("message")}
                    rows={6}
                    aria-invalid={!!errors.message}
                  />
                  <div className="flex justify-between text-sm">
                    {errors.message ? (
                      <small className="text-destructive">
                        {String(errors.message.message)}
                      </small>
                    ) : (
                      <span />
                    )}
                    <small>{messageValue.length}/2000</small>
                  </div>
                </label>

                <label className="block">
                  <span>Presupuesto (opcional)</span>
                  <Input
                    {...register("budget")}
                    aria-invalid={!!errors.budget}
                  />
                </label>

                <label className="flex flex-col">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("consent")}
                      aria-invalid={!!errors.consent}
                    />
                    <span>Acepto la política de privacidad</span>
                  </label>
                  {errors.consent && (
                    <small className="text-destructive">
                      {String(errors.consent.message)}
                    </small>
                  )}
                </label>

                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !consentValue}
                  >
                    {isSubmitting ? "Enviando…" : "Enviar"}
                  </Button>
                  {!consentValue && (
                    <div className="mt-2 text-sm text-destructive">
                      Debes aceptar la política de privacidad para enviar.
                    </div>
                  )}
                  {serverStatus === "queued" && (
                    <div className="mt-3 rounded-md bg-yellow-900/40 p-3 text-sm text-yellow-200">
                      Tu mensaje se encoló y se enviará cuando haya conexión.
                    </div>
                  )}
                  {serverStatus === "sent" && (
                    <div className="mt-3 rounded-md bg-green-900/40 p-3 text-sm text-green-200">
                      Tu mensaje fue enviado correctamente.
                    </div>
                  )}
                  {serverStatus === "error" && (
                    <div className="mt-3 rounded-md bg-destructive/20 p-3 text-sm text-destructive-foreground">
                      Ocurrió un error al intentar enviar tu mensaje.
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div>
              <StatsPanel />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
