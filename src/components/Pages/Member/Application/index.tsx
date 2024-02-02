import React, { useEffect, useState } from 'react';
import {
    MainContainer,
    Container,
    Logo,
    ApplicationDetails,
    ApplicationTitle,
    TimeDetails,
    LogDetails,
    HistoryDetails,
    ExpandContainer,
    Time,
    Private,
    Public,
    ApplicationHeader,
    PipelineStatusDescription,
    Status,
    ExpandDetails,
    CloseDetails,
    DetailsList,
		ApplicationOption,
		NoteFilterIcon,
		ActiveHover,
    ATSMenu,
    ATSGroup,
    ATSItem,
    Dropdown,
    DropdownMenu,
    Overlay,
    AtsChevron,
    AtsChevronA,
    ProgressSection
} from './styles.css'
import { InsightsApp } from 'global';
import { H2, P } from 'components/Common/styles.css';
import { HiPencilAlt } from "react-icons/hi";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ReactComponent as Checkmark } from '../../../../assets/checkmark-icon.svg';
import { ReactComponent as DropdownIcon } from '../../../../assets/dropdown.svg';
import { ReportingDB, ReportingAPI } from '../../../../../types';

import { ReactComponent as Filter } from '../../../../assets/filter.svg';
import config from '../../../../config';

import { updateApplicationPipelineStatus, updateATS } from '../../../../services/cariclub';
import swal from 'sweetalert';

import pl from 'date-fns/esm/locale/pl/index.js';
interface Props {
    application: ReportingAPI.ApplicationInsight;
    userAuthStatus: string;
    isAuth: (userAuthStatus: string, threshold: string) => boolean;
		filterChanged: any;
    viewMode: number;
    plStatuses: any;
    atsStatuses: any;
}

