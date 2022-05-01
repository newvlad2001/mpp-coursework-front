import React, {useEffect, useState} from "react";
import API from "../../utils/API";
import {useLocation} from "react-router";
import Loading from "../../components/Loading";
import PanelCardsVideosLayout from "../PanelCardsVideosLayout";



function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function HomeVideosLayout() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [videosData, setVideosData] = useState([]);
    const [page, setPage] = useState(0);
    const [next, setNext] = useState(false);
    const query = useQuery();
    const [name] = useState(query.get("name"))
    const [sort] = useState(query.get("sort"))

    useEffect(() => {
        const url = name ? `/videos?page=${page}&name=${name}` : (sort ? `/videos?page=${page}&sort=views,desc` : `/videos?page=${page}`);
        API.get(url)
            .then((res) => {
                    const v = videosData.slice();
                    Array.prototype.map.call(res.data.content, (item) => {
                        v.push(item);
                    })
                    setVideosData(v);
                    setIsLoaded(true);
                    setNext((page + 1) !== res.data.totalPages);
                },
                (error) => {
                    const response = error.response
                    console.log(response)
                })
            .catch(() => {

            });
    }, [page]);


    const Videos = <PanelCardsVideosLayout
        handleNextPage={() => { setPage(page + 1);}}
        nextPage={next}
        videosData={videosData}
    />

    return !isLoaded ? <Loading />  : Videos;
}

export default HomeVideosLayout;