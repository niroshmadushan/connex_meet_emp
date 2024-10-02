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
  padding: '15px',
  height: 'auto',
  transition: 'transform 0.2s ease-in-out',
  position: 'relative',
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
  color: color,
  animation: 'blink 1s infinite',
}));

const ScheduledMeetings = () => {
  const [normalMeetings, setNormalMeetings] = useState([
    {
      id: 1,
      title: 'Team Sync',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
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
      title: 'Review Meeting',
      date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
      time: '09:00 AM - 10:00 AM',
      room: 'Room 3',
      participants: [
        { companyName: 'Company D', employeeName: 'Charlie Green' },
      ],
      specialNote: 'Annual performance review',
      refreshment: 'Water',
    },
  ]);

  const [specialMeetings, setSpecialMeetings] = useState([
    {
      id: 3,
      title: 'Client Presentation',
      date: dayjs().format('YYYY-MM-DD'),
      time: dayjs().subtract(1, 'hour').format('hh:mm A') + ' - ' + dayjs().add(1, 'hour').format('hh:mm A'),
      room: 'Room 2',
      participants: [
        { companyName: 'Company C', employeeName: 'Alice Brown' },
      ],
      specialNote: 'Present new product features',
      refreshment: 'Coffee',
      approved: false,
    },
  ]);

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState('normal'); // Toggle view state

  const handleOpen = (meeting) => {
    setSelectedMeeting(meeting);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  const handleDelete = (id, isSpecial = false) => {
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

        if (isSpecial) {
          setSpecialMeetings(specialMeetings.filter((meeting) => meeting.id !== id));
        } else {
          setNormalMeetings(normalMeetings.filter((meeting) => meeting.id !== id));
        }

        Swal.fire('Canceled!', 'The meeting has been canceled.', 'success');
      }
    });
  };

  const handleApprove = (id) => {
    setSpecialMeetings(
      specialMeetings.map((meeting) =>
        meeting.id === id ? { ...meeting, approved: true } : meeting
      )
    );
  };

  const countUpcoming = (meetings) => {
    return meetings.filter((meeting) => getMeetingStatus(meeting.date, meeting.time) === 'upcoming').length;
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Scheduled Meetings
      </Typography>

      {/* Toggle Button for Normal and Special Meetings */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={(e, newValue) => setViewType(newValue)}
          aria-label="meeting type"
        >
          <ToggleButton value="normal">Normal Meetings ({countUpcoming(normalMeetings)})</ToggleButton>
          <ToggleButton value="special">Special Meetings ({countUpcoming(specialMeetings)})</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Show Normal or Special Meetings Based on Toggle */}
      <Grid container spacing={3}>
        {(viewType === 'normal' ? normalMeetings : specialMeetings).map((meeting) => {
          const status = getMeetingStatus(meeting.date, meeting.time);

          return (
            <Grid item xs={12} md={6} key={meeting.id}>
              <StyledCard onClick={() => handleOpen(meeting)}>
                <CardContent>
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
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(meeting.id, viewType === 'special');
                    }}
                  >
                    <DeleteIcon sx={{ color: 'red' }} />
                  </IconButton>
                  {viewType === 'special' && meeting.approved === false && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(meeting.id);
                      }}
                    >
                      Approve
                    </Button>
                  )}
                </CardActions>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ScheduledMeetings;
