import { CheckboxProps, Checkbox as MuiCHeckbox } from '@mui/material';

interface CheckboxIconProps {
  isError?: boolean;
  fontSize?: string;
}

const CheckboxIcon = (props: CheckboxIconProps) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" fill={props?.isError ? '#FDEEEC' : 'white'} />
        <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke={props?.isError ? '#EB5146' : '#94A3B8'} />
        <path
          d="M4.5 8.4375L6.1875 10.125"
          stroke={props?.isError ? '#FDEEEC' : 'white'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

const CheckboxCheckedIcon = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="17" height="17" rx="4" fill="#0C54EE" />
      <path
        d="M3.75 7.75L6.75 10.75L12.25 5.25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface ICheckboxProps extends CheckboxProps {
  error?: string | undefined;
}

const Checkbox = (props: ICheckboxProps) => {
  return (
    <MuiCHeckbox
      checkedIcon={<CheckboxCheckedIcon />}
      sx={{ padding: 0, mr: 0.75 }}
      icon={<CheckboxIcon isError={!!props.error} />}
      {...props}
      id={props?.id ? props?.id : 'checkbox'}
    />
  );
};

export default Checkbox;
