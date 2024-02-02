import React, { useEffect, useState, useMemo } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  AppBar,
  Box
} from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
  GroupContainer,
  BackButton,
  AddNewButton,
  EditButton
} from "./styles.css"
import { ReactComponent as Back } from "../../../assets/backArrow.svg"
import { ReactComponent as CheckMark } from "../../../assets/check-mark.svg"
import { getGroupTypes, addEditGroupType } from '../../../services/cariclub';
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  table: {
    minWidth: 650,
  },
}));

interface Props {
  companyId: string | null;
  viewMode: number;
  queryCompanyID: string | null;
}

interface GroupTypeObj {
  id: number;
  name: string;
  status: number;
  type: number;
  member_id?: number;
  is_primary: number;
}

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

function a11yProps(index: any) {
  return {
    id: `active-tab-${index}`,
    'aria-controls': `active-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`active-tabpanel-${index}`}
      aria-labelledby={`active-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

function GroupTypes({ companyId, viewMode, queryCompanyID }: Props) {
  const history = useHistory();
  const [statusViewMode, setStatusViewMode] = useState(0);
  const [groupTypes, setGroupTypes] = useState<GroupTypeObj[]>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const [formGroupTypeId, setFormGroupTypeId] = useState<number | null>(null);
  const [formGroupTypeName, setFormGroupTypeName] = useState('');
  const [formGroupTypeType, setFormGroupTypeType] = useState('');
  const [formGroupTypeStatus, setFormGroupTypeStatus] = useState(1);
  const [formGroupTypePrimary, setFormGroupTypePrimary] = useState(1);
  // const [formGroupTypeName, setFormGroupTypeName] = useState('');

  const cc_token: any = localStorage.getItem('cc_token');
  let _cc_token: any = null;
  if (cc_token !== null) {
    _cc_token = JSON.parse(cc_token);
  }

  const classes = useStyles();

  const types = ['Cariclub', 'Public', 'Global'];

  useEffect(() => {
    fetchGroupTypes(companyId || 'null', viewMode, statusViewMode);
  }, [companyId, viewMode, statusViewMode]);

  const fetchGroupTypes = async (org_key: string, vmode: number, smode: number) => {
    let res = await getGroupTypes(org_key, vmode, smode == 1 ? 0 : 1);
    setGroupTypes(res || []);
  }

  const initFormValues = () => {
    setFormGroupTypeId(null);
    setFormGroupTypeName('');
    setFormGroupTypeType('');
    setFormGroupTypeStatus(1);
    // setFormGroupTypePrimary(1);
  }

  const addNewGroupTypeFunc = () => {
    initFormValues();
    setShowAddEditModal(true);
  }

  const editGroupTypeFunc = (groupType: GroupTypeObj) => {
    setFormGroupTypeId(groupType.id);
    setFormGroupTypeName(groupType.name);
    setFormGroupTypeType(`${groupType.type}`);
    setFormGroupTypeStatus(groupType.status);
    setFormGroupTypePrimary(groupType.is_primary);
    setShowAddEditModal(true);
  }

  const handleModalClose = () => {
    setShowAddEditModal(false);
    initFormValues();
  }

  const handleModalSubmit = async () => {
    if (!formGroupTypeName || formGroupTypeType === '') {
      return
    }
    if (companyId) {
      let res = await addEditGroupType(companyId, (formGroupTypeId === null ? 0 : formGroupTypeId), formGroupTypeName, parseInt(formGroupTypeType), formGroupTypeStatus, formGroupTypePrimary);
      // fetchGroups(companyId);
      fetchGroupTypes(companyId, viewMode, statusViewMode);
    }

    setShowAddEditModal(false);
    initFormValues();
  }

  return (
    <GroupContainer>
      <BackButton to="/"><Back /> Back</BackButton>
      <div style={{display: 'block', textAlign: 'right'}}><AddNewButton onClick={addNewGroupTypeFunc}>Add New Cohort Type</AddNewButton></div>
      <Paper>
        <Tabs
          value={statusViewMode}
          onChange={(event: React.ChangeEvent<{}>, newValue: number) => setStatusViewMode(newValue)}
          indicatorColor="primary"
          textColor="primary"
          aria-label="full width tabs example"
        >
          <Tab label="Active" {...a11yProps(0)} />
          <Tab label="Archive" {...a11yProps(1)} />
        </Tabs>
      </Paper>
      <TabPanel value={statusViewMode} index={0}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Primary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupTypes.length ? groupTypes.map((groupType, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{groupType.name}</TableCell>
                  <TableCell>{types[groupType.type]}</TableCell>
                  <TableCell>{groupType.is_primary == 1 ? <CheckMark /> : ''}</TableCell>
                  <TableCell>{(_cc_token != null && _cc_token.type == 'Internal' && viewMode == 0) || groupType.type == 2 ? <EditButton onClick={() => editGroupTypeFunc(groupType)}>Edit</EditButton> : <></>}</TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={4} align='center'><strong>No Active Groups</strong></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={statusViewMode} index={1}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Primary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupTypes.length ? groupTypes.map((groupType, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{groupType.name}</TableCell>
                  <TableCell>{types[groupType.type]}</TableCell>
                  <TableCell>{groupType.is_primary == 1 ? <CheckMark /> : ''}</TableCell>
                  <TableCell>{(_cc_token != null && _cc_token.type == 'Internal' && viewMode == 0) || groupType.type == 2 ? <EditButton onClick={() => editGroupTypeFunc(groupType)}>Edit</EditButton> : <></>}</TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={4} align='center'><strong>No Archive Groups</strong></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      

      <Dialog
        open={showAddEditModal}
        onClose={handleModalClose}
        fullWidth={true}
        maxWidth={'sm'}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
      >
        <DialogTitle id="form-dialog-title">{formGroupTypeId ? 'Edit Cohort Type' : 'Add Cohort Type'}</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <FormControl fullWidth className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              value={formGroupTypeName}
              onChange={(e) => setFormGroupTypeName(e.target.value)}
              required
              helperText="Please input the field."
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="type"
              label="Type"
              type="text"
              value={formGroupTypeType}
              onChange={(e) => setFormGroupTypeType(e.target.value)}
              select
              required
              helperText="Please select the type."
            >
              {
                types.map((type, index) => {
                  return (_cc_token != null && _cc_token.type == 'Internal' && viewMode == 0) || index == 2 ? <MenuItem key={`type_${index}`} value={index}>{type}</MenuItem> : ''
                })
              }
            </TextField>
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="status"
              label="Status"
              type="text"
              value={formGroupTypeStatus}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => setFormGroupTypeStatus(Number(e.target.value))}
              select
            >
              <MenuItem value={1}>
                Active
              </MenuItem>
              <MenuItem value={0}>
                Deactive
              </MenuItem>
            </TextField>
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <FormControlLabel
              control={<Checkbox checked={formGroupTypePrimary == 1 ? true : false} onChange={(e) => setFormGroupTypePrimary(e.target.checked ? 1 : 0)} color="primary" />}
              label="Primary"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleModalSubmit} color="primary">
            {formGroupTypeId ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </GroupContainer>
  );
}

export default GroupTypes;