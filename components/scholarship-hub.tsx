"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import {
  scholarshipCategories,
  scholarships,
  type Scholarship,
  type ScholarshipCategory,
} from "@/lib/scholarships";

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
      <path
        d="M5 15 15 5M6 5h9v9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
      <path
        d="M3.5 10h12m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
      <circle cx="8.75" cy="8.75" r="5.75" stroke="currentColor" strokeWidth="1.6" />
      <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      className="size-4"
    >
      <path
        d="M5 3.75h10v13l-5-3-5 3v-13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required = true,
  maxLength,
  placeholder,
  minLength,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  minLength?: number;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[#344136]">
      {label}
      <input
        className="w-full rounded-xl border border-[#e4e6dc] bg-white px-3.5 py-3 text-sm font-normal text-[#273328] outline-none transition placeholder:text-[#a0a69b] focus:border-[#6f8b69] focus:ring-2 focus:ring-[#6f8b69]/15"
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}

const themeListeners = new Set<() => void>();

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getThemeSnapshot() {
  const savedTheme = window.localStorage.getItem("mwangaza-theme");
  return savedTheme === null
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : savedTheme === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

export function ScholarshipHub() {
  const isDarkMode = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const [activeCategory, setActiveCategory] =
    useState<ScholarshipCategory>("All opportunities");
  const [query, setQuery] = useState("");
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(() => new Set());
  const [activeScholarship, setActiveScholarship] = useState<Scholarship>(scholarships[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  function toggleTheme() {
    window.localStorage.setItem(
      "mwangaza-theme",
      isDarkMode ? "light" : "dark",
    );
    themeListeners.forEach((listener) => {
      listener();
    });
  }

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesCategory =
      activeCategory === "All opportunities" ||
      scholarship.category === activeCategory;
    const searchableText = [
      scholarship.title,
      scholarship.provider,
      scholarship.category,
      scholarship.location,
      scholarship.summary,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchableText.includes(query.trim().toLowerCase());
  });

  function openApplication(scholarship: Scholarship) {
    setActiveScholarship(scholarship);
    setFormError("");
    document.getElementById("apply")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function toggleSaved(slug: string) {
    setSavedSlugs((previous) => {
      const next = new Set(previous);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeScholarship) return;

    setIsSubmitting(true);
    setFormError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const application = {
      scholarshipSlug: activeScholarship.slug,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      country: formData.get("country"),
      institution: formData.get("institution"),
      studyLevel: formData.get("studyLevel"),
      course: formData.get("course"),
      personalStatement: formData.get("personalStatement"),
      consent: formData.get("consent") === "yes",
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an unexpected response. Please try again.");
      }

      if (
        typeof result !== "object" ||
        result === null ||
        (!("error" in result) && !("success" in result))
      ) {
        throw new Error("We couldn't confirm the application response. Please try again.");
      }

      if (!response.ok) {
        const message =
          "error" in result && typeof result.error === "string"
            ? result.error
            : "We couldn't submit your application. Please try again.";
        throw new Error(message);
      }

      setNotice(`Your application for ${activeScholarship.title} has been submitted.`);
      form.reset();
    } catch (error) {
      console.error("Scholarship application submission failed:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "We couldn't submit your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      data-theme={isDarkMode ? "dark" : "light"}
      className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#263027]"
    >
      <header className="sticky top-0 z-30 border-b border-[#eae9e2] bg-[#faf9f6]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#home" className="flex items-center gap-2.5" aria-label="Mwangaza home">
            <span className="flex size-10 items-center justify-center rounded-[13px] bg-[#34553d] text-[13px] font-semibold tracking-[-0.06em] text-white">
              mw
            </span>
            <span className="flex flex-col">
              <span className="text-[19px] font-semibold leading-tight tracking-[-0.06em] text-[#263c2a]">
                mwangaza<span className="text-[#9bac82]">.</span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium leading-tight tracking-normal text-[#788075]">
                Adika Kennedy
              </span>
            </span>
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 sm:flex">
            <a
              href="#opportunities"
              className="text-[13px] font-medium text-[#536052] transition hover:text-[#304d35]"
            >
              Explore scholarships
            </a>
            <a
              href="#how-it-works"
              className="text-[13px] font-medium text-[#536052] transition hover:text-[#304d35]"
            >
              How it works
            </a>
            <a
              href="#apply"
              className="text-[13px] font-semibold text-[#466247] transition hover:text-[#304d35]"
            >
              Apply online
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              aria-pressed={isDarkMode}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              className="flex size-10 items-center justify-center rounded-full border border-[#e3e5db] bg-white text-[#496649] transition hover:border-[#b6c4ae] hover:bg-[#f4f6f0]"
            >
              {isDarkMode ? (
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                  <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 2v2m0 12v2M2 10h2m12 0h2M4.34 4.34l1.42 1.42m8.48 8.48 1.42 1.42m0-11.32-1.42 1.42m-8.48 8.48-1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                  <path d="M16.3 12.1A7 7 0 0 1 7.9 3.7 7 7 0 1 0 16.3 12.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-full bg-[#34553d] px-3.5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#294732] sm:px-5 sm:text-[13px]"
            >
              Apply online <ArrowIcon />
            </a>
          </div>
        </div>
      </header>

      <section
        id="home"
        className="relative mx-auto grid max-w-[1240px] gap-10 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-24 lg:pt-[88px]"
      >
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e7e9db] bg-[#f0f1e9] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#536b48]">
            <span className="size-1.5 rounded-full bg-[#8da374]" />
            A brighter future starts here
          </p>
          <h1 className="max-w-[640px] text-[clamp(3.2rem,7.1vw,6.3rem)] font-medium leading-[0.99] tracking-[-0.075em] text-[#28352a]">
            Your next chapter,{" "}
            <span className="font-serif font-normal italic text-[#76916b]">
              within reach.
            </span>
          </h1>
          <p className="mt-6 max-w-[470px] text-[15px] leading-[1.85] text-[#70776d] sm:text-base">
            Find scholarships that fit your ambitions. Explore your options, see
            what you need, and take the first step — right here.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#opportunities"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#34553d] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(52,85,61,0.15)] transition hover:-translate-y-0.5 hover:bg-[#294732] hover:shadow-[0_9px_24px_rgba(52,85,61,0.22)]"
            >
              Browse scholarships <ArrowIcon />
            </a>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-full border border-[#dfe4da] bg-white px-5 py-3.5 text-sm font-semibold text-[#456247] transition hover:border-[#aebdaa] hover:bg-[#f4f6f0]"
            >
              Apply online <ArrowIcon />
            </a>
            <span className="text-[12px] text-[#788075]">
              A little searching can go a long way.
            </span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[#ebe9df] pt-6">
            <p className="text-[12px] text-[#798074]">
              <span className="font-semibold text-[#344a37]">6</span> example
              opportunities
            </p>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-[#b8b9ae] sm:block" />
            <p className="text-[12px] text-[#798074]">
              <span className="font-semibold text-[#344a37]">One</span> simple
              online application
            </p>
          </div>
        </div>

        <div
          aria-label="Illustration of students working toward their goals"
          role="img"
          className="relative mx-auto aspect-[1.13] w-full max-w-[510px] overflow-hidden rounded-[32px] bg-[#e3ead9] shadow-[0_20px_70px_rgba(53,71,50,0.11)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_90%,rgba(249,234,186,0.75),transparent_39%),radial-gradient(ellipse_at_92%_5%,rgba(255,255,255,0.75),transparent_35%),linear-gradient(145deg,#eff0e3,#d2e1ce)]" />
          <div aria-hidden="true" className="absolute -right-8 -top-10 size-[245px] rounded-full border border-white/65" />
          <div aria-hidden="true" className="absolute -right-1 top-[-3px] size-[178px] rounded-full border border-white/60" />
          <div aria-hidden="true" className="absolute bottom-[-90px] left-[-50px] size-[270px] rounded-full bg-[#f4dfaa]/65 blur-[1px]" />
          <div aria-hidden="true" className="absolute bottom-[16%] left-[10%] h-[42%] w-[72%] rotate-[-9deg] rounded-[50%] bg-[#c6d3bb]" />
          <div
            aria-hidden="true"
            className="absolute bottom-[13%] left-[16%] h-[36%] w-[68%] rotate-[-9deg] rounded-[45%] border border-white/35 bg-[#627b5b] shadow-[0_24px_40px_rgba(49,75,46,0.23)]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[26%] left-[27%] h-[38%] w-[48%] rotate-[-9deg] rounded-[17px] border border-white/50 bg-[#f6f2e7] shadow-[0_10px_20px_rgba(42,59,40,0.15)]"
          >
            <div className="absolute left-[13%] top-[17%] h-1.5 w-[36%] rounded-full bg-[#94ab85]" />
            <div className="absolute left-[13%] top-[29%] h-1 w-[62%] rounded-full bg-[#d9ddd0]" />
            <div className="absolute left-[13%] top-[37%] h-1 w-[50%] rounded-full bg-[#d9ddd0]" />
            <div className="absolute bottom-[15%] left-[13%] h-[24%] w-[28%] rounded-lg bg-[#dfe8d6]" />
            <div className="absolute bottom-[15%] right-[12%] h-[24%] w-[31%] rounded-lg bg-[#efe1c5]" />
          </div>
          <div aria-hidden="true" className="absolute bottom-[24%] left-[17%] h-[30%] w-[23%] rotate-[13deg] rounded-[40%_40%_28%_28%] bg-[#c77b59] shadow-[inset_-10px_-7px_0_rgba(133,65,49,0.12)]" />
          <div aria-hidden="true" className="absolute bottom-[49%] left-[22%] size-[56px] rounded-full bg-[#8d583e] shadow-[inset_-8px_-4px_0_rgba(72,43,33,0.1)]" />
          <div aria-hidden="true" className="absolute bottom-[50%] left-[20%] h-[17px] w-[64px] -rotate-[12deg] rounded-full bg-[#283c2e]" />
          <div aria-hidden="true" className="absolute bottom-[20%] right-[17%] h-[32%] w-[24%] -rotate-[15deg] rounded-[40%_40%_26%_26%] bg-[#7390a4]" />
          <div aria-hidden="true" className="absolute bottom-[47%] right-[21%] size-[54px] rounded-full bg-[#b87954]" />
          <div aria-hidden="true" className="absolute bottom-[49%] right-[18%] h-[19px] w-[65px] rotate-[15deg] rounded-t-full bg-[#4b3940]" />
          <div className="absolute left-[7%] top-[8%] flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-2.5 shadow-[0_7px_25px_rgba(42,59,40,0.08)] backdrop-blur-sm">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#edf1e4] text-[13px] text-[#537348]">✳</span>
            <span className="text-[11px] font-semibold text-[#435541]">Big dreams belong here</span>
          </div>
          <div className="absolute bottom-[8%] right-[6%] flex items-center gap-2.5 rounded-2xl border border-white/65 bg-white/90 px-4 py-3 shadow-[0_8px_25px_rgba(42,59,40,0.12)] backdrop-blur-sm">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#edf1e4] text-[#537348]">
              <ArrowIcon diagonal />
            </span>
            <span>
              <span className="block text-[9px] font-medium uppercase tracking-[0.11em] text-[#889083]">Your next step</span>
              <span className="mt-0.5 block text-[12px] font-semibold text-[#435541]">Start an application</span>
            </span>
          </div>
          <span className="absolute bottom-[9%] left-[8%] size-2 rounded-full bg-[#cf9e51]" />
          <span className="absolute right-[19%] top-[27%] size-2 rounded-full bg-[#87a575]" />
        </div>
      </section>

      <section
        id="opportunities"
        className="scroll-mt-24 border-y border-[#eeede5] bg-white/70"
      >
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#788969]">
                A good place to start
              </p>
              <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-medium tracking-[-0.06em] text-[#2c392d]">
                Opportunities worth a look.
              </h2>
              <p className="mt-2 max-w-[510px] text-[14px] leading-6 text-[#747b70]">
                Browse by interest, find a fit, and see what you need before
                applying.
              </p>
            </div>
            <label className="flex w-full items-center gap-2.5 rounded-full border border-[#e6e7df] bg-white px-4 py-3 sm:w-[260px]">
              <span className="text-[#829078]"><SearchIcon /></span>
              <span className="sr-only">Search opportunities</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search scholarships..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-[#384439] outline-none placeholder:text-[#a0a59a]"
              />
            </label>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
            {scholarshipCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-medium transition ${
                    isActive
                      ? "border-[#34553d] bg-[#34553d] text-white"
                      : "border-[#e8e9e1] bg-white text-[#647064] hover:border-[#aab8a1] hover:text-[#34553d]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div
            role="note"
            className="mt-5 flex items-start gap-3 rounded-2xl border border-[#efe8d8] bg-[#fbf8ee] px-4 py-3.5 text-[11px] leading-[1.7] text-[#786b4f] sm:items-center"
          >
            <span aria-hidden="true" className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f1e7ce] font-serif text-[12px] font-bold text-[#866e3d] sm:mt-0">
              i
            </span>
            <span>
              <strong className="font-semibold">A quick note:</strong> These are
              example listings for demonstration. Providers, awards, and
              deadlines are not verified — always confirm details with the
              official sponsor before applying.
            </span>
          </div>

          {notice && (
            <p
              role="status"
              className="mt-5 rounded-xl border border-[#cfe0ca] bg-[#eff6eb] px-4 py-3 text-sm text-[#35563b]"
            >
              {notice}
            </p>
          )}

          {filteredScholarships.length > 0 ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredScholarships.map((scholarship) => {
                const isSaved = savedSlugs.has(scholarship.slug);
                return (
                  <article
                    key={scholarship.slug}
                    className="group flex flex-col overflow-hidden rounded-[22px] border border-[#eaeae3] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#d2dbc9] hover:shadow-[0_16px_40px_rgba(39,57,38,0.08)]"
                  >
                    <div className={`relative m-2.5 h-[150px] overflow-hidden rounded-[15px] bg-gradient-to-br ${scholarship.theme}`}>
                      <div aria-hidden="true" className="absolute -right-4 -top-12 size-40 rounded-full border border-white/45" />
                      <div aria-hidden="true" className="absolute -right-1 top-0 size-28 rounded-full border border-white/45" />
                      <div aria-hidden="true" className="absolute -bottom-[58px] left-[18%] size-[190px] rounded-full border border-white/55 bg-white/20" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/65 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#4f604b] backdrop-blur-sm">
                        {scholarship.category}
                      </div>
                      <div className="absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-[14px] border border-white/75 bg-white/70 font-serif text-[16px] text-[#3d503c] shadow-sm backdrop-blur-sm">
                        {scholarship.initials}
                      </div>
                      <button
                        type="button"
                        aria-label={`${isSaved ? "Remove" : "Save"} ${scholarship.title}`}
                        aria-pressed={isSaved}
                        onClick={() => toggleSaved(scholarship.slug)}
                        className={`absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-white/65 bg-white/75 transition hover:bg-white ${isSaved ? "text-[#456b42]" : "text-[#536052]"}`}
                      >
                        <BookmarkIcon filled={isSaved} />
                      </button>
                      <span className="absolute bottom-4 right-4 rounded-full border border-white/60 bg-white/65 px-2.5 py-1.5 text-[10px] font-medium text-[#52614d] backdrop-blur-sm">
                        {scholarship.location}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
                      <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-[#898f83]">
                        {scholarship.provider}
                      </p>
                      <h3 className="mt-2 min-h-[48px] text-[18px] font-semibold leading-[1.35] tracking-[-0.04em] text-[#2d392f]">
                        {scholarship.title}
                      </h3>
                      <p className="mt-2 min-h-[58px] text-[12px] leading-[1.8] text-[#798075]">
                        {scholarship.summary}
                      </p>
                      <div className="my-4 h-px bg-[#efefe9]" />
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#8b9286]">
                            Award value
                          </p>
                          <p className="mt-1 text-[13px] font-semibold text-[#38513b]">
                            {scholarship.award}
                          </p>
                        </div>
                        <p className="text-right">
                          <span className="block text-[9px] font-medium uppercase tracking-[0.12em] text-[#8b9286]">
                            Apply by
                          </span>
                          <span className="mt-1 block text-[11px] font-medium text-[#646e62]">
                            {scholarship.deadline}
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openApplication(scholarship)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#eef2e9] px-4 py-3 text-[12px] font-semibold text-[#3d5b40] transition group-hover:bg-[#34553d] group-hover:text-white"
                      >
                        Apply for this scholarship <ArrowIcon />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-7 rounded-[22px] border border-dashed border-[#dfe2d8] bg-white/60 px-5 py-14 text-center">
              <p className="text-base font-semibold text-[#405142]">
                No matching scholarships just yet.
              </p>
              <p className="mt-2 text-sm text-[#7c8378]">
                Try a different search or browse all opportunities.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All opportunities");
                }}
                className="mt-4 text-sm font-semibold text-[#496649] underline decoration-[#c4d2be] underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        id="apply"
        className="scroll-mt-24 border-y border-[#e9e9e1] bg-[#f5f5ef]"
      >
        <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-8 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#788969]">
              Take your next step
            </p>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-medium tracking-[-0.06em] text-[#2c392d]">
              Apply for a scholarship.
            </h2>
            <p className="mx-auto mt-2 max-w-[510px] text-[14px] leading-6 text-[#747b70]">
              Choose an opportunity, fill in your details, and submit your
              application online.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e7e8df] bg-white p-5 shadow-[0_12px_40px_rgba(39,57,38,0.06)] sm:p-8">
            <div className="mb-6 border-b border-[#e9e9e1] pb-5">
              <label className="grid gap-2 text-sm font-semibold text-[#344136]">
                Which scholarship are you applying for?
                <select
                  value={activeScholarship.slug}
                  onChange={(event) => {
                    const scholarship = scholarships.find(
                      (item) => item.slug === event.target.value,
                    );
                    if (scholarship) setActiveScholarship(scholarship);
                    setFormError("");
                  }}
                  className="w-full rounded-xl border border-[#e4e6dc] bg-white px-3.5 py-3 text-sm font-normal text-[#273328] outline-none transition focus:border-[#6f8b69] focus:ring-2 focus:ring-[#6f8b69]/15"
                >
                  {scholarships.map((scholarship) => (
                    <option key={scholarship.slug} value={scholarship.slug}>
                      {scholarship.title} — {scholarship.award}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-3 rounded-xl bg-[#eff2e9] px-4 py-3 text-[11px] leading-[1.7] text-[#596753]">
                <strong className="font-semibold">Who can apply?</strong>{" "}
                {activeScholarship.eligibility}
              </p>
            </div>

            <form
              id="application-form"
              onSubmit={submitApplication}
              className="grid gap-4 sm:grid-cols-2"
            >
              <FormField label="Full name" name="fullName" maxLength={120} autoComplete="name" />
              <FormField label="Email address" name="email" type="email" maxLength={254} autoComplete="email" />
              <FormField label="Phone number" name="phone" type="tel" maxLength={32} autoComplete="tel" />
              <FormField label="Country" name="country" maxLength={80} autoComplete="country-name" placeholder="e.g. Kenya" />
              <FormField label="School or institution" name="institution" maxLength={160} autoComplete="organization" />
              <FormField label="Course of study" name="course" maxLength={120} />
              <label className="grid gap-1.5 text-sm font-medium text-[#344136] sm:col-span-2">
                Current study level
                <select
                  required
                  name="studyLevel"
                  defaultValue=""
                  className="w-full appearance-none rounded-xl border border-[#e4e6dc] bg-white px-3.5 py-3 text-sm font-normal text-[#586254] outline-none transition focus:border-[#6f8b69] focus:ring-2 focus:ring-[#6f8b69]/15"
                >
                  <option value="" disabled>Select your current or intended level</option>
                  <option value="Secondary school">Secondary school</option>
                  <option value="Certificate or diploma">Certificate or diploma</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-[#344136] sm:col-span-2">
                What would this opportunity help you achieve?
                <textarea
                  required
                  name="personalStatement"
                  minLength={40}
                  maxLength={1200}
                  rows={4}
                  placeholder="Share a little about your goals (40–1,200 characters)."
                  className="w-full resize-y rounded-xl border border-[#e4e6dc] bg-white px-3.5 py-3 text-sm font-normal leading-relaxed text-[#273328] outline-none transition placeholder:text-[#a0a69b] focus:border-[#6f8b69] focus:ring-2 focus:ring-[#6f8b69]/15"
                />
                <span className="text-[10px] font-normal text-[#868d82]">
                  Keep it personal; there&apos;s no need to include financial or sensitive personal details.
                </span>
              </label>
              <label className="flex items-start gap-2.5 text-[10px] leading-[1.7] text-[#72796e] sm:col-span-2">
                <input
                  required
                  type="checkbox"
                  name="consent"
                  value="yes"
                  className="mt-0.5 size-4 shrink-0 accent-[#456747]"
                />
                <span>
                  I agree to submit these details for this application. I
                  understand the listing is a demonstration and have checked the
                  sponsor&apos;s requirements.
                </span>
              </label>

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#f0d6d2] bg-[#fff4f1] px-4 py-3 text-[12px] text-[#9b4438] sm:col-span-2"
                >
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#34553d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#294732] disabled:cursor-wait disabled:opacity-60 sm:col-span-2"
              >
                {isSubmitting ? "Sending your application..." : "Submit application"}
                {!isSubmitting && <ArrowIcon />}
              </button>
              <p className="text-center text-[10px] leading-[1.7] text-[#898f84] sm:col-span-2">
                Your details are stored privately and won&apos;t be displayed publicly.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#788969]">
              No guesswork, just your next step
            </p>
            <h2 className="max-w-[430px] text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.06em] text-[#2c392d]">
              Applying starts with a simple form.
            </h2>
            <p className="mt-4 max-w-[400px] text-[14px] leading-7 text-[#747b70]">
              Find an opportunity that feels right? Check what the sponsor is
              looking for and introduce yourself online.
            </p>
            <a
              href="#opportunities"
              className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#466247] hover:text-[#2d4933]"
            >
              Find your opportunity <ArrowIcon />
            </a>
          </div>

          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Find your fit",
                description: "Search by interest and explore the details.",
                color: "bg-[#e9efe3] text-[#54714d]",
              },
              {
                number: "02",
                title: "Check eligibility",
                description: "Read who the opportunity is designed for.",
                color: "bg-[#f4ecda] text-[#937747]",
              },
              {
                number: "03",
                title: "Apply online",
                description: "Tell us a little about yourself and apply.",
                color: "bg-[#e9e6f0] text-[#73658f]",
              },
            ].map((step) => (
              <li
                key={step.number}
                className="rounded-[19px] border border-[#ebeae3] bg-white/80 p-5 sm:p-4 lg:p-5"
              >
                <span className={`flex size-9 items-center justify-center rounded-xl text-[11px] font-semibold ${step.color}`}>
                  {step.number}
                </span>
                <h3 className="mt-5 text-[13px] font-semibold text-[#364338]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[11px] leading-[1.8] text-[#81877d]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-[#e9e8e1] bg-[#f5f4ee]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <a href="#home" className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.04em] text-[#374837]">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#34553d] text-[10px] font-semibold text-white">
              mw
            </span>
            <span className="flex flex-col">
              <span>mwangaza.</span>
              <span className="text-[10px] font-medium tracking-normal text-[#788075]">
                Adika Kennedy
              </span>
            </span>
          </a>
          <p className="max-w-[520px] text-[10px] leading-[1.7] text-[#85897e]">
            Demonstration project. Scholarship details are examples, not verified
            offers. Always confirm requirements with the official provider.
          </p>
          <a href="#home" className="text-[11px] font-medium text-[#667461] hover:text-[#34553d]">
            Back to top ↑
          </a>
        </div>
      </footer>

    </main>
  );
}
