import React, { Component } from 'react';
import logo from './logo.svg';
import './assets/css/App.css';

const baseUrl = 'http://chatflat.herokuapp.com/conversations';

class App extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            archive: [],
            newConversation: {},
            message: {
                name: 'Bob',
                text: ''
            }
        }
    }

    fetchArchive = () => {
        const conversations = fetch(`${baseUrl}/${this.state.id}`);

        conversations
            .then(data => data.text())
            .then(data => {
                const archive = JSON.parse(data);
                this.setState({ archive: archive.messages });
            })
            .catch(err => { console.log(err) });
    }

    createConversation = () => {        
        fetch(baseUrl, {
            method: 'POST',
            body: JSON.stringify(),
        }).then(data => data.text())
        .then(data => {
            const newConversation = JSON.parse(data);
            this.setState({ id: newConversation._id })
        })
        .catch(err => { console.log(err) });
    }

    deleteConversation = () => {
        this.setState({
            archive: {},
            newConversation: {},
        });
    }

    sendMessage = (id, message) => {
        fetch(`${baseUrl}/${id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        }).then(data => data.text())
        .catch(err => { console.log(err) });
    }

    handleChange = (e) => {
        
        this.setState({
            message: {
                name: this.state.message.name,
                [e.target.name]: e.target.value,
            }
        });
    }

    handleSubmit = () => {
        const { id, message } = this.state;
        this.sendMessage(id, message);
    }

    render() {
        const { archive } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to ChatFlat</h1>
                    <ul className="nav" role="navigation">
                        <li><a onClick={this.fetchArchive} className="view">View archive</a></li>
                        <li><a onClick={this.createConversation} className="new">New Chat</a></li>
                        <li><a onClick={this.deleteConversation} className="reset">Reset data</a></li>                    
                    </ul>
                </header>
                <div>
                    {archive.length > 0 && archive.map(message => {
                        const { _id, name, text, createdAt } = message;
                        return <p key={_id}>{name}:  {text}   ({createdAt})</p>;
                    })}
                    <input
                        name='text'
                        value={this.state.message.text}
                        type='text'
                        onChange={this.handleChange.bind(this)}
                    />
                    <button onClick={this.handleSubmit} type='submit'>Send</button>
                </div>
            </div>
        );
    }
}

export default App;
