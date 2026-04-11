import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
        </div>
      </nav>
      <main
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
