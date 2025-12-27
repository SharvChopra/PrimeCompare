import { ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Gradients */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-accent/20 rounded-full blur-[120px] -z-10"
      />

      {/* Hero Section */}
      <header className="relative pt-32 pb-32 flex flex-col items-center justify-center text-center px-6">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold mb-6"
          >
            🚀 AI-Powered Product Comparisons
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-gray-400"
          >
            Find the{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-pink-500">
              Perfect Tech
            </span>{" "}
            <br /> for You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10"
          >
            Compare smartphones, laptops, and gadgets side-by-side. Get
            AI-powered insights from thousands of user reviews instantly. Stop
            guessing, start knowing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="btn-primary flex items-center justify-center group"
            >
              Create Account to Compare{" "}
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition"
                size={20}
              />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-full font-bold border border-white/20 hover:bg-white/10 transition backdrop-blur-sm text-white"
            >
              Already a Member? Login
            </Link>
          </motion.div>
        </div>

        {/* Floating UI Elements (Decorative) */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block absolute top-20 right-[10%] glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Zap className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Speed Score</p>
              <p className="font-bold text-white">9.8/10</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="hidden lg:block absolute bottom-10 left-[10%] glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Shield className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">AI Trust</p>
              <p className="font-bold text-white">Verified</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Feature Highlights */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <FeatureCard
            icon={<Zap className="text-yellow-400" size={32} />}
            title="Real-Time Analysis"
            desc="Puppeteer scrapes the latest web reviews instantly. No stale data."
            delay={0.2}
          />
          <FeatureCard
            icon={<Shield className="text-blue-400" size={32} />}
            title="Unbiased AI Insights"
            desc="Natural Language Processing (NLP) detects genuine pros & cons."
            delay={0.4}
          />
          <FeatureCard
            icon={<CheckCircle className="text-green-400" size={32} />}
            title="Side-by-Side Specs"
            desc="Compare technical specifications clearly without the clutter."
            delay={0.6}
          />
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-20 bg-primary/50 relative overflow-hidden">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Trusted by Tech Enthusiasts
          </h2>
          <p className="text-text-muted">
            See what our users are saying about PrimeCompare
          </p>
        </div>

        {/* Rolling Marquee Container */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex space-x-8 px-4"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const testimonials = [
  {
    name: "Alex M.",
    role: "Tech Reviewer",
    text: "This tool saved me hours of research. The AI insights are spot on!",
  },
  {
    name: "Sarah J.",
    role: "Gadget Lover",
    text: "Finally, a comparison site that doesn't feel cluttered. Beautiful UI!",
  },
  {
    name: "David K.",
    role: "Developer",
    text: "The side-by-side specs view is exactly what I needed for my new laptop.",
  },
  {
    name: "Emily R.",
    role: "Photographer",
    text: "I love how it scrapes real-time prices. Got the best deal on my camera.",
  },
  {
    name: "Mark T.",
    role: "Gamer",
    text: "Comparing GPU benchmarks has never been easier.",
  },
  {
    name: "Jessica L.",
    role: "Student",
    text: "Helped me find the best budget laptop for college.",
  },
];

const TestimonialCard = ({ name, role, text }) => (
  <div className="glass-card p-6 min-w-75 shrink-0">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-pink-500 flex items-center justify-center text-white font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{name}</h4>
        <p className="text-xs text-text-muted">{role}</p>
      </div>
    </div>
    <p className="text-gray-300 text-sm leading-relaxed italic">"{text}"</p>
  </div>
);

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-8 hover:bg-secondary/70 transition duration-300 group"
  >
    <div className="bg-secondary/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/5">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition text-white">
      {title}
    </h3>
    <p className="text-text-muted leading-relaxed">{desc}</p>
  </motion.div>
);

export default LandingPage;