function Application({ application, userAuthStatus, isAuth, filterChanged, viewMode, plStatuses, atsStatuses }: Props) {

    const [localApplication, setlocalApplication] = useState(application)
    const [toggleExpand, setToggleExpand] = useState(false)
		const [toggleIsSelected, setToggleIsSelected] = useState(false)
    const [toggleATSMenu, setToggleAtsMenu] = useState(false)
    const [togglePipelineMenu, setTogglePipelineMenu] = useState(false)

    const cc_token: any = localStorage.getItem('cc_token');
    let _cc_token = null;
    if (cc_token !== null) {
        _cc_token = JSON.parse(cc_token);
    }
    function formatDate(date: string){
        if(date) {
            const datePart = date.slice(0, 10).split("-");
            const timePart = date.slice(11, 19).split(":");
            return `${datePart[1]}/${datePart[2]}/${datePart[0]} ${timePart[0]}:${timePart[1]}:${timePart[2]}`;
        } else {
            return '';
        }
    }

    useEffect(() => {
      let app_history = [];
      if(application.application_history && application.application_history.length) {
        app_history = [...application.application_history]
        if(app_history[app_history.length - 1].status_step > 1) { // if the initial application status is not draft or submitted
          if(app_history[app_history.length - 1].status_step == 2) {
            app_history.push({
              ...app_history[app_history.length - 1],
              status: 'Submitted',
              status_id: 1,
              status_step: 1
            })
          } else if(app_history[app_history.length - 1].status_step == 3) {
            app_history.push({
              ...app_history[app_history.length - 1],
              status: 'Phone Call',
              status_id: 7,
              status_step: 2
            })
            app_history.push({
              ...app_history[app_history.length - 1],
              status: 'Submitted',
              status_id: 1,
              status_step: 1
            })
          } else if (app_history[app_history.length - 1].status_step == 4) {
            app_history.push({
              ...app_history[app_history.length - 1],
              status: 'Follow Up',
              status_id: 8,
              status_step: 3
            })
            app_history.push({
              ...app_history[app_history.length - 1],
              status: 'Phone Call',
              status_id: 7,
              status_step: 2
            })
            app_history.push({
              ...app_history[app_history.length - 1],
              status: 'Submitted',
              status_id: 1,
              status_step: 1
            })
          }
        }
        setlocalApplication({...localApplication, application_history: [...app_history]})
      }
    }, [application]);

    const applicationCreatedAt = localApplication.cc_created_at ? localApplication.cc_created_at : localApplication.crm_created_at

		const noteFilterChange = () => {
			setToggleIsSelected(!toggleIsSelected)
			filterChanged(localApplication.cc_opportunity_application_id)
		}

    const atsTracker = [
      'Concluded', 'Leading', 'Serving', 'Matched', 'Interviewing', 'Connecting', 'Queuing', 'Retracted', 'Null'
    ]
    const groupedATS = [
      {
        'name': 'Recommended',
        'group': 'Curation'
      },
      {
        'name': 'Drafted',
        'group': 'Curation'
      },
      {
        'name': 'Withdrawn',
        'group': 'Application'
      },
      {
        'name': 'Received',
        'group': 'Application'
      },
      {
        'name': 'Submitted',
        'group': 'Application'
      },
      {
        'name': 'Phone Call',
        'group': 'Selection'
      },
      {
        'name': 'Follow Up',
        'group': 'Selection'
      },
      {
        'name': 'Accepted',
        'group': 'Decision'
      },
      {
        'name': 'Declined',
        'group': 'Decision'
      },
      {
        'name': 'Denied',
        'group': 'Decision'
      },
      {
        'name': 'Approved',
        'group': 'Decision'
      }      
    ]

    const getUserPipelineStatus = (userpipeline_status: number) => {
      let names = {
        'position': '',
        'stage': '',
        'description': '',
        'pps_id': userpipeline_status,
        'pps_parent_id': null,
        'progress': ''
      }
      let status = plStatuses.filter((el: any) => { return el.id === userpipeline_status; })
      if (status.length > 0) {
        status = status[0];
        names.position = status.name;
        names.description = status.descriptoin;
        names.progress = status.progress;
  
        // check if it has parent stage
        if (status.parent_id) {
          names.pps_parent_id = status.parent_id
          const parent_status = plStatuses.filter((el: any) => { return el.id === status.parent_id; })
          if (parent_status.length > 0) {
            names.stage = parent_status[0].name;
          }
        }
      }
      return names;
    }

    const updateApplicationAts = (ats_name: string) => {
      setToggleAtsMenu(false)
      swal({
        title: 'Confirm update',
        text: "Are you sure you want to update the ATS?",
        icon: 'warning',
        buttons: [true, true],
      }).then(async (sure) => {
        if (sure) {
          await updateATS(localApplication.cc_opportunity_application_guid, ats_name)
          setlocalApplication({...localApplication, 'ats_stage': ats_name})
        } else {
          return false;
        }
      })
    }

    const updateApplicationTracker = async (pipelinetatus_id: number) => {
      setTogglePipelineMenu(false)
      swal({
        title: 'Confirm update',
        text: "Are you sure you want to update the Application Tracker?",
        icon: 'warning',
        buttons: [true, true],
      }).then(async (sure) => {
        if (sure) {
          await updateApplicationPipelineStatus(localApplication.cc_opportunity_application_guid, pipelinetatus_id)
          setlocalApplication({...localApplication, 'pipelinestatus_id': pipelinetatus_id})
        } else {
          return false;
        }
      })
    }

		const css = `
    .MuiButtonGroup-root {
      padding-bottom: 10px;
    }
    .MuiButton-outlined {
      padding: 5px;
      font-size: 10px;
    }
    .MuiButton-contained {
      padding: 5px;
      font-size: 10px;
    }
    .atsStage {
      display: flex;
      position: relative;
    }
    .atsStage svg {
      margin-left: 5px;
      font-size: 22px;
    }
    .atsStage .activeAts {
      background: #3a82d0;
      color: white;
    }
		`

    return (
      <MainContainer>
        {toggleIsSelected &&
          <ActiveHover />
        }
        <Container
					isActive={toggleIsSelected}
				>
          {(toggleATSMenu || togglePipelineMenu) && (
            <Overlay
              onClick={() => {
                setToggleAtsMenu(false);
                setTogglePipelineMenu(false);
              }}
            ></Overlay>
          )}
						<NoteFilterIcon
							onClick={()=>noteFilterChange()}
						>
							<Filter id="filter_icon" />
						</NoteFilterIcon>
            <ApplicationDetails>
                <ApplicationHeader>
                  {(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) ? 
                    (
                      <a target="_blank" href={config.cc_admin_url + `/organizations/` + localApplication.nonprofit_guid}>
                        <Logo src={localApplication.nonprofit_logo} alt="" />
                      </a>
                    ) : (
                      <Logo src={localApplication.nonprofit_logo} alt="" />
                  )}
                    <ApplicationTitle>
                        {localApplication.nonprofit_name}<br/> <span>{localApplication.position}</span>
                    </ApplicationTitle>
                </ApplicationHeader>
            </ApplicationDetails>
            <div>
							<style>
									{css}
							</style>
							
              <div className='atsStage'>
                {/* <ButtonGroup variant="outlined" aria-label="outlined button group">
                  <Button variant={
                    groupedATS.filter(ats => ats.name == localApplication.ats_stage)[0].group == 'Curation' ? 
                    'contained':'outlined' 
                  } color="primary" onClick={() => setToggleAtsMenu(!toggleATSMenu)}>Curation</Button>
                  <Button variant={
                    groupedATS.filter(ats => ats.name == localApplication.ats_stage)[0].group == 'Application' ? 
                    'contained':'outlined' 
                  } color="primary" onClick={() => setToggleAtsMenu(!toggleATSMenu)}>Application</Button>
                  <Button variant={
                    groupedATS.filter(ats => ats.name == localApplication.ats_stage)[0].group == 'Selection' ? 
                    'contained':'outlined' 
                  } color="primary" onClick={() => setToggleAtsMenu(!toggleATSMenu)}>Selection</Button>
                  <Button variant={
                    groupedATS.filter(ats => ats.name == localApplication.ats_stage)[0].group == 'Decision' ? 
                    'contained':'outlined' 
                  } color="primary" onClick={() => setToggleAtsMenu(!toggleATSMenu)}>Decision</Button>
                </ButtonGroup> */}

                <AtsChevron onClick={() => setToggleAtsMenu(!toggleATSMenu)}>
                  <AtsChevronA color={'yellow'}>Curation</AtsChevronA>
                  <AtsChevronA color={['Application', 'Selection','Decision'].includes(
                    groupedATS.filter(ats => ats.name == localApplication.ats_stage).length > 0 ? 
                      groupedATS.filter(ats => ats.name == localApplication.ats_stage)[0].group : '')  ? 'green' : ''}>Application</AtsChevronA>
                  <AtsChevronA color={['Selection','Decision'].includes(
                    groupedATS.filter(ats => ats.name == localApplication.ats_stage).length > 0 ? 
                      groupedATS.filter(ats => ats.name == localApplication.ats_stage)[0].group : '')  ? 'blue' : ''}>Selection</AtsChevronA>
                  <AtsChevronA color={['Decision'].includes(
                    groupedATS.filter(ats => ats.name == localApplication.ats_stage).length > 0 ? 
                      groupedATS.filter(ats => ats.name == localApplication.ats_stage)[0].group : '')  ? 'purple' : ''}>Decision</AtsChevronA>
                </AtsChevron>

                { toggleATSMenu &&
                  <ATSMenu>
                    <ATSGroup color={'yellow'}>Curation</ATSGroup>
                    { groupedATS.filter(ats => ats.group == 'Curation').map(
                      (ats: any) => {
                        return ( 
                        <ATSItem
                          onClick={() => updateApplicationAts(ats.name)} 
                        >
                          {ats.name}
                          {ats.name == localApplication.ats_stage && <Checkmark />}
                        </ATSItem> )
                      }
                    )}
                    <ATSGroup color={'green'}>Application</ATSGroup>
                    { groupedATS.filter(ats => ats.group == 'Application').map(
                      (ats: any) => {
                        return ( 
                          <ATSItem
                            onClick={() => updateApplicationAts(ats.name)} 
                          >
                            {ats.name}
                            {ats.name == localApplication.ats_stage && <Checkmark />}
                          </ATSItem> )
                      }
                    )}
                    <ATSGroup color={'blue'}>Selection</ATSGroup>
                    { groupedATS.filter(ats => ats.group == 'Selection').map(
                      (ats: any) => {
                        return ( 
                          <ATSItem
                            onClick={() => updateApplicationAts(ats.name)} 
                          >
                            {ats.name}
                            {ats.name == localApplication.ats_stage && <Checkmark />}
                          </ATSItem> )
                      }
                    )}
                    <ATSGroup color={'purple'}>Decision</ATSGroup>
                    { groupedATS.filter(ats => ats.group == 'Decision').map(
                      (ats: any) => {
                        return ( 
                          <ATSItem
                            onClick={() => updateApplicationAts(ats.name)} 
                          >
                            {ats.name}
                            {ats.name == localApplication.ats_stage && <Checkmark />}
                          </ATSItem> )
                      }
                    )}
                  </ATSMenu>
                }
              </div>
              <Dropdown>
              <ProgressSection><span>[{getUserPipelineStatus(localApplication.pipelinestatus_id).progress}%]</span> {getUserPipelineStatus(localApplication.pipelinestatus_id).description}</ProgressSection>
              {
                localApplication.pipelinestatus_id &&
                <Status  onClick={() => setTogglePipelineMenu(!togglePipelineMenu)}
                  status={getUserPipelineStatus(localApplication.pipelinestatus_id).position.toLowerCase() as string}>
                  {getUserPipelineStatus(localApplication.pipelinestatus_id).position}
                  <ExpandMoreIcon />
                </Status>
              }
              {
                togglePipelineMenu && (
                <DropdownMenu>
                  <ul className="dropdown-menu">
                    {
                      atsTracker.map((stage: string) => (
                        <li key={`cariclub_main_links_${stage}`}>
                          <span className={getUserPipelineStatus(localApplication.pipelinestatus_id).stage == stage ? `category-menu active`:`category-menu`}>
                            {stage}
                            <DropdownIcon className="DropdownIcon" style={{ transform: 'rotate(-90deg)' }}/>
                          </span>
                          <ul className="dropdown-menu dropdown-submenu">
                            {
                              stage != 'Null' &&
                              plStatuses.filter(
                                (pl:any) => pl.parent_id == (plStatuses.filter((pl1:any) => pl1.name == stage).length ? plStatuses.filter((pl1:any) => pl1.name == stage)[0].id : 0)
                              ).map((subStage: any) => ((
                                <li key={`cariclub_links_${subStage.name}`}
                                onClick={() => updateApplicationTracker(subStage.id)} 
                                >
                                  <span>{subStage.name}</span>
                                  {
                                    getUserPipelineStatus(localApplication.pipelinestatus_id).pps_id == subStage.id &&
                                    <Checkmark />
                                  }
                                </li>
                              )))
                            }
                            {
                              stage == 'Null' &&
                              <li key={`cariclub_links_null`}><span>Null</span></li>
                            }
                          </ul>
                        </li>
                      ))
                    }
                  </ul>
                </DropdownMenu>
                )
              }
              </Dropdown>
							<ApplicationOption>
                {
                  localApplication.pipelinestatus_id &&
                  <PipelineStatusDescription>
                    {getUserPipelineStatus(localApplication.pipelinestatus_id).description}
                  </PipelineStatusDescription>
                }
							</ApplicationOption>
            </div>
            <DetailsList>
                {  toggleExpand && localApplication.application_history && 
                    localApplication.application_history.map((log: ReportingDB.ApplicationsStatusLogs, idx: number) => {
                        return (
                            <li key={`application-history-${idx}`}>
                                <span></span>
                                <div>
                                    <TimeDetails>
                                        {/* <Time>{formatTimestampReadable(log.cc_created_at ? log.cc_created_at : log.crm_created_at)}</Time> */}
                                        {/* <P>{timeElapsedSinceDate(log.cc_created_at ? log.cc_created_at : log.crm_created_at)}</P> */}
                                        <P>{log.cc_updated_at ? formatDate(log.cc_updated_at as string) : formatDate(log.cc_created_at as string)}</P>
                                    </TimeDetails>
                                    <LogDetails>
                                        <div>
                                            <H2>{log.status}</H2>
                                            {log.note && log.note.length > 1 &&
                                                <P>{log.note}</P>}
                                            {/* {isAuth(userAuthStatus, "authenticated::super") &&
                                                (log.is_private
                                                    ? <Private>private</Private>
                                                    : <Public>public</Public>)
                                            } */}
                                        </div>
                                    </LogDetails>
                                </div>
                            </li>
                        )
                    })
                }
            </DetailsList>
            {/* {
                toggleExpand &&
                <CloseDetails onClick={() => setToggleExpand(!toggleExpand)}>
                    <Close />
                </CloseDetails>
            } */}
        </Container>
        {
          !toggleExpand &&
          <ExpandDetails isActive={toggleIsSelected} onClick={() => setToggleExpand(!toggleExpand)}><ExpandMoreIcon /></ExpandDetails>
        }
        {
          toggleExpand &&
          <ExpandDetails isActive={toggleIsSelected} onClick={() => setToggleExpand(!toggleExpand)}><ExpandLessIcon /></ExpandDetails>
        }
      </MainContainer>
    );
}

export default Application;
