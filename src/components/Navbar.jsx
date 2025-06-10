import { Button } from "./ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky px-4 top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="h-full flex items-center cursor-pointer p-1" onClick={() => navigate("/")}>
          {isDark ? (
            <img src="/content/Dark_mode.svg" alt="MyBlog Logo Dark" className="h-10 w-auto object-contain" />
          ) : (
            <img src="/content/White_mode.svg" alt="MyBlog Logo Light" className="h-10 w-auto object-contain" />
          )}
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer ${location.pathname === '/'
                ? `bg-primary ${isDark ? 'text-white' : 'text-black'}`
                : 'hover:bg-primary/10 hover:text-primary'
              }`}
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer ${location.pathname === '/about-us'
                ? `bg-primary ${isDark ? 'text-white' : 'text-black'}`
                : 'hover:bg-primary/10 hover:text-primary'
              }`}
            onClick={() => navigate("/about-us")}
          >
            About Us
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer ${location.pathname === '/contact-us'
                ? `bg-primary ${isDark ? 'text-white' : 'text-black'}`
                : 'hover:bg-primary/10 hover:text-primary'
              }`}
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
          </button>
          <ModeToggle />
        </nav>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer">
                <span className="sr-only">Toggle menu</span>
                ☰
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/")}>
                <Button variant="ghost" className="w-full justify-start cursor-pointer">Home</Button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/about-us")}>
                <Button variant="ghost" className="w-full justify-start cursor-pointer">About Us</Button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/contact-us")}>
                <Button variant="ghost" className="w-full justify-start cursor-pointer">Contact Us</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
