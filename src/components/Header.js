import React, {useContext} from 'react'
import { Title } from './PageTitle'
import { Menu } from 'semantic-ui-react'

const Head=()=>{

    const {page} =useContext(Title) 
    
    const Logout=()=>{
        localStorage.clear();
        window.location = '/';
        window.location.reload();
    }

    return(<>
        <Menu size='massive' widths={3} borderless className="top-menu">
        <Menu.Item
          className="menu-item"
          name='Fake Reservation'
        />
        <Menu.Item
          name={page}
        />
        <Menu.Menu className="menu-text">
          <Menu.Item position='right'
            className="header-text"
             name={localStorage.getItem("user".type)==="admin" ?
             "admin@fake.com" : localStorage.getItem("user")
            }
          />
          <Menu.Item
            name='logout'
            onClick={(e)=>Logout(e)}
          />
        </Menu.Menu>
      </Menu>
    </>)
}

export default Head