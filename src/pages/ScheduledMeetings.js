import React, { useState } from 'react';
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
  TextField,
  Button,
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

// Custom colors for meeting status
const statusColors = {
  upcoming: 'orange',
  ongoing: 'green',
  finished: 'red',
};

// Function to calculate meeting status
const getMeetingStatus = (meetingDate, meetingTime) => {
  const now = dayjs();
  const startTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[0]}`);
  const endTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[1]}`);

  if (now.isBefore(startTime)) return 'upcoming';
  if (now.isAfter(endTime)) return 'finished';
  return 'ongoing';
};

// Styled Card for a more compact look
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
  padding: '15px', // Reduced padding to make the card compact
  height: 'auto', // Auto height to adjust to content
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

// Blinking animation for the status dot
const BlinkingDot = styled(CircleIcon)(({ color }) => ({
  '@keyframes blink': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.3 },
    '100%': { opacity: 1 },
  },
  color: color, // Use dynamic color for the blinking dot
  animation: 'blink 1s infinite',
}));

const ScheduledMeetings = () => {
  // Sample data for scheduled meetings
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Team Sync',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'), // Upcoming Meeting (tomorrow)
      time: '10:00 AM - 11:30 AM',
      room: 'Room 1',
      participants: [
        { companyName: 'Company A', employeeName: 'John Doe' },
        { companyName: 'Company B', employeeName: 'Jane Smith' },
      ],
      specialNote: 'Discuss the Q3 strategy',
      refreshment: 'Tea and Snacks',
    },
    {
      id: 2,
      title: 'Client Presentation',
      date: dayjs().format('YYYY-MM-DD'), // Ongoing Meeting (today)
      time: dayjs().subtract(1, 'hour').format('hh:mm A') + ' - ' + dayjs().add(1, 'hour').format('hh:mm A'), // ongoing time
      room: 'Room 2',
      participants: [
        { companyName: 'Company C', employeeName: 'Alice Brown' },
      ],
      specialNote: 'Present new product features',
      refreshment: 'Coffee',
    },
    {
      id: 3,
      title: 'Review Meeting',
      date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'), // Finished Meeting
      time: '09:00 AM - 10:00 AM',
      room: 'Room 3',
      participants: [
        { companyName: 'Company D', employeeName: 'Charlie Green' },
      ],
      specialNote: 'Annual performance review',
      refreshment: 'Water',
    },
  ]);

  // Modal state for the meeting details popup
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleOpen = (meeting) => {
    setSelectedMeeting(meeting);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  const handleDelete = (id) => {
    // Show an input prompt asking for the reason for cancellation
    Swal.fire({
      title: 'Are you sure you want to cancel this meeting?',
      text: 'Please provide a reason for canceling this meeting:',
      input: 'text',
      inputPlaceholder: 'Enter the reason for cancelation',
      showCancelButton: true,
      confirmButtonText: 'Cancel Meeting',
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('You need to enter a reason!');
        } else {
          return reason;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        console.log(`Meeting canceled with reason: ${reason}`);
        // Proceed to cancel the meeting and remove it from the list
        setMeetings(meetings.filter((meeting) => meeting.id !== id));
        Swal.fire('Canceled!', 'The meeting has been canceled.', 'success');
      }
    });
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Scheduled Meetings
      </Typography>
      <Grid container spacing={3}>
        {meetings.map((meeting) => {
          const status = getMeetingStatus(meeting.date, meeting.time);

          return (
            <Grid item xs={12} md={6} key={meeting.id}>
              <StyledCard onClick={() => handleOpen(meeting)}>
                <CardContent>
                  {/* Status Dot */}
                  <Chip
                    icon={
                      <BlinkingDot color={statusColors[status]} /> // Blinking dot based on status
                    }
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    sx={{
                      backgroundColor: statusColors[status] + '22',
                      color: statusColors[status],
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  />
                  {/* Title */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {meeting.title}
                  </Typography>
                  {/* Date */}
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <EventIcon sx={{ marginRight: '8px', color: statusColors[status] }} />
                    {meeting.date}
                  </Typography>
                  {/* Time */}
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <AccessTimeIcon sx={{ marginRight: '8px', color: statusColors[status] }} />
                    {meeting.time}
                  </Typography>
                  {/* Room */}
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <RoomIcon sx={{ marginRight: '8px', color: statusColors[status] }} />
                    {meeting.room}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {/* Show Delete Icon only for Upcoming Meetings */}
                  {status === 'upcoming' && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(meeting.id);
                      }}
                    >
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  )}
                </CardActions>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal for displaying full meeting details */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
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
                {/* Date */}
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <EventIcon sx={{ marginRight: '8px' }} />
                  {selectedMeeting.date}
                </Typography>
                {/* Time */}
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <AccessTimeIcon sx={{ marginRight: '8px' }} />
                  {selectedMeeting.time}
                </Typography>
                {/* Room */}
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <RoomIcon sx={{ marginRight: '8px' }} />
                  {selectedMeeting.room}
                </Typography>
                {/* Participants */}
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
                {/* Special Note */}
                {selectedMeeting.specialNote && (
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <NotesIcon sx={{ marginRight: '8px' }} />
                    {selectedMeeting.specialNote}
                  </Typography>
                )}
                {/* Refreshment */}
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
