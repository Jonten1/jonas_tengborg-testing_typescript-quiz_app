import React from 'react';

export interface IButtonProps {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  radius: string
  width: string;
  fontSize?: string;
}
