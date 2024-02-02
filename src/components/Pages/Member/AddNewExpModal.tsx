import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { TextField, MenuItem } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { Autocomplete, Alert } from '@material-ui/lab';

import {
  Container,
  FormContent,
  Formtitle,
  StyledForm,
  FullWidthFormItem,
  FormItem,
  BackButton,
  StyledButton,
  FormGroup,
  EditFormContainer,
} from './styles.css';

import {
  getOrgListwithOffices,
  getDepartmentByCompany,
  getCities,
  updateUser,
  getLicenseTerms,
  getLicenseTypes,
  getCariclubRoles,
  getCandidateLicenses,
  getGroups,
  getUserData,
} from '../../../services/cariclub';

interface Props {
  showAddExpModal: boolean;
  handleSaveNewExp: any;
  handleCancelNewExp: any;
}

interface OrgObj {
  city: string | null;
  key: string;
  logo: string | null;
  name: string;
  state: string | null;
  type: string;
}
interface CityObj {
  key: string;
  name: string;
  state: string;
  state_abbr: string;
}

interface IExtracurriculars {
  title: string;
  description: string;
  renderKey: string;
}

interface IMonth {
  text: string;
  number: number;
}

interface IRoles {
  role: string;
  department: string;
  yearTo?: number;
  yearFrom: number;
  monthTo?: number;
  monthFrom: number;
  description: string;
  // renderKey: string;
  isCurrentEmployer: number;
  extracurriculars: IExtracurriculars[];
}

interface IExperience {
  org: OrgObj | null;
  roles: IRoles[] | [];
  location: CityObj | null;
}

