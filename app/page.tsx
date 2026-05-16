import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { getFeaturedPublicResources } from "@/lib/public-resources";

const searchFields = [
  { label: "Байршил", value: "Улаанбаатар" },
  { label: "Өдөр", value: "Өнөөдөр" },
  { label: "Хүний тоо", value: "4-8 хүн" },
];

const steps = [
  {
    title: "Хай",
    text: "Байршил, өдөр, хүний тоогоор тохирох karaoke өрөөг хурдан шүүнэ.",
  },
  {
    title: "Сонго",
    text: "Үнэ, багтаамж, боломжит цагийн мэдээллийг нэг дор харна.",
  },
  {
    title: "Товло",
    text: "Сонгосон цагаа илгээж, баталгаажсан захиалгын давхцлыг хаана.",
  },
];

export default async function Home() {
  const featuredResources = await getFeaturedPublicResources(6);

  return (
    <main className="page-shell">
      <Header />

      <SectionShell className="pb-10 pt-5 sm:pt-12">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <StatusPill>Караоке booking MVP</StatusPill>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.92] text-tovlo-text sm:text-7xl">
              Караоке өрөөгөө хамгийн амархан товло.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-[1.65] text-tovlo-muted/80 sm:text-lg">
              Ойрхон karaoke өрөөнүүдийг хайж, боломжит цаг, багтаамж, үнийг шалгаад захиалгын хүсэлтээ илгээх дулаан, ойлгомжтой booking туршлага.
            </p>

            <GlassCard className="mt-8 p-3 sm:p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                {searchFields.map((field) => (
                  <div className="field-surface rounded-3xl px-4 py-3" key={field.label}>
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                      {field.label}
                    </p>
                    <p className="mt-1 text-sm font-black text-tovlo-text">
                      {field.value}
                    </p>
                  </div>
                ))}
                <Button className="w-full md:w-auto">Хайх</Button>
              </div>
            </GlassCard>
          </div>

          <div className="room-stack relative min-h-[440px] overflow-hidden rounded-hero border border-tovlo-line/25 bg-tovlo-glass/8 p-6 shadow-glass backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(250,204,21,0.20),transparent_15rem)]" />
            <div className="room-stack-card absolute left-7 right-7 top-8 rounded-[34px] border border-tovlo-line/28 bg-tovlo-surface2/90 p-5 shadow-glass">
              <div className="h-40 rounded-[28px] bg-gradient-to-br from-tovlo-orange via-tovlo-softOrange to-tovlo-yellow" />
              <p className="mt-5 text-2xl font-black text-tovlo-text">Amber karaoke room</p>
              <p className="mt-2 text-sm font-medium text-tovlo-muted/75">8 хүн · 45,000₮ / цаг</p>
            </div>
            <div className="room-stack-card absolute left-12 right-12 top-32 rounded-[30px] border border-tovlo-line/24 bg-tovlo-darker/80 p-5 shadow-glass backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <StatusPill tone="success">Available</StatusPill>
                <p className="text-sm font-black text-tovlo-yellow">20:00</p>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {["18", "19", "20", "21"].map((time) => (
                  <span className="field-surface rounded-2xl py-3 text-center text-sm font-black text-tovlo-muted/85" key={time}>
                    {time}
                  </span>
                ))}
              </div>
            </div>
            <div className="room-stack-card absolute bottom-8 left-9 right-9 rounded-[28px] border border-tovlo-line/24 bg-tovlo-darker/80 p-5 shadow-glass backdrop-blur-xl">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Booking request
              </p>
              <p className="mt-2 text-xl font-black text-tovlo-text">Өнөөдөр · 20:00-22:00</p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="how-it-works" eyebrow="How it works" title="Хай. Сонго. Товло.">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <GlassCard className="min-h-56 transition hover:-translate-y-1 hover:border-tovlo-yellow/45" key={step.title}>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-tovlo-orange to-tovlo-yellow text-xl font-black text-[#120A04] shadow-glow">
                {index + 1}
              </div>
              <h2 className="text-3xl font-black text-tovlo-text">{step.title}</h2>
              <p className="mt-4 text-sm font-medium leading-[1.65] text-tovlo-muted/78">
                {step.text}
              </p>
            </GlassCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="featured" eyebrow="Featured resources" title="Онцлох өрөөнүүд.">
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </SectionShell>

      <SectionShell id="rules" eyebrow="Booking rules" title="Давхцалгүй товлолтын preview.">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="bg-tovlo-glassStrong/10">
            <StatusPill tone="success">Confirmed rule</StatusPill>
            <h2 className="mt-5 text-3xl font-black leading-[1.05] text-tovlo-text">
              Баталгаажсан захиалгууд давхцахгүй.
            </h2>
            <p className="mt-4 text-sm font-medium leading-[1.65] text-tovlo-muted/78">
              Нэг resource дээр баталгаажсан цаг байгаа бол тухайн цагийн цонх дахин сонгогдохгүй байх дүрмийн preview.
            </p>
          </GlassCard>
          <GlassCard>
            <StatusPill tone="booked">Extension blocked</StatusPill>
            <h2 className="mt-5 text-3xl font-black leading-[1.05] text-tovlo-text">
              Дараагийн баталгаажсан товлол байвал сунгалт хаагдана.
            </h2>
            <p className="mt-4 text-sm font-medium leading-[1.65] text-tovlo-muted/78">
              Захиалгын сунгалт дараагийн хэрэглэгчийн баталгаажсан цагтай зөрчилдөхгүй байх энгийн хамгаалалт.
            </p>
          </GlassCard>
        </div>
      </SectionShell>

      <SectionShell className="pt-4">
        <GlassCard className="grid gap-6 bg-tovlo-glassStrong/10 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <StatusPill tone="neutral">For businesses later</StatusPill>
            <h2 className="mt-5 text-3xl font-black leading-[1.05] text-tovlo-text sm:text-5xl">
              Караоке бизнесээ Tovlo дээр гаргах уу?
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-[1.65] text-tovlo-muted/78 sm:text-base">
              Ирээдүйд business хэсгээр resource, цагийн хуваарь, захиалгын хүсэлтээ удирдах боломжтой болно. Энэ хэсэг нь зөвхөн public CTA.
            </p>
          </div>
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-tovlo-line/28 bg-tovlo-glass/9 px-6 py-3 text-sm font-black text-tovlo-text transition hover:border-tovlo-yellow/70"
            href="/business"
          >
            Business preview
          </a>
        </GlassCard>
      </SectionShell>

      <SectionShell className="pb-16 pt-4">
        <div className="rounded-hero border border-tovlo-line/30 bg-gradient-to-br from-tovlo-orange via-tovlo-softOrange to-tovlo-yellow p-8 text-[#120A04] shadow-glow sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.12em]">Final CTA</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] sm:text-6xl">
            Өнөө оройн өрөөгөө хэдхэн алхмаар товло.
          </h2>
          <p className="mt-5 max-w-2xl text-base font-bold leading-[1.55]">
            Хайлт, өрөөний мэдээлэл, цагийн сонголт нэг урсгалд багтсан public booking experience.
          </p>
        </div>
      </SectionShell>
    </main>
  );
}
