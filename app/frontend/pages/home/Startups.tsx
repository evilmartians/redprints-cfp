import Layout from "../../components/Layout";
import { FileTextIcon, UsersIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { OAuthButtons } from "../../components/OAuthButtons";

import { usePage, Link } from "@inertiajs/react";

interface StartupsProps {
  oauth_providers: string[]
}

export default function Startups({oauth_providers}: StartupsProps) {
  const { user, startup_cfp_closed } = usePage().props;

  return (
    <Layout currentUser={user}>
      <div className="bg-gradient-to-b from-sky-700 to-sky-900 text-white rounded-xl p-8 mb-12 shadow-medium animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Call for Startups
        </h1>
        <p className="text-cloud-50 text-lg max-w-3xl">
          The <a className="underline" href="https://sfruby.com" target="_blank">San Francisco Ruby Conference</a> is excited to open our Call for Ruby Startups!
          </p>
          <p className="text-cloud-50 text-lg max-w-3xl"> Let's bring your ambitious story into the spotlight: demo your product among the other rising stars, inspire the next generation of Rubyists and connect with the brightest Ruby minds.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 text-cloud-100">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>November 19-20, 2025</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>Fort Mason, San Francisco</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            <span>400+ Attendees</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 animate-slide-up">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-sky-800">Proposal Guidelines</h2>
            <div className="space-y-6">
              <p>
                We're looking for innovative Ruby startups to showcase their products in 10-minute demo sessions.
              </p>
              <p>
                If you're building something exciting with Ruby or Rails, we want to hear from you.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-sky-800">Selection Process</h2>
            <div className="space-y-4">
              <p>
                Applications are open until all demo slots are filled.

                Demos are reviewed and confirmed on a rolling, first-come, first-served basis—so please apply early!
              </p>
              <p>
                <span className="font-medium">Important dates:</span>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>CFP opens: June 4, 2025</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-sky-800">Speaker Benefits</h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                Selected speakers will receive complimentary conference tickets (one per startup).
              </p>
            </div>
          </div>
        </div>

        <div className="lg:pl-8 space-y-8">
          <div test-id="home-actions" className="card border border-sky-800 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {!startup_cfp_closed && (
              <h3 className="text-xl font-bold mb-6">Ready to introduce your startup to the Ruby world?</h3>
            )}
            {startup_cfp_closed && (
              <h3 className="text-xl font-bold mb-6">The call for startups is now closed</h3>
            )}
            <p className="text-neutral-600 mb-8">
            </p>
            <div className="flex flex-col space-y-2">
              {!user && (
                oauth_providers.map((provider: string) => (
                  <div key={provider}>
                    { OAuthButtons[provider]() }
                  </div>
                ))
              )}

              {user && !startup_cfp_closed && (
                <Link href={`/proposals/startup`} className="btn btn-sky flex items-center justify-center">
                  Submit a Demo Proposal
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

          <div className="card border border-sky-800 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4">Have questions?</h3>
            <p className="text-neutral-600 mb-6">
              If you have any questions about the selection process or need help with your demo proposal,
              feel free to reach out to our team.
            </p>
            <a
              href="mailto:conference@sfruby.com"
              className="text-sky-800 font-medium hover:text-ruby-800 transition-colors inline-flex items-center"
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
