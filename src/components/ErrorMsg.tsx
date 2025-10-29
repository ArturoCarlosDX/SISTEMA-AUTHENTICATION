import { AlertCircle } from "lucide-react";

interface ErrorMsgProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMsg({ message, onRetry }: ErrorMsgProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="glass-card rounded-2xl p-8 max-w-md text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold">Error al cargar</h3>
        <p className="text-muted-foreground">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
