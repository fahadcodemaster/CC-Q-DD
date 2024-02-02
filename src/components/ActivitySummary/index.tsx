import React, { useEffect } from 'react';
import {
    ActivitySummaryContainer,
    ActivitySummaryLeftSection,
    BoardContainer,
    BoardScore,
    BoardText,
    RightItem,
    Status,
    ActivitySummaryRightSection,
    ItemTitle,
    SelectChart,
    SelectItem,
    ChartContainer,
    Spinner,
    LabelContainer,
    LabelItem,
    LabelItemImage,
    LabelItemName,
    SectionContainer,
    LabelColor,
} from './style.css';

import advocacy from '../../assets/chartAdvocacy.svg';
import education from '../../assets/chartEducation.svg';
import community from '../../assets/chartCommunity.svg';
import environment from '../../assets/chartEnvironment.svg';
import aid from '../../assets/chartAid.svg';
import recreation from '../../assets/chartRecreation.svg';
import wellness from '../../assets/chartWellness.svg';
import culture from '../../assets/chartCulture.svg';
import stem from '../../assets/chartSTEM.svg';
import elected from '../../assets/chartElected.svg';
import referenced from '../../assets/chartReferenced.svg';
import inducted from '../../assets/chartInducted.svg';
import selected from '../../assets/chartSelected.svg';
import nominated from '../../assets/chartNominated.svg';
import applied from '../../assets/chartApplied.svg';
import activated from '../../assets/chartActivated.svg';
import paused from '../../assets/chartPaused.svg';
import idled from '../../assets/chartIdled.svg';
import advisory from '../../assets/chartAdvisory.svg';
import associate from '../../assets/chartAssociate.svg';
import consultants from '../../assets/chartConsultants.svg';
import fans from '../../assets/chartFans.svg';
import governing from '../../assets/chartGoverning.svg';
import mentor from '../../assets/chartMentor.svg';
import patrons from '../../assets/chartPatrons.svg';
import probono from '../../assets/chartProbono.svg';
import volunteer from '../../assets/chartVolunteer.svg';

import { ReactComponent as Rising } from '../../assets/rising.svg';
import CustomBubbleChart from './CustomBubbleChart';
import { ReportingAPI } from '../../../types';


interface IProps {
    dashboardData: any;
    isLoading: boolean;
    appState: ReportingAPI.PrimaryCompanyData | undefined;
}

interface IActiveData {
    name: string;
    count: number;
}

type activeDataType = {
    [key: string]: IActiveData;
};

