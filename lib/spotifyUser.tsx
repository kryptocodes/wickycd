import { BE_URL } from "@/pages/_app";
import axios from "axios"


const fetchSpotifyUsername = async(username:string) => {
    try{
       const res = await axios.get(`${BE_URL}user/spotify/${username}`);
       return res?.data?.data?.username;
    }
    catch(error){
        return false;
    }
}

export {
    fetchSpotifyUsername
}