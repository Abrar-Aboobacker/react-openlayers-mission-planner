import { useState } from "react";
import { Button, Box } from "@mui/material";
import MapComponent from "./components/MapView";
import ModalComponent from "./components/Modal";

const App = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleDrawClick = () => setIsDrawing(true);
  const handleModalClose = () => setModalData(null);

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <Button
        variant="contained"
        onClick={handleDrawClick}
        sx={{ position: "absolute", zIndex: 1000, top: 10, left: 10 }}
      >
        Draw on Map
      </Button>

      <MapComponent
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        setModalData={setModalData}
      />

      {modalData && (
        <ModalComponent data={modalData} onClose={handleModalClose} />
      )}
    </Box>
  );
};

export default App;
