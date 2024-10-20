import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Autocomplete, Avatar, Select, MenuItem, TableHead, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Home, People, Edit, Description, LocationOn } from '@mui/icons-material';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import logo from '../img/logo.png'; // Replace with your actual logo path
import profilePic from '../img/prof.jpg'; // Fallback profile picture
import axios from 'axios';
import Swal from 'sweetalert2';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRooms from './MeetingRooms';
import Addmeetingint from './AddMeetingInternal';
import Addmeetingext from './AddMeetingSession';
import ScheduledMetting from './ScheduledMeetings';
import Homepage from './Dashboardv';
import {
  Grid, Container, Paper, CircularProgress,
  Table, TableBody, TableCell, TableRow, FormControl, InputLabel,
  OutlinedInput, InputAdornment, IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Buffer } from 'buffer';
import Cookies from 'js-cookie';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import NotesIcon from '@mui/icons-material/Notes';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import APIConnection from '../config';

const themeColor = {
  primary: '#007aff',
  primaryDark: '#005bb5',
};
// Icon for the password fields
const LockIconAdornment = styled(LockIcon)({
  color: '#555',
});

// FormControl with an icon
const StyledFormControl = styled(FormControl)({
  marginBottom: '15px',
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    color: '#555',
  },
  '& .MuiInputBase-root': {
    paddingLeft: '8px',
  },
});



const CustomButton3 = styled(Button)({
  fontSize: '0.9rem',
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  transition: 'transform 0.2s ease, background-color 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

// Dialog styles
const SmallDialog2 = styled(Dialog)({
  '& .MuiPaper-root': {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    width: '400px', // Small dialog width
  },
});
const SmallDialog3 = styled(Dialog)({
  '& .MuiPaper-root': {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    width: '800px', // Small dialog width
  },
});

// Input field styling
const StyledTextField = styled(TextField)({
  marginBottom: '15px',
  '& .MuiInputBase-root': {
    paddingLeft: '8px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    color: '#555',
  },
});

// Icon styling for the fields
const InputIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#555',
});
// Custom styling for the avatar
const AvatarStyled = styled(Avatar)({
  width: 80,
  height: 80,
  transition: 'all 0.4s ease-in-out',
  animation: 'fadeIn 0.8s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

// Profile content styling
const ProfileContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '12px',
});

// Field row with icons
const TableRowStyled = styled(TableRow)({
  '& .MuiTableCell-root': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: 'none',
    fontSize: '0.875rem',
    color: '#555',
  },
});

// Styled buttons
const SmallButton = styled(Button)({
  fontSize: '0.8rem',
  padding: '6px 12px',
  borderRadius: '8px',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

// Container for buttons at the bottom right
const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
  gap: '12px',
});

// Dialog styling for a smaller popup
const SmallDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: '15px',
    backgroundColor: '#ffffff',
    width: '350px',
    padding: '20px',
  },
});
// Keyframes for typing animation
const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// Keyframes for fade-in effect
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: '6px 16px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    backgroundColor: '#005bb5',
    transform: 'scale(1.05)'
  }
}));
// Styled components for the header
const StyledAppBar = styled(AppBar)({
  backgroundColor: '#4a4a4a', // Dark background
  height: '40px', // Thin top bar
  display: 'flex',
  justifyContent: 'center',
  boxShadow: 'none',
  padding: '0 15px',
});

const Logo = styled('img')({
  height: '50px', // Logo height
  marginRight: '15px', // Space between logo and title
  animation: `${fadeIn} 1.5s ease-in-out`, // Fade-in animation for logo
});

const WelcomeMessageWrapper = styled(Box)({
  flexGrow: 1, // Takes up available space to center content
  display: 'flex',
  justifyContent: 'center', // Center the welcome message horizontally
});

const WelcomeMessage = styled(Typography)({
  color: 'white',
  fontSize: '14px', // Font size
  fontFamily: "'Poppins', sans-serif", // Premium font
  whiteSpace: 'nowrap', // Prevents line break
  overflow: 'hidden', // Simulate cursor
  maxWidth: '20%', // Ensure it doesn't overflow its container
  animation: `${typing} 2.5s steps(30) 1s forwards`, // Typing animation
});

const DateTimeWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  fontSize: '5px', // Font size for date/time
  animation: `${fadeIn} 1.5s ease-in-out`, // Fade-in effect
});

const TimeIcon = styled(AccessTimeIcon)({
  color: 'white',
  marginRight: '15px',
  fontSize: '10px', // Icon size to fit the top bar
});

// Profile button styled component
const ProfileButton = styled(Box)({
  position: 'absolute',
  zIndex:10000,
  top: '45px', // Positioned just below the App Bar
  right: '20px', // Positioned on the right
  backgroundColor: '#e0e0e0', // Light gray background
  borderRadius: '25px', // Rounded corners
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.01)', // Soft shadow for depth
  transition: 'width 0.4s ease-in-out', // Smooth expansion on hover
  overflow: 'hidden', // Hide name initially
  width: '50px', // Initially only show the avatar
  '&:hover': {
    width: '250px', // Expand to fit content dynamically
    paddingRight: '5px', // Add extra 5px padding on the right
  },
});


// Profile name that becomes visible on hover
const ProfileName = styled(Typography)({
  marginLeft: '10px', // Space between avatar and name
  whiteSpace: 'nowrap', // Prevents text wrap
  opacity: 0, // Hidden by default
  transition: 'opacity 0.4s ease-in-out', // Fade-in transition for the name
  '&.visible': {
    opacity: 1, // Make the name visible on hover
  },
});



// Styling components for bottom taskbar
const Root = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: '#f4f6f8', // Light background for overall layout
});

const Content = styled(Box)({
  flexGrow: 1,
  textAlign: 'center',
});

const CustomBottomNav = styled(Box)({
  width: '420px', // Adjusted width to account for gaps
  height: '60px',
  position: 'fixed',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-55%)',
  display: 'flex',
  justifyContent: 'space-between',
  background: 'transparent', // No background for taskbar itself
  padding: '0 10px',
});

const IconWrapper = styled(Box)(({ selected }) => ({
  width: '80px',
  height: '40px', // Rectangular box-like shape
  borderRadius: '10px', // Small border-radius for rounded corners
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: selected ? '#00bcd4' : '#e0f7fa', // Cyan when selected, light cyan otherwise
  boxShadow: selected
    ? '0px 4px 10px rgba(0, 188, 212, 0.6)' // Shadow on selected item
    : '0px 2px 8px rgba(0, 0, 0, 0.01)', // Soft shadow for unselected items
  transition: 'all 0.3s ease-in-out',
  margin: '0 5px', // Small gap between buttons
  '&:hover': {
    backgroundColor: '#26c6da', // Hover color to match palette
    transform: 'scale(1.1)', // Smooth scaling effect
  },
}));

const CustomBottomAction = styled(BottomNavigationAction)({
  minWidth: '40px',
  '& .MuiSvgIcon-root': {
    fontSize: '28px', // Adjusting icon size
    color: '#555', // Default icon color for clarity
  },
  '&.Mui-selected .MuiSvgIcon-root': {
    color: '#ffffff', // Selected icon changes to white for contrast
  },
});

const SelectedDash = styled(Box)({
  height: '4px',
  width: '35px',
  backgroundColor: '#00bcd4', // Match the selected color theme
  borderRadius: '2px',
  marginTop: '5px', // Positioned below the icon
  transition: 'all 0.3s ease-in-out',
});

