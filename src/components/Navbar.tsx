"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "../components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center p-4 shadow-md">
      <Link href="/" className="text-xl font-bold">
        GameMatch
      </Link>
      <div className="flex items-center">
        {session ? (
          <>
            <Link href="/game-selection" className="mr-4">
              Game Selection
            </Link>
            <Link href="/questionnaire" className="mr-4">
              Questionnaire
            </Link>
            <Link href="/results" className="mr-4">
              Results
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>
                    {session.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
