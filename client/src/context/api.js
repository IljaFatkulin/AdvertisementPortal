import {createContext, useContext, useState} from "react";

const ApiContext = createContext();

export function ApiProvider({ children })  {
    const url = useState("http://localhost:8080");

    return (
        <ApiContext.Provider value={{ url }}>
            {children}
        </ApiContext.Provider>
    );
}

export function useApiUrl() {
    return useContext(ApiContext);
}