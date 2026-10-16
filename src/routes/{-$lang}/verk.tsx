import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "../../components/Shell";
import { WorkCases } from "../../components/WorkCases";
import { pageHead } from "../../content/head";
import { langFromParam } from "../../i18n";

export const Route = createFileRoute("/{-$lang}/verk")({
  head: ({ params }) => pageHead(langFromParam(params.lang) ?? "is", "verk"),
  component: WorkPage,
});

function WorkPage() {
  return (
    <Shell page="verk">
      <WorkCases />
    </Shell>
  );
}
