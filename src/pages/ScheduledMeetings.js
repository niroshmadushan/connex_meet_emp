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
  approved: 'green',
  canceled: 'gray',
  empty: 'orange',
};

// Function to calculate meeting status based on time and date
const getMeetingStatus = (meetingDate, meetingTime) => {
  const now = dayjs();
  const startTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[0]}`);
  const endTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[1]}`);

  if (now.isBefore(startTime)) return 'upcoming';
  if (now.isAfter(endTime)) return 'finished';
  return 'ongoing';
};

// Function to count active meetings for display in the toggle buttons
const countActiveMeetings = (meetings) => {
  return meetings.filter(
    (meeting) => ['upcoming', 'ongoing'].includes(getMeetingStatus(meeting.date, meeting.time))
  ).length;
};

// Function to sort meetings based on status and time
const sortMeetings = (meetings) => {
  return meetings.sort((a, b) => {
    const statusOrder = { upcoming: 1, ongoing: 2, finished: 3 };
    const statusA = getMeetingStatus(a.date, a.time);
    const statusB = getMeetingStatus(b.date, b.time);

    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    const startTimeA = dayjs(`${a.date} ${a.time.split(' - ')[0]}`);
    const startTimeB = dayjs(`${b.date} ${b.time.split(' - ')[0]}`);
    return startTimeA - startTimeB;
  });
};

