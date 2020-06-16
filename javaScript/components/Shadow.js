import React, { Component } from 'react';
import { BoxShadow } from 'react-native-shadow';

export default class Shadow extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.shadowOpt = {
            color: '#000',
            border: 6,
            opacity: 0.1,
            x: 0,
            y: 0,
            width: this.props.style ? (this.props.style.width || 100) : 100,
            height: this.props.style ? (this.props.style.height || 100) : 100,
            styles: this.props.style || {},
            radius: this.props.style ? (this.props.style.borderRadius || 0) : 0,
        };
    }

    render () {
        try {
            return <BoxShadow setting={this.shadowOpt}>
                {this.props.children}
            </BoxShadow>;
        } catch (e) {
            return null;
        }
    }
}
