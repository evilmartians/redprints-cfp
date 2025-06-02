export function Footer(){
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-800 text-cloud-500 py-8 sticky bottom-0 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-sky-400 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-sky-400">
            &copy; {currentYear} SF Ruby Conference
          </p>
        </div>
      </div>
    </footer>
  );
};
