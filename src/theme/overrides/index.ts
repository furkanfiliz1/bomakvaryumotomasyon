//

import { Theme } from '@mui/material/styles';
import Accordion from './Accordion';
import Alert from './Alert';
import Autocomplete from './Autocomplete';
import Backdrop from './Backdrop';
import Button from './Button';
import Card from './Card';
import CssBaseline from './CssBaseline';
import Dialog from './Dialog';
import FormControl from './FormControl';
import Input from './Input';
import Label from './Label';
import LinearProgress from './LinearProgress';
import Paper from './Paper';
import Radio from './Radio';
import Switch from './Switch';
import TextField from './TextField';
import Tooltip from './Tooltip';
import Typography from './Typography';

export function componentsOverrides(theme: Theme) {
  return Object.assign(
    Card(theme),
    Input(theme),
    Paper(),
    Button(theme),
    Label(),
    Tooltip(theme),
    Backdrop(theme),
    Typography(theme),
    CssBaseline(),
    Autocomplete(theme),
    Alert(theme),
    TextField(theme),
    Dialog(),
    Accordion(),
    FormControl(),
    Switch(theme),
    LinearProgress(theme),
    Radio(theme),
  );
}
