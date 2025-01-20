import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


interface ModalComponentProps {
  data:any;
  onClose:React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalComponent:React.FC<ModalComponentProps> = ({ data, onClose }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [selectedWaypoint, setSelectedWaypoint] = React.useState(null);

  const handleMenuOpen = (event, waypoint) => {
    setAnchorEl(event.currentTarget);
    // setSelectedWaypoint(waypoint);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedWaypoint(null);
  };



  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mission Planner
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Waypoint</TableCell>
              <TableCell>Coordinates</TableCell>
              <TableCell>Distance (m)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{`${row.coordinates[0].toFixed(6)}, ${row.coordinates[1].toFixed(6)}`}</TableCell>
                <TableCell>{row.distance.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, row)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={()=>console.log('clicked')}>
            Insert Polygon Before
          </MenuItem>
          <MenuItem onClick={()=>console.log('clicked')}>
            Insert Polygon After
          </MenuItem>
        </Menu>

        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
