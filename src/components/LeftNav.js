import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Menu } from 'semantic-ui-react'

const LeftNav =()=>{
    const history=useHistory()
    const[active, setActive]=useState('Journey') 

    const handleItemClick = (e, path)=>{
        setActive(e.target.innerText)
        history.push(path)
    }

    return(<>
    <Menu pointing vertical color="grey" className="left-nav">
        <Menu.Item
          name='Dashboard'
          active={active === "Dashboard"}
          onClick={(e)=>handleItemClick(e, "/dashboard")}
        />
        <Menu.Item
          name='Journey'
          active={active === "Journey"}
          onClick={(e)=>handleItemClick(e,"/journey")}
        />
      </Menu>
    </>)
}

export default LeftNav