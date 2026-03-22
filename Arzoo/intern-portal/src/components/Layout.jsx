import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Layout() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
