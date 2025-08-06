import { Link, usePage } from "@inertiajs/react";
import {
  CalendarIcon,
  FileTextIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";

import Layout from "../../components/Layout";
import { OAuthButtons } from "../../components/OAuthButtons";
import type { CFP } from "../../serializers";

interface StartupsProps {
  oauth_providers: string[];
  startup_cfp: CFP;
}

export default function Startups({
  oauth_providers,
  startup_cfp,
}: StartupsProps) {
  const { user } = usePage().props;

  return (
    <Layout currentUser={user}>
      <div className="from-secondary-700 to-secondary-900 shadow-medium animate-fade-in mb-12 rounded-xl bg-gradient-to-b p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Call for Startups
        </h1>
        <p className="text-cloud-50 max-w-3xl text-lg">
          The{" "}
          <a
            className="underline"
            href="https://sfruby.com"
            target="_blank"
            rel="noreferrer"
          >
            San Francisco Ruby Conference
          </a>{" "}
          is excited to open our Call for Ruby Startups!
        </p>
        <p className="text-cloud-50 max-w-3xl text-lg">
          {" "}
          Let’s bring your ambitious story into the spotlight: demo your product
          among the other rising stars, inspire the next generation of Rubyists
          and connect with the brightest Ruby minds.
        </p>
        <div className="text-cloud-100 mt-8 flex flex-wrap gap-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            <span>November 19-20, 2025</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-5 w-5" />
            <span>Fort Mason, San Francisco</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="mr-2 h-5 w-5" />
            <span>400+ Attendees</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="animate-slide-up space-y-8">
          <div>
            <h2 className="text-secondary-800 mb-4 text-2xl font-bold">
              Proposal Guidelines
            </h2>
            <div className="space-y-6">
              <p>
                We’re looking for innovative Ruby startups to showcase their
                products in 10-minute demo sessions.
              </p>
              <p>
                If you’re building something exciting with Ruby or Rails, we
                want to hear from you.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-secondary-800 mb-4 text-2xl font-bold">
              Selection Process
            </h2>
            <div className="space-y-4">
              <p>
                Applications are open until all demo slots are filled. Demos are
                reviewed and confirmed on a rolling, first-come, first-served
                basis—so please apply early!
              </p>
              <p>
                <span className="font-medium">Important dates:</span>
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>CFP opens: June 4, 2025</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-secondary-800 mb-4 text-2xl font-bold">
              Speaker Benefits
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                Selected speakers will receive complimentary conference tickets
                (one per startup).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:pl-8">
          <div
            data-test-id="home-actions"
            className="card border-secondary-800 animate-slide-up border"
            style={{ animationDelay: "0.1s" }}
          >
            {!startup_cfp.is_closed && (
              <h3 className="mb-6 text-xl font-bold">
                Ready to introduce your startup to the Ruby world?
              </h3>
            )}
            {startup_cfp.is_closed && (
              <h3 className="mb-6 text-xl font-bold">
                The call for startups is now closed
              </h3>
            )}
            <p className="mb-8 text-neutral-600"></p>
            <div className="flex flex-col space-y-2">
              {!user &&
                oauth_providers.map((provider: string) => (
                  <div key={provider}>{OAuthButtons[provider]()}</div>
                ))}

              {user && !startup_cfp.is_closed && (
                <Link
                  href={`/startups/new`}
                  className="btn btn-secondary flex items-center justify-center"
                >
                  Submit a Demo Proposal
                </Link>
              )}

              {user && (
                <Link
                  href={`/proposals`}
                  className="btn btn-outline flex items-center justify-center"
                >
                  <FileTextIcon className="mr-2 h-5 w-5" />
                  View My Proposals
                </Link>
              )}
            </div>
          </div>

          <div
            className="card border-secondary-800 animate-slide-up border"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="mb-4 text-xl font-bold">Have questions?</h3>
            <p className="mb-6 text-neutral-600">
              If you have any questions about the selection process or need help
              with your demo proposal, feel free to reach out to our team.
            </p>
            <a
              href="mailto:conference@sfruby.com"
              className="text-secondary-800 hover:text-primary-800 inline-flex items-center font-medium transition-colors"
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
