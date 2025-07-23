"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { BrainCircuit, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleButton from "../features/GoogleButton";
import { useRouter } from "next/navigation";

/**
 * Header component that displays the navigation and user actions.
 *
 * This component includes:
 * - A logo and title for the application.
 * - Navigation links that change based on the user's authentication state and current page.
 * - User actions including sign-in and sign-out functionality.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user, isLoadingUser, signIn, logout } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    }

    router.push("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              InterviewAI
            </span>
          </div>

          {/* Navigation */}
          {!isHome && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          )}

          {isHome && user && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoadingUser ? (
              // Loading state
              <div className="flex items-center space-x-3">
                <div className="h-9 w-16 bg-muted animate-pulse rounded-md"></div>
                <div className="h-9 w-24 bg-muted animate-pulse rounded-md"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.photoURL || undefined}
                        alt={user.displayName || "User"}
                      />
                      <AvatarFallback>
                        {user.displayName ? (
                          user.displayName.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/dashboard">
                      <span className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Unauthenticated user
              <div className="flex items-center space-x-3">
                <GoogleButton signIn={handleSignIn} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
