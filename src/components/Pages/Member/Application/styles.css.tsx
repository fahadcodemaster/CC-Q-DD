import styled from 'styled-components'
import { H2, P } from 'components/Common/styles.css';

interface IStatus{
    status: string;
}

const bg: any = {
    "submitted" : "#3A82D0",
    "draft" : "#2C3152",
    "denied" : "#2C3152",
    "accepted": "#03de32",
    "approved": "#03de32"
}

export const Status = styled(P)<IStatus>`
    background: #3A82D0;
    color: white;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 14px;
    padding-inline: 4px;
    border-radius: 4px;
    align-self: flex-end;
    text-align: center;
    flex-grow: 2;
    cursor: pointer;
    svg {
        position: absolute;
        right: 3px;
        top: 3px;
    }
`

export const ExpandDetails = styled.p<{ isActive: boolean; }>`
    line-height: 1.25;
    font-family: Mulish,sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #2C3152;
    cursor: pointer;
    z-index: 1;
    width: 100%;
    text-align: center;
    border: ${({isActive}) => isActive ? `2px solid #3a82d0` : `1px solid #dfe0eb`};
    background: whitesmoke;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    margin-bottom: 10px;
    border-top: 0;
    svg {
        font-size: 1rem;
    }
`

export const CloseDetails = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
`

export const DetailsList = styled.ul`
    list-style: none;
    padding-top: 10px;
    > li {
        padding-bottom: 30px;
        position:relative;
        display: flex;
        
        > div{
            display: flex;
            flex-direction: column;
        }

        > span {
            border-radius: 50%;
            width: 12px;
            height: 12px;
            background: #2C3152;
            margin-right: 11px;
            margin-top: 5px;
            &::before{
                content:'';
                position:absolute;
                border-left: 1px solid #2C3152;
                width: 2px;
                top: 5px;
                left:6px;
                bottom:0;
                height:100%;
            }
        }

        &:last-child span:before{
            content:none;
        }
    }
`
export const MainContainer = styled.div`
    position: relative;
`;

export const Container = styled.div<{ isActive: boolean; }>`
    width: 100%;
    position: relative;
    border-radius: 8px;
    border: ${({isActive}) => isActive ? `2px solid #3a82d0` : `1px solid #dfe0eb`};
    background: white;
    padding: 20px 24px;
    padding-bottom: 0px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 0px;
`;

export const NoteFilterIcon = styled.span`
    position: absolute;
    top: 20px;
    right: 24px;
    cursor: pointer;
`;

export const ActiveHover = styled.div`
    position: absolute;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    background: #3a82d014;
`

export const ApplicationTitle = styled(H2)`
    margin: 0;
    line-height: 1.25;
    font-family: ${({theme}) => theme.font.family.secondary};
    font-size: 16px;
    font-weight: 700;
    color: #2C3152;
    margin-left: 15px;

    span{
        margin: 0;
        line-height: 1.25;
        font-family: ${({theme}) => theme.font.family.secondary};
        font-size: 14px;
        font-weight: 500;
        color: #2C3152;
    }
`;
export const ApplicationOption = styled.div`
    display: flex;
    padding-top: 10px;
`
export const PipelineStatusDescription = styled.span`
    line-height: 1.25;
    font-family: Mulish,sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #2C3152;
`
export const ApplicationHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    margin-right: 20px;
`

export const ExpandContainer = styled.div`
    width: 100%;
    text-align: center;
    > svg {
        fill: ${({ theme }) => theme.color.text.normal};
        &:hover {
            cursor: pointer;
            transform: scale(1.1);
        }
    }
`;

export const HistoryDetails = styled.div`
    position: relative;
`;

export const ApplicationDetails = styled.div`
    
`;

export const LogDetails = styled.div`
      > div {
        display: flex;
        > h2{
            margin:0;
            font-family: ${({theme}) => theme.font.family.secondary};
            font-size: 14px;
            line-height: 1.25;
            font-weight: 500;
            color: #2C3152;
        }

    }
`

export const TimeDetails = styled.div`
    display: flex;
    flex-direction: row;
    > p {
        font-family: ${({theme}) => theme.font.family.secondary};
        font-size: 12px;
        font-weight: 500;
        color: #2C3152;
        line-break: auto; 
    }
`

export const Time = styled(P)`
    font-size: ${({ theme }) => theme.font.size.m};
`;

