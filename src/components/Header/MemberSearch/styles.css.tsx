import styled from 'styled-components'
import { Button } from '../../Common/styles.css'

export const Container = styled.div`
    height: 100%;
    position: relative;
    margin-right: 10px;
`;
export const SearchIcon = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 999;
`

export const HeaderSearch = styled.input`
    width: 220px;
    height: 36px;
    border-radius: 7px;
    border: 0;
    padding: 0 10px;
    position: relative;
`

export const SuggestionUl = styled.ul`
    position: absolute;
    background: white;
    top: 58px;
    border-radius: 5px;
    width: 245px;
    box-shadow: 0px 4px 8px lightgrey;
    max-height: 400px;
    overflow-y: auto;
`

export const NoSuggestion = styled.div`
    position: absolute;
    background: white;
    top: 58px;
    border-radius: 5px;
    width: 220px;
    box-shadow: 0px 4px 8px lightgrey;
    color: #767676;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    font-family: 'Inter', sans-serif;
    padding: 4px 10px;
    cursor: pointer;
`
export const SuggestionLi = styled.li`
    color: #767676;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    font-family: 'Inter', sans-serif;
    padding: 4px 10px;
    cursor: pointer;
    display: flex;

    &:hover{
        background: #3a82d069;
        color: white !important;
    }

    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 5px;
    }
    span {
        font-size: 12px;
    }
`
export const SuggestionActiveLi = styled.li`
    color: #767676;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    font-family: 'Inter', sans-serif;
    padding: 4px 10px;
    cursor: pointer;
    display: flex;
    background: #3a82d069;
    color: white;
    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 5px;
    }
    span {
        font-size: 12px;
    }
`