import {login ,logout} from './login';
import {displayMap} from './mapbox';
import '@babel/polyfill';
import { updatedata } from './updatese';
const mapBox =document.getElementById('map');
const loginform=document.querySelector('.form');
const logoutbtn=document.querySelector('.nav__el--logout');
const userDataForm=document.querySelector('.form-user-data');



if(mapBox){
const locations=JSON.parse(mapBox.dataset.locations);
displayMap(locations);}
if(loginform)
loginform.addEventListener('submit',e =>{
    e.preventDefault();
    const email =document.getElementById('email').value;
    const password=document.getElementById('password').value;
    login(email , password);
});

if(logoutbtn) logoutbtn.addEventListener('click' , logout);
if(userDataForm)
    userDataForm.addEventListener('submit' , e => {
e.preventDefault();
const name=document.getElementById('name').value;
const email = document.getElementById('email').value;
updatedata(name , email);
});