import React, { useState, useEffect } from 'react';
import profilePic from '../img/prof.jpg'; // Fallback profile picture
import axios from 'axios';
import Swal from 'sweetalert2';
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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: '6px 16px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    backgroundColor: '#005bb5',
    transform: 'scale(1.05)'
  }
}));

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      
      const profileId = Cookies.get('userId'); 
      const apiLink = 'http://192.168.13.6:3001/profile';

      try {
        const response = await axios.get(`${apiLink}/${profileId}`, { withCredentials: true });
        const imageBase64 = Buffer.from(response.data.image.data).toString('base64');
        response.data.image = `data:image/jpeg;base64,${imageBase64}`;
        setUserData(response.data);
        setEditData(response.data);
        setLoading(false);
      } catch (err) {
        handleDialogClose();
        Swal.fire('Error!', 'Failed to fetch profile data.', 'error');
      }
    };

    fetchProfileData();
  }, []);

  const handleDialogClose = () => {
    setOpenEdit(false);
    setOpenPassword(false);
  };

  const handleEdit = () => setOpenEdit(true);

  const handleSave = async () => {
    try {
      const apiLink = 'http://192.168.13.6:3001/profile';
      await axios.put(apiLink, editData, { withCredentials: true });
      setUserData(editData);
      setOpenEdit(false);
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
    } catch (error) {
      handleDialogClose();
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error!', 'New passwords do not match!', 'error');
      return;
    }
    try {
      const response = await axios.post('http://192.168.13.6:3001/password', {
        id: userData.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, { withCredentials: true });

      Swal.fire('Success!', response.data.message, 'success');
      setOpenPassword(false);
    } catch (error) {
      handleDialogClose();
      Swal.fire('Error!', error.response.data.message, 'error');
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <StyledPaper>
        <Avatar alt={userData.name} src={userData.image || profilePic} sx={{ width: 100, height: 100, marginBottom: '10px' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{userData.name}</Typography>
        <Table>
          <TableBody>
            <TableRow><TableCell align="right"><strong>Email:</strong></TableCell><TableCell>{userData.email}</TableCell></TableRow>
            <TableRow><TableCell align="right"><strong>Phone:</strong></TableCell><TableCell>{userData.phone}</TableCell></TableRow>
            <TableRow><TableCell align="right"><strong>Address:</strong></TableCell><TableCell>{userData.address}</TableCell></TableRow>
            <TableRow><TableCell align="right"><strong>Designation:</strong></TableCell><TableCell>{userData.designation}</TableCell></TableRow>
          </TableBody>
        </Table>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <CustomButton variant="contained" color="primary" onClick={handleEdit} startIcon={<EditIcon />}>Edit Profile</CustomButton>
          <CustomButton variant="outlined" color="primary" onClick={() => setOpenPassword(true)} startIcon={<LockIcon />}>Change Password</CustomButton>
        </Box>
      </StyledPaper>

      {/* Dialogs for Editing and Changing Password */}
      <Dialog open={openEdit} onClose={handleDialogClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Email" value={editData.email} disabled />
          <TextField fullWidth margin="dense" label="Phone" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
          <TextField fullWidth margin="dense" label="Address" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
          <TextField fullWidth margin="dense" label="Designation" value={editData.designation} onChange={(e) => setEditData({ ...editData, designation: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />}>Save</CustomButton>
          <CustomButton onClick={handleDialogClose} variant="outlined" color="secondary" startIcon={<CancelIcon />}>Cancel</CustomButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openPassword} onClose={handleDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
            <OutlinedInput
              id="currentPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current Password"
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="newPassword">New Password</InputLabel>
            <OutlinedInput
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New Password"
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm New Password"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handlePasswordChange} variant="contained" color="primary">Change Password</CustomButton>
          <CustomButton onClick={() => setOpenPassword(false)} variant="outlined" color="secondary">Cancel</CustomButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
