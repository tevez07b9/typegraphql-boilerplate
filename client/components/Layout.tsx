import React from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

const Layout: React.FC<{}> = ({ children }) => {
  return (
    <div className="h-full w-full">
      <Box>
        <Navbar />
        <Box className="p-4" h="full">
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
