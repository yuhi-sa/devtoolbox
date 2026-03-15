import { getImplementedTools } from "@/lib/tools-registry";
import ToolPageClient from "./ToolPageClient";

export function generateStaticParams() {
  return getImplementedTools()
    .filter((t) => t.id !== "pipeline")
    .map((t) => ({ tool: t.id }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: toolId } = await params;
  return <ToolPageClient toolId={toolId} />;
}
