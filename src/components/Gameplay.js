import React, { Component } from "react";
import GameOver from './GameOver';
import "./gameplay.css";

export default class Gameplay extends Component {
  constructor(props) {
    super(props);
    this.gameDimensions = 20; // For n x n matrix
    this.state = {
      activeBox: 280, // Snake Head in the matrix
      isDirectionHorizontal: false, // true for Horizontal and false for Vertical
      isMovementPositive: false, // true for one side and vice versa
      isMoving: true, // Game is over or not
      direction: `up`,  // Current moving direction
      snakeLength: 3,
      snakePositions: [], // Snake Length positions
      gameDimensions: this.gameDimensions,
      score: 0,
      currentFoodPosition: parseInt(Math.random()*this.gameDimensions*this.gameDimensions)
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  resetGame () {
    this.setState(() => (
      {
        activeBox: 280,
        isDirectionHorizontal: false, // true for Horizontal and false for Vertical
        isMovementPositive: false, // true for one side and vice versa
        isMoving: true,
        direction: `up`,
        snakeLength: 3,
        snakePositions: [],
        gameDimensions: this.gameDimensions,
        score: 0,
        currentFoodPosition: parseInt(Math.random()*this.gameDimensions*this.gameDimensions)
      }
    ));
    this.forceUpdate();
  }

  handleKeyPress(event) {
    const key = event.key;

    if (
      key === `ArrowUp` &&
      this.state.direction !== `up` &&
      this.state.direction !== `down`
    ) {
      this.setState(() => ({
        isDirectionHorizontal: false,
        isMovementPositive: false,
        direction: `up`
      }));
    }
    if (
      key === `ArrowDown` &&
      this.state.direction !== `down` &&
      this.state.direction !== `up`
    ) {
      this.setState(() => ({
        isDirectionHorizontal: false,
        isMovementPositive: true,
        direction: `down`
      }));
    }
    if (
      key === `ArrowLeft` &&
      this.state.direction !== `left` &&
      this.state.direction !== `right`
    ) {
      this.setState(() => ({
        isDirectionHorizontal: true,
        isMovementPositive: false,
        direction: `left`
      }));
    }
    if (
      key === `ArrowRight` &&
      this.state.direction !== `right` &&
      this.state.direction !== `left`
    ) {
      this.setState(() => ({
        isDirectionHorizontal: true,
        isMovementPositive: true,
        direction: `right`
      }));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Prevent update while changing directions
    if (
      this.state.isDirectionHorizontal !== nextState.isDirectionHorizontal ||
      this.state.isMovementPositive !== nextState.isMovementPositive
    ) {
      return false;
    }
    return true;
  }

  render() {
    const gameplayAreaDimension = 650;
    const delay = 100;

    // If snake is moving
    if (this.state.isMoving) {
      setTimeout(() => {
        this.setState(state => {

          // Game Over when Snake touches itself
          if (state.snakePositions.includes(state.activeBox)) {
            return {
              isMoving: false
            };
          }

          // When Snake eats food
          if (state.activeBox === state.currentFoodPosition) {
            const foodPosition = parseInt(Math.random()*this.gameDimensions*this.gameDimensions);
            return {
              currentFoodPosition: foodPosition,
              score: state.score + 1,
              snakeLength: state.snakeLength + 1
            };
          }

          // Fill Snake Positions according to length
          const snakePositions = state.snakePositions;
          snakePositions.push(state.activeBox);
          if (snakePositions.length > state.snakeLength - 1)
            snakePositions.shift();

          // For Horizontal movement
          if (state.isDirectionHorizontal) {
            const xCoordinate = state.activeBox % state.gameDimensions; // Between 0 and this.state.gameDimensions-1
            // For Moving Right
            if (state.isMovementPositive && xCoordinate < state.gameDimensions - 1) {
              return {
                activeBox: state.activeBox + 1,
                snakePositions: snakePositions
              };
            }
            // For Moving Left
            else if (!state.isMovementPositive && xCoordinate > 0) {
              return {
                activeBox: state.activeBox - 1,
                snakePositions: snakePositions
              };
            }
            else return {
              isMoving: false
            }
          }
          // For Vertical movement
          else {
            const yCoordinate = parseInt(state.activeBox / state.gameDimensions); // Between 0 and this.state.gameDimensions-1
            // For Moving Up
            if (state.isMovementPositive && yCoordinate < state.gameDimensions - 1) {
              return {
                activeBox: state.activeBox + state.gameDimensions,
                snakePositions: snakePositions
              };
            }
            // For Moving Down
            else if (!state.isMovementPositive && yCoordinate > 0) {
              return {
                activeBox: state.activeBox - state.gameDimensions,
                snakePositions: snakePositions
              };
            }
            else return {
              isMoving: false
            }
          }
        });
      }, delay);
    }

    const gridContainerStyle = {
      display: `grid`,
      gridTemplateColumns: `repeat(${this.state.gameDimensions}, auto [col-start])`,
      height: `${gameplayAreaDimension}px`,
      width: `${gameplayAreaDimension}px`,
      backgroundColor: `greenyellow`,
      margin: `0 auto`,
      border: `5px solid #282c34`,
      boxShadow: `inset 0 0 10px #000000`,
    };

    const gridBoxStyle = {
      height: `${gameplayAreaDimension / this.state.gameDimensions}px`,
      width: `${gameplayAreaDimension / this.state.gameDimensions}px`,
      border: `0px solid`,
      borderRadius: `10px`
    };

    const activeBoxStyle = {
      backgroundColor: `green`
    };

    const foodBoxStyle = {
      backgroundColor: `red`,
      borderRadius: `50%`
    };

    return (
      <div className="Game-Board">
      <div className="Score-Board">
          SCORE: {this.state.score}
      </div>
      <div
        className="Game-Grid-Container"
        style={gridContainerStyle}
        onKeyPress={this.handleKeyPress}
      >
        {/** Make a Grid n x n with divs*/}
        {[...Array(this.state.gameDimensions * this.state.gameDimensions)].map((_, i) => {
          return (
            <div
              className="Grid-Box"
              style={
                this.state.snakePositions.includes(i) ||
                i === this.state.activeBox
                  ? { ...activeBoxStyle, ...gridBoxStyle }
                  : (i === this.state.currentFoodPosition)? {  ...gridBoxStyle, ...foodBoxStyle }
                  : gridBoxStyle
              }
              key={i}
            >
            </div>
          );
        })}

        <GameOver show={!this.state.isMoving} resetHandler={this.resetGame} />
      </div>
      </div>
    );
  }
}
