import React, { Component } from 'react';
import './gameOver.css';

export default class GameOver extends Component {

    render () {
        if (!this.props.show) return null;
        return (
            <div className="Over-Card">
                <div className="Card-Info">
                <div>Game Over!</div>
                <button onClick={this.props.resetHandler} className="Reset-Button">Reset Game</button>
                </div>
            </div>
        );
    }
}