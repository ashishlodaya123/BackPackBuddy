import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Backpack,
  Map,
  ShieldCheck,
  Users,
  Sun,
  Cloud,
  Star,
} from "lucide-react";

// You would replace these with your actual shadcn/ui components
const Button = ({ children, className, ...props }) => (
  <button
    className={`px-6 py-3 rounded-md font-semibold ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Input = (props) => (
  <input
    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent"
    {...props}
  />
);
const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const Nav = () => (
  <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 sm:px-6 lg:px-8">
    <nav className="container mx-auto flex justify-between items-center">
      <div className="flex items-center">
        <Backpack className="h-8 w-8 text-secondary" />
        <span className="ml-2 text-2xl font-bold text-secondary">
          BackpackBuddy
        </span>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <a href="#features" className="text-gray-600 hover:text-secondary">
          Features
        </a>
        <a href="#testimonials" className="text-gray-600 hover:text-secondary">
          Reviews
        </a>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          Get Started
        </Button>
      </div>
    </nav>
  </header>
);

const HeroSection = ({ onPlanTrip }) => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [budget, setBudget] = useState("Chill");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination && dates) {
      onPlanTrip({ destination, dates, budget });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 bg-primary">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold text-secondary tracking-tight"
        >
          Smarter Travel, Planned by AI.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
        >
          Stop planning, start exploring. Get a personalized, budget-aware
          itinerary in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <Card className="shadow-xl">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-left text-gray-700 mb-1"
                >
                  Destination
                </label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="e.g., Vietnam"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="dates"
                  className="block text-sm font-medium text-left text-gray-700 mb-1"
                >
                  Dates
                </label>
                <Input
                  id="dates"
                  type="text"
                  placeholder="e.g., July 15 - July 30"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 md:col-span-3 lg:col-span-1"
              >
                Plan My Trip
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Map,
    title: "Dynamic Itinerary",
    description:
      "Day-by-day plans that adapt to your style, from hidden gems to popular sights.",
  },
  {
    icon: ShieldCheck,
    title: "Offline Survival Pack",
    description:
      "Download your full itinerary, maps, and safety info as a single PDF.",
  },
  {
    icon: Users,
    title: "Backpacker Focused",
    description:
      "We prioritize hostels, social spots, and authentic, budget-friendly experiences.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-secondary">
          Everything a Backpacker Needs
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          All powered by autonomous AI agents.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="text-center h-full">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary mb-4">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-secondary">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const testimonials = [
  {
    name: "Alex R.",
    quote:
      "BackpackBuddy planned my 3-week trip through Southeast Asia flawlessly. It felt like having a personal travel agent who actually gets the backpacker vibe.",
    rating: 5,
  },
  {
    name: "Maria S.",
    quote:
      "The 'Hidden Gems' feature is a game-changer. I discovered so many places I would have never found on my own. The offline PDF was a lifesaver!",
    rating: 5,
  },
  {
    name: "Ben K.",
    quote:
      "As someone with a full-time job, I need my short trips to be efficient. This tool saved me hours of planning and the itinerary was spot on.",
    rating: 4,
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-20 bg-primary">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-secondary">
          Trusted by Explorers Worldwide
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Don't just take our word for it.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <div className="flex mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              <p className="text-muted-foreground flex-grow">
                "{testimonial.quote}"
              </p>
              <p className="mt-4 font-semibold text-secondary">
                - {testimonial.name}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground">
    <div className="container mx-auto py-8 px-4 text-center">
      <div className="flex justify-center items-center mb-4">
        <Backpack className="h-6 w-6" />
        <span className="ml-2 text-xl font-bold">BackpackBuddy</span>
      </div>
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} BackpackBuddy. All rights reserved.
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Your AI companion for smarter adventures.
      </p>
    </div>
  </footer>
);

const Home = () => {
  // This function would be passed down from your App's router
  // to navigate to the results page with the form data.
  const handlePlanTrip = (data) => {
    console.log("Planning trip with data:", data);
    // Example: navigate('/results', { state: data });
    alert(`Starting to plan your trip to ${data.destination}!`);
  };

  return (
    <div className="bg-white">
      <Nav />
      <main>
        <HeroSection onPlanTrip={handlePlanTrip} />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
