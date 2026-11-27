import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Filter,
  Instagram,
  Play,
  Search,
} from "lucide-react";
import Header from "../components/Header";
import { formatUpdateDate, getYouTubeUpdates } from "../api/socialUpdates";

const categories = ["All", "YouTube", "Instagram"];
const pageSize = 6;

export default function UpdatesPage() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [updates, setUpdates] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getYouTubeUpdates(null, controller.signal)
      .then(({ items, nextPageToken }) => {
        setUpdates(items);
        setNextToken(nextPageToken);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [active, query]);
  const shown = useMemo(
    () =>
      updates.filter(
        (item) =>
          (active === "All" || item.type === active) &&
          `${item.title} ${item.text}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [active, query, updates],
  );
  const visible = shown.slice((page - 1) * pageSize, page * pageSize);
  const canFetchMore = active !== "Instagram" && Boolean(nextToken);

  const nextPage = async () => {
    if (page * pageSize < shown.length) {
      setPage((current) => current + 1);
      return;
    }
    if (!canFetchMore || loadingMore) return;
    setLoadingMore(true);
    setMoreError(false);
    try {
      const result = await getYouTubeUpdates(nextToken);
      setUpdates((current) => {
        const ids = new Set(current.map((item) => item.id));
        return [
          ...current,
          ...result.items.filter((item) => !ids.has(item.id)),
        ];
      });
      setNextToken(result.nextPageToken);
      const matches = result.items.some(
        (item) =>
          `${item.title} ${item.text}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()) &&
          !updates.some((existing) => existing.id === item.id),
      );
      if (matches && shown.length >= page * pageSize)
        setPage((current) => current + 1);
    } catch {
      setMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900">
      <Header />
      <main>
        <section className="border-b border-violet-100 bg-gradient-to-br from-[#f8f1ff] via-white to-[#fff8dc] px-5 py-12 sm:px-8 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#6a20b7]">
              Stay in the loop
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#301068] sm:text-5xl">
              Latest from JDAX
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Class highlights and useful updates for your preparation journey.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setActive(item)}
                  aria-pressed={active === item}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${active === item ? "bg-[#4b0aa4] text-white" : "bg-slate-50 text-slate-600 hover:bg-violet-50"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="relative block w-full md:w-72">
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                aria-label="Search loaded updates"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search updates"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-violet-500"
              />
            </label>
          </div>
          {query && (
            <p className="mt-3 text-sm text-slate-500">
              Searching loaded updates. Use Next to load more.
            </p>
          )}
          {active === "Instagram" ? (
            <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-slate-500">
              <Instagram className="mx-auto mb-3" />
              Instagram updates are not available yet.
            </div>
          ) : status === "loading" ? (
            <p className="mt-8 text-center text-slate-500" role="status">
              Loading updates…
            </p>
          ) : status === "error" ? (
            <p
              className="mt-8 rounded-2xl border border-red-200 p-8 text-center text-red-700"
              role="alert"
            >
              Unable to load updates. Please try again later.
            </p>
          ) : visible.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-slate-500">
              <Filter className="mx-auto mb-3" />
              No updates found in loaded results.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {visible.map((item, index) => (
                <article
                  key={item.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${index === 0 ? "md:col-span-2 md:grid md:grid-cols-[1.05fr_1fr]" : ""}`}
                >
                  <div className="relative min-h-48 bg-slate-100">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-white text-[#5b17ad] shadow">
                      <Play size={18} fill="currentColor" />
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide">
                      <span className="text-[#6a20b7]">{item.type}</span>
                      <span className="text-slate-400">
                        {formatUpdateDate(item.publishedAt)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-black leading-snug text-[#28104d]">
                      {item.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 leading-6 text-slate-600">
                      {item.text}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex w-fit items-center gap-2 font-bold text-[#4b0aa4]"
                    >
                      Open update <ArrowUpRight size={18} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
          {moreError && (
            <p role="alert" className="mt-4 text-center text-sm text-red-700">
              Unable to load more updates. Please try again.
            </p>
          )}
          {status === "ready" &&
            active !== "Instagram" &&
            (page > 1 || shown.length > pageSize || canFetchMore) && (
              <nav
                aria-label="Updates pages"
                className="mt-8 flex items-center justify-center gap-4"
              >
                <button
                  type="button"
                  disabled={page === 1 || loadingMore}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border px-4 py-2 font-bold text-violet-800 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm font-semibold text-slate-600">
                  Page {page}
                </span>
                <button
                  type="button"
                  disabled={
                    loadingMore ||
                    (page * pageSize >= shown.length && !canFetchMore)
                  }
                  onClick={() => void nextPage()}
                  className="rounded-lg border px-4 py-2 font-bold text-violet-800 disabled:opacity-40"
                >
                  {loadingMore ? "Loading…" : "Next"}
                </button>
              </nav>
            )}
          <div className="mt-8 rounded-2xl bg-[#301068] p-6 text-white sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-black">
                <CheckCircle2 className="text-[#ffd64c]" /> Get important
                announcements first
              </div>
              <p className="mt-1 text-sm text-violet-100">
                Follow JDAX channels for class reminders and study updates.
              </p>
            </div>
            <Link
              to="/schedules"
              className="mt-4 inline-block rounded-xl bg-[#ffd64c] px-5 py-3 font-bold text-[#32106c] sm:mt-0"
            >
              <CalendarDays size={17} className="mr-2 inline" />
              View schedule
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
