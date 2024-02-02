import styled from 'styled-components'
import { Button } from '../../Common/styles.css'

export const UploadNotesSection = styled.label`
    
    
    padding: 10px 12px;
    font-weight: 500;
    border-radius: 7px;
    color: white;

    input[type="file"] {
        position: absolute;
        top: -1000px;
    }
`;

export const UploadTrigger = styled.div`
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
    position: relative;
`;

export const DropdownButton = styled.button`
    width: 35px;
    height: 35px;
    font-family: Mulish,sans-serif;
    font-size: 22px;
    cursor: pointer;
    background: #fed600;
    border: 2px white solid;
    font-weight: bolder;
    border-radius: 50%;
    color: white;
`;

export const UploadDropdownSection = styled.div`
    padding: 10px 0;
    background: #49516d;
    position: absolute;
    top: 42px;
    right: -60px;
    font-family: Inter,sans-serif;
    z-index: 333;
    border-radius: 8px;
    color: #f5f5f7;
    cursor: pointer;
    width: 150px;
`;

export const UploadDropdownRow = styled.label`
    display: block;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    
    &:hover {
        background: gray;
    }

    input[type="file"] {
        position: absolute;
        top: -1000px;
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