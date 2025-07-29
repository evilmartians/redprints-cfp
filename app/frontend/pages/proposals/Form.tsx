import { useForm, usePage } from "@inertiajs/react";
import { AlertCircle, Save, SendIcon, Upload } from "lucide-react";
import type { FormEvent } from "react";
import { useRef, useState } from "react";

import Select from "../../components/Select";
import TextAreaWithCounter from "../../components/TextAreaWithCounter";
import type { CFP, Proposal, SpeakerProfile } from "../../serializers";
import type { AppPageProps } from "../../types/global";

interface FormProps {
  proposal: Proposal;
  speaker: SpeakerProfile | null;
  cfp: CFP;
}

export default function Form({ proposal, speaker, cfp }: FormProps) {
  const { user, limits } =
    usePage<AppPageProps<{ limits: Record<string, number> }>>().props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultTrack =
    Object.keys(cfp.tracks).length === 1 ? Object.keys(cfp.tracks)[0] : "";

  const { data, setData, post, patch, errors } = useForm({
    proposal: {
      title: proposal.title ?? "",
      abstract: proposal.abstract ?? "",
      details: proposal.details ?? "",
      pitch: proposal.pitch ?? "",
      track: proposal.track ?? defaultTrack,
      speaker_name: speaker?.name ?? user.email,
      speaker_email: speaker?.email ?? "",
      speaker_bio: speaker?.bio ?? "",
      speaker_company: speaker?.company ?? "",
      speaker_role: speaker?.role ?? "",
      speaker_socials: speaker?.socials ?? "",
      speaker_photo: null as File | null,
      speaker_photo_url: speaker?.photo_url ?? "",
      drafting: "0",
    },
  });

  type ProposalFields = keyof typeof data.proposal;
  const formErrors = errors as Partial<Record<ProposalFields, string[]>>;

  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!proposal.id;
  const canSaveDraft = proposal.status === "draft";

  const fieldName = (field: string, defaultName: string) => {
    return cfp.field_names?.[field] ?? defaultName;
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    if (isEditing) {
      patch(`/proposals/${proposal.id}`, {
        forceFormData: true,
      });
    } else {
      post("/proposals", {
        forceFormData: true,
      });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="card border-secondary-800 animate-slide-up border">
        <h2 className="border-secondary-800 mb-6 border-b pb-4 text-xl font-bold">
          {fieldName("talk_header", "Talk Information")}
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="label">
              {fieldName("title", "Title")} *
            </label>
            <input
              id="title"
              type="text"
              value={data.proposal.title}
              onChange={(e) => setData("proposal.title", e.target.value)}
              className="input-field"
              placeholder={fieldName(
                "title_description",
                "A clear, concise title for your talk",
              )}
              required={submitting}
            />
            {formErrors.title && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.title.join(", ")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="abstract" className="label">
              {fieldName("abstract", "Abstract")} *
            </label>
            <TextAreaWithCounter
              id="abstract"
              value={data.proposal.abstract}
              onChange={(val) => setData("proposal.abstract", val)}
              maxLength={limits.abstract}
              placeholder={fieldName(
                "abstract_description",
                "A brief overview of your talk (will be published in the program)",
              )}
              required={submitting}
            />
            {formErrors.abstract && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.abstract.join(", ")}
              </p>
            )}
          </div>

          {Object.keys(cfp.tracks).length > 1 && (
            <div>
              <label htmlFor="track" className="label">
                Track *
              </label>
              <Select
                id="track"
                value={data.proposal.track}
                onChange={(e) => setData("proposal.track", e.target.value)}
                required={!canSaveDraft}
                placeholder="Select a track"
                options={Object.keys(cfp.tracks).map((track) => ({
                  value: track,
                  label: cfp.tracks[track],
                }))}
              />
              {formErrors.track && (
                <p className="mb-4 text-sm text-red-600">
                  {formErrors.track.join(", ")}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="details" className="label">
              {fieldName("details", "Detailed Description")} *
            </label>
            <TextAreaWithCounter
              id="details"
              value={data.proposal.details}
              onChange={(val) => setData("proposal.details", val)}
              maxLength={limits.details}
              placeholder={fieldName(
                "details_description",
                "A detailed description of your talk, including outline, key points, and what attendees will learn",
              )}
              required={submitting}
            />
            {formErrors.details && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.details.join(", ")}
              </p>
            )}
            <p className="text-cloud-700 mt-1 text-sm">
              {fieldName(
                "detailsNotice",
                "This is for the review committee only and won't be published.",
              )}
            </p>
          </div>

          <div>
            <label htmlFor="pitch" className="label">
              {fieldName("pitch", "Why this talk matters")} *
            </label>
            <TextAreaWithCounter
              id="pitch"
              value={data.proposal.pitch}
              onChange={(val) => setData("proposal.pitch", val)}
              maxLength={limits.pitch}
              placeholder={fieldName(
                "pitch_details",
                "Why is this talk important for the Ruby community? What makes you the right person to give it?",
              )}
              required={submitting}
            />
            {formErrors.pitch && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.pitch.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div
        className="card border-secondary-800 animate-slide-up border"
        style={{ animationDelay: "0.1s" }}
      >
        <h2 className="border-secondary-800 mb-6 border-b pb-4 text-xl font-bold">
          Speaker Profile
        </h2>
        <p className="mb-4 flex items-center text-amber-600">
          <AlertCircle className="mr-2 hidden h-4 w-4 sm:inline" />
          Note: Your speaker profile information will be updated for all your
          proposals.
        </p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="label">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={data.proposal.speaker_name}
                onChange={(e) =>
                  setData("proposal.speaker_name", e.target.value)
                }
                className="input-field"
                placeholder="Your full name"
                required={submitting}
              />
              {formErrors.speaker_name && (
                <p className="mb-4 text-sm text-red-600">
                  {formErrors.speaker_name.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={data.proposal.speaker_email}
                onChange={(e) =>
                  setData("proposal.speaker_email", e.target.value)
                }
                className="input-field"
                placeholder="Your email address"
                required={submitting}
              />
              {formErrors.speaker_email && (
                <p className="mb-4 text-sm text-red-600">
                  {formErrors.speaker_email.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="company" className="label">
              Company/Organization
            </label>
            <input
              id="company"
              type="text"
              value={data.proposal.speaker_company}
              onChange={(e) =>
                setData("proposal.speaker_company", e.target.value)
              }
              className="input-field"
              placeholder="Where you work (optional)"
            />
            {formErrors.speaker_company && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.speaker_company.join(", ")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="label">
              Company Role
            </label>
            <input
              id="role"
              type="text"
              value={data.proposal.speaker_role}
              onChange={(e) => setData("proposal.speaker_role", e.target.value)}
              className="input-field"
              placeholder="Your role at the company (optional)"
            />
            {formErrors.speaker_role && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.speaker_role.join(", ")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="label">
              Speaker Bio *
            </label>
            <TextAreaWithCounter
              id="bio"
              value={data.proposal.speaker_bio}
              onChange={(val) => setData("proposal.speaker_bio", val)}
              maxLength={limits.speaker_bio}
              placeholder="A brief bio that will be published in the program"
              required={submitting}
            />
            {formErrors.speaker_bio && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.speaker_bio.join(", ")}
              </p>
            )}
          </div>

          <div>
            <div>
              <label htmlFor="twitter" className="label">
                Social Links
              </label>
              <input
                id="twitter"
                type="text"
                value={data.proposal.speaker_socials}
                onChange={(e) =>
                  setData("proposal.speaker_socials", e.target.value)
                }
                className="input-field"
              />
              {formErrors.speaker_socials && (
                <p className="mb-4 text-sm text-red-600">
                  {formErrors.speaker_socials.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="profile_photo" className="label">
              Profile Photo
            </label>
            <div className="space-y-2">
              {data.proposal.speaker_photo_url && (
                <div className="mb-2">
                  <img
                    src={data.proposal.speaker_photo_url}
                    alt="Current profile photo"
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                id="profile_photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file) {
                    setData(
                      "proposal.speaker_photo_url",
                      URL.createObjectURL(file),
                    );
                    setData("proposal.speaker_photo", file);
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                {data.proposal.speaker_photo_url
                  ? "Change Photo"
                  : "Upload Photo"}
              </button>
              {data.proposal.speaker_photo && (
                <p className="text-cloud-700 text-sm">
                  Selected: {data.proposal.speaker_photo.name}
                </p>
              )}
            </div>
            {formErrors.speaker_photo && (
              <p className="mb-4 text-sm text-red-600">
                {formErrors.speaker_photo.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div
        className="animate-slide-up flex flex-col justify-start space-y-4 sm:flex-row-reverse sm:space-y-0 sm:space-x-4 sm:space-x-reverse"
        style={{ animationDelay: "0.2s" }}
      >
        <button
          type="submit"
          onClick={() => setSubmitting(true)}
          className="btn btn-primary flex cursor-pointer items-center justify-center"
        >
          <SendIcon className="mr-2 h-5 w-5" />
          Submit Proposal
        </button>
        {canSaveDraft && (
          <button
            type="submit"
            className="btn btn-outline flex cursor-pointer items-center justify-center"
            onClick={() => {
              setSubmitting(false);
              setData("proposal.drafting", "1");
            }}
          >
            <Save className="mr-2 h-5 w-5" />
            Save Draft
          </button>
        )}
      </div>
    </form>
  );
}
