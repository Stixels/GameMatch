import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16 space-y-12 bg-background text-foreground">
      <header className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-primary">
          Welcome to GameMatch
        </h1>
        <p className="text-2xl text-muted-foreground">
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
    <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
