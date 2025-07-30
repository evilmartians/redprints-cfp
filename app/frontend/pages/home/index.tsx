import { Link, usePage } from "@inertiajs/react";
import {
  CalendarIcon,
  FileTextIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";

import Layout from "@/components/Layout";
import { OAuthButtons } from "@/components/OAuthButtons";
import type { CFP } from "@/serializers";

interface IndexProps {
  oauth_providers: string[];
  startup_cfp: CFP;
}

export default function Index({ oauth_providers, startup_cfp }: IndexProps) {
  const { user, cfp_closed } = usePage().props;

  return (
    <Layout currentUser={user}>
      <div className="from-primary-500 to-primary-700 shadow-medium animate-fade-in mb-12 rounded-xl bg-gradient-to-b p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Call for Proposals
        </h1>
        <p className="text-cloud-50 max-w-3xl text-lg">
          Share your Ruby knowledge and experience at the{" "}
          <a
            className="underline"
            href="https://sfruby.com"
            target="_blank"
            rel="noreferrer"
          >
            San Francisco Ruby Conference 2025
          </a>
          . We’re looking for talks to support and inspire the new generation of
          successful startups built on Ruby and Rails.
        </p>
        <div className="text-primary-100 mt-8 flex flex-wrap gap-4">
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
                Thank you for your interest in speaking at our conference! We’re
                excited to invite proposals for talks in two tracks:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <span className="font-medium">
                    New Open Source and Tooling, Including AI
                  </span>
                  <p>
                    Talks about new tooling built for ambitious Ruby and Rails
                    products.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Scaling Ruby and Rails</span>
                  <p>
                    Experiences and best practices scaling Ruby and Rails
                    applications from scaleups and enterprises.
                  </p>
                </li>
              </ul>
              <p>
                Each talk should be 30 minutes in total, including time for Q&A.
                We’re especially interested in talks that are:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Educational and informative</li>
                <li>Grounded in real-world experience</li>
                <li>Accessible to Ruby developers of all levels</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-secondary-800 mb-4 text-2xl font-bold">
              Selection Process
            </h2>
            <div className="space-y-4">
              <p>
                All proposals will be thoughtfully reviewed by our program
                committee. Talks will be selected based on the following
                criteria:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Relevance to the specified tracks</li>
                <li>Originality and freshness of the topic</li>
                <li>Speaker’s experience and expertise</li>
                <li>Overall balance of the conference program</li>
              </ul>
              <p>
                <span className="font-medium">Important dates:</span>
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>CFP opens: June 4, 2025</li>
                <li>CFP closes: July 13, 2025</li>
                <li>Notifications: July 21, 2025</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-secondary-800 mb-4 text-2xl font-bold">
              Speaker Benefits
            </h2>
            <div className="space-y-4 text-neutral-700">
              <p>Selected speakers will receive:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>A complimentary conference ticket</li>
                <li>
                  A travel stipend (up to $500 for domestic travel, $1,000 for
                  international travel)
                </li>
                <li>Invitation to the speaker dinner</li>
              </ul>
              <p>
                To help keep our conference affordable, we kindly ask that you
                check if your employer is able to support your travel. If so,
                we’d be happy to recognize them as a travel sponsor.
              </p>
              <p>We look forward to your proposals!</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:pl-8">
          <div
            data-test-id="home-actions"
            className="card border-secondary-800 animate-slide-up border"
            style={{ animationDelay: "0.1s" }}
          >
            {cfp_closed && (
              <>
                <h3 className="mb-6 text-xl font-bold">
                  The call for proposals is now closed
                </h3>
                <p className="mb-8 text-neutral-600">
                  Than you everyone for your submissions! You will hear from us
                  shortly!
                </p>
              </>
            )}
            {!cfp_closed && (
              <>
                <h3 className="mb-6 text-xl font-bold">
                  Ready to share your Ruby expertise?
                </h3>
                <p className="mb-8 text-neutral-600">
                  We welcome proposals from speakers of all experience levels.
                  Whether you’re a seasoned presenter or a first-time speaker,
                  we want to hear from you!
                </p>
              </>
            )}
            <div className="flex flex-col space-y-2">
              {!user &&
                oauth_providers.map((provider: string) => (
                  <div key={provider}>{OAuthButtons[provider]()}</div>
                ))}

              {user && !cfp_closed && (
                <Link
                  href={`/proposals/new`}
                  className="btn btn-primary flex items-center justify-center"
                >
                  Submit a Proposal
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

          {!startup_cfp.is_closed && (
            <div
              className="card border-secondary-800 animate-slide-up border"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="mb-4 text-xl font-bold">
                Building a startup with Ruby?
              </h3>
              <p className="mb-6 text-neutral-600">
                Demo your startup at the conference! Share your story to inspire
                others, and connect with some of the best Ruby minds! All
                startup demos will be 10 minutes.
              </p>
              <Link
                href={`/startups`}
                className="btn btn-secondary flex items-center justify-center"
              >
                Call for Startups
              </Link>
            </div>
          )}

          <div
            className="card border-secondary-800 animate-slide-up border"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="mb-4 text-xl font-bold">Have questions?</h3>
            <p className="mb-6">
              If you have any questions about the CFP process or need help with
              your proposal, feel free to reach out to our team.
            </p>
            <a
              href="mailto:conference@sfruby.com"
              className="text-primary-600 hover:text-primary-800 inline-flex items-center font-medium transition-colors"
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
