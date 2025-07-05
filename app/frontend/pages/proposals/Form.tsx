import Layout from "../../components/Layout";
import { useForm, Link, usePage } from "@inertiajs/react";
import { AlertCircle, ArrowLeftIcon, Save, SendIcon, Upload } from 'lucide-react';
import TextAreaWithCounter from "../../components/TextAreaWithCounter";
import Select from "../../components/Select";
import { Proposal, SpeakerProfile } from "../../serializers";
import { FormEvent, useState, useRef } from "react";

interface FormProps {
  proposal: Proposal
  speaker: SpeakerProfile | null
}

export default function Form({ proposal, speaker }: FormProps) {
  const { user } = usePage().props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, patch, processing, errors } = useForm({
    proposal: {
      title: proposal.title || '',
      abstract: proposal.abstract || '',
      details: proposal.details || '',
      pitch: proposal.pitch || '',
      track: proposal.track || '',
      speaker_name: speaker?.name || user.email,
      speaker_email: speaker?.email || '',
      speaker_bio: speaker?.bio || '',
      speaker_company: speaker?.company || '',
      speaker_role: speaker?.role || '',
      speaker_socials: speaker?.socials || '',
      speaker_photo: null as File | null,
      speaker_photo_url: speaker?.photo_url || '',
      drafting: '0'
    }
  })

  type ProposalFields = keyof typeof data.proposal;
  const formErrors = errors as Partial<Record<ProposalFields, Array<string>>>

  const [submitting, setSubmitting] = useState(false);

  // TODO: sync with backend validations
  const limits = {
    abstract: 400,
    details: 800,
    pitch: 600,
    speaker_bio: 300
  }

  const isEditing = !!proposal.id;
  const canSaveDraft = proposal.status === 'draft';
  const isStartupDemo = proposal.track === 'startup';

  function submit(e: FormEvent) {
    e.preventDefault()
    if (isEditing) {
      patch(`/proposals/${proposal.id}`, {
        forceFormData: true,
      })
    } else {
      post('/proposals', {
        forceFormData: true,
      })
    }
  }

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={isEditing ? `/proposals/${proposal.id}` : (isStartupDemo ? '/startups' : '/')}
          className="flex items-center text-cloud-600 hover:text-cloud-700 transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back {isEditing ? "to the proposal" : "home"}
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">{isStartupDemo ? "Submit Your Demo Proposal" : "Submit Your Proposal"}</h1>
            {!isStartupDemo && (
              <p className="text-cloud-600">
                Share your knowledge with the Ruby community. All fields marked with * are required.
              </p>
            )}
            {isStartupDemo && (
              <p className="text-cloud-600">
                Share your story among the rising stars of the Ruby community and help inspire the next generation of Rubyists—while bringing your product into the spotlight.
                <br/>
                All fields marked with * are required.
              </p>
            )}
          </div>

          <form onSubmit={submit} className="space-y-8">
            <div className="card border border-sky-800 animate-slide-up">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-sky-800">{isStartupDemo ? "Demo Information" : "Talk Information"}</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="label">
                    {isStartupDemo ? "Startup Name" : "Title"} *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={data.proposal.title}
                    onChange={(e) => setData('proposal.title', e.target.value)}
                    className="input-field"
                    placeholder={isStartupDemo ? "" : "A clear, concise title for your talk"}
                    required={submitting}
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.title.join(", ")}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="abstract" className="label">
                    {isStartupDemo ? "How far along are you?" : "Abstract"} *
                  </label>
                  <TextAreaWithCounter
                    id="abstract"
                    value={data.proposal.abstract}
                    onChange={(val) => setData('proposal.abstract', val)}
                    maxLength={limits.abstract}
                    placeholder={isStartupDemo ? "Tell us a bit about your stage and progress" : "A brief overview of your talk (will be published in the program)"}
                    required={submitting}
                  />
                  {formErrors.abstract && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.abstract.join(", ")}</p>
                  )}
                </div>

                {!isStartupDemo && (
                  <div>
                    <label htmlFor="track" className="label">
                      Track *
                    </label>
                    <Select
                      id="track"
                      value={data.proposal.track}
                      onChange={(e) => setData('proposal.track', e.target.value)}
                      required={!canSaveDraft}
                      options={[
                        { value: '', label: 'Select a track' },
                        { value: 'oss', label: 'New Open Source and Tooling' },
                        { value: 'scale', label: 'Scaling Ruby and Rails' },
                        { value: 'general', label: 'General' },
                      ]}
                    />
                    {formErrors.track && (
                      <p className="text-red-600 text-sm mb-4">{formErrors.track.join(", ")}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="details" className="label">
                    {isStartupDemo ? "Demo Details" : "Detailed Description"} *
                  </label>
                  <TextAreaWithCounter
                    id="details"
                    value={data.proposal.details}
                    onChange={(val) => setData('proposal.details', val)}
                    maxLength={limits.details}
                    placeholder={isStartupDemo ? "Tell us a bit about the problem the product is solving, and the target audience. What can you demo?" : "A detailed description of your talk, including outline, key points, and what attendees will learn"}
                    required={submitting}
                  />
                  {formErrors.details && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.details.join(", ")}</p>
                  )}
                  {!isStartupDemo && (
                    <p className="mt-1 text-sm text-cloud-700">
                      This is for the review committee only and won't be published.
                    </p>
                  )}
                  {isStartupDemo && (
                    <p className="mt-1 text-sm text-cloud-700">
                      Don't forget to add links to your website and such.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="pitch" className="label">
                    {isStartupDemo ? "How does Ruby power your product?" : "Why this talk matters"} *
                  </label>
                  <TextAreaWithCounter
                    id="pitch"
                    value={data.proposal.pitch}
                    onChange={(val) => setData('proposal.pitch', val)}
                    maxLength={limits.pitch}
                    placeholder={isStartupDemo ? "" : "Why is this talk important for the Ruby community? What makes you the right person to give it?"}
                    required={submitting}
                  />
                  {formErrors.pitch && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.pitch.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="card border border-sky-800 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-sky-800">Speaker Profile</h2>
              <p className="text-amber-600 mb-4 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 hidden sm:inline" />
                Note: Your speaker profile information will be updated for all your proposals.
              </p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="label">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={data.proposal.speaker_name}
                      onChange={(e) => setData('proposal.speaker_name', e.target.value)}
                      className="input-field"
                      placeholder="Your full name"
                      required={submitting}
                    />
                    {formErrors.speaker_name && (
                      <p className="text-red-600 text-sm mb-4">{formErrors.speaker_name.join(", ")}</p>
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
                      onChange={(e) => setData('proposal.speaker_email', e.target.value)}
                      className="input-field"
                      placeholder="Your email address"
                      required={submitting}
                    />
                    {formErrors.speaker_email && (
                      <p className="text-red-600 text-sm mb-4">{formErrors.speaker_email.join(", ")}</p>
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
                    onChange={(e) => setData('proposal.speaker_company', e.target.value)}
                    className="input-field"
                    placeholder="Where you work (optional)"
                  />
                  {formErrors.speaker_company && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.speaker_company.join(", ")}</p>
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
                    onChange={(e) => setData('proposal.speaker_role', e.target.value)}
                    className="input-field"
                    placeholder="Your role at the company (optional)"
                  />
                  {formErrors.speaker_role && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.speaker_role.join(", ")}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="label">
                    Speaker Bio *
                  </label>
                  <TextAreaWithCounter
                    id="bio"
                    value={data.proposal.speaker_bio}
                    onChange={(val) => setData('proposal.speaker_bio', val)}
                    maxLength={limits.speaker_bio}
                    placeholder="A brief bio that will be published in the program"
                    required={submitting}
                  />
                  {formErrors.speaker_bio && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.speaker_bio.join(", ")}</p>
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
                      onChange={(e) => setData('proposal.speaker_socials', e.target.value)}
                      className="input-field"
                    />
                    {formErrors.speaker_socials && (
                      <p className="text-red-600 text-sm mb-4">{formErrors.speaker_socials.join(", ")}</p>
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
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      id="profile_photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          setData('proposal.speaker_photo_url', URL.createObjectURL(file));
                          setData('proposal.speaker_photo', file);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {data.proposal.speaker_photo_url ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {data.proposal.speaker_photo && (
                      <p className="text-sm text-cloud-700">
                        Selected: {data.proposal.speaker_photo.name}
                      </p>
                    )}
                  </div>
                  {formErrors.speaker_photo && (
                    <p className="text-red-600 text-sm mb-4">{formErrors.speaker_photo.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row-reverse justify-start space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <button
                type="submit"
                onClick={() => setSubmitting(true)}
                className="btn btn-ruby flex items-center justify-center cursor-pointer"
              >
                <SendIcon className="h-5 w-5 mr-2" />
                Submit Proposal
              </button>
              {canSaveDraft && (
                <button
                  type="submit"
                  className="btn btn-outline flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setSubmitting(false);
                    setData('proposal.drafting', '1');
                  }}
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Draft
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
