import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import API from "../utils/API";
import Loading from "../components/Loading";
import CardVideoWithAbout from "../components/CardVideoWithAbout";


function VerticalPanelCardsVideosLayout() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [videosData, setVideosData] = useState([]);

    useEffect(() => {
        API.get('/videos?size=5&sort=name,asc')
            .then((res) => {
                    console.log(res.data.content);
                    setVideosData(res.data.content);
                    setIsLoaded(true);
                },
                (error) => {
                    const response = error.response
                    console.log(response)
                })
            .catch(() => {
                console.log('WOOOOW');
            });
    }, []);



    const Videos = (
        <div>
            <Typography gutterBottom variant="subtitle1" color="textSecondary">
                {"Other videos"}
            </Typography>
            {
                Array.prototype.map.call(videosData, function (item) {
                    return <CardVideoWithAbout item={item} />;
                })
            }
        </div>
    );

    return !isLoaded ? <Loading />  : Videos;
}

export default VerticalPanelCardsVideosLayout;