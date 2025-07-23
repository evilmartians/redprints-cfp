import Layout from "../../components/Layout";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from 'lucide-react';
import Form from "./Form";
import { CFP, Proposal, SpeakerProfile } from "../../serializers";

interface EditProps {
  proposal: Proposal
  speaker: SpeakerProfile | null
  cfp: CFP
}

export default function Edit({ proposal, speaker, cfp }: EditProps) {
  const { user } = usePage().props;

  const fieldName = (field: string, defaultName: string) => {
    return (cfp.field_names && cfp.field_names[field] !== undefined) ? cfp.field_names[field] : defaultName;
  }

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/proposals/${proposal.id}`}
          className="flex items-center text-cloud-600 hover:text-cloud-700 transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to the proposal
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">{fieldName("header", "Edit Your Proposal")}</h1>
            <p className="text-cloud-600">
              {fieldName("description", "Update your proposal details. All fields marked with * are required.")}
            </p>
          </div>

          <Form proposal={proposal} speaker={speaker} cfp={cfp} />
        </div>
      </div>
    </Layout>
  );
}
