
export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Maruf Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
