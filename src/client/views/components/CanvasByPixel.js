import React from 'react';
import hot from './utils/hot';
import { rgbToColor } from '../../utils/colors';

class CanvasByPixel extends React.Component {
    constructor() {
        super();
        this._getColorFunctions = [];
        this._getColorOnClickFunctions = [];
    }
    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    onClickPixels(x, y) {
        let handled = false;
        this.getColorOnClickFunctions.forEach(({ getColor, onClick, noClick }) => {
            if (!handled && !noClick) {
                let data = getColor(x, y, { ...this.props, ...this.globalData });
                if (data) {
                    onClick(data);
                    handled = true;
                }
            }
        });
    }
    onClick(e) {
        const canvas = this.refs.canvas;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(event.clientX - rect.left);
        const y = Math.floor(event.clientY - rect.top);
        this.onClickPixels(x, y);
    }

    get width() {
        return this.props.width;
    }
    get height() {
        return this.props.height;
    }
    get background() {
        return this.props.background;
    }

    get getColorFunctions() {
        return this._getColorFunctions;
    }
    get getColorOnClickFunctions() {
        return this._getColorOnClickFunctions;
    }

    set functions(value) {
        this._getColorFunctions = value.map(item => item.getColor);
        this._getColorOnClickFunctions = [...value].reverse().map(item => item);
    }
    get globalData() {
        return {};
    }
    updateCanvas() {
        let { width, height, background } = this;
        const canvas = this.refs.canvas;
        const context = canvas.getContext('2d');


        if (canvas.width !== width) {
            canvas.width = width;
        }
        if (canvas.height !== height) {
            canvas.height = height;
        }

        if (background === undefined) {
            background = '#000000';
        }

        context.fillStyle = background;
        context.fillRect(0, 0, width, height);

        let globalData = { ...this.props, ...this.globalData };

        let y = 0;
        while (y<height) {
            let x = 0;
            while (x<width) {
                this.getColorFunctions.forEach(f => {
                    let data = f(x, y, globalData);
                    if (data) {
                        let { c, rgb } = data;
                        if (c === undefined && rgb !== undefined) {
                            c = rgbToColor(rgb);
                        }
                        if (c !== undefined) {
                            context.fillStyle = c;
                            context.fillRect(x, y, 1, 1);
                        }
                    }
                });
                x++;
            }
            y++;
        }
    }

    render() {
        return <canvas ref='canvas' onClick={(e) => this.onClick(e)}></canvas>;
    }
}

// export default hot(module, CanvasByPixel);
export default CanvasByPixel;
