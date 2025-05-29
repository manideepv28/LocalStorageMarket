import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const Icon = icons[type];

  return (
    <Card
      className={`${colors[type]} px-6 py-3 shadow-lg transform transition-all duration-300 animate-in slide-in-from-right`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{message}</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-white hover:bg-white/20">
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}
