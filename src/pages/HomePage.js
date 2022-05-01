import React, {useEffect} from "react";
import {useAuthDispatch} from "../context";
import {checkAuth} from "../context/actions";
import HomeVideosLayout from "../layouts/home/HomeVideosLayout";





function HomePage() {
    const dispatch = useAuthDispatch();
    useEffect(() => checkAuth(dispatch), []);
    return (
        <HomeVideosLayout />
    )
}

export default HomePage;