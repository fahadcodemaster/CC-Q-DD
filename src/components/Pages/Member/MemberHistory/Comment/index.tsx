import React, { useState, useEffect, useRef } from 'react';
import { Container,
     CommentHeader,
     CommentContent,
     CommentBox,
     ProfileImg,
     ProfileImg2,
     CommentBody,
     CommentBorder,
     LoadCommentMore,
     SwitchContainer,
     CommentInputContainer,
     CommentBodyContainer,
     ButtonPost,
     StyledHeadingContent } from './styles.css'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import defaultProfileImg from "../../../../../assets/default-user-avatar.png";
import { getComments, postComment, postUpdateComment } from "../../../../../services/cariclub";
import moment from 'moment/moment';
import CustomSwitch from '../../CustomSwitch';

interface Props {
    userData: any;
    log: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        width: '25ch',
      },
    },
}));

function Comment({ userData, log }: Props) {
    const [ showReply, setShowReply ] = useState(false);
    const [ editComment, setEditComment ] = useState<any[]>([]);
    const [ commentContent, setCommentContent ] = useState('');
    const [ isPublic, setIsPublic ] = useState(true);
    const [ commentsCount, setCommentsCount ] = useState(0);
    const [ noteComments, setNoteComments ] = useState<any[]>([]);
    const classes = useStyles();

    useEffect(() => {
        setCommentsCount(log.comments_count);
        setNoteComments(log.comments || []);
    }, [log])

    const loadMoreComments = async () => {
        if( noteComments.length > 0 && commentsCount > 0 ) {
            if(commentsCount > noteComments.length) {
                let last_id = noteComments[noteComments.length-1].commentID || null;
                let comments = await getComments(log.comment_action_type, log.id, undefined, last_id);
                let new_comments = [...noteComments, ...comments]
                setNoteComments(new_comments);
            }
        }
    }

    const toggleReply = () => {
        setShowReply(!showReply);
    }
    const handleImgLoadError = (e: any) => {
        // return <ProfileImg src={defaultProfileImg} style={{ width: "200px" }} />
        e.target.src = defaultProfileImg
        e.target.onerror = null
    }
    
    const handleCommentContent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const content: string = (event.target as HTMLInputElement).value;
        setCommentContent(content);
    };

    const handleUpdateCommentContent = (idx:number, event: React.ChangeEvent<HTMLInputElement>) => {
        const content: string = (event.target as HTMLInputElement).value;
        let comments = [...noteComments];
        comments[idx].commentContent = content;
        setNoteComments(comments);
    };

    const handleIsPublic = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPublic(event.target.checked);
    };

    const postNewComment = async () => {
        let result = await postComment(log.comment_action_type, log.id, isPublic, commentContent);
        let new_comments = [...noteComments];
        new_comments.unshift(result);
        setNoteComments(new_comments);
        setCommentsCount(commentsCount + 1);
        setCommentContent('');
    }

    const updateComment = async (idx: number) => {
        let comments = [...noteComments];
        let result = await postUpdateComment(comments[idx].commentID, comments[idx].commentType, comments[idx].commentContent);
        comments[idx] = result;
        setNoteComments(comments);
        let comment_edits = [...editComment];
        comment_edits[comments[idx].commentID] = false;
        setEditComment(comment_edits);
    }

    const eidtComment = (commentID: number) => {
        let value = editComment[commentID] === true ? false: true;
        let comment_edits = [...editComment];
        comment_edits[commentID] = value;
        setEditComment(comment_edits);
    }

    const convertDateDiffHumanize = (date: string) => {
        var date_mom =  convertUTCToLocal(date, 'YYYY-MM-DD HH:mm:ss');
        return moment.duration(date_mom.diff(moment(), 'minutes'), 'minutes').humanize(true);
    }
    const convertUTCToLocal = (dt:string, dtFormat:string) => {
        var toDt = moment.utc(dt, dtFormat).toDate();
        return moment(toDt);
    }


    return (
        <Container>
            <CommentHeader>
                <span>{commentsCount > 0 ? commentsCount: 'no'} comment{commentsCount > 1 ? 's': ''}</span>
                <a onClick={toggleReply}>Reply</a>
            </CommentHeader>
            {showReply && 
                <CommentBox>
                    {
                        userData.general_info.img_url
                            ? <ProfileImg src={userData.general_info.img_url} onError={(e) => handleImgLoadError(e)} />
                            : <ProfileImg src={defaultProfileImg} />
                    }
                    {/* <input type="text" placeholder='Add a comment' value={commentContent} onChange={handleCommentContent} /> */}
                    <CommentBodyContainer>
                        <CommentInputContainer>
                            <StyledHeadingContent 
                                name="comment" 
                                placeholder="Add a comment" 
                                value={commentContent}
                                onChange={handleCommentContent}
                            />

                            <ButtonPost type='button' onClick={postNewComment}>Post</ButtonPost>
                        </CommentInputContainer>
                        
                        <SwitchContainer>
                            <CustomSwitch setIsChecked={handleIsPublic} isChecked={isPublic} />
                            <p>
                                Public
                            </p>
                        </SwitchContainer>
                    </CommentBodyContainer>
                </CommentBox>
            }
            {noteComments != null && commentsCount > 0 ? <CommentBorder></CommentBorder>:<></>}
            {noteComments != null && commentsCount > 0 ? 
                noteComments.map((comment: any, idx: number) => {
                   return (
                    <CommentContent key={idx}>
                        <div>
                            {
                                comment.editor.image
                                    ? <ProfileImg2 src={comment.creator.image} onError={(e) => handleImgLoadError(e)} />
                                    : <ProfileImg2 src={defaultProfileImg} />
                            }
                            <CommentBody>{comment.commentContent}</CommentBody>
                        </div>
                        <div>
                            <span>{convertDateDiffHumanize(comment.createdAt)}</span>
                            {
                                comment.commentStatus == 2 &&
                                <span>Updated by {comment.editor.name} {convertDateDiffHumanize(comment.updatedAt)}</span>
                            }
                            <a onClick={() => eidtComment(comment.commentID)}>Edit</a>
                        </div>
                        {
                            editComment[comment.commentID] === true &&
                            <CommentBox>
                                {
                                    userData.general_info.img_url
                                        ? <ProfileImg src={userData.general_info.img_url} onError={(e) => handleImgLoadError(e)} />
                                        : <ProfileImg src={defaultProfileImg} />
                                }
                                {/* <input type="text" placeholder='Add a comment' value={commentContent} onChange={handleCommentContent} /> */}
                                {/* <FormControlLabel
                                    control={<Switch checked={(comment.commentType == 1? true: false)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleEditIsPublic(idx, event)} name="is_public" color="primary"/>}
                                    labelPlacement="start"
                                    label="Public"
                                /> */}
                                <CommentInputContainer>
                                    <StyledHeadingContent 
                                        name="comment" 
                                        placeholder="Add a comment" 
                                        value={comment.commentContent}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateCommentContent(idx, event)}
                                    />
                                    <ButtonPost type='button' onClick={() => updateComment(idx)}>Update</ButtonPost>
                                </CommentInputContainer>
                                
                            </CommentBox>
                        }
                    </CommentContent>
                   )
                }) :<></>
            }
            {
                noteComments != null && commentsCount > 0 && commentsCount > noteComments.length &&
                <LoadCommentMore onClick={loadMoreComments}>LOAD MORE</LoadCommentMore>
            }
        </Container>
    );
}

export default Comment;