import { H2, P } from "components/Common/styles.css";
import styled, { keyframes } from "styled-components";

interface ICardStats{
    color: string,
    sm?: boolean
}

interface IChartTab{
    isActive?: boolean;
}

interface ILabelColor{
    bg: string;
}

interface ILabelItem{
    isBlurred: boolean;
    isHovered?: boolean;
}

const colors: any  = {
    "success" : "#4BDE97",
    "danger" : "#F26464",
    "warning" : "#FFB648"
}



export const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
`

export const ActivitySummaryContainer = styled.div`
    background: white;
    border: 1px #DFE0EB solid;
    border-radius: 10px;
    display: flex;
    margin-bottom: 20px;
`

export const ChartContainer = styled.div`
    height: 100%;
    display: flex;
    position: relative;
    overflow: hidden;
    align-items: center;
    justify-content: center;

    svg{
        .value-text{
        }
    }
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

export const LabelContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 8px;
    margin-bottom: 50px;
`

export const LabelItem = styled.div<ILabelItem>`
    height: 200px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 5px;
    border: 1px #DFE0EB solid;
    filter: ${({isBlurred}) => isBlurred ? "blur(6px)" : "none"};
    transform: ${({isHovered}) => isHovered ? "scale(1.1)" : "scale(1)"};
    transition: .4s all ease-in-out;
`

export const LabelItemImage = styled.div`
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px #DFE0EB solid;
    img{
        width: 70px;
        height: 70px;
    }
`

export const LabelItemName = styled.div`
    height: 30%;
    width: 100%;
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    color: #252733;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 16px;
    text-align: center;

    span{
        font-weight: 400;
        font-size: 14px;
        background: #252733;
        padding: 2px 10px;
        border-radius: 20px;
        color: #FFFFFF;
    }
`

export const ActivitySummaryLeftSection = styled.div`
    width: 70%;
    border-right: 1px #DFE0EB solid;
    padding:32px;
`
export const ActivitySummaryRightSection = styled.div`
    width: 30%;
`

export const SectionTitle = styled(H2)`
    color: #252733;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 19px;
    line-height: 1.2;
    margin-bottom: 8px;
`

export const SelectChart = styled.div`
    width: 100%;
    justify-content: space-between;
    height: 40px;
    background: #F7F5F9;
    gap: 4px;
    padding: 2px;
    display: flex !important;
    border-radius: 8px;
`

export const LabelColor = styled.div<ILabelColor>`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${({bg}) => bg};
`

export const SelectItem = styled.div<IChartTab>`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: ${({ theme }) => theme.font.family.primary};
    color: #263238;
    font-weight: 500;
    font-size: 14px;
    width: 100%;
    cursor: pointer;
    border-radius: 8px;
    background: ${({isActive}) => isActive ? "white" : "transparent"};
    transition: background .4s ease-in-out;
`

export const MonthEngagement = styled(P)`
    color: #9FA2B4;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 24px;
`

export const BoardContainer = styled.div`
    display: flex;
    align-items: center;
`

export const BoardScore = styled(H2)`
    display: inline-block;
    color: #263238;
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    margin-right: 8px;
    
`

export const BoardText = styled(P)`
    font-size: 16px;
    font-weight: 400;
    color: #263238;
`

export const BoardStatusText = styled(P)`
    color: #B9B9B9;
    font-size: 14px;
`

export const Status = styled(P)<ICardStats>`
    color: ${({color}) => colors[color]};
    line-height: 1;
    display: inline-block;
    font-size: ${({sm}) => sm ? "14px" : "16px"};
    margin-right: 8px;
    font-weight: 600;
    svg{
        margin-right: 5px;
    }
`

export const TopLeftSection = styled.div`
    border-bottom: 1px #DFE0EB solid;
    padding: 24px 32px;
    height: 35%;
`

export const BottomLeftSection = styled.div`
    display: flex;
    width: 100%;
    flex: 1;
`

export const ApplicationsContainer = styled.div`
    border-right: 1px #DFE0EB solid;
    padding: 24px 0 0 32px;
    flex: 1;
`

export const MemberContainer = styled.div`
    padding: 24px 0 0 32px;
    flex: 2;
`

export const RightItem = styled.div`
    border-bottom: 1px #DFE0EB solid;
    padding: 24px 32px;
    &:last-child{
        border-bottom: none;
    }
`

export const ItemTitle = styled(P)`
    color: #9FA2B4;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-weight: 600;
    font-size: 16px;
`