// Styled Card component for a cleaner UI
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
  const [normalMeetings, setNormalMeetings] = useState([]);
  const [specialMeetings, setSpecialMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState('normal'); // Toggle view state

  useEffect(() => {
    const empID = localStorage.getItem('id');
    if (!empID) return;

    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`http://192.168.13.150:3001/get-schedule-meeting/${empID}`, {
          withCredentials: true,
        });
        const formattedMeetings = await Promise.all(
          response.data.map(async (meeting) => {
            const statusResponse = await axios.get(
              `http://192.168.13.150:3001/getdeletednormalmeet/${meeting.bookingDetails.id}`,
              { withCredentials: true }
            );
            return {
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
              status: statusResponse.data.status,
            };
          })
        );
        setNormalMeetings(formattedMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    const fetchSpecialMeetings = async () => {
      try {
        const specialResponse = await axios.get(`http://192.168.13.150:3001/getspecialbookings/${empID}`, {
          withCredentials: true,
        });
        const formattedSpecialMeetings = await Promise.all(
          specialResponse.data.map(async (meeting) => {
            const statusResponse = await axios.post(
              `http://192.168.13.150:3001/checkapprove/${meeting.bookingDetails.id}`,
              { empid: empID },
              { withCredentials: true }
            );
            return {
              id: meeting.bookingDetails.id,
              title: meeting.bookingDetails.title,
              Bookedby: meeting.bookingDetails.bookedBy,
              date: dayjs(meeting.bookingDetails.date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
              time: `${meeting.bookingDetails.start_time} - ${meeting.bookingDetails.end_time}`,
              room: `Room ${meeting.bookingDetails.place_id}`,
              participants: meeting.participants.map((participant) => ({
                companyName: participant.company_name || 'Unknown Company',
                employeeName: participant.full_name || 'Unknown Employee',
              })),
              specialNote: meeting.bookingDetails.note,
              refreshment: meeting.bookingDetails.refreshment,
              status: statusResponse.data.status,
            };
          })
        );
        setSpecialMeetings(formattedSpecialMeetings);
      } catch (error) {
        console.error('Error fetching special meetings:', error);
      }
    };

    fetchMeetings();
    fetchSpecialMeetings();
  }, []);

  const handleOpen = (meeting) => {
    setSelectedMeeting(meeting);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  const handleDeleteNormal = async (id) => {
    const empID = localStorage.getItem('id');
    const result = await Swal.fire({
      title: 'Are you sure you want to cancel this normal meeting?',
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
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://192.168.13.150:3001/updatemeetingstatusnormal/${id}`,
          { reason: result.value },
          { withCredentials: true }
        );
        setNormalMeetings(normalMeetings.map((meeting) => (meeting.id === id ? { ...meeting, status: 'canceled' } : meeting)));
        Swal.fire('Canceled!', 'The normal meeting has been canceled.', 'success');
      } catch (error) {
        console.error('Error canceling meeting:', error);
        Swal.fire('Error!', 'There was an issue canceling the meeting.', 'error');
      }
    }
  };

  const handleDeleteSpecial = async (id) => {
    const empID = localStorage.getItem('id');
    const result = await Swal.fire({
      title: 'Are you sure you want to cancel this special meeting?',
      input: 'text',
      inputPlaceholder: 'Enter the reason for cancellation',
      showCancelButton: true,
      confirmButtonText: 'Cancel Meeting',
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('You need to enter a reason!');
        } else {
          return reason;
        }
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://192.168.13.150:3001/cancelstatus/${id}`, { empid: empID, reason: result.value }, { withCredentials: true });
        setSpecialMeetings(specialMeetings.map((meeting) => (meeting.id === id ? { ...meeting, status: 'canceled' } : meeting)));
        Swal.fire('Canceled!', 'The special meeting has been canceled.', 'success');
      } catch (error) {
        console.error('Error canceling meeting:', error);
        Swal.fire('Error!', 'There was an issue canceling the meeting.', 'error');
      }
    }
  };

  const handleApprove = async (id) => {
    const empID = localStorage.getItem('id');
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this meeting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://192.168.13.150:3001/updatemeetingstatus/${id}`,
          { empid: empID },
          { withCredentials: true }
        );

        setSpecialMeetings(
          specialMeetings.map((meeting) =>
            meeting.id === id ? { ...meeting, status: 'approved' } : meeting
          )
        );

        Swal.fire('Approved!', 'The meeting has been approved.', 'success');
      } catch (error) {
        console.error('Error approving meeting:', error);
        Swal.fire('Error!', 'There was an issue approving the meeting.', 'error');
      }
    }
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
          onChange={(e, newValue) => {
            if (newValue) setViewType(newValue);
          }}
          aria-label="meeting type"
        >
          <ToggleButton value="normal" disabled={viewType === 'normal'}>
            Normal Meetings ({countActiveMeetings(normalMeetings)})
          </ToggleButton>
          <ToggleButton value="special" disabled={viewType === 'special'}>
            Special Meetings ({countActiveMeetings(specialMeetings)})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Show Normal or Special Meetings Based on Toggle */}
      <Grid container spacing={3}>
        {sortMeetings(viewType === 'normal' ? normalMeetings : specialMeetings).map((meeting) => {
          const status = getMeetingStatus(meeting.date, meeting.time);

          return (
            <Grid item xs={12} md={6} key={meeting.id}>
              <StyledCard onClick={() => handleOpen(meeting)}>
                <CardContent>
                  {/* Special Meeting Information */}
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
                      {meeting.Bookedby}
                    </Box>
                  )}

                  {/* Meeting Status Indicator */}
                  <Chip
                    icon={<BlinkingDot color={statusColors[status]} />}
                    label={
                      meeting.status === 'canceled'
                        ? 'Canceled'
                        : status.charAt(0).toUpperCase() + status.slice(1)
                    }
                    sx={{
                      backgroundColor:
                        meeting.status === 'canceled'
                          ? statusColors['canceled'] + '22'
                          : statusColors[status] + '22',
                      color:
                        meeting.status === 'canceled'
                          ? statusColors['canceled']
                          : statusColors[status],
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  />

                  {/* Meeting Details */}
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

                {/* Action Buttons: Approve, Delete or Canceled Status */}
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  {/* Show "Canceled" Text for Canceled Normal Meetings */}
                  {viewType === 'normal' && meeting.status === 'canceled' && (
                    <Typography variant="body1" sx={{ color: 'red', fontWeight: 'bold' }}>
                      This meeting has been canceled
                    </Typography>
                  )}

                  {/* Show Approved/Canceled Text for Special Meetings */}
                  {viewType === 'special' && meeting.status === 'approved' && (
                    <Typography sx={{ color: 'green', fontWeight: 'bold' }}>Approved</Typography>
                  )}
                  {viewType === 'special' && meeting.status === 'canceled' && (
                    <Typography sx={{ color: 'red', fontWeight: 'bold' }}>Canceled</Typography>
                  )}

                  {/* Show Delete Button for Upcoming Normal Meetings if Not Canceled */}
                  {viewType === 'normal' && status === 'upcoming' && meeting.status !== 'canceled' && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNormal(meeting.id);
                      }}
                    >
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  )}

                  {/* Show Delete Button for Special Meetings that are Upcoming or Ongoing */}
                  {viewType === 'special' &&
                    ['upcoming', 'ongoing'].includes(status) &&
                    meeting.status !== 'approved' &&
                    meeting.status !== 'canceled' && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSpecial(meeting.id);
                        }}
                      >
                        <DeleteIcon sx={{ color: 'red' }} />
                      </IconButton>
                    )}

                  {/* Show Approve Button for Special Meetings if not Approved or Canceled */}
                  {viewType === 'special' &&
                    meeting.status !== 'approved' &&
                    status !== 'finished' &&
                    meeting.status !== 'canceled' && (
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

      {/* Meeting Details Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '12px', boxShadow: 24, p: 4 }}>
            {selectedMeeting ? (
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
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center' }}>Loading details...</Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ScheduledMeetings;
