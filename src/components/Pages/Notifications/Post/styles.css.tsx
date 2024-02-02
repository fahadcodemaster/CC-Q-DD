import styled from "styled-components";

export const PostContainer = styled.div`
    width: 100%;
    padding: 20px 24px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DFE0EB;
`

export const PostHeader = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 25px;
    img{
        max-height: 24px;
        width: auto;
    }
`

export const StyledHeadingContent = styled.input`
    border: none;
    font-weight: 500;
    font-size: 14px;
    outline: none;
    &:placeholder{
        color: #767676;
    }
    font-family: ${({theme}) => theme.font.family.primary};
    color: #2C3152;
    border: 1px solid #E2E2E2;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    padding: 8px;
`

export const PostContentContainer = styled.div`
`

export const StyledPostContent = styled.textarea`
    width: 100%;
    max-width: 100%;
    resize: none;
    outline: none;
    border: none;
    background: #F8F8F8;
    &:placeholder{
        color: #767676;
    }
    font-family: ${({theme}) => theme.font.family.primary};
    color: #2C3152;
    min-height: 100px;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    border-radius: 5px;
    padding: 8px;
    margin-bottom: 8px;
`

export const PostOptionsContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

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
`

export const PostSubmitContainer = styled.div`
    display: flex;
    align-items: center;
    select{
        margin-right: 10px;
        padding: 8px 12px;
        font-family:${({theme}) => theme.font.family.primary};
        font-size: 14px;
        outline: none;
        border: 1px solid rgba(134, 134, 134, 0.4);
        border-radius:7px;
        background: white;
        cursor: pointer;
    }
`

export const PostButton= styled.button`
    padding: 9.5px 17.5px;
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