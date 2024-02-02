import React, { useState, useEffect, Component, Fragment } from 'react';
import { getCompanyData, getMemberSearch } from '../../../services/cariclub';

import { ReactComponent as Filter } from '../../../assets/filter.svg';
import defaultProfileImg from '../../../assets/default-user-avatar.png';

import { 
	Container,
	HeaderSearch,
  SuggestionUl,
  SuggestionActiveLi,
  SuggestionLi,
  SearchIcon,
  NoSuggestion,
} from './styles.css';

const MemberSearch = () => {
    const [userInput, setUserInput] = useState('')
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [activeSuggestion, setActiveSuggestion] = useState(-1)

    let suggestionsListComponent;
    
		const onChange = (event: any) => {
      const userInput = event.currentTarget.value
			setUserInput(event.target.value)
		}

    const onBaseClick = (event: any) => {
      // show/hide the suggestion box
      setShowSuggestions(!showSuggestions)
    }

    const onClick = (event: any, member: any) => {
      console.log('clicked--->', member)
      // set full name to the input box
      setUserInput(member.first_name + ' ' +member.last_name)
      // hide the suggestion box
      setShowSuggestions(false)
      // set org_key, redirect to member page
      localStorage.setItem('company_id', member.org_key)
      const url = `/pipeline/`+member.org_key+'/'+member.key
      window.location.replace(url)
    }

    const onKeyDown = (event: any) => {  
      // if (event.keyCode === 13) {
      //   // get members
        
      // }
    };

		 useEffect(() => {
        if (userInput) {
          console.log("key---", userInput);
          const fetchMembers = async () => {
              const res: any = await getMemberSearch(userInput)
              setFilteredSuggestions(res.members)
              // show the suggestion box
              setShowSuggestions(true)
          }
  
          fetchMembers()
        }
    }, [userInput])
    
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <SuggestionUl>
            {filteredSuggestions.map((suggestion: any, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                return (
                  <SuggestionActiveLi key={suggestion.key}>
                    <img src={suggestion.profile_url ? suggestion.profile_url:defaultProfileImg}/>
                    <p>{suggestion.first_name} {suggestion.last_name}<br/>
                    <span>({suggestion.organization} / {suggestion.city}, {suggestion.state})</span></p>
                  </SuggestionActiveLi>
                );
              }
              return (
                <SuggestionLi key={suggestion.key} onClick={event => onClick(event, suggestion)}>
                  <img src={suggestion.profile_url ? suggestion.profile_url:defaultProfileImg}/>
                  <p>{suggestion.first_name} {suggestion.last_name}<br/>
                  <span>({suggestion.organization} / {suggestion.city}, {suggestion.state})</span></p>
                </SuggestionLi>
              );
            })}
          </SuggestionUl>
        );
      } else {
        suggestionsListComponent = (
          <NoSuggestion>
            <em>No search result.</em>
          </NoSuggestion>
        );
      }
    }

    return (
        <Container>
          <Fragment>
            <SearchIcon>
              <Filter id="filter_icon" />
            </SearchIcon>
            <HeaderSearch 
							type="text"
              onClick={onBaseClick}
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={userInput}
              placeholder="Search..."
						/>
            {suggestionsListComponent}
          </Fragment>
        </Container>
    );
}

export default MemberSearch;
