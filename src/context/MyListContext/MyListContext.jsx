import { createContext, useEffect, useState } from "react";

const MyListContext = createContext();


export function MyListProvider({ children }) {

    const [myList, setMyList] = useState(() => {
        const savedMyList = localStorage.getItem("cinevo-my-list");

        return savedMyList ? JSON.parse(savedMyList) : [];
    });

    useEffect(() => {
        localStorage.setItem("cinevo-my-list", JSON.stringify(myList))
    }
    ), [myList];


    function addToMyList(movie) {
        const exists = myList.some((item) => {
            return (movie.id === item.id && movie.mediaType === item.mediaType)
        });

        if (exists) {
            return;
        }

        setMyList((prev) => {
            return [...prev, movie]
        });
    }

    function isInMyList(id, mediaType) {
        const exists = myList.some((item) => {
            return (id === item.id && mediaType === item.mediaType)
        })

        return exists;
    }

    function removeFromMyList(id, mediaType) {
        setMyList((prev) => {
            return prev.filter((item) => {
                return !(item.id === id && item.mediaType === mediaType)
            });
        });
    }

    function clearMyList() {
        setMyList([]);
    }


    return (
        <MyListContext.Provider value={{ myList, addToMyList, isInMyList, removeFromMyList, clearMyList}}>
            {children}
        </MyListContext.Provider>
    );
}

export default MyListContext;