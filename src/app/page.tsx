import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to GameMatch</h1>
        <p className="text-2xl text-gray-600">
          Find your next favorite game in minutes!
        </p>
      </header>

      <div className="flex justify-center">
        <Link href="/game-selection">
          <Button size="lg" className="text-lg px-8 py-4">
            Get Started Now
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <FeatureCard
          title="Personalized Recommendations"
          description="Our AI analyzes your preferences to suggest games you'll love."
        />
        <FeatureCard
          title="Vast Game Library"
          description="Access thousands of games across multiple platforms and genres."
        />
        <FeatureCard
          title="Game Discovery"
          description="Discover new games and genres you'll love."
        />
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
