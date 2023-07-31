import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Container,
  Typography,
  Checkbox,
  Grid,
} from '@mui/material';
import { parseISO, isValid } from 'date-fns'; // Import date-fns functions

const steps = ['Personal Details', 'Education Details', 'Travel History'];


const App = () => {
  const [currentlyPursuing, setCurrentlyPursuing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [newPlace, setNewPlace] = useState('');
  const [newCity, setNewCity] = useState('');

  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    instituteName: '',
    duration: '',
    joiningYear: '2020',
    endDate: '2024',
    places: [],
    cities: [],
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
  
    if (type === 'checkbox') {
      // Handle changes for checkbox
      setCurrentlyPursuing(checked);
  
      // If the checkbox is checked, disable the End Year input field
      // and set the end date to 'Currently Pursuing'
      if (checked) {
        setFormData({ ...formData, endDate: 'Currently Pursuing' });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      // Handle changes for other fields
      setFormData({ ...formData, [name]: value });
    }
    setFormErrors({ ...formErrors, [name]: "" });
  }

  // Function to handle step navigation
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddPlaceAndCity = () => {
    if (newPlace && newCity) {
      setFormData({
        ...formData,
        places: [...formData.places, newPlace],
        cities: [...formData.cities, newCity],
      });
      setNewPlace('');
      setNewCity('');
    }
  };

  // Function to validate the form data before proceeding to the next step
  const validateForm = () => {
    const {
      name,
      phone,
      email,
      gender,
      instituteName,
      duration,
      joiningYear,
      endDate,
      places,
      cities,
    } = formData;
  
    // Check for name, email, and phone validation errors
    const hasNameError = formErrors.name !== "";
    const hasPhoneError = formErrors.phone !== "";
    const hasEmailError = formErrors.email !== "";
  
    switch (activeStep) {
      case 0:
        return name && !hasNameError && phone && !hasPhoneError && email && !hasEmailError && gender;
      case 1:
        return instituteName && duration && isValid(parseISO(joiningYear)) && endDate;
      case 2:
        return places.length > 0 && cities.length > 0;
      default:
        return false;
    }
  };

  // Function to submit the form data
  const handleSubmit = () => {
    // Do something with the form data (e.g., send it to a server)
    console.log(formData);
  };

  const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    name: yup
      .string('Enter your name')
      .required('Name is required'),
    phone: yup 
      .string('Enter Phone number')
      .required('Phone number is required')
  });

  const WithMaterialUI = () => {
    const formik = useFormik({
      initialValues: {
        email: formData.email,
        name: formData.name,
        phone: formData.phone
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2));
      },
    });}

  
    const [formErrors, setFormErrors] = useState({
      name: "",
      phone: "",
      email: "",
    });
  
    // Helper function to validate email format
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    const handleBlur = (event) => {
      const { name, value } = event.target;
  
      // Validate the field on blur and set the error message if invalid
      switch (name) {
        case "name":
          setFormErrors({
            ...formErrors,
            name: value.length < 2 ? "Name must be at least 2 characters" : "",
          });
          break;
        case "phone":
          setFormErrors({
            ...formErrors,
            phone:
              value.length < 11 || value.length > 15
                ? "Phone must be between 11 and 15 characters"
                : "",
          });
          break;
        case "email":
          setFormErrors({
            ...formErrors,
            email: isValidEmail(value) ? "" : "Enter a valid email",
          });
          break;
        default:
          break;
      }
    };

  

   const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" style={{ margin: "5%" }}>
              Personal Details
            </FormLabel>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              fullWidth
              required
              margin="normal"
              error={formErrors.name !== ""}
              helperText={formErrors.name}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              required
              margin="normal"
              error={formErrors.phone !== ""}
              helperText={formErrors.phone}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              fullWidth
              required
              margin="normal"
              error={formErrors.email !== ""}
              helperText={formErrors.email}
            />
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
            
          </FormControl>
        );
      case 1:
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" style={{margin:"5%"}}>Education Details</FormLabel>
            <TextField
              label="Institute Name"
              name="instituteName"
              value={formData.instituteName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Joining Year"
              name="joiningYear"
              value={formData.joiningYear}
              onChange={handleChange}
              fullWidth
              required
              placeholder="2020"
              helperText="Enter Year"
              error={!isValid(parseISO(formData.joiningYear))}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentlyPursuing}
                  onChange={handleChange}
                  name="currentlyPursuing"
                />
              }
              label="Currently Pursuing"
            />
            <TextField
              label="End Year"
              name="endDate"
              helperText="Enter Year"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              required={!currentlyPursuing}
              placeholder="2024"
              error={!isValid(parseISO(formData.endDate)) && !currentlyPursuing}
              disabled={currentlyPursuing}
              margin="normal"
            />
          </FormControl>
        );
      case 2:
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" style={{margin:"5%"}}>Travel History</FormLabel>
            <TextField
              label="Place Name"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddPlaceAndCity} fullWidth>
              Add Place and City
            </Button>
            <Typography variant="h6">Added Places and Cities:</Typography>
            {formData.places.map((place, index) => (
              <Typography key={index} variant="body1">
                Place: {place}, City: {formData.cities[index]}
              </Typography>
            ))}
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" style={{marginTop:'5%'}}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
             <div>
             <Typography variant="h5" gutterBottom align="center" marginTop="10%">
               Thank you for submitting the form!
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Name: {formData.name}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Phone: {formData.phone}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Email: {formData.email}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Gender: {formData.gender}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Institute Name: {formData.instituteName}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Duration: {formData.duration}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Joining Year: {formData.joiningYear}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               End Date: {formData.endDate}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Places: {formData.places.join(', ')}
             </Typography>
             <Typography variant="body1" align="center" gutterBottom>
               Cities: {formData.cities.join(', ')}
             </Typography>
           </div>
        ) : (
          <div>
            {renderStepContent(activeStep)}
            <div style={{ marginTop: '20px' }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!validateForm()}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default App;