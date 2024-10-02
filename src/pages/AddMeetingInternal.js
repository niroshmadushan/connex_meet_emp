import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Autocomplete,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import NotesIcon from '@mui/icons-material/Notes';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const themeColor = {
  primary: '#007aff',
  primaryDark: '#005bb5',
};

const AddMeetingSession = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [employeeEmails, setEmployeeEmails] = useState([
    'john.doe@connexit.com',
    'jane.smith@connexit.com',
    'alice.jones@connexit.com',
    'bob.brown@connexit.com',
    'charlie.adams@connexit.com',
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    availableRooms: [],
    selectedRoomId: '',
    availableSlots: [],
    selectedSlot: '',
    startTime: '',
    endTime: '',
    startTimeOptions: [],
    endTimeOptions: [],
    companyName: 'Connex IT',
    employeeEmail: '',
    participantList: [],
    type: 'internalmeeting',
    specialNote: '',
    refreshment: '',
    id: '',
    orgId: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id') || '';
    const userOrgId = localStorage.getItem('orgid') || '';
    setFormData((prevData) => ({
      ...prevData,
      id: userId,
      orgId: userOrgId,
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get('http://192.168.13.150:3001/place', { withCredentials: true });
        setRooms(roomsResponse.data);

        const bookingsResponse = await axios.get('http://192.168.13.150:3001/bookings', { withCredentials: true });
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.date) {
      setFormData((prevData) => ({
        ...prevData,
        selectedRoomId: '',
        availableSlots: [],
        startTimeOptions: [],
        endTimeOptions: [],
        startTime: '',
        endTime: '',
      }));
    }
  }, [formData.date, rooms]);

  useEffect(() => {
    if (formData.selectedRoomId) {
      const selectedRoom = rooms.find((room) => room.id === formData.selectedRoomId);
      if (selectedRoom) {
        const availableTimeSlots = getAvailableTimeSlots(selectedRoom);
        setFormData((prevData) => ({
          ...prevData,
          availableSlots: availableTimeSlots,
          selectedSlot: '',
          startTimeOptions: [],
          endTimeOptions: [],
          startTime: '',
          endTime: '',
        }));
      }
    }
  }, [formData.selectedRoomId, formData.date]);

  useEffect(() => {
    if (formData.selectedSlot) {
      const [slotStart, slotEnd] = formData.selectedSlot.split(' - ');
      const timeOptions = generateTimeOptions(slotStart, slotEnd);
      setFormData((prevData) => ({
        ...prevData,
        startTimeOptions: timeOptions,
        endTimeOptions: timeOptions,
        startTime: '',
        endTime: '',
      }));
    }
  }, [formData.selectedSlot]);

  useEffect(() => {
    if (formData.startTime) {
      const [slotStart, slotEnd] = formData.selectedSlot.split(' - ');
      const endOptions = generateTimeOptions(formData.startTime, slotEnd);
      setFormData((prevData) => ({
        ...prevData,
        endTimeOptions: endOptions.slice(1),
        endTime: '',
      }));
    }
  }, [formData.startTime]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailChange = (event, value) => {
    setFormData({
      ...formData,
      employeeEmail: value,
    });
  };

  const handleAddParticipant = () => {
    if (formData.employeeEmail.trim()) {
      const newParticipant = {
        companyName: formData.companyName,
        employeeEmail: formData.employeeEmail,
      };
      setFormData((prevData) => ({
        ...prevData,
        participantList: [...prevData.participantList, newParticipant],
        employeeEmail: '',
      }));
    }
  };

  const handleDeleteParticipant = (index) => {
    const updatedList = formData.participantList.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      participantList: updatedList,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formData.date ? format(new Date(formData.date), 'MM/dd/yyyy') : '';
    const bookingData = {
      title: formData.title,
      date: formattedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      specialNote: formData.specialNote,
      refreshment: formData.refreshment,
      selectedRoomId: formData.selectedRoomId,
      participantList: formData.participantList,
      id: formData.id,
      orgId: formData.orgId,
    };

    try {
      await axios.post('http://192.168.13.150:3001/add-booking', bookingData, { withCredentials: true });
      Swal.fire('Success!', 'The meeting/session has been added successfully.', 'success').then(() => {
        setFormData({
          title: '',
          date: '',
          availableSlots: [],
          selectedRoomId: '',
          selectedSlot: '',
          startTime: '',
          endTime: '',
          companyName: 'Connex IT',
          employeeEmail: '',
          participantList: [],
          type: 'internalmeeting',
          specialNote: '',
          refreshment: '',
          id: '',
          orgId: '',
        });
        navigate('/home-dashboard');
      });
    } catch (error) {
      Swal.fire('Error!', 'There was a problem adding the meeting. Please try again.', 'error');
      console.error('Error adding booking:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Add a New Internal Meeting
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '12px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Room</InputLabel>
                <Select
                  label="Select Room"
                  name="selectedRoomId"
                  value={formData.selectedRoomId}
                  onChange={handleChange}
                  required
                >
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {formData.availableSlots.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Time Slot</InputLabel>
                  <Select
                    label="Select Time Slot"
                    name="selectedSlot"
                    value={formData.selectedSlot}
                    onChange={handleChange}
                    required
                  >
                    {formData.availableSlots.map((slot, index) => (
                      <MenuItem key={index} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              >
                {formData.startTimeOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              >
                {formData.endTimeOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={employeeEmails}
                value={formData.employeeEmail}
                onChange={handleEmailChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee Email"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAddParticipant}
                sx={{ backgroundColor: themeColor.primary, color: '#fff', ':hover': { backgroundColor: themeColor.primaryDark } }}
              >
                Add Participant
              </Button>
            </Grid>

            {formData.participantList.length > 0 && (
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Company Name</TableCell>
                      <TableCell>Employee Email</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.participantList.map((participant, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{participant.companyName}</TableCell>
                        <TableCell>{participant.employeeEmail}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDeleteParticipant(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Note"
                name="specialNote"
                value={formData.specialNote}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter any special notes regarding the event"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Refreshment"
                name="refreshment"
                value={formData.refreshment}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Enter refreshment details if any"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RefreshIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: themeColor.primary, color: '#fff', ':hover': { backgroundColor: themeColor.primaryDark } }}
                fullWidth
              >
                Add Meeting
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddMeetingSession;
