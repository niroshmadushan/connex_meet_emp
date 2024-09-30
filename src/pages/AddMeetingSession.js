import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import NotesIcon from '@mui/icons-material/Notes';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { format, isSameDay } from 'date-fns';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Theme colors
const themeColor = {
  primary: '#007aff',
  primaryDark: '#005bb5',
};

const AddMeetingSession = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    availableRooms: [],
    selectedRoom: '',
    availableSlots: [],
    selectedSlot: '',
    startTime: '',
    endTime: '',
    startTimeOptions: [],
    endTimeOptions: [],
    companyName: '',
    employeeName: '',
    participantList: [],
    type: 'meeting',
    specialNote: '',
    refreshment: '',
  });

  const navigate = useNavigate();

  // Fetch rooms and bookings data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get('http://192.168.13.150:3001/place', { withCredentials: true });
        setRooms(roomsResponse.data);

        const bookingsResponse = await axios.get('http://192.168.13.150:3001/bookings', { withCredentials: true });
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Failed to fetch room and booking data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle changes in date and update available rooms based on the selected date
  useEffect(() => {
    if (formData.date) {
      const filteredRooms = rooms.map((room) => room.name);
      setFormData((prevData) => ({
        ...prevData,
        availableRooms: filteredRooms || [],
        selectedRoom: '',
        availableSlots: [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
      }));
    }
  }, [formData.date, rooms]);

  // Handle room selection change and update available slots for the selected room
  useEffect(() => {
    if (formData.selectedRoom) {
      const selectedRoom = rooms.find((room) => room.name === formData.selectedRoom);
      if (selectedRoom) {
        const availableTimeSlots = getAvailableTimeSlots(selectedRoom);
        setFormData((prevData) => ({
          ...prevData,
          availableSlots: availableTimeSlots,
          selectedSlot: '',
          startTime: '',
          endTime: '',
          startTimeOptions: [],
          endTimeOptions: [],
        }));
      }
    }
  }, [formData.selectedRoom, formData.date]);

  // Calculate available time slots for the selected room based on the selected date
  const getAvailableTimeSlots = (room) => {
    const startTime = room.start_time;
    const endTime = room.end_time;

    const convertTime = (time) => {
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      return adjustedHours * 100 + minutes;
    };

    const roomStart = convertTime(startTime);
    const roomEnd = convertTime(endTime);

    const roomBookings = bookings.filter(
      (booking) => booking.place_id === room.id && isSameDay(new Date(booking.date), new Date(formData.date))
    );

    if (roomBookings.length === 0) {
      return [`${startTime} - ${endTime}`];
    }

    const sortedBookings = roomBookings
      .map((booking) => ({
        start: convertTime(booking.start_time),
        end: convertTime(booking.end_time),
      }))
      .sort((a, b) => a.start - b.start);

    const freeSlots = [];
    let lastEndTime = roomStart;

    sortedBookings.forEach((booking) => {
      if (lastEndTime < booking.start) {
        freeSlots.push({ start: lastEndTime, end: booking.start });
      }
      lastEndTime = Math.max(lastEndTime, booking.end);
    });

    if (lastEndTime < roomEnd) {
      freeSlots.push({ start: lastEndTime, end: roomEnd });
    }

    const formatTime = (time) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return freeSlots.map((slot) => `${formatTime(slot.start)} - ${formatTime(slot.end)}`);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddParticipant = () => {
    if (formData.companyName.trim() && formData.employeeName.trim()) {
      const newParticipant = {
        companyName: formData.companyName,
        employeeName: formData.employeeName,
      };
      setFormData((prevData) => ({
        ...prevData,
        participantList: [...prevData.participantList, newParticipant],
        companyName: '',
        employeeName: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Success!',
      text: 'The meeting/session has been added successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      setFormData({
        title: '',
        date: '',
        availableRooms: [],
        selectedRoom: '',
        availableSlots: [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        companyName: '',
        employeeName: '',
        participantList: [],
        type: 'meeting',
        specialNote: '',
        refreshment: '',
      });
      navigate('/home-dashboard');
    });
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Add a New Meeting
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
          <Grid container spacing={3}>
            {/* Title and Date */}
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
                InputLabelProps={{
                  shrink: true,
                }}
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

            {/* Room and Time Slot Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Room</InputLabel>
                <Select
                  label="Select Room"
                  name="selectedRoom"
                  value={formData.selectedRoom}
                  onChange={handleChange}
                  required
                >
                  {formData.availableRooms.map((room, index) => (
                    <MenuItem key={index} value={room}>
                      {room}
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

            {formData.startTimeOptions.length > 0 && (
              <>
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
              </>
            )}

            {/* Company Name and Employee Name Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAddParticipant}
                sx={{
                  backgroundColor: themeColor.primary,
                  color: '#fff',
                  ':hover': {
                    backgroundColor: themeColor.primaryDark,
                  },
                }}
              >
                Add Participant
              </Button>
            </Grid>

            {/* Participant List */}
            {formData.participantList.length > 0 && (
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Company Name</TableCell>
                      <TableCell>Employee Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.participantList.map((participant, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{participant.companyName}</TableCell>
                        <TableCell>{participant.employeeName}</TableCell>
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

            {/* Event Type */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Type of Event"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="conference">Conference</MenuItem>
              </TextField>
            </Grid>

            {/* Special Note */}
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

            {/* Refreshments */}
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

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: themeColor.primary,
                  color: '#fff',
                  ':hover': {
                    backgroundColor: themeColor.primaryDark,
                  },
                  transition: 'background-color 0.3s ease',
                  padding: '10px',
                  fontWeight: 'bold',
                }}
                fullWidth
              >
                Add Meeting
              </Button>
            </Grid>
          </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddMeetingSession;
