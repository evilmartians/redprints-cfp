import Layout from "../../components/Layout";
import { useForm, Link, usePage } from "@inertiajs/react";
import { ArrowLeftIcon, Save, SendIcon } from 'lucide-react';
import TextAreaWithCounter from "../../components/TextAreaWithCounter";
import Select from "../../components/Select";
import { Proposal, SpeakerProfile, User } from "../../serializers";
import { FormEvent } from "react";

interface FormProps {
  proposal: Proposal
  speaker: SpeakerProfile | null
}

function Form({ proposal, speaker }: FormProps) {
  const { user } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
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
      speaker_socials: speaker?.socials || ''
    }
  })

  // TODO: sync with backend validations
  const limits = {
    abstract: 400,
    details: 800,
    pitch: 600,
    speaker_bio: 300
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    post('/proposals')
  }

  return (
    <Layout currentUser={user}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="flex items-center text-cloud-600 hover:text-cloud-700 transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Submit Your Proposal</h1>
            <p className="text-cloud-600">
              Share your knowledge with the Ruby community. All fields marked with * are required.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-8">
            <div className="card border border-sky-800 animate-slide-up">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-sky-800">Talk Information</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="label">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={data.proposal.title}
                    onChange={(e) => setData('proposal.title', e.target.value)}
                    className="input-field"
                    placeholder="A clear, concise title for your talk"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="abstract" className="label">
                    Abstract *
                  </label>
                  <TextAreaWithCounter
                    id="abstract"
                    value={data.proposal.abstract}
                    onChange={(val) => setData('proposal.abstract', val)}
                    maxLength={limits.abstract}
                    placeholder="A brief overview of your talk (will be published in the program)"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="track" className="label">
                    Track *
                  </label>
                  <Select
                    id="track"
                    value={data.proposal.track}
                    onChange={(e) => setData('proposal.track', e.target.value)}
                    required
                    options={[
                      { value: '', label: 'Select a track' },
                      { value: 'oss', label: 'Modern OSS tools' },
                      { value: 'scale', label: 'Scaling startups' },
                      { value: 'general', label: 'General' },
                    ]}
                  />
                </div>

                <div>
                  <label htmlFor="details" className="label">
                    Detailed Description *
                  </label>
                  <TextAreaWithCounter
                    id="details"
                    value={data.proposal.details}
                    onChange={(val) => setData('proposal.details', val)}
                    maxLength={limits.details}
                    placeholder="A detailed description of your talk, including outline, key points, and what attendees will learn"
                    required
                  />
                  <p className="mt-1 text-sm text-neutral-500">
                    This is for the review committee only and won't be published.
                  </p>
                </div>

                <div>
                  <label htmlFor="pitch" className="label">
                    Why this talk matters *
                  </label>
                  <TextAreaWithCounter
                    id="pitch"
                    value={data.proposal.pitch}
                    onChange={(val) => setData('proposal.pitch', val)}
                    maxLength={limits.pitch}
                    placeholder="Why is this talk important for the Ruby community? What makes you the right person to give it?"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="card border border-sky-800 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-sky-800">Speaker Profile</h2>

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
                      required
                    />
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
                      required
                    />
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
                    required
                  />
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
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row-reverse justify-start space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <button
                type="submit"
                className="btn btn-ruby flex items-center justify-center cursor-pointer"
              >
                <SendIcon className="h-5 w-5 mr-2" />
                Submit Proposal
              </button>
              <button
                type="submit"
                name="proposal[draft]"
                value="1"
                className="btn btn-outline flex items-center justify-center cursor-pointer"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Form;
