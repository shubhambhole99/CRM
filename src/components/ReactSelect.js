
import React, { useState } from 'react';
import Select from 'react-select';

export default () => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Assuming pnamearr is an array of objects like [{ _id: "1", name: "Option 1" }, { _id: "2", name: "Option 2" }]
  const pnamearr = [
    { _id: "1", name: "Option 1" },
    { _id: "2", name: "Option 2" }
  ];

  const options = pnamearr.map(option => ({
    value: option._id,
    label: option.name
  }));

  // Adding a placeholder option
  const placeholderOption = { value: '', label: 'Select Option' };
  options.unshift(placeholderOption);

  return (
    <Select
      value={selectedOption}
      onChange={setSelectedOption}
      options={options}
      isSearchable={true}
      placeholder="Search or Select Option"
    />
  );
};
