import Layout from "../../components/Layout";

import { usePage, Link } from "@inertiajs/react";

interface IndexProps {
}

function Index({}: IndexProps) {
  const { user, oauth_providers } = usePage().props;

  return (
    <Layout currentUser={user}>
      Welcome to SF Ruby CFP app!

      {!user && (
        oauth_providers.map((provider: string) => (
            <div key={provider}>
              <a href={`/auth/${provider}`}>Sign in with {provider}</a>
            </div>
          ))
      )}

      {user && (
        <Link href={`/proposals/new`}>Submit a proposal</Link>
      )}
    </Layout>
  );
}

export default Index;
