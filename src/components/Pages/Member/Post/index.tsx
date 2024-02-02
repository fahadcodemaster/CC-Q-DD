import React, {useEffect, useState} from "react"
import CustomSwitch from "../CustomSwitch"
import {postNote} from "../../../../services/cariclub";
import {PostContainer, PostSubmitContainer, PostButton, PostHeader, StyledPostContent, StyledHeadingContent, PostContentContainer, PostOptionsContainer, SwitchContainer} from "./styles.css"
import { InsightsApp } from "global";

interface IProps {
    member: InsightsApp.MemberPage | undefined;
    companyLogo: string;
    applications: any;
    fetchLogs: any;
}

const Post = ({member, companyLogo, applications, fetchLogs}: IProps) => {

    const cc_token:any = localStorage.getItem('cc_token');
    let _cc_token = null;
    if(cc_token !== null) {
        _cc_token = JSON.parse(cc_token);
    } 

    const [post, setPost] = useState({
        heading: "",
        content: "",
        isPrivate: false,
        postType: "general",
    })

    const handleHeading = (e: any) => {
        e.preventDefault();
        setPost({...post, heading: e.target.value})
    }

    const handleContent = (e: any) => {
        e.preventDefault();
        setPost({...post, content: e.target.value})
    }

    const handleIsPrivate = (e: any) => {
        setPost({...post, isPrivate: e.target.checked})
    }

    const handlePostType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const postType: string = event.target.value;
        setPost({...post, postType: postType});
    };

    const handlePostNote = async () => {
        if(member) {
            if(!post.content) return;
            let result_code = await postNote(member.key, post.content, post.isPrivate, post.heading, (post.postType == 'general' ? undefined: parseInt(post.postType)));
            setPost({
                heading: "",
                content: "",
                isPrivate: false,
                postType: "general"
            });
            if(result_code == 'c39') {
                fetchLogs(member.key);
            }
        }
    }

    return(
        <PostContainer>
            <PostHeader>
                <img src={companyLogo} alt="company-logo" />
                <StyledHeadingContent 
                    name="heading" 
                    placeholder="Add a headline" 
                    value={post.heading}
                    onChange={handleHeading}
                    />
            </PostHeader>
            <PostContentContainer>
                <StyledPostContent placeholder="Type a note here..." value={post.content} onChange={handleContent}/>
            </PostContentContainer>

            <PostOptionsContainer>
                {
                    _cc_token !== null && _cc_token.type == 'Internal' &&
                    <SwitchContainer>
                        <CustomSwitch setIsChecked={handleIsPrivate} isChecked={post.isPrivate} />
                        <p>
                            Private Message
                        </p>
                    </SwitchContainer>
                }
                
                    
                <PostSubmitContainer>
                    <select value={post.postType} onChange={handlePostType}>
                        <option value="general">General</option>
                        {
                            (applications && applications.length) &&
                            
                                applications.map((application: any) => 
                                    <option value={application.cc_opportunity_application_id}>{application.nonprofit_name}</option>
                                )
                        }
                    </select>
                    <PostButton onClick={handlePostNote}>
                        Post
                    </PostButton>
                </PostSubmitContainer>
            </PostOptionsContainer>
        </PostContainer>
    )
}

export default Post