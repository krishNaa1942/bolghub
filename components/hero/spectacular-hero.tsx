"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const heroStats = [
  { label: "Production ready", value: "2 min setup" },
  { label: "Live collaborators", value: "Unlimited" },
  { label: "Content velocity", value: "5x faster" },
  { label: "Taxonomy coverage", value: "92% glowing" },
];

const heroHighlights = [
  "Cinematic web-swing motion rooted in Framer Motion",
  "Glassmorphism dashboard shell tuned for collaboration",
  "Markdown editor with live Spider-Sense preview panel",
];

const heroParticles = Array.from({ length: 18 }, (_, index) => {
  const baseRadius = 3 + ((index * 7) % 4);
  const wave = Math.sin(index * 0.6) * 24;
  const sway = Math.cos(index * 0.45) * 18;
  const cx = 140 + index * 62 + wave;
  const cy =
    index % 2 === 0 ? 480 - index * 14 + sway : 520 - index * 16 - sway * 0.6;
  return {
    radius: baseRadius,
    cx,
    cy,
    delay: index * 0.08,
  };
});

export function SpectacularHero() {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-32">
      <HeroBackdrop />
      <div className="container px-4">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Badge
            variant="outline"
            className="border-primary/40 bg-white/5 text-primary backdrop-blur"
          >
            Spectacular web studio
          </Badge>
          <motion.h1
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Swing into a Spider-Verse grade publishing experience
          </motion.h1>
          <motion.p
            className="mt-6 max-w-3xl text-balance text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            Orchestrate your editorial universe with neon webs, cinematic
            motion, and an app shell that feels lifted from Spider-Man&apos;s
            own infinity lab.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.08, delayChildren: 0.25 },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button
                asChild
                size="lg"
                className="group shadow-[0_12px_40px_-18px_rgba(229,9,80,0.85)]"
              >
                <Link href="/blog" className="flex items-center gap-2">
                  Explore the multiverse
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/40 bg-background/60 backdrop-blur-xl"
              >
                <Link href="/dashboard/new" className="flex items-center gap-2">
                  Start crafting origin story
                  <Sparkles className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.ul
            className="mt-12 grid w-full gap-4 text-left sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          >
            {heroHighlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-background/70 p-4 backdrop-blur-xl"
              >
                <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Zap className="size-3" />
                </span>
                <span className="text-sm text-muted-foreground">
                  {highlight}
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-14 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
          >
            {heroStats.map((stat) => (
              <Card
                key={stat.label}
                className="group relative overflow-hidden border-white/15 bg-background/70 shadow-[0_25px_60px_-45px_rgba(229,9,80,0.9)] backdrop-blur-xl transition hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="relative px-5 py-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.22),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_65%)]" />
      <motion.svg
        viewBox="0 0 1200 600"
        className="absolute inset-0 h-full w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
        }}
      >
        <motion.path
          d="M150 520 C 260 480, 340 400, 420 310 C 520 200, 640 140, 820 160 C 980 180, 1080 260, 1120 360"
          fill="none"
          stroke="url(#webGradient)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                duration: 2.6,
                ease: "easeInOut",
              },
            },
          }}
        />
        <defs>
          <motion.linearGradient
            id="webGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            initial={{ x1: "0%", x2: "100%" }}
            animate={{ x1: ["0%", "20%", "0%"], x2: ["100%", "80%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <stop offset="0%" stopColor="rgba(229,9,80,0.85)" />
            <stop offset="55%" stopColor="rgba(99,102,241,0.75)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.85)" />
          </motion.linearGradient>
        </defs>
        {heroParticles.map((particle, index) => (
          <motion.circle
            key={`web-particle-${index}`}
            r={particle.radius}
            cx={particle.cx}
            cy={particle.cy}
            fill="rgba(255,255,255,0.55)"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0.1, 0.85, 0.3],
              scale: [0.8, 1.4, 0.9],
            }}
            transition={{
              duration: 4.5,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-red-500/25 via-fuchsia-500/15 to-sky-500/20 blur-[120px]" />
      </motion.div>
    </div>
  );
}
