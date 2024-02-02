import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik'
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Input,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
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
  EditButton,
  RemoveButton
} from "./styles.css"
import { ReactComponent as Back } from "../../../assets/backArrow.svg"
import { ReactComponent as CheckMark } from "../../../assets/check-mark.svg"
import { ReactComponent as StarIcon } from "../../../assets/star-icon.svg"
import { getGroupTypes, getGroups, addEditGroupType, addEditGroup, removeGroup } from '../../../services/cariclub';
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
  containerPaper: {
    marginBottom: '20px',
    padding: '20px'
  },
  containerPaperTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Mulish,sans-serif'
  }
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

interface GroupObj {
  id: number;
  name: string;
  type_id: number;
  type_name: string;
  status: number;
  desc?: string;
  type_type: number;
  type_is_primary: number;
}

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

function a10yProps(index: any) {
  return {
    id: `active-gt-tab-${index}`,
    'aria-controls': `active-gt-tabpanel-${index}`,
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

function GTTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`active-gt-tabpanel-${index}`}
      aria-labelledby={`active-gt-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
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

function Groups({ companyId, viewMode, queryCompanyID }: Props) {
  const history = useHistory();
  const [statusViewGTMode, setStatusViewGTMode] = useState(0);
  const [statusViewMode, setStatusViewMode] = useState(0);
  const [groupTypes, setGroupTypes] = useState<GroupTypeObj[]>([]);
  const [avaliableGroupTypes, setAvailableGroupTypes] = useState<GroupTypeObj[]>([]);
  const [groups, setGroups] = useState<GroupObj[]>([]);
  const [showAddEditGTModal, setShowAddEditGTModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  // const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const [formGroupTypeId, setFormGroupTypeId] = useState<number | null>(null);
  const [formGroupTypeName, setFormGroupTypeName] = useState('');
  const [formGroupTypeType, setFormGroupTypeType] = useState('');
  const [formGroupTypeStatus, setFormGroupTypeStatus] = useState(1);
  const [formGroupTypePrimary, setFormGroupTypePrimary] = useState(0);
  

  const [formGroupId, setFormGroupId] = useState<number | null>(null);
  const [formGroupName, setFormGroupName] = useState('');
  const [formGroupDesc, setFormGroupDesc] = useState('');
  const [formGroupType, setFormGroupType] = useState<string | null>('');
  const [formGroupStatus, setFormGroupStatus] = useState(1);

  const cc_token: any = localStorage.getItem('cc_token');
  let _cc_token: any = null;
  if (cc_token !== null) {
    _cc_token = JSON.parse(cc_token);
  }

  const classes = useStyles();

  const types = ['CariClub', 'Universal', 'Global'];

  useEffect(() => {
    fetchAvaliableGroupTypes(companyId || 'null', viewMode);
    fetchGroupTypes(companyId || 'null', viewMode, statusViewGTMode);
    fetchGroups(companyId || 'null', viewMode, statusViewMode);
  }, [companyId, viewMode, statusViewMode, statusViewGTMode]);

  const fetchGroupTypes = async (org_key: string, vmode: number, smode: number) => {
    let res = await getGroupTypes(org_key, vmode, smode == 1 ? 0 : 1);
    setGroupTypes(res || []);
  }

  const fetchAvaliableGroupTypes = async (org_key: string, vmode: number) => {
    let res = await getGroupTypes(org_key, vmode, 1);
    setAvailableGroupTypes(res || []);
  }

  const fetchGroups = async (org_key: string, vmode: number, smode: number) => {
    let res = await getGroups(org_key, vmode, smode == 1 ? 0 : 1);
    setGroups(res || []);
  }

  const initGroupTypeFormValues = () => {
    setFormGroupTypeId(null);
    setFormGroupTypeName('');
    setFormGroupTypeType('');
    setFormGroupTypeStatus(1);
    setFormGroupTypePrimary(0);
  }

  const addNewGroupTypeFunc = () => {
    initGroupTypeFormValues();
    setShowAddEditGTModal(true);
  }

  const editGroupTypeFunc = (groupType: GroupTypeObj) => {
    setFormGroupTypeId(groupType.id);
    setFormGroupTypeName(groupType.name);
    setFormGroupTypeType(`${groupType.type}`);
    setFormGroupTypeStatus(groupType.status);
    setFormGroupTypePrimary(groupType.is_primary);
    setShowAddEditGTModal(true);
  }

  const initFormValues = () => {
    setFormGroupId(null);
    setFormGroupName('');
    setFormGroupType('');
    setFormGroupDesc('');
    setFormGroupStatus(1);
  }

  const addNewGroupFunc = () => {
    initFormValues();
    setShowAddEditModal(true);
  }

  const editGroupFunc = (group: GroupObj) => {
    setFormGroupId(group.id);
    setFormGroupName(group.name);
    setFormGroupType(`${group.type_id}`);
    setFormGroupStatus(group.status);
    setFormGroupDesc(group.desc || '');
    setShowAddEditModal(true);
  }

  const handleGTModalClose = () => {
    setShowAddEditGTModal(false);
    initGroupTypeFormValues();
  }

  const handleGTModalSubmit = async () => {
    if (!formGroupTypeName || formGroupTypeType === '') {
      return
    }
    if (companyId) {
      let res = await addEditGroupType(companyId, (formGroupTypeId === null ? 0 : formGroupTypeId), formGroupTypeName, parseInt(formGroupTypeType), formGroupTypeStatus, formGroupTypePrimary);
      // fetchGroups(companyId);
      fetchGroupTypes(companyId, viewMode, statusViewGTMode);
      fetchAvaliableGroupTypes(companyId, viewMode);
    }

    setShowAddEditGTModal(false);
    initGroupTypeFormValues();
  }


  const handleModalClose = () => {
    initFormValues();
    setShowAddEditModal(false);
  }

  const handleModalSubmit = async () => {
    if (!formGroupName || formGroupType === null || formGroupType === '') {
      return
    }
    if (companyId) {
      let res = await addEditGroup(formGroupId !== null ? formGroupId : 0, formGroupName, parseInt(formGroupType), formGroupStatus, companyId, formGroupDesc);
      fetchGroups(companyId, viewMode, statusViewMode);
    }
    initFormValues();
    setShowAddEditModal(false);
  }

  const removeGroupFunc = async (group: GroupObj) => {
    swal({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete this cohort?',
      icon: 'warning',
      buttons: [true, 'Confirm'],
    }).then(async (sure) => {
      if (sure) {
        await removeGroup(group.id);
        if (companyId) {
          fetchGroups(companyId, viewMode, statusViewMode);
        }
      }
    });
  }



  return (
    <GroupContainer>
      <BackButton to="/"><Back /> Back</BackButton>
      <Paper className={classes.containerPaper} style={{marginTop: '45px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={classes.containerPaperTitle}>Cohorts</span>
          <AddNewButton onClick={addNewGroupFunc}>Add New Cohort</AddNewButton>
        </div>
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
                  <TableCell></TableCell>
                  <TableCell>Cohort Name</TableCell>
                  <TableCell>Cohort Type</TableCell>
                  <TableCell>Cohort Description</TableCell>
                  {/* <TableCell>Status</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.length ? groups.map((group, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.type_is_primary === 1 && <StarIcon style={{width: '12px', verticalAlign: 'super'}} />}{group.type_name}</TableCell>
                    <TableCell>{group.desc}</TableCell>
                    {/* <TableCell>{group.status == 1 ? 'Active' : 'Deactive'}</TableCell> */}
                    <TableCell>
                      <div style={{ display: 'flex' }}>
                        <EditButton onClick={() => editGroupFunc(group)}>Edit</EditButton>&nbsp;&nbsp;
                        {
                          (_cc_token != null && _cc_token.type == 'Internal' && viewMode == 0 && group.type_type != 2) && <RemoveButton onClick={() => removeGroupFunc(group)}>Delete</RemoveButton>
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={6} align='center'><strong>No active cohorts</strong></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={statusViewMode} index={1}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Cohort Name</TableCell>
                  <TableCell>Cohort Type</TableCell>
                  <TableCell>Cohort Description</TableCell>
                  {/* <TableCell>Status</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.length ? groups.map((group, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.type_is_primary === 1 && <StarIcon style={{width: '12px', verticalAlign: 'super'}} />}{group.type_name}</TableCell>
                    <TableCell>{group.desc}</TableCell>
                    {/* <TableCell>{group.status == 1 ? 'Active' : 'Deactive'}</TableCell> */}
                    <TableCell>
                      <div style={{ display: 'flex' }}>
                        <EditButton onClick={() => editGroupFunc(group)}>Edit</EditButton>&nbsp;&nbsp;
                        {
                          (_cc_token != null && _cc_token.type == 'Internal' && viewMode == 0 && group.type_type != 2) && <RemoveButton onClick={() => removeGroupFunc(group)}>Delete</RemoveButton>
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={6} align='center'><strong>No archived cohorts</strong></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Paper className={classes.containerPaper}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={classes.containerPaperTitle}>Cohort Types</span>
          <AddNewButton onClick={addNewGroupTypeFunc}>Add New Cohort Type</AddNewButton>
        </div>
        <Paper>
          <Tabs
            value={statusViewGTMode}
            onChange={(event: React.ChangeEvent<{}>, newValue: number) => setStatusViewGTMode(newValue)}
            indicatorColor="primary"
            textColor="primary"
            aria-label="full width tabs example"
          >
            <Tab label="Active" {...a10yProps(0)} />
            <Tab label="Archive" {...a10yProps(1)} />
          </Tabs>
        </Paper>
        <GTTabPanel value={statusViewGTMode} index={0}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Visibility</TableCell>
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
                )) : <TableRow><TableCell colSpan={4} align='center'><strong>No active cohort types</strong></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </GTTabPanel>
        <GTTabPanel value={statusViewGTMode} index={1}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Visibility</TableCell>
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
                )) : <TableRow><TableCell colSpan={4} align='center'><strong>No archived cohort types</strong></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </GTTabPanel>
      </Paper>

      <Dialog
        open={showAddEditGTModal}
        onClose={handleGTModalClose}
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
              id="type"
              label="Visibility"
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
                Archive
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
          <Button onClick={handleGTModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleGTModalSubmit} color="primary">
            {formGroupTypeId ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAddEditModal}
        onClose={handleModalClose}
        fullWidth={true}
        maxWidth={'sm'}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
      >
        <DialogTitle id="form-dialog-title">{formGroupId ? 'Edit Cohort' : 'Add Cohort'}</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <FormControl fullWidth className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="group_type"
              label="Cohort Type"
              type="text"
              value={formGroupType}
              onChange={(e) => setFormGroupType(e.target.value)}
              select
              required
              helperText="Please select the type."
            >
              <MenuItem value={-1}>
                <strong>Add New Type</strong>
              </MenuItem>
              {
                avaliableGroupTypes.length && avaliableGroupTypes.map((gt) => <MenuItem key={`gt_${gt.id}`} value={gt.id}>{gt.name}</MenuItem>)
              }
            </TextField>
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Cohort Name"
              type="text"
              value={formGroupName}
              onChange={(e) => setFormGroupName(e.target.value)}
              required
              helperText="Please input the field."
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="desc"
              label="Cohort Description"
              inputProps={{
                maxlength: 100
              }}
              type="text"
              value={formGroupDesc}
              onChange={(e) => setFormGroupDesc(e.target.value)}
              required
              helperText={`Remaining characters : ${100 - formGroupDesc.length}`}
            />
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="group_status"
              label="Cohort Status"
              type="text"
              value={formGroupStatus}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => setFormGroupStatus(Number(e.target.value))}
              select
            >
              <MenuItem value={1}>
                Active
              </MenuItem>
              <MenuItem value={0}>
                Archive
              </MenuItem>
            </TextField>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleModalSubmit} color="primary">
            {formGroupId ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </GroupContainer>
  );
}

export default Groups;