import Layout from "../../components/Layout";
import { JSX } from "react";
import { FileTextIcon, UsersIcon, CalendarIcon, MapPinIcon, GithubIcon } from 'lucide-react';
import GoogleIcon from "../../icons/Google";

import { usePage, Link } from "@inertiajs/react";

interface IndexProps {
}

const OAuthButtons: Record<string, () => JSX.Element | null> = {
  github: () => {
    return (<a href="/auth/github" className="btn btn-outline flex items-center justify-center bg-[#24292F] text-white hover:bg-[#24292F]/90">
      <GithubIcon className="h-5 w-5 mr-2" />
      Sign in with GitHub
    </a>);
  },
  developer: () => {
    return (<a href="/auth/developer" className="btn btn-outline flex items-center justify-center">
      Sign in as developer
    </a>);
  },
  google_oauth2: () => {
    return (<a href="/auth/google_oauth2" className="btn btn-outline flex items-center justify-center">
      <GoogleIcon className="h-5 w-5 mr-2" />
      Sign in with Google
    </a>);
  }
}

function Index({}: IndexProps) {
  const { user, oauth_providers } = usePage().props;

  return (
    <Layout currentUser={user}>
      <div className="bg-gradient-to-b from-ruby-500 to-ruby-700 text-white rounded-xl p-8 mb-12 shadow-medium animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Call for Proposals
        </h1>
        <p className="text-cloud-50 text-lg max-w-3xl">
          Share your Ruby knowledge and experience at the <a href="https://sfruby.com" target="_blank">San Francisco Ruby Conference 2025</a>. We're looking for talks
          to support and inspire the new generation of successful startups built on Ruby and Rails.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 text-ruby-100">
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
               Thank you for your interest in speaking at our conference! We’re excited to invite proposals for talks in two tracks:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">New Open Source and Tooling, Including AI</span> 
                <p>Talks about new tooling built for ambitious Ruby and Rails products.</p></li>
                <li><span className="font-medium">Scaling Ruby</span> 
                <p>Experiences and best practices scaling Ruby and Rails applications from scaleups and enterprises.</p></li>
              </ul>
              <p>
                Each talk should be 30 minutes in total, including time for Q&A. We’re especially interested in talks that are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Educational and informative</li>
                <li>Grounded in real-world experience</li>
                <li>Accessible to Ruby developers of all levels</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-sky-800">Selection Process</h2>
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
                <li>CFP closes: July 15, 2025</li>
                <li>Notifications: July 21, 2025</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-sky-800">Speaker Benefits</h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                Selected speakers will receive:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A complimentary conference ticket</li>
                <li>A travel stipend (up to $500 for domestic travel, $1,000 for international travel)</li>
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
          <div className="card border border-sky-800 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-bold mb-6">Ready to share your Ruby expertise?</h3>
            <p className="text-neutral-600 mb-8">
              We welcome proposals from speakers of all experience levels. Whether you're a seasoned presenter or a first-time speaker,
              we want to hear from you!
            </p>
            <div className="flex flex-col space-y-2">
              {!user && (
                oauth_providers.map((provider: string) => (
                  <div key={provider}>
                    { OAuthButtons[provider]() }
                  </div>
                ))
              )}

              {user && (
                <Link href={`/proposals/new`} className="btn btn-ruby flex items-center justify-center">
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

          <div className="card border border-sky-800 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4">Have questions?</h3>
            <p className="text-neutral-600 mb-6">
              If you have any questions about the CFP process or need help with your proposal,
              feel free to reach out to our team.
            </p>
            <a
              href="mailto:conference@sfruby.com"
              className="text-ruby-700 font-medium hover:text-ruby-800 transition-colors inline-flex items-center"
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

export default Index;
