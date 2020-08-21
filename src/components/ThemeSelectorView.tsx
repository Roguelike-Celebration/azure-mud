import React, {useState, useContext} from 'react'
import {PublicUser} from '../../server/src/user'

import '../../style/profileEditView.css'
import {DispatchContext} from '../App'
import {HideModalAction} from '../Actions'

interface Props {
    isFTUE: boolean;
    defaultHandle?: string;
    user?: PublicUser;
}

export default function ThemeSelectorView (props: Props) {

    const dispatch = useContext(DispatchContext)

    const { defaultHandle, user} = props

    const close = () => {
        dispatch(HideModalAction())
    }

    // By default, use the state in local storage
    // Otherwise, set the state in local storage to be Default

    // Set the selection of the radio group upon opening the modal
    const [selectedTheme, setselectedTheme] = React.useState(
        localStorage.getItem('UserSelectedTheme') || 'Default'
    );

    //Handle what happens when you change the modal - 
    //// change the value in local storage
    //// then change the actual theme
    //// then refresh

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setselectedTheme(event.target.value);
        localStorage.setItem('UserSelectedTheme',event.target.value);
    };
    return(
        
        <div className={`container ${props.isFTUE ? 'ftue' : ''}`}>
        <div className ="form">
            <label>Theme</label>
                <div className = "radio"><label><input 
                    type = "radio"
                    id = "theme"
                    value = "Default"
                    checked = {selectedTheme === 'Default'}
                    onChange = {handleChange}
                    />
                    Default (Dark)</label></div>
                <div className = "radio"><label><input 
                    type = "radio"
                    id = "theme"
                    value = "SolarizedDark"
                    checked = {selectedTheme === 'SolarizedDark'}
                    onChange = {handleChange}
                    />
                    Solarized Dark</label></div>
                <div className = "radio"><label><input 
                    type = "radio"
                    id = "theme"
                    value = "SolarizedLight"
                    checked = {selectedTheme === 'SolarizedLight'}
                    onChange = {handleChange}
                    />
                    Solarized Light</label></div>
        </div>
        </div>
    )
}