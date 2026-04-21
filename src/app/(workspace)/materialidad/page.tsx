import { MaterialityInbox } from "@/components/workspace/materiality-inbox";
import { getMaterialityMessages } from "@/lib/materiality";

export const dynamic = "force-dynamic";

export default async function MaterialidadPage() {
  try {
    const messages = await getMaterialityMessages(20);

    return <MaterialityInbox messages={messages} />;
  } catch (error) {
    console.error("[materialidad] could not load n8n messages", error);

    return (
      <MaterialityInbox
        messages={[]}
        loadError="No pude leer la bandeja de materialidad desde Supabase. Revisa las variables de entorno y el acceso a la tabla mensajes."
      />
    );
  }
}
