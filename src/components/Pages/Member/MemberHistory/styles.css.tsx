import { H2, P } from 'components/Common/styles.css';
import styled from 'styled-components'

interface IVisibility{
    visibility: string;
}

const bg: any = {
    "public" : "#3A82D0",
    "private" : "#2C3152"
}


export const Container = styled.div`
    margin-bottom: 10px;
    width: 100%;
    border-bottom: 1px solid #DFE0EB;
    padding: 20px 24px;
    position: relative;
`;

export const LogDetails = styled.div`
    margin-top: 12px;
`

export const TimeDetails = styled.div`
    display: flex;
    flex-direction: row;
    gap: 13px;
    > p {
        line-break: auto; 
    }
`
export const Visibility = styled(P)<IVisibility>`
    background: ${({visibility}) => bg[visibility]};
    color: white;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 14px;
    padding-inline: 4px;
    border-radius: 4px;
`

export const NonProfitName = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 14px;
    color: #767676;
`
export const NonprofitLogo = styled.img`
    width: auto;
    height: 28px;
    object-fit: cover;
`;

export const LogAction = styled(H2)`
    color: #2C3152;
    margin: 0;
    margin-bottom: 8px;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 16px;
`
export const LogHeader = styled(P)`
    color: #2C3152;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 400;
    font-size: 16px;
`
export const LogContent = styled(P)`
    color: #2C3152;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 400;
    font-size: 14px;
    line-height: 1.3;
`

export const Time = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-size: 14px;
    font-weight: 500;
    color: #2C3152;
`;
export const TimeEstimation = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-size: 14px;
    font-weight: 500;
    color: #3A82D0;
    margin-right: 3px;
`;
export const HoverControl = styled.div`
    position: absolute;
    right: 20px;
    top: 25px;
    > button {
        border: 0;
        background: none;
        font-size: 20px;
        padding: 3px;
        color: grey;
        cursor: pointer;
    }
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
export const StyledForm = styled.div`
    gap: 20px;
`;
export const FormGroup = styled.div`
    text-align: right;
    gap: 20px;
    width: 100%;
    max-width: 100%;
`;
export const StyledButton = styled.button<{ isSubmit?: boolean; isCancel?: boolean }>`
    padding: 9.5px 17.5px;
    font-size: 14px;
    max-width: 100px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.font.family.primary};
    color: #ffffff;
    border: none;
    outline: none;
    background: ${({ isSubmit, isCancel }) => (isSubmit ? '#49D2C9' : isCancel ? '#132A5D' : '#3a82d0')};
    cursor: pointer;
    border-radius: 4px;
    margin-left: 10px;
`;