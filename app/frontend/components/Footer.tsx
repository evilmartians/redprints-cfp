export function Footer(){
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-cloud-500 py-8 sticky bottom-0 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-secondary-400 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          {/* FIXME: Add your conference name */}
          <p className="text-sm text-secondary-400">
            &copy; {currentYear} Example Conference
          </p>
        </div>
      </div>
    </footer>
  );
};