export default function AddNewExpModal({ showAddExpModal, handleSaveNewExp, handleCancelNewExp }: Props) {
  const [acOrgOpen, setACOrgOpen] = useState(false);
  const [acCityOpen, setACCityOpen] = useState(false);
  const [orgLists, setOrgLists] = useState<OrgObj[]>([]);
  const [cityLists, setCityLists] = useState<CityObj[]>([]);
  const [experience, setExperience] = useState<IExperience>({
    org: null,
    roles: [{
      role: '',
      department: '',
      yearTo: 0,
      yearFrom: 0,
      monthTo: 0,
      monthFrom: 0,
      description: '',
      isCurrentEmployer: 1,
      extracurriculars: []
    }],
    location: null
  })
  const loading_org = acOrgOpen && orgLists.length === 0;
  const loading_city = acCityOpen && cityLists.length === 0;
  const monthOptions: IMonth[] = [
    { text: 'Select Month', number: 0 },
    { text: 'January', number: 1 },
    { text: 'February', number: 2 },
    { text: 'March', number: 3 },
    { text: 'April', number: 4 },
    { text: 'May', number: 5 },
    { text: 'June', number: 6 },
    { text: 'July', number: 7 },
    { text: 'August', number: 8 },
    { text: 'September', number: 9 },
    { text: 'October', number: 10 },
    { text: 'November', number: 11 },
    { text: 'December', number: 12 }
  ];
  const yearsOptions = Array.from(new Array(90), (x, i) => new Date().getFullYear() - i).map(String);

  React.useEffect(() => {
    let active = true;

    if (!loading_org) {
      return undefined;
    }

    (async () => {
      let res = await getOrgListwithOffices("company", null);
      // await sleep(1e3); // For demo purposes.
      // const countries = await response.json();

      if (active) {
        setOrgLists([...res]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading_org]);

  const fetchCities = async (template: string | null) => {
    let res = await getCities(template);
    if (res && res.length) {
      setCityLists([...res]);
    }
  }

  const handleRemoveExtracurricular = (render_key: string) => {
    let c = [...experience.roles[0].extracurriculars]
    let index = c.findIndex((ext: IExtracurriculars) => ext.renderKey == render_key)
    if (index > -1) {
      c.splice(index, 1);
      setExperience({...experience, roles: [{...experience.roles[0], extracurriculars: [...c]}]});
    }
  }

  const generateGuid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  const addNewExtracurricular = () => {
    let newObj: IExtracurriculars = {
      title: "",
      description: "",
      renderKey: generateGuid()
    }
    setExperience({...experience, roles: [{...experience.roles[0], extracurriculars: [...experience.roles[0].extracurriculars, newObj]}]});
  }

  const handleExtrasChangeInput = (render_key: string, key: string, value: string) => {
    let c = [...experience.roles[0].extracurriculars]
    let index = c.findIndex((ext: IExtracurriculars) => ext.renderKey == render_key)
    if(key == 'title') {
      c[index].title = value;
    }
    if(key == 'description') {
      c[index].description = value;
    }
    setExperience({...experience, roles: [{...experience.roles[0], extracurriculars: [...c]}]});
  }

  const handleSave = () => {
    console.log(experience);
  }

  return (
    <div>
      <Dialog open={showAddExpModal} fullWidth={true} maxWidth={'sm'} onClose={handleCancelNewExp} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add New Experience</DialogTitle>
        <DialogContent>
          <StyledForm>
            <FormGroup>
              <FormItem>
                <Autocomplete
                  id="exp-company"
                  open={acOrgOpen}
                  onOpen={() => {
                    setACOrgOpen(true);
                  }}
                  onClose={() => {
                    setACOrgOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.key === value.key}
                  getOptionLabel={(option) => option.name}
                  options={orgLists}
                  loading={loading_org}
                  onChange={(event, value) => {
                    if (value) {
                      setExperience({...experience, org: {...value}})
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={experience.org === null ? true : false}
                      helperText={experience.org === null ? 'Select the Company': ''}
                      label="Select Company"
                      value={experience.org !== null? experience.org.key: ''}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading_org ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Autocomplete
                  id="exp-city"
                  open={acCityOpen}
                  filterOptions={(x) => x}
                  onOpen={() => {
                    setACCityOpen(true);
                  }}
                  onClose={() => {
                    setACCityOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.key === value.key}
                  getOptionLabel={(option) => `${option.name}, ${option.state_abbr}`}
                  options={cityLists}
                  loading={loading_city}
                  onChange={(event, value) => {
                    if (value) {
                      setExperience({...experience, location: {...value}})
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    fetchCities(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select City"
                      value={experience.location !== null? experience.location.key: ''}
                      error={experience.location === null ? true : false}
                      helperText={experience.location === null ? 'Select the City': ''}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading_city ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <div style={{ marginTop: '20px' }}>Role</div>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <TextField
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                  // helperText={formik.errors.firstName}
                  value={experience.roles[0].role}
                  onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], role: e.target.value}]})}
                />
              </FormItem>
              <FormItem>
                <TextField
                  fullWidth
                  id="department"
                  name="department"
                  label="Department"
                  // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                  // helperText={formik.errors.firstName}
                  value={experience.roles[0].department}
                  onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], department: e.target.value}]})}
                />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={experience.roles[0].isCurrentEmployer == 1? true: false}
                      onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], isCurrentEmployer: e.target.checked ? 1: 0}]})}
                      name=""
                      color="primary"
                    />
                  }
                  label="I am currently working in this role"
                />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <TextField
                  fullWidth
                  id="date_started_month"
                  name="date_started_month"
                  label="Date Started Month"
                  // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                  // helperText={formik.errors.firstName}
                  value={experience.roles[0].monthFrom}
                  onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], monthFrom: parseInt(e.target.value)}]})}
                  select
                >
                  {monthOptions.length &&
                    monthOptions.map((m) => (
                      <MenuItem
                        key={`from_month_${m.number}`}
                        value={m.number}
                      >
                        {m.text}
                      </MenuItem>
                    ))}
                </TextField>
              </FormItem>
              <FormItem>
                <TextField
                  fullWidth
                  id="date_started_year"
                  name="date_started_year"
                  label="Date Started Year"
                  // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                  // helperText={formik.errors.firstName}
                  value={experience.roles[0].yearFrom}
                  onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], yearFrom: parseInt(e.target.value)}]})}
                  select
                >
                  <MenuItem value={0}>Select Year</MenuItem>
                  {yearsOptions.length &&
                    yearsOptions.map((y) => (
                      <MenuItem
                        key={`from_year_${y}`}
                        value={y}
                      >
                        {y}
                      </MenuItem>
                    ))}
                </TextField>
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <TextField
                  fullWidth
                  id="date_ended_month"
                  name="date_ended_month"
                  label="Date Ended Month"
                  // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                  // helperText={formik.errors.firstName}
                  value={experience.roles[0].monthTo}
                  onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], monthTo: parseInt(e.target.value)}]})}
                  select
                >
                  {monthOptions.length &&
                    monthOptions.map((m) => (
                      <MenuItem
                        key={`from_month_${m.number}`}
                        value={m.number}
                      >
                        {m.text}
                      </MenuItem>
                    ))}
                </TextField>
              </FormItem>
              <FormItem>
                <TextField
                  fullWidth
                  id="date_ended_year"
                  name="date_ended_year"
                  label="Date Ended Year"
                  // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                  // helperText={formik.errors.firstName}
                  value={experience.roles[0].yearTo}
                  onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], yearTo: parseInt(e.target.value)}]})}
                  select
                >
                  <MenuItem value="0">Select Year</MenuItem>
                  {yearsOptions.length &&
                    yearsOptions.map((y) => (
                      <MenuItem
                        key={`from_year_${y}`}
                        value={y}
                      >
                        {y}
                      </MenuItem>
                    ))}
                </TextField>
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                  // helperText={formik.errors.firstName}
                  value={experience.roles[0].description}
                  onChange={(e) => setExperience({...experience, roles: [{...experience.roles[0], description: e.target.value}]})}
                  minRows={4}
                  maxRows={4}
                />
              </FormItem>
            </FormGroup>
          </StyledForm>
          {
            experience.roles[0].extracurriculars.length ? experience.roles[0].extracurriculars.map((ext: IExtracurriculars) => (
              <StyledForm key={ext.renderKey}>
                <FormGroup>
                  <FormItem>
                    <TextField
                      fullWidth
                      id={`extracurriculars_${ext.renderKey}`}
                      name="extracurriculars"
                      label="Extracurriculars"
                      // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                      // helperText={formik.errors.firstName}
                      value={ext.title}
                      onChange={(e) => handleExtrasChangeInput(ext.renderKey, 'title', e.target.value)}
                    />
                  </FormItem>
                </FormGroup>
                <FormGroup>
                  <FormItem>
                    <TextField
                      fullWidth
                      id={`extracurriculars_desc_${ext.renderKey}`}
                      name="extracurriculars_description"
                      label="Description"
                      multiline
                      // error={formik.errors.firstName && formik.touched.firstName ? true : false}
                      // helperText={formik.errors.firstName}
                      value={ext.description}
                      onChange={(e) => handleExtrasChangeInput(ext.renderKey, 'description', e.target.value)}
                      minRows={4}
                      maxRows={4}
                    />
                  </FormItem>
                </FormGroup>
                <FormGroup>
                  <FormItem style={{textAlign: 'right'}}>
                    <Button variant="contained" color="secondary" onClick={() => handleRemoveExtracurricular(ext.renderKey)} >
                      Remove Extracurricular
                    </Button>
                  </FormItem>
                </FormGroup>
              </StyledForm>
            )) : <></>
          }
          <StyledForm style={{justifyContent: 'end'}}>
            <Button variant="contained" color="primary" onClick={() => addNewExtracurricular()} >
              Add Extracurricular
            </Button>
          </StyledForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNewExp} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}