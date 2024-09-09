"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "../components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link href="/" className="text-xl font-bold">
        GameMatch
      </Link>
      <div>
        {session ? (
          <>
            <Link href="/profile" className="mr-4">
              Profile
            </Link>
            <Link href="/settings" className="mr-4">
              Settings
            </Link>
            <Link href="/game-selection" className="mr-4">
              Game Selection
            </Link>
            <Link href="/questionnaire" className="mr-4">
              Questionnaire
            </Link>
            <span className="mr-4">Signed in as {session.user?.email}</span>
            <Button variant="destructive" onClick={() => signOut()}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => router.push("/login")} className="mr-2">
              Login
            </Button>
            <Button onClick={() => router.push("/signup")} variant="outline">
              Sign up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
