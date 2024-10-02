import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Modal,
  Backdrop,
  Fade,
  Chip,
  IconButton,
  CardActions,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotesIcon from '@mui/icons-material/Notes';
import RefreshIcon from '@mui/icons-material/Refresh';
import GroupIcon from '@mui/icons-material/Group';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const statusColors = {
  upcoming: 'orange',
  ongoing: 'green',
  finished: 'red',
};

const getMeetingStatus = (meetingDate, meetingTime) => {
  const now = dayjs();
  const startTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[0]}`);
  const endTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[1]}`);

  if (now.isBefore(startTime)) return 'upcoming';
  if (now.isAfter(endTime)) return 'finished';
  return 'ongoing';
};

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  padding: '15px',
  height: 'auto',
  transition: 'transform 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const BlinkingDot = styled(CircleIcon)(({ color }) => ({
  '@keyframes blink': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.3 },
    '100%': { opacity: 1 },
  },
  color: color,
  animation: 'blink 1s infinite',
}));

const ScheduledMeetings = () => {
  const [normalMeetings, setNormalMeetings] = useState([]);
  const [specialMeetings, setSpecialMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState('normal'); // Toggle view state

  useEffect(() => {
    const fetchMeetings = async () => {
      const empID = localStorage.getItem('id'); // Get employee ID from local storage
      if (!empID) return;

      try {
        const response = await axios.get(`http://192.168.13.150:3001/get-schedule-meeting/${empID}`, {
          withCredentials: true,
        });

        const formattedMeetings = response.data.map((meeting) => ({
          id: meeting.bookingDetails.id,
          title: meeting.bookingDetails.title,
          date: dayjs(meeting.bookingDetails.date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          time: `${meeting.bookingDetails.start_time} - ${meeting.bookingDetails.end_time}`,
          room: `Room ${meeting.bookingDetails.place_id}`,
          participants: meeting.participants.map((participant) => ({
            companyName: participant.company_name || 'Unknown Company',
            employeeName: participant.full_name || 'Unknown Employee',
          })),
          specialNote: meeting.bookingDetails.note,
          refreshment: meeting.bookingDetails.refreshment,
        }));

        setNormalMeetings(formattedMeetings); // Update normal meetings state
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleOpen = (meeting) => {
    setSelectedMeeting(meeting); // Ensure the selectedMeeting is set
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null); // Clear the selected meeting after closing
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Scheduled Meetings
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={(e, newValue) => setViewType(newValue)}
          aria-label="meeting type"
        >
          <ToggleButton value="normal">Normal Meetings</ToggleButton>
          <ToggleButton value="special">Special Meetings</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {(viewType === 'normal' ? normalMeetings : specialMeetings).map((meeting) => {
          const status = getMeetingStatus(meeting.date, meeting.time);

          return (
            <Grid item xs={12} md={6} key={meeting.id}>
              <StyledCard onClick={() => handleOpen(meeting)}>
                <CardContent>
                  {viewType === 'special' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#f5f5f5',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        color: '#007aff',
                      }}
                    >
                      Special Meeting
                    </Box>
                  )}
                  <Chip
                    icon={<BlinkingDot color={statusColors[status]} />}
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    sx={{
                      backgroundColor: statusColors[status] + '22',
                      color: statusColors[status],
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {meeting.title}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <EventIcon sx={{ marginRight: '8px', color: statusColors[status] }} />
                    {meeting.date}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <AccessTimeIcon sx={{ marginRight: '8px', color: statusColors[status] }} />
                    {meeting.time}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <RoomIcon sx={{ marginRight: '8px', color: statusColors[status] }} />
                    {meeting.room}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal for Meeting Details */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '12px',
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedMeeting && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {selectedMeeting.title}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <EventIcon sx={{ marginRight: '8px' }} />
                  {selectedMeeting.date}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <AccessTimeIcon sx={{ marginRight: '8px' }} />
                  {selectedMeeting.time}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <RoomIcon sx={{ marginRight: '8px' }} />
                  {selectedMeeting.room}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <GroupIcon sx={{ marginRight: '8px' }} />
                  Participants:
                </Typography>
                <ul>
                  {selectedMeeting.participants.map((participant, index) => (
                    <li key={index}>
                      {participant.companyName} - {participant.employeeName}
                    </li>
                  ))}
                </ul>
                {selectedMeeting.specialNote && (
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <NotesIcon sx={{ marginRight: '8px' }} />
                    {selectedMeeting.specialNote}
                  </Typography>
                )}
                {selectedMeeting.refreshment && (
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <RefreshIcon sx={{ marginRight: '8px' }} />
                    Refreshment: {selectedMeeting.refreshment}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ScheduledMeetings;
