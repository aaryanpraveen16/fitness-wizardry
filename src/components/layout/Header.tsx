
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut } from "lucide-react";

interface NavLinkProps {
  to: string;
  label: string;
  currentPath: string;
}

const NavLink = ({ to, label, currentPath }: NavLinkProps) => {
  const isActive = currentPath === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  
  // Don't show header on onboarding, login, or signup pages
  if (["/", "/onboarding", "/login", "/signup"].includes(pathname)) {
    return null;
  }

  const isAuthenticated = pathname !== "/login" && pathname !== "/signup" && pathname !== "/onboarding";

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/workout-plans", label: "Workout Plans" },
    { to: "/nutrition", label: "Nutrition" },
    { to: "/progress", label: "Progress" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-8 rounded-full fitness-gradient flex items-center justify-center font-bold">MB</div>
            <span className="text-xl font-bold">MyFitnessBuddy</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated &&
            navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                label={link.label}
                currentPath={pathname}
              />
            ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/login">
                        <LogOut className="mr-2 size-4" /> Logout
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <User className="size-4 mr-2" /> Profile
            </Link>
            <Link
              to="/login"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="size-4 mr-2" /> Logout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
