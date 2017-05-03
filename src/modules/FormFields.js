import React from 'react';
import { FormGroup, Col, FormControl, Glyphicon, Tooltip, OverlayTrigger, Radio } from 'react-bootstrap';
import $ from 'jquery';
import './FormFields.css';
import info from '../data.json';

export class Username extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            username: "",
            usernameList: [],
            errorMessage: null,
            validation: null,

        };

        this.checkUsername = this.checkUsername.bind(this);
        this.getUsersSlugList = this.getUsersSlugList.bind(this);
    }

    componentDidMount(){
        this.getUsersSlugList();

    }
    getUsersSlugList(){
        var self = this;
        $.ajax({
            url: info.siteURL+"/wp-admin/admin-ajax.php",
            data:{
                'action': 'resocosp_get_users_slug'
            },
            dataType: 'json',
            success: function(data){
                self.state.usernameList = data;
            },
            error: function(error){
                console.log(error);
            }
        });

    }

    checkUsername(e){
        e.preventDefault();

        var regex = /^[a-z](?!.*?[\.\-_]{2})[a-z0-9\.\-_]{5,19}[a-z0-9]$/;
        let str = regex.exec(e.target.value);
        
        if(str !== null){
            this.setState({username: e.target.value, validation: "success", errorMessage: ""});
            this.props.callbackParent(true, e.target.value);
        }
        else{
            var errorMessage = "Formato non corretto";
            if(e.target.value === "") errorMessage = "";
            
            this.setState({username: e.target.value, validation: "error", errorMessage: errorMessage});
            this.props.callbackParent(false);
        }

        if(this.state.errorMessage === ""){
            for(var i in this.state.usernameList){
                if(this.state.usernameList[i] === e.target.value){
                    this.setState({username: e.target.value, validation: "error", errorMessage: "Utente già presente"});
                    this.props.callbackParent(false);
                    break;
                }
            }
        }
    }

    render(){
        let usernameTooltip =   <Tooltip id="username-input-format" className="registration-input-format">
                                    <p>I caratteri ammessi sono: {' '}
                                        <strong>lettere minuscole</strong>,{' '}
                                         <strong>numeri</strong>,{' '}
                                         e i simboli <strong>.</strong> (punto), <strong>-</strong> (meno) e <strong>_</strong> (underscore).
                                    </p>
                                    <p>Il primo carattere deve essere una lettera minuscola, 
                                        i segni di punteggiatura non possono essere ripetuti consecutivamente,
                                        l'ultimo carattere può contenere solo lettere minuscole o numeri
                                        e la lunghezza deve essere compresa tra i 7 e i 20 caratteri.
                                    </p>
                                </Tooltip>;

        return(
            <FormGroup className="registration-form-group" validationState={this.state.validation}>
                <Col sm={4} className="registration-form-label">
                    Username                   
                    <OverlayTrigger placement="bottom" 
                                    overlay={usernameTooltip}
                                    className="registration-input-format">
                        <Glyphicon  glyph="question-sign" 
                                    className="registration-question-sign" />
                    </OverlayTrigger>
                </Col>
                <Col sm={8}>
                    <FormControl type="text" 
                                 placeholder="Inserisci il tuo username"
                                 onInput={this.checkUsername}
                                 value={this.state.username}
                                 
                    />
                    <p className="registration-form-error">{this.state.errorMessage}</p>
                </Col>

            </FormGroup>
        );
    }
}

export class Email extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            emailList: [],
            errorMessage: null,
            validation: null
        }

        this.checkEmail = this.checkEmail.bind(this);
        this.getUsersEmailList = this.getUsersEmailList.bind(this);
    }

    componentDidMount(){
        this.getUsersEmailList();
    }

    getUsersEmailList(){
        var self = this;
        $.ajax({
            url: info.siteURL+"/wp-admin/admin-ajax.php",
            data:{
                'action': 'resocosp_get_users_email'
            },
            dataType: 'json',
            success: function(data){
                self.state.emailList = data;
            },
            error: function(error){
                console.log(error);
            }
        });
    }

    checkEmail(e){
        e.preventDefault();
        var errorMessage = null;
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let str = regex.exec(e.target.value);
        
        if(str !== null){
            errorMessage = "";
            this.setState({email: e.target.value, validation: "success", errorMessage: errorMessage});
            this.props.callbackParent(true, e.target.value);
        }
        else{
            errorMessage = "Formato non corretto";
            this.setState({email: e.target.value, validation: "error", errorMessage: errorMessage});
            this.props.callbackParent(false);
        }

        if(errorMessage === ""){
            for(var i in this.state.emailList){
                if(this.state.emailList[i] === e.target.value){
                    this.setState({email: e.target.value, validation: "error", errorMessage: "Email già utilizzata"});
                    this.props.callbackParent(false);
                    break;
                }
            }
        }
    }

    render(){
        return(
            <FormGroup className="registration-form-group" validationState={this.state.validation}>
                <Col sm={4} className="registration-form-label">
                    Email
                </Col>
                <Col sm={8}>
                    <FormControl type="mail" 
                                 placeholder="Inserisci la tua email" 
                                 onInput={this.checkEmail}
                                 value={this.state.email}
                    />
                    <p className="registration-form-error">{this.state.errorMessage}</p>
                </Col>
            </FormGroup>
        );
    }
}

export class Ruolo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ruolo: null
        }
    }

    setRuolo(e){
        this.setState({ruolo: e.target.value});
        this.props.callbackParent(true, e.target.value);
    }

    render(){
        return(
            <FormGroup className="registration-form-group">
                <Col sm={4} className="registration-form-label">
                    Ruolo
                </Col>
                <Col sm={8}>
                    <Radio name="ruolo" value="cliente" onChange={this.setRuolo.bind(this)} inline>
                    Utente
                    </Radio>
                    {' '}
                    <Radio name="ruolo" value="admin-azienda" onChange={this.setRuolo.bind(this)} inline>
                    Azienda
                    </Radio>
                    {' '}
                </Col>
            </FormGroup>
        );
    }
}

export class Submit extends React.Component{

    submitNewUser(e){
        e.preventDefault();
        this.props.callbackParent();
    }

    render(){
        return(
            <FormGroup className="registration-form-group register-button">
                <Col>
                    <FormControl  type="submit"
                            value="Invia"
                            id="register-submit" 
                            bsClass="btn btn-primary"
                            disabled={this.props.disabled} 
                            onClick={this.submitNewUser.bind(this)}
                    />
                </Col>
            </FormGroup>
        );
    }
}