const ActivitySummary = ({ dashboardData, isLoading, appState }: IProps) => {
    const [activeTab, setActiveTab] = React.useState<number>(0);
    let _i = 1;
    const [activeData, setActiveData] = React.useState<activeDataType>({});
    const [formattedData, setFormattedData] = React.useState<any[]>();
    const [isHovered, setIsHovered] = React.useState('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const colors: any[] = [
        '#E7D0F1',
        '#CBE0F8',
        '#F9ADAD',
        '#4F5C77',
        '#A681A2',
        '#FFE082',
        '#FFC7D0',
        '#008290',
        '#C2FCF3',
        '#BDA69E',
        '#E36F47',
        '#79B6AC',
        '#4994B6',
        '#ABEE87',
        '#6879B3',
        '#F0972D',
        '#C3FCF1',
        '#FFC0BA',
        '#7095B2',
    ];

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const onTabClick = (key: any, index: number) => {
        setActiveTab(index);
        setActiveData(dashboardData.chart_stats[key]);
    };

    const labels = [
        [
            {
                name: 'Advocacy',
                img: advocacy,
            },
            {
                name: 'Aid',
                img: aid,
            },
            {
                name: 'Community',
                img: community,
            },
            {
                name: 'Culture',
                img: culture,
            },
            {
                name: 'Education',
                img: education,
            },
            {
                name: 'Environment',
                img: environment,
            },
            {
                name: 'Health',
                img: wellness,
            },
            {
                name: 'Recreation',
                img: recreation,
            },
            {
                name: 'STEM',
                img: stem,
            },
        ],
        [
            {
                name: 'Elected',
                img: elected,
            },
            {
                name: 'Referenced',
                img: referenced,
            },
            {
                name: 'Inducted',
                img: inducted,
            },
            {
                name: 'Selected',
                img: selected,
            },
            {
                name: 'Nominated',
                img: nominated,
            },
            {
                name: 'Applied',
                img: applied,
            },
            {
                name: 'Activated',
                img: activated,
            },
            {
                name: 'Paused',
                img: paused,
            },
            {
                name: 'Idled',
                img: idled,
            },
        ],
        [
            {
                name: 'Governing Board',
                img: governing,
            },
            {
                name: 'Associate Board',
                img: associate,
            },
            {
                name: 'Advisory Board',
                img: advisory,
            },

            {
                name: 'Consultants',
                img: consultants,
            },
            {
                name: 'Pro-bono',
                img: probono,
            },
            {
                name: 'Mentor',
                img: mentor,
            },
            {
                name: 'Volunteer',
                img: volunteer,
            },
            {
                name: 'Patrons',
                img: patrons,
            },
            {
                name: 'Fans',
                img: fans,
            },
        ],
    ];

    const categories = [
        'advocacy',
        'aid',
        'community',
        'culture',
        'education',
        'environment',
        'health',
        'recreation',
        'stem',
        'elected',
        'referenced',
        'inducted',
        'selected',
        'nominated',
        'applied',
        'activated',
        'paused',
        'idled',
        'governing board',
        'associate board',
        'advisory board',
        'consultants',
        'pro-bono',
        'mentor',
        'volunteer',
        'patrons',
        'fans',
    ];

    React.useEffect(() => {
        if (dashboardData) {
            setActiveData(dashboardData.chart_stats.impact);
            setActiveTab(0);
        }
    }, [dashboardData]);

    React.useEffect(() => {
        let image: { name: string; img: string } = labels[0][0];
        let temp: any[] =
            activeData &&
            Object.keys(activeData).map((key: string) => {
                image = labels[activeTab].filter((d) => d.name.toLowerCase() === activeData[key].name.toLowerCase())[0];
                return {
                    name: activeData[key].name,
                    className: activeData[key].name.toLowerCase(),
                    size: activeData[key].count,
                    img: image ? image.img : advocacy,
                };
            });

        if (activeTab > 1) {
            const tempVolunteer = temp.filter(
                (t) => t.name.toLowerCase() === 'volunteer' || t.name.toLowerCase() === 'other',
            );
            let index = 0;

            if (tempVolunteer) {
                let newVolunteer = {};
                let volunteerSize = [];
                for (let i = 0; i < tempVolunteer.length; i++) {
                    index = temp.indexOf(tempVolunteer[i]);
                    if (index > -1) {
                        temp.splice(index, 1);
                        volunteerSize = tempVolunteer.map((t) => t.size);
                        newVolunteer = {
                            name: 'Volunteer',
                            className: 'volunteer',
                            size: volunteerSize.reduce((prev, next) => prev + next, 0),
                            img: volunteer,
                        };
                        temp = [...temp, newVolunteer];
                    }
                }
            }

            const volunteerCount = temp.filter((t) => t.name.toLowerCase() === 'volunteer');
            if (volunteerCount.length > 1) {
                index = temp.indexOf(volunteerCount[0]);
                temp.splice(index, 1);
            }
        }

        if (temp) {
            temp = temp.filter((data) => categories.includes(data.name.toLowerCase()));
        }

        setFormattedData(temp);
    }, [activeData]);

    /* License IDs
    1 - prime
    2 - active
    3 - latent
    4 - disable
    5 - waitlist
    6 - pause
    */

    /* CR IDs
    1 - 
    2 - 
    3 - member
    4 - candidate
    5 - legacy
    6 - 
    7 - prospect
    8 - 
    9 - applicant
    */

    return (
        <SectionContainer>
            <ActivitySummaryContainer>
                <ActivitySummaryLeftSection>
                    <SelectChart>
                        {dashboardData &&
                            Object.keys(dashboardData.chart_stats).map((key, index: number) => (
                                <SelectItem
                                    onClick={() => onTabClick(key, index)}
                                    key={`chart_${key}`}
                                    isActive={index === activeTab}
                                >
                                    {capitalize(key)}
                                </SelectItem>
                            ))}
                    </SelectChart>
                    <ChartContainer>
                        {dashboardData && !isLoading && (
                            <CustomBubbleChart isHovered={isHovered} setIsHovered={setIsHovered} data={formattedData} />
                        )}

                        {isLoading && <Spinner />}
                    </ChartContainer>
                </ActivitySummaryLeftSection>
                <ActivitySummaryRightSection>
                    <RightItem>
                        <ItemTitle>License Holders</ItemTitle>
                        <BoardContainer>
                            <BoardScore>
                                {' '}
                                {(appState?.members &&
                                    appState?.members?.filter((member: ReportingAPI.MemberInsight) =>
                                        [2, 3].includes(member.candidate_license as number),
                                    ).length) ||
                                    '0'}
                            </BoardScore>
                            <BoardText>
                                {/*<Status color="danger">
                                    +3 this month
                                </Status>*/}
                            </BoardText>
                        </BoardContainer>
                    </RightItem>
                    <RightItem>
                        <ItemTitle>Active Licenses</ItemTitle>
                        <BoardContainer>
                            <BoardScore>
                                {(appState?.members &&
                                    appState?.members?.filter(
                                        (member: ReportingAPI.MemberInsight) => member.candidate_license === 2,
                                    ).length) ||
                                    '0'}
                            </BoardScore>
                            <BoardText>
                                {/*<Status color="danger">
                                    +2 this month
                            </Status>*/}
                            </BoardText>
                        </BoardContainer>
                    </RightItem>
                    <RightItem>
                        <ItemTitle>Idled Licenses</ItemTitle>
                        <BoardContainer>
                            <BoardScore>
                                {(appState?.members &&
                                    appState?.members?.filter(
                                        (member: ReportingAPI.MemberInsight) => member.candidate_license === 3,
                                    ).length) ||
                                    '0'}
                            </BoardScore>
                            <BoardText>
                                {/*<Status color="warning">
                                    +0 this month
                    </Status>*/}
                            </BoardText>
                        </BoardContainer>
                    </RightItem>
                    <RightItem>
                        <ItemTitle>Paused Licenses</ItemTitle>
                        <BoardContainer>
                            <BoardScore>
                                {(appState?.members &&
                                    appState?.members?.filter(
                                        (member: ReportingAPI.MemberInsight) => member.candidate_license === 6,
                                    ).length) ||
                                    '0'}
                            </BoardScore>
                            <BoardText>
                                {/*<Status color="warning">
                                    +0 this month
                        </Status>*/}
                            </BoardText>
                        </BoardContainer>
                    </RightItem>
                    <RightItem>
                        <ItemTitle>License Waitlist</ItemTitle>
                        <BoardContainer>
                            <BoardScore>
                                {(appState?.members &&
                                    appState?.members?.filter(
                                        (member: ReportingAPI.MemberInsight) => member.candidate_license === 5,
                                    ).length) ||
                                    '0'}
                            </BoardScore>
                            <BoardText>
                                {/*<Status color="warning">
                                    +0 this month
                        </Status>*/}
                            </BoardText>
                        </BoardContainer>
                    </RightItem>
                </ActivitySummaryRightSection>
            </ActivitySummaryContainer>
            <LabelContainer>
                {labels &&
                    labels[activeTab].map((label) => {
                        const data =
                            formattedData &&
                            formattedData
                                .map((item) => {
                                    if (item.name.toLowerCase() === label.name.toLowerCase()) {
                                        return item;
                                    }
                                })
                                .filter((x) => x !== undefined)[0];
                        return (
                            <LabelItem
                                isBlurred={
                                    isHovered.length > 0 &&
                                    isHovered.toLocaleLowerCase() !== label.name.toLocaleLowerCase()
                                }
                                isHovered={
                                    isHovered.length > 0 &&
                                    isHovered.toLocaleLowerCase() === label.name.toLocaleLowerCase()
                                }
                                onMouseEnter={() => setIsHovered(label.name.toLowerCase())}
                                onMouseLeave={() => setIsHovered('')}
                                key={`labelitem_${label.name}`}
                            >
                                <LabelItemImage>
                                    <img src={label.img} alt={label.name} />
                                </LabelItemImage>
                                <LabelItemName>
                                    <p>{label.name}</p>
                                    {data ? <span>{data && data.size}</span> : <span>0</span>}
                                </LabelItemName>
                            </LabelItem>
                        );
                    })}
            </LabelContainer>
        </SectionContainer>
    );
};

export default ActivitySummary;
