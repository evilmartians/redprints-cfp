export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-cloud-500 sticky bottom-0 w-full py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-secondary-400 mt-8 flex flex-col items-center justify-between border-t pt-6 md:flex-row">
          {/* FIXME: Add your conference name */}
          <p className="text-secondary-400 text-sm">
            &copy; {currentYear} Example Conference
          </p>
        </div>
      </div>
    </footer>
  );
}
