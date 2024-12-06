import React, { useState } from "react";
import { Tab, Tabs, } from "@mui/material";
import { Container } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Customer from "./Customer";
import Training from "./Training";

function MyTabs() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  const tabTitles = ["Customers", "Trainings"];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">
            {tabTitles[currentTabIndex]}
          </Typography>
          <Tabs value={currentTabIndex} onChange={handleTabChange} textColor="inherit">
            <Tab label="Customers" />
            <Tab label="Trainings" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container>
        {currentTabIndex === 0 && <Customer />}
        {currentTabIndex === 1 && <Training />}
      </Container>
    </>
  );
}

export default MyTabs;