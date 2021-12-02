import React,{ createContext, useState } from 'react';

export const Title = createContext({page:'Plan Journey'});

const PageTitle=({children})=>{

    const [page,setPage]=useState('Plan Journey');

    const UpdateTitle=(title)=>{
        setPage(title)
    }

    const provider = {
        page,
        UpdateTitle,
      };
    return(<>
        <Title.Provider value={provider}>
             {children}
        </Title.Provider>
        </>)
}

export default PageTitle;