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

// Function to calculate meeting status
const getMeetingStatus = (meetingDate, meetingTime) => {
  const now = dayjs();
  const startTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[0]}`);
  const endTime = dayjs(`${meetingDate} ${meetingTime.split(' - ')[1]}`);

  if (now.isBefore(startTime)) return 'upcoming';
  if (now.isAfter(endTime)) return 'finished';
  return 'ongoing';
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
  const [normalMeetings, setNormalMeetings] = useState([]);
  const [specialMeetings, setSpecialMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState('normal'); // Toggle view state

  // Fetch meetings data from the backend
  useEffect(() => {
    const empID = localStorage.getItem('id'); // Get employee ID from local storage
    if (!empID) return;

    const fetchMeetings = async () => {
      try {
        // Fetch normal meetings data
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
          status: meeting.bookingDetails.status, // Track meeting status for Special Meetings
        }));

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

        const formattedSpecialMeetings = specialResponse.data.map((meeting) => ({
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
          approved: meeting.bookingDetails.status === 2, // Use status field for approval check
          status: meeting.bookingDetails.status, // Track meeting status for Special Meetings
        }));

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
        if (isSpecial) {
          setSpecialMeetings(specialMeetings.filter((meeting) => meeting.id !== id));
        } else {
          setNormalMeetings(normalMeetings.filter((meeting) => meeting.id !== id));
        }

        Swal.fire('Canceled!', 'The meeting has been canceled.', 'success');
      }
    });
  };

  const handleApprove = async (id) => {
    // Retrieve employee ID from local storage
    const empID = localStorage.getItem('id');
  
    // Show confirmation alert before approval
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this meeting?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
    });
  
    if (result.isConfirmed) {
      try {
        // Send PUT request to update meeting status with `empID` in the body
        await axios.put(
          `http://192.168.13.150:3001/updatemeetingstatus/${id}`,
          { empid:empID }, // Send `empID` in the request body
          {
            withCredentials: true,
          }
        );
  
        // Update meeting status locally after successful approval
        setSpecialMeetings(
          specialMeetings.map((meeting) =>
            meeting.id === id ? { ...meeting, approved: true, status: 2 } : meeting
          )
        );
  
        Swal.fire('Approved!', 'The meeting has been approved.', 'success');
      } catch (error) {
        console.error('Error approving meeting:', error);
        Swal.fire('Error!', 'There was an issue approving the meeting.', 'error');
      }
    }
  };
  

  const countActiveMeetings = (meetings) => {
    return meetings.filter(
      (meeting) => ['upcoming', 'ongoing'].includes(getMeetingStatus(meeting.date, meeting.time))
    ).length;
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
                  {/* Show Delete Button for Special or Normal Meetings with "upcoming" or "ongoing" Status */}
                  {viewType === 'special'
                    ? ['upcoming', 'ongoing'].includes(status) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(meeting.id, viewType === 'special');
                          }}
                        >
                          <DeleteIcon sx={{ color: 'red' }} />
                        </IconButton>
                      )
                    : status === 'upcoming' && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(meeting.id, viewType === 'special');
                          }}
                        >
                          <DeleteIcon sx={{ color: 'red' }} />
                        </IconButton>
                      )}

                  {/* Show Approve Button for Special Meetings if Not Approved and Not "Finished" */}
                  {viewType === 'special' && meeting.status !== 2 && status !== 'finished' ? (
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
                  ) : (
                    meeting.status === 2 && (
                      <Typography sx={{ color: 'green', fontWeight: 'bold' }}>Approved</Typography>
                    )
                  )}
                </CardActions>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>
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
            {/* Ensure selectedMeeting is defined before rendering */}
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
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Loading details...
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ScheduledMeetings;
