// src/layouts/Layout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearchChange={setSearchQuery} />

      <main className="flex-grow">
        <Outlet context={{ searchQuery }} />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
