import React, { Component } from 'react';
import './App.css';
import AttributeGenerator from './AttributesGenerator';

const reload = true;

class App extends Component {
  constructor(props) {
    super(props);

    this.AttributeGenerator = new AttributeGenerator(this.handleEvent);

    this.state = {
      handlers: this.AttributeGenerator.handlers,
      sets: this.AttributeGenerator.sets,
      set: null,
      currentLog: '',
      currentSetIndex: 0
    }
  }

  getNextIndex() {
    let currentSetIndex = 0;
    let storedSet = sessionStorage.getItem('currentAttributeSet');
    let sessionAttributeSet = parseInt(storedSet);

    if(storedSet !== null) {
      currentSetIndex = sessionAttributeSet + 1;
    }

    sessionStorage.setItem('currentAttributeSet', currentSetIndex);

    return currentSetIndex;
  }

  componentDidMount() {
    this.nextSet();
  }

  log(message) {
    this.setState(prevState => ({ currentLog: prevState.currentLog + message }));
  }

  handleEvent = (event) => {
    this.log(event.type + ',');
  }

  handleEnd() {
    window.setTimeout(() => {
      this.log('&' + performance.now());
      console.log(this.state.currentLog);

      if (reload) {
        this.reload();
      } else {
        this.nextSet();
      }
    }, 5000);
  }

  nextSet() {
    let index = this.getNextIndex();
    if (index >= this.state.sets.length) {
      sessionStorage.removeItem('currentAttributeSet');
      return;
    }

    this.setState(prevState => {
      let newSet = prevState.sets[index];
      let newLog = this.AttributeGenerator.generateSetId(newSet) + performance.now() + '&';
      this.handleEnd();
      return { set: newSet, currentSetIndex: index, currentLog: newLog};
    });
  }

  reload() {
    sessionStorage.setItem(`run-${this.state.currentSetIndex}`, this.state.currentLog);
    if (this.state.currentSetIndex < this.state.sets.length) {
      window.location.reload();
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.set && 
            <video autoPlay={this.state.set.autoplay} preload={this.state.set.preload} playsInline={this.state.set.playsinline} muted className={ !this.state.set.visible ? 'hide' : '' } {...this.state.handlers}>
              <source src="https://assets.stullercloud.com/das/59837902.mp4" type="video/mp4"></source>
              <source src="https://assets.stullercloud.com/das/59837905.webm" type="video/webm"></source> 
            </video>
          }
        </header>
      </div>
    );
  }
}

export default App;
