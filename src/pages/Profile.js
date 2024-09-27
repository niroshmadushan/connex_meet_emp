import React, { useState, useEffect } from 'react';
import profilePic from '../img/prof.jpg'; // Fallback profile picture
import axios from 'axios';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  marginBottom: '20px',
}));

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false); // State for the password dialog
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const profileId = localStorage.getItem('id');
      const apiLink = 'http://192.168.13.150:300/profile';

      try {
        const response = await axios.get(`${apiLink}/${profileId}`, {
          withCredentials: true,
        });

        // Convert Buffer image to Base64
        const imageBuffer = response.data.image.data;
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');
        response.data.image = `data:image/jpeg;base64,${imageBase64}`; // Set the Base64 image string

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
    setEditData({ ...userData });
    setOpenEdit(true);
  };

  const handleSave = async () => {
    const profileId = localStorage.getItem('id');
    const apiLink = 'http://192.168.13.150:3001/profile';

    try {
      await axios.put(`${apiLink}/${profileId}`, editData, {
        withCredentials: true,
      });
      setUserData(editData);
      setOpenEdit(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setOpenEdit(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // Add your API call for changing the password here
    alert("Password changed successfully!");
    setOpenPassword(false);
  };

  const handlePasswordFieldChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <StyledPaper>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={userData.name}
              src={userData.image || profilePic} // Use Base64 image or fallback
              sx={{ width: 100, height: 100, marginRight: '10px' }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {userData.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="right"><strong>Email:</strong></TableCell>
                  <TableCell>{userData.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right"><strong>Phone:</strong></TableCell>
                  <TableCell>{userData.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right"><strong>Address:</strong></TableCell>
                  <TableCell>{userData.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right"><strong>Designation:</strong></TableCell>
                  <TableCell>{userData.designation}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenPassword(true)} // Open the password dialog
            startIcon={<LockIcon />}
          >
            Change Password
          </Button>
        </Box>
      </StyledPaper>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={handleCancel}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            name="name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Phone"
            name="phone"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Address"
            name="address"
            value={editData.address}
            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Designation"
            name="designation"
            value={editData.designation}
            onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />}>
            Save
          </Button>
          <Button onClick={handleCancel} variant="outlined" color="secondary" startIcon={<CancelIcon />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
            <OutlinedInput
              id="currentPassword"
              name="currentPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordFieldChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current Password"
            />
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel htmlFor="newPassword">New Password</InputLabel>
            <OutlinedInput
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordFieldChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New Password"
            />
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordFieldChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm New Password"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Change Password
          </Button>
          <Button onClick={() => setOpenPassword(false)} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
