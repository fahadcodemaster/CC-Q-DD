import { H2, P } from 'components/Common/styles.css';
import styled, {keyframes} from 'styled-components';

interface IVisibility{
    visibility: string;
}

const bg: any = {
    "public" : "#3A82D0",
    "private" : "#2C3152"
}



export const Container = styled.div`
    height: 100%;
    width: 100%;
    padding: 20px;
    background : #F7F5F9;
    overflow-X: hidden;
    position: relative;
`

export const NonprofitLogo = styled.img`
    width: auto;
    height: 28px;
    object-fit: cover;
`;

export const ComingSoon = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    -moz-backdrop-filter: blur(4px);
    -o-backdrop-filter: blur(4px);
    -ms-backdrop-filter: blur(4px);

    display: flex;
    align-items: center;
    justify-content: center;
`

export const ComingSoonText= styled(H2)`
    font-size: 32px;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 600;
    color: #2C3152;
`

export const CommentSection = styled.div`
    
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: 4px;
`

export const CommentsCount = styled.span`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-size: 12px;
    font-weight: 500;
    color: #767676;
    cursor: pointer;
`

export const CommentReply = styled.span`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-size: 12px;
    font-weight: 500;
    color: #3A82D0;
    cursor: pointer;
`

export const NonProfitName = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 14px;
    color: #767676;
`

export const NotificationsContainer = styled.div`
    min-height: 980px;
    width: 100%;
    border-radius: 8px;
    border: 1px solid #DFE0EB;
    margin-top: 10px;
    background: white;
`

export const SectionHeader = styled.div`
    padding: 20px 24px;
    padding-bottom: 0;
`

export const SectionHeaderText = styled(H2)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 19px;
    color: #252733;
`

export const ItemHeader = styled.div`
    display: flex;
    gap: 24px;
`

export const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
`

export const ProfileImage = styled.img`
    width: 37px;
    height: 37px;
    border-radius: 50%;
    object-fit: cover;
`

export const ProfileName = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 16px;
    color: #2C3152;
    cursor: pointer;
`

export const Details = styled.div`
    display: flex;
    gap: 13px;
    align-items: center;
`

export const NotifDate = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 14px;
    color: #2C3152;
`

export const EstimDate = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 14px;
    color: #3A82D0;
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


export const NotificationItem = styled.div`
    width: 100%;
    border-bottom: 1px solid #DFE0EB;
    padding: 20px 24px;
    margin-bottom: 10px;

    &:last-child{
        border-bottom:none;
    }
`

export const Note = styled(P)`
    color: #2C3152;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 16px;
`

export const NoteContent = styled(P)`
    color: #2C3152;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 400;
    font-size: 14px;
    line-height: 1.3;
`

export const ItemContent = styled.div`
    margin: 23px 0 16px 0;
`

export const LoadMoreContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
`

export const StyledButton= styled.button`
    padding: 14px 28px;
    font-size: 14px;
    max-width: 400px;
    font-weight: 700;
    font-family: ${({theme}) => theme.font.family.primary};
    color: #FFFFFF;
    border: none;
    outline: none;
    background: #3A82D0;
    cursor: pointer;
    flex: 1;
    border-radius: 4px;
    margin: 15px 0;
`

const spinnerAnimation = keyframes`
   0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.div`
    display: inline-block;
    width: 80px;
    height: 80px;

    &:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #DFE0EB;
        border-color: #DFE0EB transparent #DFE0EB transparent;
        animation: ${spinnerAnimation} 1.2s linear infinite;
    }
`

export const SpinnerContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const licenseColors: any = {
    purple: '#B660C7',
    green: '#49D2C9',
    blue: '#0084D6',
    red: '#F37A7C',
    yellow: '#FDBD41',
    gray: '#B3B3B3',
};
export const LicenseStatusCircle = styled.div<{ shape: string; status: string }>`
    position: absolute;
    top: -14px;
    left: 28px;
    z-index: 300;
    height: ${({ shape }) => (shape === 'circle' ? '25px' : '20px')};
    width: ${({ shape }) => (shape === 'circle' ? '25px' : '20px')};
    background: ${({ status }) => licenseColors[status]};
    border-radius: ${({ shape }) => (shape === 'circle' ? '50%' : '1px')};
    border: 4px solid #fff;
`;