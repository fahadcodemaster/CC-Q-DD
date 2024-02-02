import React from "react";
import './style.css'

interface IProps{
    isChecked: boolean;
    setIsChecked(e: any): void;
}

const CustomSwitch = (props: IProps) => {
    return(
        <label className="switch">
            <input type="checkbox" checked={props.isChecked} onChange={props.setIsChecked} />
            <span className="slider round"></span>
        </label>
    )
}

export default CustomSwitch