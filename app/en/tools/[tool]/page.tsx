import { getImplementedTools } from "@/application/registry";
import EnToolPageClient from "./EnToolPageClient";

export function generateStaticParams() {
  return getImplementedTools()
    .filter((t) => t.id !== "pipeline")
    .map((t) => ({ tool: t.id }));
}

export default async function EnToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: toolId } = await params;
  return <EnToolPageClient toolId={toolId} />;
}
