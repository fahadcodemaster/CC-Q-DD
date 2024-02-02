import React, { useState, useEffect, useRef } from 'react';
import {
	Container,
	LogDetails,
	TimeDetails,
	TimeEstimation,
	Time,
	Visibility,
	LogAction,
	LogContent,
	LogHeader,
	NonprofitLogo,
	NonProfitName,
	HoverControl,
	SwitchContainer,
	StyledForm,
	FormGroup,
	StyledButton
} from './styles.css'
import { HiPencilAlt, HiOutlineArchive } from "react-icons/hi";
import CustomSwitch from "../CustomSwitch"
import { updateNote } from "../../../../services/cariclub";
import { ReportingDB } from '../../../../../types';
import { P, H2 } from 'components/Common/styles.css';
import { timeElapsedSinceDate, formatTimestampReadable } from '../../../../services/utils'
import moment from 'moment/moment';
import config from '../../../../config';
import swal from 'sweetalert';

import Comment from "./Comment";

interface Props {
	userData: any;
	log: any;
	isAuth: (userAuthStatus: string, threshold: string) => boolean;
	userAuthStatus: string;
	viewMode: number;
	fetchLogs: any;
}

function formatDate(date: string) {
	const datePart = date.slice(0, 10).split("-")

	return `${datePart[1]}/${datePart[2]}/${datePart[0]}`
}

function estimateTime(date: string) {
	const today = new Date()
	const formattedDate: string = formatDate(date)
	const dateParts = formattedDate.split('/')
	const postDate = new Date(`${dateParts[2]}/${dateParts[0]}/${dateParts[1]}`)

	let years = today.getFullYear() - postDate.getFullYear();
	let months = today.getMonth() - postDate.getMonth();
	let days = today.getDate() - postDate.getDate()
	let msg = ""

	if (years < 2) {
		if (months < 0) {
			months += 12
			msg = `Over ${months} months ago.`
		} else if (months >= 0) {
			if (months <= 1) {
				if (days < 0) {
					days += 31;
				}
				msg = `Over ${days} days ago.`
				if (Math.abs(days) < 28 && Math.abs(days) > 21) {
					msg = "Over 3 weeks ago."
				}
				if (Math.abs(days) <= 21) {
					msg = "3 weeks ago."
				}
				if (Math.abs(days) < 20 && Math.abs(days) > 14) {
					msg = "Over 2 weeks ago."
				}
				if (Math.abs(days) <= 14) {
					msg = "2 weeks ago."
				}
				if (Math.abs(days) < 13 && Math.abs(days) > 7) {
					msg = "Over a week ago."
				}
				if (Math.abs(days) < 8) {
					msg = "A week ago."
				}
				if (Math.abs(days) < 7) {
					msg = `${days} days ago.`
				}
				if (Math.abs(days) === 1) {
					msg = "Yesterday."
				}
				if (Math.abs(days) < 1) {
					msg = `Today.`
				}
			}

			if (months > 1) {
				msg = months < 2 ? `Over ${months} month ago.` : `Over ${months} months ago.`
			}
			if (years > 0) {
				msg = `Over a year ago.`
			}
		}
	} else if (years > 1) {
		if (today.getMonth() < postDate.getMonth()) {
			years--;
		}
		msg = years < 2 ? `Over ${years} year ago.` : `Over ${years} years ago.`
	}

	return msg;
}

function MemberHistory({ userData, log, isAuth, userAuthStatus, viewMode, fetchLogs }: Props) {
	const [isHovering, setIsHovering] = useState(false);
	const [showEditComment, setShowEditComment] = useState(false);
	const [localLog, setLocalLog] = useState(log);
	const cc_token: any = localStorage.getItem('cc_token');
	let _cc_token = null;
	if (cc_token !== null) {
		_cc_token = JSON.parse(cc_token);
	}
	const convertDateDiffHumanize = (date: string) => {
		var date_mom = convertUTCToLocal(date, 'YYYY-MM-DD HH:mm:ss');
		return moment.duration(date_mom.diff(moment(), 'minutes'), 'minutes').humanize(true);
	}
	const convertUTCToLocal = (dt: string, dtFormat: string) => {
		var toDt = moment.utc(dt, dtFormat).toDate();
		return moment(toDt);
	}

	const handleMouseOver = () => {
		setIsHovering(true);
	}
	const handleMouseOut = () => {
		setIsHovering(false);
	}

	const handleIsPrivate = (e: any) => {
		setLocalLog({ ...localLog, is_public: !e.target.checked });
	}
	const startEditComment = () => {
		setShowEditComment(true);
	}
	const cancelEditComment = () => {
		setLocalLog(log);
		setShowEditComment(false);
	}
	const saveEditComment = async () => {
		// api call
		await updateNote(localLog)
		// end
		setShowEditComment(false);
	}
	const archiveComment = async () => {
		swal({
			title: 'Are you sure?',
			text: '',
			icon: 'warning',
			buttons: [true, 'Confirm'],
		}).then(async (sure) => {
			if (sure) {
				let tmp = {...localLog, is_archived: 1}
				await updateNote(tmp)
				fetchLogs();
			} else {
				return false;
			}
		})
	}
	return (
		<Container onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
			{isHovering && (
				<HoverControl>
					<button title="Edit" onClick={startEditComment}><HiPencilAlt /></button>
					<button title="Archive" onClick={archiveComment}><HiOutlineArchive /></button>
				</HoverControl>
			)}
			<TimeDetails>
				<Time>{formatDate(localLog.date)}</Time>
				<TimeEstimation>{convertDateDiffHumanize(localLog.date)}</TimeEstimation>
				{isAuth(userAuthStatus, "authenticated::admin") && !showEditComment &&
					(localLog.is_public
						? <Visibility visibility='public'>Public</Visibility>
						: <Visibility visibility='private'>Private</Visibility>)
				}
				{showEditComment && (
					<SwitchContainer>
						<CustomSwitch setIsChecked={handleIsPrivate} isChecked={!localLog.is_public} />
						<p>
							Private Message
						</p>
					</SwitchContainer>
				)}
				{localLog.nonprofit_logo != '' &&
					(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) ?
					(
						<a target="_blank" href={config.cc_admin_url + `/organizations/` + localLog.nonprofit_guid}>
							<NonprofitLogo src={localLog.nonprofit_logo}></NonprofitLogo>
						</a>
					) : (
						<NonprofitLogo src={localLog.nonprofit_logo}></NonprofitLogo>
					)
				}
				<NonProfitName>{localLog.nonprofit_name}</NonProfitName>
			</TimeDetails>
			<LogDetails>
				<LogAction>
					{localLog.action_headline ? localLog.action_headline : localLog.type}
				</LogAction>
				<LogContent dangerouslySetInnerHTML={{ __html: localLog.action}}></LogContent>
			</LogDetails>
			<Comment userData={userData} log={localLog}></Comment>
			{showEditComment && (
				<StyledForm style={{ justifyContent: 'center' }}>
					<FormGroup>
						<StyledButton isSubmit type="button" onClick={saveEditComment}>
							Save
						</StyledButton>
						<StyledButton isCancel type="button" onClick={cancelEditComment}>
							Cancel
						</StyledButton>
					</FormGroup>
				</StyledForm>
			)}
		</Container>
	);
}

export default MemberHistory;
