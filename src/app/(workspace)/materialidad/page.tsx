import { ModulePage } from "@/components/workspace/module-page";
import { moduleDefinitions } from "@/lib/legal-data";

export default function MaterialidadPage() {
  return <ModulePage module={moduleDefinitions.materialidad} />;
}
