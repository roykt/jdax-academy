import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  Video,
} from "lucide-react";
import Header from "../components/Header";
import { apiGet } from "../api/client";

const exams = [
  ["All", ""],
  ["UPSC", "upsc"],
  ["TNPSC", "tnpsc"],
  ["SSC", "ssc"],
  ["RRB", "rrb"],
  ["Banking", "banking"],
  ["College", "college-programme"],
  ["GS", "gs-function"],
  ["JEE", "jee"],
  ["NEET", "neet"],
];
const dateKey = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
const displayDate = (key) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${key}T00:00:00Z`));
const displayTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

export default function SchedulesPage() {
  const [exam, setExam] = useState("");
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [schedules, setSchedules] = useState([]);
  const [status, setStatus] = useState("loading");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    apiGet("/api/content-schedules/get-all", controller.signal)
      .then((response) => {
        if (!Array.isArray(response.data))
          throw new Error("Invalid schedule response");
        setSchedules(response.data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  const shown = useMemo(
    () =>
      schedules
        .filter((item) => {
          const scheduled = new Date(item.scheduledAt);
          return (
            !Number.isNaN(scheduled.getTime()) &&
            dateKey(scheduled) === selectedDate &&
            (!exam || item.category === exam) &&
            `${item.title ?? ""} ${item.venue ?? ""}`
              .toLowerCase()
              .includes(query.toLowerCase().trim())
          );
        })
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)),
    [schedules, selectedDate, exam, query],
  );

  useEffect(() => {
    setPage(1);
  }, [selectedDate, exam, query]);
  const pageCount = Math.max(1, Math.ceil(shown.length / 5));
  const currentPage = Math.min(page, pageCount);
  const visible = shown.slice((currentPage - 1) * 5, currentPage * 5);

  const moveDate = (days) => {
    const date = new Date(`${selectedDate}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    setSelectedDate(date.toISOString().slice(0, 10));
  };
  const today = selectedDate === dateKey(new Date());

  return (
    <div className="min-h-screen bg-[#fbfbff] text-slate-900">
      <Header />
      <main className="overflow-hidden">
        <section className="relative bg-[#26005e] px-5 py-12 text-white sm:px-8 lg:py-16">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#f8d64d_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="relative mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#ffd84e]">
              Learn with clarity
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Class schedule
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-violet-100">
              Find JDAX classes and sessions in one place.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous day"
                  onClick={() => moveDate(-1)}
                  className="rounded-lg border p-2 text-violet-800"
                >
                  <ChevronLeft size={19} />
                </button>
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {today ? "Today" : "Scheduled for"}
                  </p>
                  <h2 className="font-bold text-violet-950">
                    {displayDate(selectedDate)}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Next day"
                  onClick={() => moveDate(1)}
                  className="rounded-lg border p-2 text-violet-800"
                >
                  <ChevronRight size={19} />
                </button>
                <label className="sr-only" htmlFor="schedule-date">
                  Select schedule date
                </label>
                <input
                  id="schedule-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    if (event.target.value) setSelectedDate(event.target.value);
                  }}
                  className="max-w-[145px] rounded-lg border border-slate-200 px-2 py-1 text-sm"
                />
              </div>
              <label className="relative block w-full lg:w-72">
                <Search
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a class or venue"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-violet-500"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {exams.map(([label, value]) => (
                <button
                  type="button"
                  onClick={() => setExam(value)}
                  key={label}
                  aria-pressed={exam === value}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${exam === value ? "bg-[#4b0aa4] text-white shadow" : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#32106c]">
                  Classes scheduled {today ? "today" : "on this date"}
                </h2>
                <span className="rounded-full bg-[#fff1b6] px-3 py-1 text-sm font-bold text-[#5b4100]">
                  {shown.length} sessions
                </span>
              </div>
              {status === "loading" ? (
                <p className="rounded-xl border border-dashed p-8 text-center text-slate-500">
                  Loading schedulesâ€¦
                </p>
              ) : status === "error" ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 p-8 text-center text-red-700"
                >
                  Unable to load schedules. Please try again later.
                </p>
              ) : shown.length === 0 ? (
                <p className="rounded-xl border border-dashed p-8 text-center text-slate-500">
                  No schedules match this date and search.
                </p>
              ) : (
                <div className="space-y-3">
                  {visible.map((item) => {
                    const scheduledDate = new Date(item.scheduledAt);
                    const validDate = !Number.isNaN(scheduledDate.getTime());
                    const online = /\bonline\b/i.test(item.venue || "");
                    const categoryLabel =
                      exams.find(([, value]) => value === item.category)?.[0] ||
                      item.category;
                    return (
                      <article
                        key={item._id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-5 sm:p-4"
                      >
                        <div className="w-[90px] shrink-0 self-stretch border-r border-dashed border-slate-200 pr-2 sm:w-[120px] sm:pr-4">
                          <p className="text-sm font-black text-[#4b0aa4] sm:text-lg">
                            {validDate
                              ? displayTime(scheduledDate)
                              : "Time unavailable"}
                          </p>
                          {validDate && (
                            <p className="text-xs text-slate-500 sm:text-sm">
                              {new Intl.DateTimeFormat("en-IN", {
                                timeZone: "Asia/Kolkata",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }).format(scheduledDate)}
                            </p>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap gap-2">
                            <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-black text-violet-800">
                              {categoryLabel}
                            </span>
                            {item.group && (
                              <span className="rounded-md border border-violet-200 px-2 py-0.5 text-xs font-bold text-violet-800">
                                {item.group.replace("group-", "G")}
                              </span>
                            )}
                          </div>
                          <h3 className="break-words font-bold text-slate-900">
                            {item.title}
                          </h3>
                        </div>
                        {item.venue && (
                          <div className="flex w-[85px] shrink-0 items-start justify-end gap-1.5 text-sm font-semibold text-slate-600 sm:w-[140px]">
                            {online ? (
                              <Video
                                size={16}
                                className="mt-0.5 shrink-0 text-violet-700"
                              />
                            ) : (
                              <MapPin
                                size={16}
                                className="mt-0.5 shrink-0 text-violet-700"
                              />
                            )}
                            <span className="min-w-0 break-words">
                              {item.venue}
                            </span>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
              {status === "ready" && pageCount > 1 && (
                <nav
                  aria-label="Schedule pages"
                  className="mt-5 flex items-center justify-center gap-3"
                >
                  <button
                    type="button"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-violet-200 px-3 py-2 text-sm font-bold text-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-semibold text-slate-600">
                    Page {currentPage} of {pageCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    className="rounded-lg border border-violet-200 px-3 py-2 text-sm font-bold text-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              )}
            </div>
            <aside className="h-fit rounded-2xl bg-[#fff8db] p-5">
              <CalendarDays className="text-[#4b0aa4]" />
              <h2 className="mt-4 text-xl font-black text-[#32106c]">
                Browse schedules
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose a date to see classes scheduled for that day.
              </p>
              <div className="mt-5 border-t border-amber-200 pt-4 text-sm text-slate-600">
                <Clock3 size={16} className="mr-2 inline text-[#4b0aa4]" />
                All dates and times are IST.
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
