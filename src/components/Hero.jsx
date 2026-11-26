import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Instagram, Play } from "lucide-react";
import santhomeImg from "../assets/santhome.png";
import classroomImg from "../assets/four.jpg";
import notebookImg from "../assets/two.jpg";

const exams = ["UPSC", "TNPSC", "SSC", "RRB", "Banking", "College", "GS", "JEE", "NEET"];
const groups = ["All", "G1", "G2", "G4"];

function FeedItem({ image, type, children, time }) {
  const isYoutube = type === "YouTube";
  return <div className="flex gap-3 py-2 first:pt-0 last:pb-0">
    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:h-20 sm:w-32"><img src={image} alt="" className="h-full w-full object-cover" /><span className={`absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-md text-white ${isYoutube ? "bg-red-600" : "bg-gradient-to-br from-purple-600 via-rose-500 to-amber-400"}`}>{isYoutube ? <Play size={15} fill="currentColor" /> : <Instagram size={16} />}</span></div>
    <div className="min-w-0 self-center text-sm leading-snug sm:text-base"><p><span className="font-bold text-[#42108f]">{type}</span> <span>• {children}</span></p><p className="mt-1 text-sm text-slate-500">{time}</p></div>
    <ArrowRight className="ml-auto shrink-0 self-center text-[#4f08a8]" size={25} />
  </div>;
}

function ScheduleRow({ time, group, children }) {
  return <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm sm:text-base"><span className="rounded-lg bg-[#fff0a5] px-2 py-1 font-bold text-[#3b157e]">{time}</span><span className="rounded-lg border border-[#8051c1] px-2 py-0.5 font-semibold text-[#4e149a]">{group}</span><span className="min-w-0 font-semibold leading-tight text-slate-800">{children}</span><ChevronRight className="text-[#4f08a8]" /></div>;
}

export default function Hero() {
  return <section className="relative overflow-hidden bg-[radial-gradient(circle_at_5%_30%,#f4fff4_0,transparent_28%),radial-gradient(circle_at_95%_80%,#f6fff4_0,transparent_30%),#fff] px-4 pb-7 pt-6 sm:px-7 lg:px-9">
    <div className="mx-auto max-w-[1320px]">
      <div className="grid items-center gap-6 lg:grid-cols-[.96fr_1fr] lg:gap-10">
        <div className="max-w-[710px] lg:pl-8">
          <p className="text-2xl font-black leading-none tracking-tight text-[#4613a3] sm:text-3xl">WELCOME TO</p>
          <h1 className="mt-1 text-[clamp(2.25rem,4vw,4rem)] font-black leading-[.95] tracking-tight text-[#ffc900]">JD Academy of<br />eXcellence <span className="text-[#4d0ca5]">JDAX</span></h1>
          <p className="mt-2 text-base font-bold text-[#161340] sm:text-lg">We believe in the transformative journey of every aspirant</p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-end"><img src={santhomeImg} alt="Santhome Cathedral" className="h-28 w-32 rounded-lg object-cover shadow-sm sm:h-32 sm:w-36" /><p className="max-w-[440px] text-center text-sm font-semibold leading-snug text-[#20204a] sm:pb-2 sm:text-left sm:text-base">Located in the heart of Santhome near the iconic Santhome Cathedral, Chennai, JDAX Academy is a unique academic unit initiated by the Archdiocese of Madras-Mylapore.</p></div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4"><Link to="/course-comparison" className="rounded-xl bg-[#4b07aa] px-6 py-2.5 text-center text-base font-bold text-white shadow-md">Compare All Exams</Link><Link to="/course-finder" className="rounded-xl border-2 border-[#5d13b5] bg-white px-6 py-2.5 text-center text-base font-bold text-[#4b07aa]">Which Exam Fits You?</Link></div>
        </div>
        <div className="mx-auto w-full max-w-[590px]"><div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-lg"><iframe className="h-full w-full" src="https://www.youtube.com/embed/aGQqcuiTCt4?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowFullScreen title="JDAX Intro" /></div><p className="mt-2 text-sm font-semibold leading-snug text-[#19163e] sm:text-base">Join structured programs for UPSC, TNPSC, SSC, BANKING AND RRB exams with top mentors and curated resources.</p></div>
      </div>
      <section className="mt-5 grid overflow-hidden rounded-2xl border border-[#f2c531] bg-white/80 lg:grid-cols-[.82fr_1.18fr]">
        <div className="p-4 sm:p-5 lg:border-r-2 lg:border-[#f5d56f]"><h2 className="flex items-center gap-3 text-2xl font-black text-[#4c0da7]"><span>Latest from JDAX</span><i className="h-1 flex-1 rounded bg-[#ffd221]" /></h2><div className="mt-3 divide-y divide-slate-200"><FeedItem image={classroomImg} type="YouTube" time="2h ago">TNPSC G2 live class</FeedItem><FeedItem image={notebookImg} type="Instagram" time="5h ago">Weekly current affairs update</FeedItem></div><Link to="/updates" className="mt-3 flex w-fit items-center gap-2 text-lg font-bold text-[#4b07aa]">See all updates <ArrowRight size={20} /></Link></div>
        <div className="p-4 sm:p-5"><h2 className="flex items-center gap-3 text-2xl font-black text-[#4c0da7]"><span>Upcoming classes</span><i className="h-1 flex-1 rounded bg-[#ffd221]" /></h2><div className="mt-2 flex flex-wrap gap-1.5">{exams.map((exam) => <button key={exam} className={`rounded-full border px-3 py-0.5 text-sm font-semibold ${exam === "TNPSC" ? "border-[#5a0ab4] bg-[#4e07aa] text-white" : "border-slate-200 bg-white text-slate-700"}`}>{exam}</button>)}</div><div className="mt-2 flex flex-wrap gap-1.5">{groups.map((group) => <button key={group} className={`rounded-full border px-4 py-0.5 text-sm font-semibold ${group === "All" ? "border-[#ffec9b] bg-[#ffeca0]" : "border-slate-200 bg-white"}`}>{group}</button>)}</div><div className="mt-2 space-y-1.5"><ScheduleRow time="10:00 AM" group="G1">TNPSC G1 – Indian Polity</ScheduleRow><ScheduleRow time="04:00 PM" group="G2">TNPSC G2 – Indian Polity (Part 1)</ScheduleRow></div><Link to="/schedules" className="mt-3 flex w-fit items-center gap-2 text-lg font-bold text-[#4b07aa]">See all schedules <ArrowRight size={20} /></Link></div>
      </section>
    </div>
  </section>;
}
