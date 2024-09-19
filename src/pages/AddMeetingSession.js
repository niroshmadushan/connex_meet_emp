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
  Autocomplete,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import NotesIcon from '@mui/icons-material/Notes';
import RefreshIcon from '@mui/icons-material/Refresh';
import TitleIcon from '@mui/icons-material/Title';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Sample Data for Companies and Visitors
const companies = [
  { name: 'Company A', visitors: ['John Doe', 'Jane Smith'] },
  { name: 'Company B', visitors: ['Alice Brown', 'Bob Johnson'] },
  { name: 'Company C', visitors: ['Charlie Green', 'Diana White'] },
];

const themeColor = {
  primary: '#007aff',
  primaryDark: '#005bb5',
  textPrimary: '#333333',
  cardBg: '#ffffff',
  buttonHover: '#005bb5',
  lightGray: '#e0e0e0',
};

const availablePlaces = {
  '2024-09-04': ['Room 1', 'Room 3', 'Room 4'],
  '2024-09-05': ['Room 2', 'Room 3'],
};

const availableTimeSlots = {
  'Room 1': ['10:00 AM - 12:30 PM', '01:00 PM - 02:30 PM', '04:00 PM - 06:00 PM'],
  'Room 3': ['09:00 AM - 11:00 AM', '03:00 PM - 05:00 PM'],
  'Room 4': ['11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'],
};

const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
  return `${hours}:${minutes}`;
};

const generateTimeOptions = (start, end, step = 15) => {
  const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}:00`);
  const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}:00`);
  const options = [];

  while (startTime <= endTime) {
    const timeString = startTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    options.push(timeString);
    startTime.setMinutes(startTime.getMinutes() + step);
  }

  return options;
};

