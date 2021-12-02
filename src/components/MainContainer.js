
import React from 'react';
import Head from './Header'
import LeftNav from './LeftNav'

const MainContainer = (props) => {
    return (
        <div>
            <Head />
            {localStorage.getItem("user") &&
            <LeftNav />
            }
            <div>
            	{props.children}
	        </div>
        </div>
    )
}

export default MainContainer;