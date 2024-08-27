import { Box, CssBaseline } from "@mui/material";
import { ReactNode, useState } from "react";
import AppBar from '../layouts/appBar';
import DrawerHeader from '../layouts/drawer/drawerHeader';
import Drawer from '../layouts/drawer/drawer'; 
import React from "react";
import MainContent from "./drawer/mainContent";

interface DashboardLayoutProps {
  children: ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <CssBaseline />
      <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer open={open} handleDrawerClose={handleDrawerClose} />
      <MainContent open={open}>
        <DrawerHeader />
        {children}
      </MainContent>
    </>
  );
}