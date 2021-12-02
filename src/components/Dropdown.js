import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropDown =(props)=>{
    return(<>
    <Dropdown
        className="city-dropdown"
        clearable
        fluid
        search
        selection
        options={props.cities}
        placeholder={props.placeholder}
        onChange={props.getSource}
    />
    </>)
}

export default DropDown