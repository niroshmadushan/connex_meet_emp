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
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotesIcon from '@mui/icons-material/Notes';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const themeColor = {
  primary: '#007aff',
  primaryDark: '#005bb5',
};

const AddMeetingSession = () => {
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

  const [availablePlaces, setAvailablePlaces] = useState({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState({});
  const navigate = useNavigate();

  // Fetch rooms and bookings data when date changes
  useEffect(() => {
    if (formData.date) {
      fetchRoomsAndBookings(formData.date);
    }
  }, [formData.date]);

  const fetchRoomsAndBookings = async (selectedDate) => {
    try {
      const roomsResponse = await axios.get(`http://192.168.13.150:3001/api/rooms`);
      const rooms = roomsResponse.data;
      const bookingsResponse = await axios.get(`http://192.168.13.150:3001/api/bookings?date=09/30/2024`);
      const bookings = bookingsResponse.data;

      console.log(bookings);
      const placesByDate = { [selectedDate]: rooms.map((room) => room.name) };

      const slotsByRoom = rooms.reduce((acc, room) => {
        const roomBookings = bookings.filter((booking) => booking.place_id === room.id);
        const availableSlots = calculateAvailableTimeSlots(room, roomBookings);
        acc[room.name] = availableSlots;
        return acc;
      }, {});

      setAvailablePlaces(placesByDate);
      setAvailableTimeSlots(slotsByRoom);

      setFormData((prevData) => ({
        ...prevData,
        availableRooms: placesByDate[selectedDate] || [],
        selectedRoom: '',
        availableSlots: [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
      }));
    } catch (error) {
      console.error('Failed to fetch rooms and bookings data:', error);
    }
  };

  const calculateAvailableTimeSlots = (room, bookings) => {
    const roomStart = convertTimeToMinutes(room.start_time);
    const roomEnd = convertTimeToMinutes(room.end_time);

    const sortedBookings = bookings
      .map((booking) => ({
        start: convertTimeToMinutes(booking.start_time),
        end: convertTimeToMinutes(booking.end_time),
      }))
      .sort((a, b) => a.start - b.start);

    const freeSlots = [];
    let lastEnd = roomStart;

    sortedBookings.forEach((booking) => {
      if (lastEnd < booking.start) {
        freeSlots.push(formatTimeRange(lastEnd, booking.start));
      }
      lastEnd = Math.max(lastEnd, booking.end);
    });

    if (lastEnd < roomEnd) freeSlots.push(formatTimeRange(lastEnd, roomEnd));

    return freeSlots;
  };

  const convertTimeToMinutes = (time) => {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : hours;
    return hour24 * 60 + minutes;
  };

  const formatTimeRange = (start, end) => {
    const formatTime = (minutes) => {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
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
            {/* Title and Date Inputs */}
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

            {/* Room Selection */}
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

            {/* Time Slot Selection */}
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

            {/* Start and End Time Inputs */}
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

            {/* Company and Employee Name Inputs */}
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

            {/* Add Participant Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAddParticipant}
                sx={{ backgroundColor: themeColor.primary, color: '#fff', ':hover': { backgroundColor: themeColor.primaryDark } }}
              >
                Add Participant
              </Button>
            </Grid>

            {/* Participant List Table */}
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

            {/* Event Type Selection */}
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

            {/* Refreshment Details */}
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
                  ':hover': { backgroundColor: themeColor.primaryDark },
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
        </form>
      </Paper>
    </Box>
  );
};

export default AddMeetingSession;
