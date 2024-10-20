import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
import { isSameDay } from 'date-fns';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import APIConnection from '../config';

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
    selectedRoomId: '',
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
    id: '', // For storing `id` from local storage
    orgId: '', // For storing `orgId` from local storage
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

  // Fetch rooms and bookings data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get(`${APIConnection.mainapi}/place`, { withCredentials: true });
        setRooms(roomsResponse.data);

        const bookingsResponse = await axios.get(`${APIConnection.mainapi}/bookings`, { withCredentials: true });
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

  // When a slot is selected, update start and end time options based on the slot
  useEffect(() => {
    if (formData.selectedSlot) {
      const [slotStart, slotEnd] = formData.selectedSlot.split(' - ');
      const timeOptions = generateTimeOptions(slotStart, slotEnd, 15);
      setFormData((prevData) => ({
        ...prevData,
        startTimeOptions: timeOptions,
        endTimeOptions: timeOptions,
        startTime: '',
        endTime: '',
      }));
    }
  }, [formData.selectedSlot]);

  // Update end time options based on selected start time
  useEffect(() => {
    if (formData.startTime) {
      const [slotStart, slotEnd] = formData.selectedSlot.split(' - ');
      const endOptions = generateTimeOptions(formData.startTime, slotEnd, 15);
      setFormData((prevData) => ({
        ...prevData,
        endTimeOptions: endOptions.slice(1), // Show times after the selected start time
        endTime: '',
      }));
    }
  }, [formData.startTime]);

  useEffect(() => {
    if (formData.selectedRoomId) {
      const selectedRoom = rooms.find((room) => room.id === formData.selectedRoomId);
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
  }, [formData.selectedRoomId, formData.date]);

  const generateTimeOptions = (start, end, step = 15) => {
    const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}:00`);
    const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}:00`);
    const options = [];

    while (startTime <= endTime) {
      const timeString = convertTo12Hour(startTime.toTimeString().substring(0, 5)); // Format to 12-hour for display
      options.push(timeString);
      startTime.setMinutes(startTime.getMinutes() + step);
    }

    return options;
  };

  const convertTo12Hour = (time24h) => {
    let [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert back to 12-hour format
    hours = hours % 12 || 12; // Adjust 0 to 12 for midnight
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    // Handle "12:00 AM" and "12:00 PM" edge cases
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else {
      hours = modifier === 'PM' ? (parseInt(hours, 10) + 12).toString() : hours;
    }

    return `${hours.padStart(2, '0')}:${minutes}`; // Ensure "01" format instead of "1"
  };

  const getAvailableTimeSlots = (room) => {
    const startTime = room.start_time; // Already in 12-hour format
    const endTime = room.end_time;     // Already in 12-hour format

    // Convert the 12-hour time to 24-hour format for internal calculations
    const convertTime = (time) => {
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      return adjustedHours * 100 + minutes; // Use 100-based format for comparisons
    };

    const roomStart = convertTime(startTime);
    const roomEnd = convertTime(endTime);

    const roomBookings = bookings.filter(
      (booking) => booking.place_id === room.id && isSameDay(new Date(booking.date), new Date(formData.date))
    );

    if (roomBookings.length === 0) {
      return [`${startTime} - ${endTime}`]; // If no bookings, the entire slot is free
    }

    // Sort and find free slots
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

    // Convert slots back to 12-hour format for display
    const formatTime = (time) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      return convertTo12Hour(`${hours}:${minutes.toString().padStart(2, '0')}`);
    };

    return freeSlots.map((slot) => `${formatTime(slot.start)} - ${formatTime(slot.end)}`);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle adding participants to the meeting
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

  // Handle deleting participants from the list
  const handleDeleteParticipant = (index) => {
    const updatedList = formData.participantList.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      participantList: updatedList,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the participant list is empty before proceeding
    if (formData.participantList.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Please add at least one participant before submitting the meeting.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Prevent form submission if no participants
    }

    const formattedDate = formData.date ? format(new Date(formData.date), 'MM/dd/yyyy') : '';

    // Prepare the data for the API request
    const bookingData = {
      title: formData.title,
      date: formattedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      specialNote: formData.specialNote,
      refreshment: formData.refreshment,
      selectedRoomId: formData.selectedRoomId,
      companyName: formData.companyName,
      employeeName: formData.employeeName,
      participantList: formData.participantList,
      id: formData.id, // ID from local storage
      orgId: formData.orgId, // Org ID from local storage
    };

    try {
      // Send the booking data to the API endpoint
      await axios.post(`${APIConnection.mainapi}/add-booking`, bookingData, {
        withCredentials: true,
      });

      // Show success message and reset the form
      Swal.fire({
        title: 'Success!',
        text: 'The meeting has been added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        setFormData({
          title: '',
          date: '',
          availableRooms: [],
          selectedRoom: '',
          selectedRoomId: '',
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
          id: '',
          orgId: '',
        });
        navigate('/connex_meet_emp/dash');
      });
    } catch (error) {
      // Handle the error if the POST request fails
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the meeting. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error adding booking:', error);
    }
  };


  return (
    <Box sx={{ padding: '20px,',height:'60vh',mt:7 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        External Meeting Form
      </Typography>
      <Box elevation={2} sx={{ padding: '50px',width:'50%',backgroundColor:'white',m:'auto',height:'70vh',overflowY:'scroll', borderRadius: '12px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Title, Date, Room, Time Slots, Start and End Time */}
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
                  inputProps: {
                    min: format(new Date(), 'yyyy-MM-dd'), // Set the minimum date to today's date
                  },
                }}
                required
              />
            </Grid>

            {/* Room Selection and Available Slots */}
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

            {/* Available Slots Dropdown */}
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

            {/* Start and End Time Options */}
            {/* {formData.startTimeOptions.length > 0 && ( */}
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
            {/* )} */}

            {/* Participant Fields */}
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

            {/* Participant Table */}
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

            {/* Special Note and Refreshment */}
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
                required
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
                required
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
                
              >
                Add Meeting
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddMeetingSession;
