import React, { useEffect, useRef } from "react";
import './index.css';

interface IProps {
    stepsArray: any[];
    currentStep: number;
}

interface divEL {
    current: HTMLDivElement | null;
}

const ProgressBar = ({stepsArray, currentStep}: IProps) => {

    const containerRef: divEL = useRef(null);

    useEffect(() => {
        
        let els = document.getElementsByClassName('stepContainer');
        let steps: any[] = Array.prototype.map.call(els, (e) => e);
        const {x} = containerRef.current!.getBoundingClientRect()

    

        function progress(stepNum: any) {
            let p = stepNum * 30;
            let currentStepPosition = 0;
            steps.forEach((e) => {
                if (parseInt(e.id) === stepNum) {
                    currentStepPosition = e.children[0].getBoundingClientRect().x - x
                    e.classList.add('selected');
                    e.classList.remove('completed');
                }
                if (parseInt(e.id) < stepNum) {
                    e.classList.add('completed');
                }
                if (parseInt(e.id) > stepNum) {
                    e.classList.remove('selected', 'completed');
                }
            });
            (document.getElementsByClassName('percent')as HTMLCollectionOf<HTMLElement>)[0].style.width = `${Math.round(currentStepPosition)}px`;

        }


        progress(5)
    }, [currentStep])


    return(
        <div className="container" ref={containerRef}>
            <div className="progress">
                <div className="percent"></div>
            </div>
            <div className="steps">
                {
                    stepsArray.map((_step, index: number) => {
                        console.log(index.toString())
                        return(
                            <p className="stepContainer" id={index.toString()}>
                                <div className="step">
                                </div>
                                {_step}
                            </p>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ProgressBar