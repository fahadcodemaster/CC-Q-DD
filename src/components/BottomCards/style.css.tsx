import { H2, P } from "components/Common/styles.css"
import styled from "styled-components"

interface IStatus{
    status: string
}

const colors: any  = {
    "info" : "#5887FF",
    "danger" : "#F26464",
    "warning" : "#FFB648",
    "purple" : "#B65CE0"
}
const backgrounds: any = {
    "info" : "#5887FF1A",
    "danger" : "#DE654B1A",
    "warning" : "#FFAC321A",
    "purple" : "#B65CE01A"
}

export const BottomCardsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px !important;
`

export const Card = styled.div`
    background: white;
    border: 1px #DFE0EB solid;
    padding: 20px 24px;
    border-radius: 8px;
`

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const CardTitle = styled(H2)`
    font-size: 19px;
    font-family: ${({ theme }) => theme.font.family.secondary}; 
    font-weight: 700;
    color: #252733;
    cursor: pointer;
    transition: color .4s ease-in-out;

    svg{
        margin-left: 8px;
        transition: margin-left .4s ease-in;
    }

    &:hover{
        color: #5887FF;
        svg{
            margin-left: 16px;
            transition: margin-left .4s ease-out;
        }
        transition: color .4s ease-in-out;
    }
`



export const Item = styled.div`
    display: flex;
    align-items: center;
    padding: 17px 0;
    justify-content: space-between;
`

export const ItemName = styled(P)`
    font-size: 12px;
    font-weight: 500;
    color: #767676;
    
`

export const ItemProfile = styled.div`
    display: flex;
    align-items: center;
    min-width: 40%;

    img{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 8px;
    }
`

export const Status = styled(P)<IStatus>`
    font-size: 12px;
    background: ${({status}) => backgrounds[status]};
    color: ${({status}) => colors[status]};
    padding: 1px 15px;
    min-width: 85px;
    text-align: center;
    border-radius: 8px;
    font-weight: 500;
`

export const CountContainer = styled.div`
    border-radius: 50%;
    height: 22px;
    width: 22px;
    background: #2A3358;

    display:flex;
    align-items: center;
    justify-content: center;
`

export const Count = styled(P)`
    font-size: 12px;
    font-weight: 500;
    color: white;
`