const AddMeetingSession = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    availableRooms: [],
    selectedRoom: '',
    availableSlots: [],
    selectedSlot: '',
    startTime: '',
    endTime: '',
    startTimeOptions: [],
    endTimeOptions: [],
    type: 'meeting',
    registeredParticipants: [], // For registered participants, non-editable but deletable
    unknownParticipants: [], // For unknown participants, editable and deletable
    specialNote: '',
    refreshment: '',
    companyName: '',
    companyVisitors: [],
    newParticipant: '',
    editingIndex: null,
    editingName: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (formData.date) {
      setFormData((prevData) => ({
        ...prevData,
        availableRooms: availablePlaces[formData.date] || [],
        selectedRoom: '',
        availableSlots: [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
      }));
    }
  }, [formData.date]);

  useEffect(() => {
    if (formData.selectedRoom) {
      setFormData((prevData) => ({
        ...prevData,
        availableSlots: availableTimeSlots[formData.selectedRoom] || [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
      }));
    }
  }, [formData.selectedRoom]);

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

  const handleCompanyChange = (event, value) => {
    const company = companies.find((c) => c.name === value);
    setFormData({
      ...formData,
      companyName: value,
      companyVisitors: company ? company.visitors : [],
    });
  };

  const handleParticipantSelect = (event, values) => {
    setFormData((prevData) => ({
      ...prevData,
      registeredParticipants: [...new Set([...prevData.registeredParticipants, ...values])],
    }));
  };

  const handleDeleteRegisteredParticipant = (index) => {
    const updatedRegisteredParticipants = formData.registeredParticipants.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      registeredParticipants: updatedRegisteredParticipants,
    });
  };

  const handleAddUnknownParticipant = () => {
    if (formData.newParticipant.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        unknownParticipants: [...prevData.unknownParticipants, prevData.newParticipant.trim()],
        newParticipant: '',
      }));
    }
  };

  const handleEditUnknownParticipant = (index) => {
    setFormData({
      ...formData,
      editingIndex: index,
      editingName: formData.unknownParticipants[index],
    });
  };

  const handleUpdateUnknownParticipant = () => {
    if (formData.editingName.trim()) {
      const updatedUnknownParticipants = [...formData.unknownParticipants];
      updatedUnknownParticipants[formData.editingIndex] = formData.editingName.trim();
      setFormData({
        ...formData,
        unknownParticipants: updatedUnknownParticipants,
        editingIndex: null,
        editingName: '',
      });
    }
  };

  const handleDeleteUnknownParticipant = (index) => {
    const updatedUnknownParticipants = formData.unknownParticipants.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      unknownParticipants: updatedUnknownParticipants,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    Swal.fire({
      title: 'Success!',
      text: 'The meeting/session has been added successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      setFormData({
        title: '',
        date: '',
        location: '',
        availableRooms: [],
        selectedRoom: '',
        availableSlots: [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
        type: 'meeting',
        registeredParticipants: [],
        unknownParticipants: [],
        specialNote: '',
        refreshment: '',
        companyName: '',
        companyVisitors: [],
        newParticipant: '',
        editingIndex: null,
        editingName: '',
      });
      navigate('/home-dashboard');
    });
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Add a New Meeting or Session
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title, Date, and Room Selection */}
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Room</InputLabel>
                <Select
                  label="Select Room"
                  name="selectedRoom"
                  value={formData.selectedRoom}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <RoomIcon color="primary" />
                    </InputAdornment>
                  }
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
                    startAdornment={
                      <InputAdornment position="start">
                        <AccessTimeIcon color="primary" />
                      </InputAdornment>
                    }
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    required
                  >
                    {formData.startTimeOptions.map((option, index) => (
                      <MenuItem key={index} value={convertTo24Hour(option)}>
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    required
                  >
                    {formData.endTimeOptions.map((option, index) => (
                      <MenuItem key={index} value={convertTo24Hour(option)}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            )}

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
                <MenuItem value="session">Session</MenuItem>
                <MenuItem value="interview">Interview</MenuItem>
                <MenuItem value="service">Service</MenuItem>
              </TextField>
            </Grid>

            {/* New Participant Section */}
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={companies.map((company) => company.name)}
                value={formData.companyName}
                onChange={handleCompanyChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Visitor Company"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                )}
              />
            </Grid>

            {formData.companyVisitors.length > 0 && (
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={formData.companyVisitors}
                  value={formData.registeredParticipants}
                  onChange={handleParticipantSelect}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={index} label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Registered Visitors"
                      placeholder="Start typing..."
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            )}

            {/* List of Registered Participants (Non-Editable, Deletable) */}
            {formData.registeredParticipants.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  Registered Participants:
                </Typography>
                <List>
                  <TransitionGroup>
                    {formData.registeredParticipants.map((participant, index) => (
                      <Collapse key={index}>
                        <ListItem>
                          <ListItemText primary={participant} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDeleteRegisteredParticipant(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </List>
              </Grid>
            )}

            {/* Add Unknown Participants Section */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Unknown Participant"
                name="newParticipant"
                value={formData.newParticipant}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AddIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Button onClick={handleAddUnknownParticipant} sx={{ marginLeft: 1 }}>
                      Add
                    </Button>
                  ),
                }}
              />
            </Grid>

            {/* List of Unknown Participants (Editable, Deletable) */}
            {formData.unknownParticipants.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  Unknown Participants:
                </Typography>
                <List>
                  <TransitionGroup>
                    {formData.unknownParticipants.map((participant, index) => (
                      <Collapse key={index}>
                        <ListItem>
                          {formData.editingIndex === index ? (
                            <>
                              <TextField
                                value={formData.editingName}
                                onChange={(e) => setFormData({ ...formData, editingName: e.target.value })}
                                sx={{ marginRight: 1 }}
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={handleUpdateUnknownParticipant}>
                                  <SaveIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </>
                          ) : (
                            <>
                              <ListItemText primary={participant} />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleEditUnknownParticipant(index)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleDeleteUnknownParticipant(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </>
                          )}
                        </ListItem>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </List>
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
        </form>
      </Paper>
    </Box>
  );
};

export default AddMeetingSession;
