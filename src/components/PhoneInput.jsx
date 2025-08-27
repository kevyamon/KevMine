import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputField = ({ value, onChange, placeholder }) => {
  return (
    <div className="phone-input-container">
      <PhoneInput
        country={'ci'} // Default country, can be dynamic
        value={value}
        onChange={onChange}
        inputProps={{
          required: true,
          placeholder: placeholder,
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        }}
      />
    </div>
  );
};

export default PhoneInputField;