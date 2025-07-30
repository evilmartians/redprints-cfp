import { Link, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from "lucide-react";

import Layout from "@/components/Layout";
import type { CFP, Proposal, SpeakerProfile } from "@/serializers";

import Form from "./Form";

interface NewProps {
  proposal: Proposal;
  speaker: SpeakerProfile | null;
  cfp: CFP;
}

export default function New({ proposal, speaker, cfp }: NewProps) {
  const { user } = usePage().props;
  const homeLink = cfp.id !== "primary" ? `/${cfp.id}` : "/";

  const fieldName = (field: string, defaultName: string) => {
    return cfp.field_names?.[field] ?? defaultName;
  };

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={homeLink}
          className="text-cloud-600 hover:text-cloud-700 mb-6 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back home
        </Link>

        <div className="mx-auto max-w-4xl">
          <div className="animate-fade-in mb-8">
            <h1 className="mb-2 text-3xl font-bold">
              {fieldName("header", "Submit Your Proposal")}
            </h1>
            <p className="text-cloud-600">
              {fieldName(
                "description",
                "Share your knowledge with the Ruby community. All fields marked with * are required.",
              )}
            </p>
          </div>

          <Form proposal={proposal} speaker={speaker} cfp={cfp} />
        </div>
      </div>
    </Layout>
  );
}
