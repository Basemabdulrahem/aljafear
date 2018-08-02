import React from 'react';
import { isEmail } from 'validator';

export const required = (value, props) => {
    
    if (!value || (props.isCheckable && !props.checked)) {
      return <span className="text-danger">Required</span>;
    }
  };
  
export const email = (value) => {
    if (!isEmail(value)) {
        return <span className="text-danger">{value} is not a valid email.</span>;
    }
};

export const isEqual = (value, props, components) => {
    const bothUsed = components.password[0].isUsed && components.confirm[0].isUsed;
    const bothChanged = components.password[0].isChanged && components.confirm[0].isChanged;

    if (bothChanged && bothUsed && components.password[0].value !== components.confirm[0].value) {
        return <span className="text-danger">Passwords are not equal.</span>;
    }
};