export const Private = styled(P)`
    border: 1px solid ${({ theme }) => theme.color.text.light};
    color: ${({ theme }) => theme.color.text.light};
    padding: 5px;
    border-radius: 5px;
    position: absolute;
    line-height: 1;
    right: 0;
    top: 0;
    margin: 10px 10px 0 0;
`
export const Public = styled(P)`
    border: 1px solid ${({ theme }) => theme.backgroundColor.primary};
    color: ${({ theme }) => theme.color.text.light};
    padding: 5px;
    border-radius: 5px;
    position: absolute;
    line-height: 1;
    right: 0;
    top: 0;
    margin: 10px 10px 0 0;
    
`
export const Logo = styled.img`
    z-index: 1;
    height: 40px;
`
export const ATSMenu = styled.div`
    position: absolute;
    right: 0;
    font-family: Mulish,sans-serif;
    font-size: 14px;
    top: 32px;
    background: white;
    border: 1px solid lightgray;
    border-radius: 5px;
    z-index: 101;
`
export const ATSGroup = styled.p<{ color: string; }>`
    background: ${({color}) => color == 'yellow' ? `#ffa726` : color == 'green' ? `#66bb6a` : color == 'blue' ? `#29b6f6` : color == `purple` ? `#ce93d8`:`#d2d3d5`};
    text-align: center;
    padding: 5px 10px;
`
export const ATSItem = styled.p`
    cursor: pointer;
    padding: 3px 10px;
    &:hover {
        background: #5887ff1a;
    }
    svg {
        float: right;
        width: 15px;
        height: 15px;
    }
`
export const Dropdown = styled.div`
    position: relative;
`
export const DropdownMenu = styled.div`
    padding: 10px 0;
    background: #49516d;
    position: absolute;
    top: 30px;
    left: 0;
    font-family: Inter,sans-serif;
    font-weight: 500;
    font-size: 12px;
    z-index: 333;
    border-radius: 8px;
    color: #f5f5f7;
    cursor: pointer;
    width: 150px;

    .dropdown:not(.dropdown-toggle) {
        border-radius: 8px;
        color: #f5f5f7;
        .DropdownIcon {
            stroke: #f5f5f7;
        }
    }

    li {
        position: relative;
        font-size: 14px;
        .DropdownIcon {
            stroke: #f5f5f7;
        }
    }
    
    .dropdown-menu {
        background: #49516d;
        color: #f5f5f7;
        li > span {
            white-space: nowrap;
            padding: 5px 10px;
            display: block;
            font-family: 'Inter', sans-serif;
            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: space-between;

            .lock-icon {
                fill: #f5f5f7;
                stroke: none !important;
                border: none !important;
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%) scale(0.35);
            }
            &:hover {
                background: #7d8499;
            }
        }
        li > span.active {
            background: gray;
        }
    }

    .dropdown-menu .dropdown-submenu {
        min-width: 130px;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 8px 0px;
        margin-left: 1px;
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        z-index: 1000;
        border-radius: 8px;
        padding: 5px 0px;

        li {
            padding-right: 15px;
        }

        li > svg {
            fill: #f5f5f7;
            border: #f5f5f7;
            stroke: #f5f5f7;
            width: 12px;
            height: 12px;
            position: absolute;
            right: 5px;
            top: 7px;
        }
    }
    .dropdown-menu .dropdown-submenu-left {
        right: 100%;
        left: auto;
    }
    .dropdown-menu > li:hover > .dropdown-submenu {
        display: block;
    }
`;

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background: transparent;
    z-index: 100;
`;

export const AtsChevron = styled.nav`
    color: #fff;
    display: grid;
    font-size: 15px;
    grid-gap: 7px;
    grid-template-columns: repeat(4,1fr) 1px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    width: 100%;
`

export const AtsChevronA = styled.a<{ color: string; }>`
    background-color: ${({color}) => color == 'yellow' ? `#ffa726` : color == 'green' ? `#66bb6a` : color == 'blue' ? `#29b6f6` : color == `purple` ? `#ce93d8`:`#d2d3d5`};
    color: #fff;
    font-size: 10px;
    line-height: 20px;
    padding: 0.5em;
    position: relative;
    cursor: pointer;
    padding-left: 13px;
    text-decoration: none;
    font-family: 'Inter',sans-serif;

    &::before {
        border-bottom: 15px solid transparent;
        border-left: 8px solid #fff;
        border-top: 15px solid transparent;
        bottom: 0;
        content: '';
        height: 0;
        left: 0;
        position: absolute;
        top: 0;
        width: 0;
    }
    &::after {
        border-bottom: 15px solid transparent;
        border-left: 7px solid;
        border-top: 15px solid transparent;
        bottom: 0;
        content: '';
        height: 0;
        position: absolute;
        right: 0;
        top: 0;
        -webkit-transform: translateX(0.667em);
        -ms-transform: translateX(.667em);
        -webkit-transform: translateX(0.667em);
        -ms-transform: translateX(0.667em);
        transform: translateX(0.667em);
        width: 0;
        border-left-color: ${({color}) => color == 'yellow' ? `#ffa726` : color == 'green' ? `#66bb6a` : color == 'blue' ? `#29b6f6` : color == `purple` ? `#ce93d8`:`#d2d3d5`};
    }
`;

export const ProgressSection = styled.p`
    margin-bottom: 10px;
    font-family: Mulish,sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #2c3152;
    text-align: center;
    span {
        font-weight: bold;
    }
`;