import axios from "axios";


const FetchAllLensHandle = async (address:string) => {
try{
    const payload = {
        query: 'query OwnedBy($request: ProfilesRequest!) { profiles(request: $request) { items { id handle { fullHandle namespace } ownedBy { address } } } }',
        variables: {
          request: {
            where: {
              ownedBy: address,
            },
          },
        },
        operationName: 'OwnedBy',
      }
    const data = await axios.post("https://api-v2.lens.dev", 
     JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    return data?.data;

}
catch(error){
    return [];
}
}

export {
    FetchAllLensHandle
}