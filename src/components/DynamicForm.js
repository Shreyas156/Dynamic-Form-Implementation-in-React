import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for better styling
const FormWrapper = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const SelectWrapper = styled.div`
  margin-bottom: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #66afe9;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #66afe9;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45a049;
  }
`;

const ProgressWrapper = styled.div`
  margin-top: 20px;
  background-color: #f1f1f1;
  border-radius: 5px;
`;

const ProgressBar = styled.div`
  height: 20px;
  width: ${(props) => props.width || '0%'};
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.4s ease;
`;

const SubmissionMessage = styled.p`
  margin-top: 10px;
  color: ${(props) => (props.success ? 'green' : 'red')};
  text-align: center;
`;

const DynamicForm = () => {
  const [formData, setFormData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [selectedForm, setSelectedForm] = useState('');
  const [progress, setProgress] = useState(0);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const apiResponses = {
    'User Information': {
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName', type: 'text', label: 'Last Name', required: true },
        { name: 'age', type: 'number', label: 'Age', required: false }
      ]
    },
    'Address Information': {
      fields: [
        { name: 'street', type: 'text', label: 'Street', required: true },
        { name: 'city', type: 'text', label: 'City', required: true },
        { name: 'state', type: 'dropdown', label: 'State', options: ['Maharashtra', 'Goa', 'Kerala'], required: true },
        { name: 'zipCode', type: 'text', label: 'Zip Code', required: false }
      ]
    },
    'Payment Information': {
      fields: [
        { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
        { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
        { name: 'cvv', type: 'password', label: 'CVV', required: true },
        { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true }
      ]
    }
  };

  const handleSelection = (e) => {
    const formType = e.target.value;
    setSelectedForm(formType);

    // Add null/undefined checks here
    if (apiResponses[formType] && apiResponses[formType].fields) {
      setFormData(apiResponses[formType].fields);
      setFormValues({});
      setProgress(0);
    } else {
      console.error('Invalid form type or missing data');
      setFormData([]); // Clear form data in case of invalid form type
    }
  };

  const handleInputChange = (e, field) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    calculateProgress();
  };

  const calculateProgress = () => {
    const totalFields = formData.length;
    const filledFields = formData.filter(
      (field) => formValues[field.name] && formValues[field.name] !== ''
    ).length;
    setProgress((filledFields / totalFields) * 100);
  };

  const validateForm = () => {
    let isValid = true;
    formData.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmissionMessage('Form submitted successfully!');
    } else {
      setSubmissionMessage('Please fill out all required fields.');
    }
  };

  return (
    <FormWrapper>
      <FormTitle>Dynamic Form</FormTitle>

      <SelectWrapper>
        <Select onChange={handleSelection} value={selectedForm}>
          <option value="">Select Form Type</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </Select>
      </SelectWrapper>

      {formData.length > 0 && (
        <form onSubmit={handleSubmit}>
          {formData.map((field, index) => (
            <FormField key={index}>
              <Label>{field.label}</Label>
              {field.type === 'dropdown' ? (
                <Select
                  name={field.name}
                  required={field.required}
                  onChange={(e) => handleInputChange(e, field)}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  onChange={(e) => handleInputChange(e, field)}
                />
              )}
            </FormField>
          ))}

          <Button type="submit">Submit</Button>
        </form>
      )}

      {submissionMessage && (
        <SubmissionMessage success={submissionMessage === 'Form submitted successfully!'}>
          {submissionMessage}
        </SubmissionMessage>
      )}

      <ProgressWrapper>
        <ProgressBar width={`${progress}%`} />
      </ProgressWrapper>
    </FormWrapper>
  );
};

export default DynamicForm;
