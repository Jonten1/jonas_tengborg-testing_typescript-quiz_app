import React, { useState } from 'react'
import { IButtonProps } from '../../../Interfaces/IButtonProps';

export const SubmitButton: React.FC<IButtonProps> = (props) => {

  const btnHoverColor = 'white';
  const btnDefaultText = "Submit";
  const [hover, setHover] = useState(false)
  const onMouseEnter = () => setHover(true);
  const onMouseLeave = () => setHover(false);

  const buttonStyle ={
    backgroundColor: hover ? btnHoverColor : props.color,
    border: props.border,
    borderRadius: props.radius,
    height: props.height,
    width: props.width,
    fontSize: props.fontSize,
  }

  return (
    <button
      data-testid = "submit-button"
      style={buttonStyle}
      onClick={ props.onClick }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={false}
    >
      {props.children || btnDefaultText }
    </button>
  );
}
