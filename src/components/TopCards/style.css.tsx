import styled from "styled-components";
import {H2, P} from '../Common/styles.css'

interface ICardStats{
    color: string
}

const colors: any  = {
    "success" : "#4BDE97",
    "danger" : "#F26464",
    "warning" : "#FFB648"
}

export const CardsWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px !important;
    margin-top: 25px;
    margin-bottom: 20px;
`

export const Card = styled.div`
    background: white;
    border: 1px #DFE0EB solid;
    display: flex;
    align-items: center;
    justify-center: center;
    gap: 9px;
    padding: 24px 19px;
    border-radius: 10px;
`

export const CardInfos = styled.div`
    display: flex;
    flex-direction: column;
`

export const CardInfosHeader = styled(H2)`
    color: #171717;
    font-weight: 600;
    font-size: 18px;
    line-height: 1;
    margin-bottom: 14px;
`

export const CardInfosText = styled(P)`
    color: #B9B9B9;
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
    margin-bottom: 8px;
`

export const Status = styled(P)<ICardStats>`
    color: ${({color}) => colors[color]};
    font-weight: 500;
    display: inline-block;
    margin-right: 8px;

    svg{
        margin-right: 5px;
    }
`