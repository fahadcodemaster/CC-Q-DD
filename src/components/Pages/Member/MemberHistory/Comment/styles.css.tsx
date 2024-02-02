import { H2, P } from 'components/Common/styles.css';
import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    position: relative;
    margin-top: 5px;
`;

export const CommentHeader = styled.div`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-style: normal;
    font-weight: 500;
    diplay: flex;
    position: relative;
    > span {
        font-size: 12px;
        color: #767676;
    }
    > a {
        margin-left: 10px;
        color: #3A82D0;
        font-size: 12px;
        cursor: pointer;
        :hover {
            text-decoration: underline;
        }
    }
`;

export const LoadCommentMore = styled.div`
    margin-top: 15px;
    color: #767676;
    font-size: 12px;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 600;
    cursor: pointer;
    :hover {
        text-decoration: underline;
    }
`;

export const CommentBorder = styled.div`
    height: 30px;
    width: 1px;
    margin: 8px;
    background-color: #767676;
`;

export const CommentContent = styled.div`
    margin: 8px 0;
    > div {
        margin-bottom: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        > span {
            font-family: 'Mulish';
            font-style: normal;
            font-weight: 500;
            margin-left: 5px;
            font-size: 12px;
            color: #767676;
        }
        > a {
            font-family: 'Mulish';
            font-style: normal;
            font-weight: 500;
            margin-left: 10px;
            color: #3A82D0;
            font-size: 12px;
            cursor: pointer;
            :hover {
                text-decoration: underline;
            }
        }
    }
`;
export const CommentBody = styled.div`
    font-size: 14px;
    font-family: ${({theme}) => theme.font.family.primary};
    font-weight: 400;
    color: #2C3152;
`;

export const CommentBox = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    margin: 10px 0;
`;

export const StyledHeadingContent = styled.input`
    border: none;
    font-weight: 500;
    font-size: 14px;
    outline: none;
    &:placeholder{
        color: #767676;
    }
    border-bottom: 1px solid #767676;
    font-family: ${({theme}) => theme.font.family.primary};
    color: #2C3152;
`

export const CommentBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const ButtonPost = styled.button`
    height: 35px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    font-family: ${({theme}) => theme.font.family.primary};
    color: #FFFFFF;
    gap: 12px;
    border: none;
    outline: none;
    background: #3A82D0;
    cursor: pointer;
    border-radius: 4px;
`

export const ProfileImg = styled.img`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
`;

export const ProfileImg2 = styled.img`
    width: 21px;
    height: 21px;
    border-radius: 50%;
    object-fit: cover;
`;

export const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 13px;
    p{
        font-family: ${({theme}) => theme.font.family.primary};
        color: #3182CE;
        font-weight: 500;
        font-size: 14px;
    }
`;

export const CommentInputContainer = styled.div`
    display: flex;
    gap: 8px;
`