export default function Dashboard() {
  const [navValue, setNavValue] = useState(0); // State to track selected item
  const [time, setTime] = useState(new Date());
  const [openProfile, setOpenProfile] = useState(false); // State for profile popup
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openPeoplePopup, setOpenPeoplePopup] = useState(false); // State for People popup
  const [openEditPopup, setOpenEditPopup] = useState(false); //
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const [roomsint, setroomsint] = useState([]);
  const [availableroomsint, setAvailableroomsint] = useState([])
  const [bookingsint, setbookingsint] = useState([]);
  const [employeeEmails, setEmployeeEmails] = useState([]);

  const [formdata2, setformdata2] = useState({
    title: '',
    date: '',
    availableroomsint: [],
    selectedRoomId: '',
    availableSlots: [],
    selectedSlot: '',
    startTime: '',
    endTime: '',
    startTimeOptions: [],
    endTimeOptions: [],
    companyName: 'Connex IT',
    employeeName: '',
    participantList: [],
    type: 'internalmeeting',
    specialNote: '',
    refreshment: '',
    id: '',
    orgId: '',
  });
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Ensure that the state changes when a button is clicked
  const handleNavChange = (newValue) => {
    setNavValue(newValue); // Update selected value
  };

  // Handle opening the profile popup
  const handleProfileClick = () => {
    setOpenProfile(true);
  };

  // Handle closing the profile popup
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  // Handle profile data change (for text fields)


  // Simulate profile update action
  // Format time with AM/PM
  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Format date
  const formattedDate = time.toLocaleDateString();


  // profile setting 



  useEffect(() => {
    const fetchProfileData = async () => {

      const profileId = Cookies.get('userId');
      const apiLink = `${APIConnection.mainapi}/profile`;

      try {
        const response = await axios.get(`${apiLink}/${profileId}`, { withCredentials: true });
        const imageBase64 = Buffer.from(response.data.image.data).toString('base64');
        response.data.image = `data:image/jpeg;base64,${imageBase64}`;
        setUserData(response.data);
        setEditData(response.data);
        setLoading(false);
      } catch (err) {
        handleDialogClose();
        Swal.fire('Error!', 'Failed to fetch profile data.', 'error');
      }
    };

    fetchProfileData();
  }, []);

  const handleDialogClose = () => {
    setOpenEdit(false);
    setOpenPassword(false);
  };

  const handleEdit = () => setOpenEdit(true);

  const handleSave = async () => {
    try {
      const apiLink = `${APIConnection.mainapi}/profile`;
      await axios.put(apiLink, editData, { withCredentials: true });
      setUserData(editData);
      setOpenEdit(false);
      setOpenProfile(false);
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
    } catch (error) {
      handleDialogClose();
      setOpenProfile(false);
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setOpenProfile(false);
      Swal.fire('Error!', 'New passwords do not match!', 'error');
      return;
    }
    try {
      const response = await axios.post(`${APIConnection.mainapi}/password`, {
        id: userData.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, { withCredentials: true });
      setOpenProfile(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      Swal.fire('Success!', response.data.message, 'success');
      setOpenPassword(false);
    } catch (error) {
      handleDialogClose();
      setOpenProfile(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      Swal.fire('Error!', error.response.data.message, 'error');
    }
  };

  const handleOpenPeoplePopup = () => {
    handleNavChange(3)
    setOpenPeoplePopup(true);
  };

  // Open Edit Popup
  const handleOpenEditPopup = () => {
    handleNavChange(4)
    setOpenEditPopup(true);
  };

  // Close People Popup
  const handleClosePeoplePopup = () => {
    setOpenPeoplePopup(false);
  };

  // Close Edit Popup
  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
  };


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
        const roomsResponse = await axios.get('${APIConnection.mainapi}/place', { withCredentials: true });
        setRooms(roomsResponse.data);

        const bookingsResponse = await axios.get('${APIConnection.mainapi}/bookings', { withCredentials: true });
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
    if (!formData.participantList || formData.participantList.length === 0) {
      setOpenEditPopup(false);
      Swal.fire({
        title: 'Error!',
        text: 'Please add at least one participant before submitting the meeting.',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing on outside click
        allowEscapeKey: false,    // Prevent closing with the Escape key
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
      participantList: formData.participantList || [], // Add fallback for safety
      id: formData.id, // ID from local storage
      orgId: formData.orgId, // Org ID from local storage
    };
  
    try {
      // Send the booking data to the API endpoint
      await axios.post('${APIConnection.mainapi}/add-booking', bookingData, {
        withCredentials: true,
      });
      setOpenEditPopup(false);
  
      // Show success message and reset the form
      Swal.fire({
        title: 'Success!',
        text: 'The meeting has been added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing on outside click
        allowEscapeKey: false,    // Prevent closing with the Escape key
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset the form data
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
  
          // Reload the page after success
          window.location.reload();
        }
      });
    } catch (error) {
      // Handle the error if the POST request fails
      setOpenEditPopup(false);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the meeting. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing on outside click
        allowEscapeKey: false,    // Prevent closing with the Escape key
      });
      console.error('Error adding booking:', error);
    }
  };
  







  useEffect(() => {
    const userId = localStorage.getItem('id') || '';
    const userOrgId = localStorage.getItem('orgid') || '';
    setformdata2((prevData) => ({
      ...prevData,
      id: userId,
      orgId: userOrgId,
    }));
  }, []);
  useEffect(() => {
    const empId = localStorage.getItem('id'); // Retrieve 'id' from local storage

    if (empId) {
      axios
        .get(`${APIConnection.mainapi}/email/${empId}`, { withCredentials: true })
        .then((response) => {
          // Extract the email values from the response and set the employeeEmails state
          const emails = response.data.map((item) => item.email);
          setEmployeeEmails(emails);
        })
        .catch((error) => {
          console.error('Failed to fetch employee emails:', error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const roomsintResponse = await axios.get('${APIConnection.mainapi}/place', { withCredentials: true });
        setroomsint(roomsintResponse.data);

        const bookingsintResponse = await axios.get('${APIConnection.mainapi}/bookings', { withCredentials: true });
        setbookingsint(bookingsintResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData2();
  }, []);

  useEffect(() => {
    if (formdata2.date) {
      updateAvailableroomsint();
      setformdata2((prevData) => ({
        ...prevData,
        selectedRoomId: '',
        availableSlots: [],
        startTimeOptions: [],
        endTimeOptions: [],
        startTime: '',
        endTime: '',
      }));
    }
  }, [formdata2.date, roomsint]);

  useEffect(() => {
    if (formdata2.selectedRoomId) {
      const selectedRoom = roomsint.find((room) => room.id === formdata2.selectedRoomId);
      if (selectedRoom) {
        const availableTimeSlots = getAvailableTimeSlots1(selectedRoom);
        setformdata2((prevData) => ({
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
  }, [formdata2.selectedRoomId, formdata2.date]);

  useEffect(() => {
    if (formdata2.selectedSlot) {
      const [slotStart, slotEnd] = formdata2.selectedSlot.split(' - ');
      const timeOptions = generateTimeOptions1(slotStart, slotEnd);
      setformdata2((prevData) => ({
        ...prevData,
        startTimeOptions: timeOptions,
        endTimeOptions: timeOptions,
        startTime: '',
        endTime: '',
      }));
    }
  }, [formdata2.selectedSlot]);

  useEffect(() => {
    if (formdata2.startTime) {
      const [slotStart, slotEnd] = formdata2.selectedSlot.split(' - ');
      const endOptions = generateTimeOptions1(formdata2.startTime, slotEnd);
      setformdata2((prevData) => ({
        ...prevData,
        endTimeOptions: endOptions.slice(1),
        endTime: '',
      }));
    }
  }, [formdata2.startTime]);

  const handleChange1 = (e) => {
    setformdata2({
      ...formdata2,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailChange1 = (event, value) => {
    setformdata2({
      ...formdata2,
      employeeEmail: value,
    });
  };

  const updateAvailableroomsint = () => {
    if (formdata2.date) {
      // Filter roomsint that have at least one available time slot for the selected date
      const filteredroomsint = roomsint.filter((room) => {
        const availableTimeSlots = getAvailableTimeSlots1(room);
        return availableTimeSlots.length > 0;
      });
      setAvailableroomsint(filteredroomsint);
    }
  };

  const handleAddParticipant1 = () => {
    if (formdata2.employeeEmail.trim()) {
      const newParticipant = {
        companyName: formdata2.companyName,
        employeeEmail: formdata2.employeeEmail,
      };
      setformdata2((prevData) => ({
        ...prevData,
        participantList: [...prevData.participantList, newParticipant],
        employeeEmail: '',
      }));
    }
  };

  const handleDeleteParticipant1 = (index) => {
    const updatedList = formdata2.participantList.filter((_, i) => i !== index);
    setformdata2({
      ...formdata2,
      participantList: updatedList,
    });
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    // Check if the participant list is empty before proceeding
    if (formdata2.participantList.length === 0) {
      setOpenPeoplePopup(false);
      Swal.fire({
        title: 'Error!',
        text: 'Please add at least one participant before submitting the meeting.',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing on outside click
        allowEscapeKey: false,    // Prevent closing with the Escape key
      });
      return; // Prevent form submission if no participants are present
    }

    const formattedDate = formdata2.date ? format(new Date(formdata2.date), 'MM/dd/yyyy') : '';

    const bookingData = {
      title: formdata2.title,
      date: formattedDate,
      startTime: formdata2.startTime,
      endTime: formdata2.endTime,
      type: formdata2.type,
      specialNote: formdata2.specialNote,
      refreshment: formdata2.refreshment,
      selectedRoomId: formdata2.selectedRoomId,
      participantList: formdata2.participantList,
      id: formdata2.id,
      orgId: formdata2.orgId,
    };

    try {
      await axios.post('${APIConnection.mainapi}/add-booking-int', bookingData, { withCredentials: true });
      setOpenPeoplePopup(false);

      // Show success message and wait for "OK" button to be clicked
      Swal.fire({
        title: 'Success!',
        text: 'The meeting has been added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing on outside click
        allowEscapeKey: false,    // Prevent closing with the Escape key
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset the form and reload the page when the user clicks "OK"
          setformdata2({
            title: '',
            date: '',
            availableroomsint: [],
            selectedRoomId: '',
            availableSlots: [],
            selectedSlot: '',
            startTime: '',
            endTime: '',
            startTimeOptions: [],
            endTimeOptions: [],
            companyName: 'Connex IT',
            employeeName: '',
            participantList: [],
            type: 'internalmeeting',
            specialNote: '',
            refreshment: '',
            id: '',
            orgId: '',
          });

          // Reload the page
          window.location.reload();
        }
      });
    } catch (error) {
      setOpenPeoplePopup(false);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the meeting. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false, // Prevent closing on outside click
        allowEscapeKey: false,    // Prevent closing with the Escape key
      });
      console.error('Error adding booking:', error);
    }
  };


  const generateTimeOptions1 = (start, end, step = 15) => {
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



  const getAvailableTimeSlots1 = (room) => {
    const startTime = room.start_time; // Already in 12-hour format
    const endTime = room.end_time;     // Already in 12-hour format

    // Convert the 12-hour time to 24-hour format for internal calculations
    const convertTime = (time) => {
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      return adjustedHours * 100 + minutes; // Use 100-based format for comparisons
    };

    const roomsinttart = convertTime(startTime);
    const roomEnd = convertTime(endTime);

    const roombookingsint = bookingsint.filter(
      (booking) => booking.place_id === room.id && isSameDay(new Date(booking.date), new Date(formdata2.date))
    );

    if (roombookingsint.length === 0) {
      return [`${startTime} - ${endTime}`]; // If no bookingsint, the entire slot is free
    }

    // Sort and find free slots
    const sortedbookingsint = roombookingsint
      .map((booking) => ({
        start: convertTime(booking.start_time),
        end: convertTime(booking.end_time),
      }))
      .sort((a, b) => a.start - b.start);

    const freeSlots = [];
    let lastEndTime = roomsinttart;

    sortedbookingsint.forEach((booking) => {
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

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  //handle add meeting 



  return (
    <Root sx={{backgroundColor:'white',height:'60vh'}}>
      {/* Top App Bar */}
      <StyledAppBar position="fixed">
        <Toolbar style={{ justifyContent: 'space-between', minHeight: '50px' }}>
          {/* Left - Logo */}
          <Box display="flex" alignItems="center">
            <Logo src={logo} alt="Connex Logo" />
          </Box>

          {/* Center - Welcome Message */}
          <WelcomeMessageWrapper>
            <WelcomeMessage variant="h6">Welcome to Connex Meet Platform</WelcomeMessage>
          </WelcomeMessageWrapper>

          {/* Right - Date and Time */}
          <DateTimeWrapper>
            <Typography variant="body1" sx={{ fontSize: '13px' }}>
              {formattedDate} - {formattedTime}
            </Typography>
          </DateTimeWrapper>
        </Toolbar>
      </StyledAppBar>

      {/* Profile Button - Positioned after the App Bar */}
      <ProfileButton onClick={handleProfileClick}>
        <AvatarStyled src={userData.image} sx={{ width: 40, height: 40, marginRight: 1 }} /> {/* Avatar icon */}
        <ProfileName className="visible">{userData.name}</ProfileName> {/* Name that appears on hover */}
      </ProfileButton>

      {/* Profile Popup Dialog */}
      <SmallDialog open={openProfile} onClose={handleCloseProfile} maxWidth="xs" fullWidth>
        <ProfileContent>
          {/* Avatar */}
          <AvatarStyled alt={userData.name} src={userData.image || '/default.jpg'} />

          {/* Profile Name */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            {userData.name}
          </Typography>

          {/* Profile Information with Icons */}
          <Table>
            <TableBody>
              <TableRowStyled>
                <TableCell><EmailIcon sx={{ fontSize: '18px', color: '#555' }} />Email</TableCell>
                <TableCell>{userData.email}</TableCell>
              </TableRowStyled>
              <TableRowStyled>
                <TableCell><PhoneIcon sx={{ fontSize: '18px', color: '#555' }} />Phone</TableCell>
                <TableCell>{userData.phone}</TableCell>
              </TableRowStyled>
              <TableRowStyled>
                <TableCell><HomeIcon sx={{ fontSize: '18px', color: '#555' }} />Address</TableCell>
                <TableCell>{userData.address}</TableCell>
              </TableRowStyled>
              <TableRowStyled>
                <TableCell><WorkIcon sx={{ fontSize: '18px', color: '#555' }} />Designation</TableCell>
                <TableCell>{userData.designation}</TableCell>
              </TableRowStyled>
            </TableBody>
          </Table>

          {/* Buttons */}
          <ButtonContainer>
            <SmallButton variant="contained" color="primary" onClick={handleEdit}>
              <EditIcon sx={{ fontSize: '16px' }} />
              Edit
            </SmallButton>
            <SmallButton variant="outlined" color="primary" onClick={() => setOpenPassword(true)}>
              <LockIcon sx={{ fontSize: '16px' }} />
              Change Password
            </SmallButton>
          </ButtonContainer>
        </ProfileContent>
      </SmallDialog>


      <SmallDialog2 open={openEdit} onClose={handleDialogClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {/* Name Input with Person Icon */}
          <InputIcon>
            <PersonIcon />
            <StyledTextField
              sx={{ mt: 1 }}
              fullWidth
              label="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </InputIcon>

          {/* Email Input (Disabled) */}
          <InputIcon>
            <EmailIcon />
            <StyledTextField
              fullWidth
              label="Email"
              value={editData.email}
              disabled
            />
          </InputIcon>

          {/* Phone Input with Phone Icon */}
          <InputIcon>
            <PhoneIcon />
            <StyledTextField
              fullWidth
              label="Phone"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
          </InputIcon>

          {/* Address Input with Home Icon */}
          <InputIcon>
            <HomeIcon />
            <StyledTextField
              fullWidth
              label="Address"
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
            />
          </InputIcon>

          {/* Designation Input with Work Icon */}
          <InputIcon>
            <WorkIcon />
            <StyledTextField
              fullWidth
              label="Designation"
              value={editData.designation}
              onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
            />
          </InputIcon>
        </DialogContent>

        <DialogActions>
          {/* Save Button */}
          <CustomButton3 onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />}>
            Save
          </CustomButton3>

          {/* Cancel Button */}
          <CustomButton3 onClick={handleDialogClose} variant="outlined" color="secondary" startIcon={<CancelIcon />}>
            Cancel
          </CustomButton3>
        </DialogActions>
      </SmallDialog2>


      <SmallDialog open={openPassword} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {/* Current Password Field */}
          <StyledFormControl fullWidth variant="outlined">
            <InputLabel htmlFor="currentPassword" sx={{ mt: 1 }}>Current Password</InputLabel>
            <OutlinedInput
              id="currentPassword"
              sx={{ mt: 1 }}
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              startAdornment={
                <InputAdornment position="start">
                  <LockIconAdornment />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current Password"
            />
          </StyledFormControl>

          {/* New Password Field */}
          <StyledFormControl fullWidth variant="outlined">
            <InputLabel htmlFor="newPassword">New Password</InputLabel>
            <OutlinedInput
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              startAdornment={
                <InputAdornment position="start">
                  <LockIconAdornment />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New Password"
            />
          </StyledFormControl>

          {/* Confirm New Password Field */}
          <StyledFormControl fullWidth variant="outlined">
            <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              startAdornment={
                <InputAdornment position="start">
                  <LockIconAdornment />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm New Password"
            />
          </StyledFormControl>
        </DialogContent>

        {/* Dialog Action Buttons */}
        <DialogActions>
          <CustomButton3 onClick={handlePasswordChange} variant="contained" color="primary">
            Change Password
          </CustomButton3>
          <CustomButton3 onClick={handleDialogClose} variant="outlined" color="secondary">
            Cancel
          </CustomButton3>
        </DialogActions>
      </SmallDialog>

      {/* Main Content Area */}
      <Content>
       {navValue === 4 && <MeetingRooms />}
       {navValue === 2 && <Addmeetingint />}
       {navValue === 1 && <Addmeetingext />}
       {navValue === 3 && <ScheduledMetting />}
       {navValue === 0 && <Homepage />}

      </Content>

      {/* Bottom Taskbar */}
      <CustomBottomNav>
        <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleNavChange(0)}>
          <IconWrapper selected={navValue === 0}>
            <CustomBottomAction icon={<Home />} />
          </IconWrapper>
          {navValue === 0 && <SelectedDash />} {/* Display the dash if this is selected */}
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleNavChange(1)}>
          <IconWrapper selected={navValue === 1}>
            <CustomBottomAction icon={<People />} />
          </IconWrapper>
          {navValue === 1 && <SelectedDash />}
        </Box>


        {/* Third Button (Edit) */}
        <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleNavChange(2)}>
          <IconWrapper selected={navValue === 2}>
            <CustomBottomAction icon={<Edit />} />
          </IconWrapper>
          {navValue === 2 && <SelectedDash />}
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleNavChange(3)}>
          <IconWrapper selected={navValue === 3}>
            <CustomBottomAction icon={<Description />} />
          </IconWrapper>
          {navValue === 3 && <SelectedDash />}
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleNavChange(4)}>
          <IconWrapper selected={navValue === 4}>
            <CustomBottomAction icon={<LocationOn />} />
          </IconWrapper>
          {navValue === 4 && <SelectedDash />}
        </Box>
      </CustomBottomNav>

      {/* People Popup */}
      <SmallDialog3 open={openPeoplePopup} onClose={handleClosePeoplePopup}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Add a New Internal Meeting
        </Typography>
        <Box elevation={3} sx={{ padding: '20px', borderRadius: '12px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formdata2.title}
                  onChange={handleChange1}
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
                  value={formdata2.date}
                  onChange={handleChange1}
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

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Room</InputLabel>
                  <Select
                    label="Select Room"
                    name="selectedRoomId"
                    value={formdata2.selectedRoomId}
                    onChange={handleChange1}
                    required
                  >
                    {availableroomsint.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>

              {formdata2.availableSlots.length > 0 && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Time Slot</InputLabel>
                    <Select
                      label="Select Time Slot"
                      name="selectedSlot"
                      value={formdata2.selectedSlot}
                      onChange={handleChange1}
                      required
                    >
                      {formdata2.availableSlots.map((slot, index) => (
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
                  value={formdata2.startTime}
                  onChange={handleChange1}
                  required
                >
                  {formdata2.startTimeOptions.map((option, index) => (
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
                  value={formdata2.endTime}
                  onChange={handleChange1}
                  required
                >
                  {formdata2.endTimeOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={employeeEmails}
                  value={formdata2.employeeEmail}
                  onChange={handleEmailChange1}
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
                  onClick={handleAddParticipant1}
                  sx={{ backgroundColor: themeColor.primary, color: '#fff', ':hover': { backgroundColor: themeColor.primaryDark } }}
                >
                  Add Participant
                </Button>
              </Grid>

              {formdata2.participantList.length > 0 && (
                <Grid item xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Employee Email</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formdata2.participantList.map((participant, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{participant.employeeEmail}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleDeleteParticipant1(index)}>
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
                  value={formdata2.specialNote}
                  onChange={handleChange1}
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
                  value={formdata2.refreshment}
                  onChange={handleChange1}
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
        </Box>
      </SmallDialog3>

      {/* Edit Popup */}
      <SmallDialog3 open={openEditPopup} onClose={handleCloseEditPopup}>

        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Add a New External Meeting
        </Typography>
        <Box elevation={3} sx={{ padding: '20px', borderRadius: '12px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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
                      {formData?.participantList?.map((participant, index) => (
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
                  fullWidth
                >
                  Add Meeting
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>


      </SmallDialog3>
    </Root>
  );
}
