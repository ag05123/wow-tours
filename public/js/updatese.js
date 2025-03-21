import axios from 'axios';
import { showAlert } from './alert';
export const updatedata = async (name , email) => {
    try{
        const res= await axios ({
            method : 'PATCH',
            url : '/api/v1/users/updateMe',
            data : {
                name,
                email
            }
        });
        if(res.data.status==='success'){
            showAlert('success', 'data uppdated succcessfully' );
        }
    }catch(err){
        showAlert('error' , err.response.data.message);
    }
}