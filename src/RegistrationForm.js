import React from 'react';
import { Form } from 'react-bootstrap';
import { Username, Email, Ruolo, Submit } from './modules/FormFields';
import  Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css' ;
import $ from 'jquery';
import info from './data.json';
import './RegistrationForm.css';

export default class RegistrationForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            usernameReady: false,
            email: "",
            emailReady: false,
            ruolo: null,
            ruoloReady: false,
            disabled: true,
            successMessage: null,
            datiInviati: false,
            loading: false
        }

        this.successMessage = this.successMessage.bind(this);
    }
    componentWillMount()
    {
        let message = this.successMessage();
        this.setState({successMessage: message});
    }

    componentDidUpdate()
    {
        let prevDisabled = this.state.disabled;
        let inputTrigger = this.state.usernameReady && this.state.emailReady;
        if( inputTrigger && prevDisabled && this.state.ruoloReady){
            this.setState({disabled: false});
        }
        if (!inputTrigger && !prevDisabled){
            this.setState({disabled: true});
        }
    }

    usernameChanged(newState, value){
        this.setState({usernameReady: newState, username: value});
    }

    emailChanged(newState, value){
        this.setState({emailReady: newState, email: value});
    }

    ruoloChanged(newState, value){
        this.setState({ruoloReady: newState, ruolo: value});
    }

    successMessage(){
        return {__html: `Abbiamo inviato le credenziali di accesso all'indirizzo <strong>`+this.state.email+`</strong>.
                <br />
                Effettua il <a href="`+info.siteURL+`/accedi">login</a> per modificare la password e inserire i tuoi dati`};
         
    }

    inviaDati(){

        this.setState({loading: true});
        var self = this;
        $.ajax({
            url: info.siteURL + "/wp-admin/admin-ajax.php",
            method: 'post',
            data: {
                'action': 'resocosp_registra_utente',
                'username': self.state.username,
                'email': self.state.email,
                'ruolo': self.state.ruolo
            },
            dataType: "json",
            success: function(response){
                if(response.messaggio){
                    self.setState({
                        datiInviati: true,
                        loading: false
                    });               
                }
                else{
                    console.log(response);
                    console.log("mail non inviata");
                }
            },
            error: function(xhr,status,error){
                console.log(error);
            }
        });
    }

    render(){
        return (
            <div className="registration-form-wrapper">
                { this.state.datiInviati === false && this.state.loading === false ? (
                <Form horizontal>
                    <Username callbackParent={(newState, value) => this.usernameChanged(newState, value)}/>
                    <Email callbackParent={(newState, value) => this.emailChanged(newState, value)}/>
                    <Ruolo callbackParent={(newState, value) => this.ruoloChanged(newState, value)}/>
                    <Submit disabled={this.state.disabled} callbackParent={() =>this.inviaDati()}/>
                </Form>
                ) :  (
                    null
                )}
                { this.state.datiInviati ?(
                <p className="registration-success-message" dangerouslySetInnerHTML={this.successMessage()} />
                ): (
                    null
                )}
                {this.state.loading ? (
                <div className="background-spinner">
                    <Spinner />
                    <div className="text-center background-spinner-message">Invio dati in corso...</div>
                </div>
                ) : (
                    null
                )}
            </div>
        );
    }
}