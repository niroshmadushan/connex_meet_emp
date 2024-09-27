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

const CenteredAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  marginBottom: '10px',
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
      const profileId = localStorage.getItem('id'); 
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

  const handleEdit = () => setOpenEdit(true);
  const handleSave = async () => {
    try {
      const apiLink = 'http://192.168.13.150:3001/profile';
      await axios.put(apiLink, editData, { withCredentials: true });
      setUserData(editData);
      setOpenEdit(false);
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handleCancel = () => {
    setOpenEdit(false);
    setEditData(userData); 
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error!', 'New passwords do not match!', 'error');
      return;
    }
    try {
      const response = await axios.post('http://192.168.13.150:3001/password', {
        id: userData.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, { withCredentials: true });

      Swal.fire('Success!', response.data.message, 'success');
      setOpenPassword(false);
    } catch (error) {
      Swal.fire('Error!', error.response.data.message, 'error');
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <StyledPaper>
        <CenteredAvatar alt={userData.name} src={userData.image || profilePic} />
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
          <Button variant="contained" color="primary" onClick={handleEdit} startIcon={<EditIcon />}>Edit Profile</Button>
          <Button variant="outlined" color="primary" onClick={() => setOpenPassword(true)} startIcon={<LockIcon />}>Change Password</Button>
        </Box>
      </StyledPaper>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={handleCancel}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {['name', 'email', 'phone', 'address', 'designation'].map(field => (
            <TextField
              key={field}
              fullWidth
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={editData[field]}
              onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>
          <Button onClick={handleCancel} variant="outlined" color="secondary" startIcon={<CancelIcon />}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
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
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel
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
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">Change Password</Button>
          <Button onClick={() => setOpenPassword(false)} variant="outlined" color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
