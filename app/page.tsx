const navigation = [
  { label: "Overview", href: "#overview", number: "01" },
  { label: "Tech stack", href: "#skills", number: "02" },
  { label: "My approach", href: "#approach", number: "03" },
  { label: "Contact", href: "#contact", number: "04" },
];

const skillGroups = [
  {
    number: "01",
    title: "Frontend",
    description: "Building clear, responsive interfaces for the web.",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
    accent: "bg-[#20382a] text-[#a8d0ad]",
  },
  {
    number: "02",
    title: "Styling & design",
    description: "Turning thoughtful design into polished experiences.",
    skills: ["Tailwind CSS", "Responsive design", "Figma", "Accessibility"],
    accent: "bg-[#3b3020] text-[#e2bf83]",
  },
  {
    number: "03",
    title: "Tools & workflow",
    description: "Keeping projects organised from idea to delivery.",
    skills: ["Git", "GitHub", "VS Code", "npm", "Vercel"],
    accent: "bg-[#292a42] text-[#b8b8ed]",
  },
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_78%_9%,rgba(74,112,81,0.17),transparent_35%),#0d120f] text-[#edf1eb]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col md:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-[#26302a] bg-[#111713]/95 px-6 py-5 md:sticky md:top-0 md:h-screen md:w-[250px] md:border-b-0 md:border-r md:px-7 md:py-8">
          <a href="#overview" className="flex items-center gap-3" aria-label="Kennedy Adika home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#31533c] font-mono text-sm font-medium tracking-tight text-white shadow-lg shadow-[#000]/20">
              KA
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[-0.02em]">Kennedy Adika</span>
              <span className="mt-0.5 block text-xs text-[#929d93]">Developer portfolio</span>
            </span>
          </a>

          <div className="mt-8 flex items-center gap-2 rounded-full border border-[#2b3830] bg-[#171f1a] px-3 py-2 text-xs text-[#b4beb4] md:mt-12">
            <span className="h-2 w-2 rounded-full bg-[#6fa778]" />
            Welcome to my corner of the web
          </div>

          <nav aria-label="Main navigation" className="mt-6 flex gap-2 overflow-x-auto pb-1 md:mt-8 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
            {navigation.map((item, index) => (
              <a
                key={item.number}
                href={item.href}
                className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors md:w-full ${
                  index === 0
                    ? "bg-[#203027] font-medium text-[#d8e7d8]"
                    : "text-[#9ba59b] hover:bg-[#1a241d] hover:text-[#e0e9df]"
                }`}
              >
                <span className={`font-mono text-[10px] ${index === 0 ? "text-[#91b398]" : "text-[#768078]"}`}>
                  {item.number}
                </span>
                {item.label}
                {index === 0 && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#8caf91] md:block" />}
              </a>
            ))}
          </nav>

          <div className="mt-auto hidden pt-10 md:block">
            <div className="mb-4 h-px bg-[#26302a]" />
            <p className="text-xs leading-5 text-[#929d93]">
              Curious by nature.
              <br />
              Always learning by building.
            </p>
            <p className="mt-5 font-mono text-[10px] tracking-wide text-[#727d73]">© KENNEDY ADIKA</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[#26302a] px-6 py-4 sm:px-10 lg:px-14">
            <p className="text-xs text-[#929d93]">
              Portfolio <span className="mx-2 text-[#59645b]">/</span> <span className="text-[#d5ddd4]">Overview</span>
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#344238] bg-[#171f1a] px-3.5 py-2 text-xs font-medium text-[#d9e2d8] shadow-sm shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-[#59735d] hover:bg-[#1d2921] hover:shadow-md"
            >
              Say hello <ArrowIcon diagonal />
            </a>
          </header>

          <div className="mx-auto max-w-[1050px] px-6 pb-16 pt-10 sm:px-10 sm:pt-14 lg:px-14 lg:pt-16">
            <section id="overview" className="scroll-mt-8">
              <div className="grid gap-9 lg:grid-cols-[1fr_270px] lg:items-end">
                <div>
                  <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#304236] bg-[#17211a]/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#b0c9b2] shadow-sm shadow-black/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8caf91]" />
                    A little about what I do
                  </p>
                  <h1 className="max-w-[700px] text-[clamp(2.65rem,6vw,5rem)] font-medium leading-[1.04] tracking-[-0.065em] text-[#edf1eb]">
                    I make the web
                    <br className="hidden sm:block" /> feel a little more <span className="font-serif italic text-[#a6c5a9]">human.</span>
                  </h1>
                  <p className="mt-6 max-w-[590px] text-[15px] leading-7 text-[#a5afa5] sm:text-base">
                    I&apos;m Kennedy, a developer who enjoys bringing ideas to life with thoughtful design and dependable code. Here&apos;s a snapshot of the tools I use and the way I like to work.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#344339] bg-[linear-gradient(145deg,rgba(27,37,30,0.98),rgba(20,29,23,0.94))] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[#4b624e] hover:shadow-[0_20px_50px_rgba(0,0,0,0.32)]">
                  <span aria-hidden="true" className="absolute -right-7 -top-9 h-28 w-28 rounded-full border border-[#435b47] bg-[#263c2c]/50" />
                  <span aria-hidden="true" className="absolute -right-1 top-0 h-16 w-16 rounded-full border border-[#435b47]/80" />
                  <div className="flex items-center justify-between">
                    <span className="relative text-xs font-medium text-[#aab5aa]">The short version</span>
                    <span className="font-mono text-[10px] text-[#849085]">01 / 03</span>
                  </div>
                  <p className="relative mt-5 text-2xl font-medium tracking-[-0.04em]">Ideas into interfaces.</p>
                  <p className="relative mt-2 text-sm leading-6 text-[#a0aba0]">
                    Combining frontend craft, curiosity, and care for the details.
                  </p>
                  <a href="#skills" className="relative mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#a8c5ab] transition hover:gap-3 hover:text-[#d0e3d1]">
                    Explore my toolkit <ArrowIcon />
                  </a>
                </div>
              </div>
            </section>

            <section id="skills" className="scroll-mt-8 pt-16 sm:pt-20">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#899489]">The toolkit</p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em] sm:text-[28px]">Things I work with</h2>
                </div>
                <p className="max-w-[260px] text-xs leading-5 text-[#9ba69b]">A practical mix of technologies for creating useful digital experiences.</p>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                {skillGroups.map((group) => (
                  <article key={group.number} className="group rounded-2xl border border-[#29352d] bg-[#141b16] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#435a47] hover:bg-[#18221b] hover:shadow-[0_18px_38px_rgba(0,0,0,0.28)] sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[10px] transition-transform duration-200 group-hover:scale-110 ${group.accent}`}>
                        {group.number}
                      </span>
                      <span className="h-px w-10 bg-[#354139]" />
                    </div>
                    <h3 className="mt-5 text-base font-semibold tracking-[-0.025em]">{group.title}</h3>
                    <p className="mt-1.5 min-h-10 text-xs leading-5 text-[#9ba69b]">{group.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${group.title} skills`}>
                      {group.skills.map((skill) => (
                        <li key={skill} className="rounded-lg border border-[#2d3931] bg-[#19211b] px-2.5 py-1.5 text-[11px] text-[#c2ccc2]">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section id="approach" className="scroll-mt-8 pt-14 sm:pt-16">
              <div className="grid gap-6 rounded-2xl border border-[#3b5540] bg-[linear-gradient(120deg,#203328,#18251c)] p-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#b0c5b2]">How I work</p>
                  <h2 className="mt-3 text-2xl font-medium tracking-[-0.045em]">Good work starts with good questions.</h2>
                  <p className="mt-2 max-w-[570px] text-sm leading-6 text-[#c4d0c4]">
                    I like to understand the people and problem first, then build a simple, considered solution that feels just as good to use as it does to look at.
                  </p>
                </div>
                <a href="#contact" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e8efe6] px-4 py-2.5 text-xs font-medium text-[#203328] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                  Get in touch <ArrowIcon />
                </a>
              </div>
            </section>

            <footer id="contact" className="scroll-mt-8 mt-10 flex flex-col gap-4 border-t border-[#29332c] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium tracking-[-0.02em]">Have an idea in mind?</p>
                <p className="mt-1 text-xs text-[#9ba69b]">I&apos;d love to hear what you&apos;re working on.</p>
              </div>
              <a href="mailto:hello@example.com" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#a8c5ab] transition hover:gap-3 hover:text-[#d0e3d1]">
                Let&apos;s talk <ArrowIcon diagonal />
              </a>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
