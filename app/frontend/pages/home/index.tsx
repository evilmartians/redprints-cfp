import Layout from "../../components/Layout";
import { FileTextIcon, UsersIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { OAuthButtons } from "../../components/OAuthButtons";

import { usePage, Link } from "@inertiajs/react";

interface IndexProps {
  oauth_providers: string[]
}

export default function Index({ oauth_providers }: IndexProps) {
  const { user, cfp_closed } = usePage().props;

  return (
    <Layout currentUser={user}>
      <div className="bg-gradient-to-b from-primary-500 to-primary-700 text-white rounded-xl p-8 mb-12 shadow-medium animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Call for Proposals
        </h1>
        <p className="text-cloud-50 text-lg max-w-3xl">
          Share your knowledge and experience at the EXAMPLE conference!
        </p>
        <div className="mt-8 flex flex-wrap gap-4 text-primary-100">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>Neverber 39-40, 2025</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>Olympus Mons, Mars</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            <span>1500+ Attendees</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 animate-slide-up">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-secondary-800">Proposal Guidelines</h2>
            <div className="space-y-6">
              <p>
               Thank you for your interest in speaking at our conference! We're excited to invite proposals for talks in the following tracks:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">New Open Source and Tooling, Including AI</span>
                <p>Talks about new tooling built for ambitious Ruby and Rails products.</p></li>
                <li><span className="font-medium">Scaling Ruby and Rails</span>
                <p>Experiences and best practices scaling Ruby and Rails applications from scaleups and enterprises.</p></li>
              </ul>
              <p>
                Each talk should be 30 minutes in total, including time for Q&A. We're especially interested in talks that are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Educational and informative</li>
                <li>Grounded in real-world experience</li>
                <li>Accessible to Ruby developers of all levels</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-secondary-800">Selection Process</h2>
            <div className="space-y-4">
              <p>
                All proposals will be thoughtfully reviewed by our program committee. Talks will be selected based on the following criteria:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Relevance to the specified tracks</li>
                <li>Originality and freshness of the topic</li>
                <li>Speaker's experience and expertise</li>
                <li>Overall balance of the conference program</li>
              </ul>
              <p>
                <span className="font-medium">Important dates:</span>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>CFP opens: June 4, 2025</li>
                <li>CFP closes: July 13, 2035</li>
                <li>Notifications: July 21, 2035</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-secondary-800">Speaker Benefits</h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                Selected speakers will receive:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A complimentary conference ticket</li>
                <li>Invitation to the speaker dinner</li>
              </ul>
              <p>
                To help keep our conference affordable, we kindly ask that you check if your employer is able to support your travel. If so, we’d be happy to recognize them as a travel sponsor.
              </p>
              <p>We look forward to your proposals!</p>
            </div>
          </div>
        </div>

        <div className="lg:pl-8 space-y-8">
          <div test-id="home-actions" className="card border border-secondary-800 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {cfp_closed && (
              <>
                <h3 className="text-xl font-bold mb-6">The call for proposals is now closed</h3>
                <p className="text-neutral-600 mb-8">
                  Than you everyone for your submissions! You will hear from us shortly!
                </p>
              </>
            )}
            {!cfp_closed && (
              <>
                <h3 className="text-xl font-bold mb-6">Ready to share your expertise?</h3>
                <p className="text-neutral-600 mb-8">
                  We welcome proposals from speakers of all experience levels. Whether you're a seasoned presenter or a first-time speaker,
                  we want to hear from you!
                </p>
              </>
            )}
            <div className="flex flex-col space-y-2">
              {!user && (
                oauth_providers.map((provider: string) => (
                  <div key={provider}>
                    { OAuthButtons[provider]() }
                  </div>
                ))
              )}

              {user && !cfp_closed && (
                <Link href={`/proposals/new`} className="btn btn-primary flex items-center justify-center">
                  Submit a Proposal
                </Link>
              )}

              {user && (
                <Link href={`/proposals`} className="btn btn-outline flex items-center justify-center">
                  <FileTextIcon className="h-5 w-5 mr-2" />
                  View My Proposals
                </Link>
              )}
            </div>
          </div>

          <div className="card border border-secondary-800 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4">Have questions?</h3>
            <p className="mb-6">
              If you have any questions about the CFP process or need help with your proposal,
              feel free to reach out to our team.
            </p>
            {/* FIXME: Replace with your contact email */}
            <a
              href="mailto:conference@example.com"
              className="text-primary-600 font-medium hover:text-primary-800 transition-colors inline-flex items-center"
            >
              Contact the CFP team
              <span className="ml-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
