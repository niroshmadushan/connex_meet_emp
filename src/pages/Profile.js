import React, { useState, useEffect } from 'react';
import profilePic from '../img/prof.jpg'; // Fallback profile picture
import axios from 'axios';
import {
  Box, Avatar, Typography, TextField, Button, Grid, Container, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  Table, TableBody, TableCell, TableRow, FormControl, InputLabel,
  OutlinedInput, InputAdornment, IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/system';
import { Buffer } from 'buffer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  marginBottom: '20px',
}));

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const profileId = localStorage.getItem('id'); // Assuming profileId is stored in localStorage
      const apiLink = 'http://192.168.13.150:3001/profile';

      try {
        const response = await axios.get(`${apiLink}/${profileId}`, { withCredentials: true });
        const imageBase64 = Buffer.from(response.data.image.data).toString('base64');
        response.data.image = `data:image/jpeg;base64,${imageBase64}`;
        setUserData(response.data);
        setEditData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setOpenEdit(true);
  };

  const handleSave = async () => {
    try {
      const apiLink = 'http://192.168.13.150:3001/profile'; // Endpoint for updating profile
      await axios.put(apiLink, editData, { withCredentials: true });
      setUserData(editData);
      setOpenEdit(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setOpenEdit(false);
    setEditData(userData); // Reset the editData to the original userData on cancel
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <StyledPaper>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Avatar alt={userData.name} src={userData.image || profilePic} sx={{ width: 100, height: 100, marginRight: '10px' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{userData.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Table>
              <TableBody>
                <TableRow><TableCell align="right"><strong>Email:</strong></TableCell><TableCell>{userData.email}</TableCell></TableRow>
                <TableRow><TableCell align="right"><strong>Phone:</strong></TableCell><TableCell>{userData.phone}</TableCell></TableRow>
                <TableRow><TableCell align="right"><strong>Address:</strong></TableCell><TableCell>{userData.address}</TableCell></TableRow>
                <TableRow><TableCell align="right"><strong>Designation:</strong></TableCell><TableCell>{userData.designation}</TableCell></TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleEdit} startIcon={<EditIcon />}>Edit Profile</Button>
        </Box>
      </StyledPaper>

      <Dialog open={openEdit} onClose={handleCancel}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
          <TextField fullWidth margin="dense" label="Phone" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
          <TextField fullWidth margin="dense" label="Address" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
          <TextField fullWidth margin="dense" label="Designation" value={editData.designation} onChange={(e) => setEditData({ ...editData, designation: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>
          <Button onClick={handleCancel} variant="outlined" color="secondary" startIcon={<CancelIcon />}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
