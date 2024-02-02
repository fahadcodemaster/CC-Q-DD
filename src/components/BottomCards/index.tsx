import React from "react";
import {BottomCardsContainer, Card, CardTitle, CardHeader, Item, ItemName,Status, ItemProfile, Count, CountContainer} from "./style.css"
import {ReactComponent as Arrow} from "../../assets/right-arrow.svg"
import {ReactComponent as Search} from "../../assets/searchHeader.svg"
import {ReactComponent as Dots} from "../../assets/dots.svg"
import img from "../../assets/Image.png"


const BottomCards = () => {
    return(
        <BottomCardsContainer>
            <Card>
                <CardHeader>
                    <CardTitle>
                        License Inventory
                        <Arrow />
                    </CardTitle>
                    <Search />
                </CardHeader>
                <Item>
                    <ItemProfile>
                        <img src={img} alt="profile-img"/>
                        <ItemName>Eleanor Pena</ItemName>
                    </ItemProfile>
                    <Status status="warning">
                        Allocated
                    </Status>
                    <Dots />
                </Item>
                <Item>
                    <ItemProfile>
                        <img src={img} alt="profile-img"/>
                        <ItemName>Jacob Jones</ItemName>
                    </ItemProfile>
                    <Status status="info">
                        Allocated
                    </Status>
                    <Dots />
                </Item>

                <Item>
                    <ItemProfile>
                        <img src={img} alt="profile-img"/>
                        <ItemName>Darrell Steward</ItemName>
                    </ItemProfile>
                    <Status status="danger">
                        Unallocated
                    </Status>
                    <Dots />
                </Item>
                
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Applicants
                        <Arrow />
                    </CardTitle>
                    <Search />
                </CardHeader>

                <Item>
                    <ItemProfile>
                        <img src={img} alt="profile-img"/>
                        <ItemName>Eleanor Pena</ItemName>
                    </ItemProfile>
                    <Status status="warning">
                        Deciding
                    </Status>
                    <CountContainer>
                        <Count>
                            2
                        </Count>
                    </CountContainer>
                    
                </Item>
                <Item>
                    <ItemProfile>
                        <img src={img} alt="profile-img"/>
                        <ItemName>Jacob Jones</ItemName>
                    </ItemProfile>
                    <Status status="info">
                        Meeting
                    </Status>
                    <CountContainer>
                        <Count>
                            3
                        </Count>
                    </CountContainer>
                </Item>

                <Item>
                    <ItemProfile>
                        <img src={img} alt="profile-img"/>
                        <ItemName>Darrell Steward</ItemName>
                    </ItemProfile>
                    <Status status="purple">
                        Qualifying
                    </Status>
                    <CountContainer>
                        <Count>
                            1
                        </Count>
                    </CountContainer>
                </Item>
                
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Interests
                    </CardTitle>
                </CardHeader>
            </Card>
        </BottomCardsContainer>
    )
}

export default BottomCards