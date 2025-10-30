import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type Producto = {
  id: string;
  name: string;
  price: string;
  desc: string;
};

function randomProducts(): Producto[] {
  const names = [
    "Nebula Lamp",
    "Quantum Keyboard",
    "Aurora Headset",
    "Stellar Mug",
    "Orbit Backpack",
  ];
  return Array.from({ length: 6 }).map((_, i) => ({
    id: String(i + 1),
    name: names[Math.floor(Math.random() * names.length)],
    price: `$${(Math.random() * 200 + 10).toFixed(2)}`,
    desc: "Producto premium con diseño futurista",
  }));
}

export default function Producto() {
  const navigate = useNavigate();
  const productos = React.useMemo(() => randomProducts(), []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <Card key={p.id} className="p-4 bg-[#0b0d10] text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{p.price}</div>
                <div className="text-xs text-muted-foreground">En stock</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  // lleva al contacto para consultas del producto
                  navigate("/contact")
                }
              >
                Consultar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Botón fijo de contacto en esquina (para que siempre sea accesible) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => navigate("/contact")}
          className="flex items-center gap-2"
          aria-label="Ir a contacto"
        >
          Contacto
        </Button>
      </div>
    </div>
  );
}
