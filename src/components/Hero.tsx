import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import WebEvents from '../webEvents';
import storage from '../storage';

// Handle for the typeWriter animation
function Hero({
	theme,
	children,
	style = {},
}: {
	theme?: string;
	children?: any;
	style?: any;
}) {
	console.log(style);

	return (
		<div
			className={'hero min-h-screen bg-base-200 w-full z-50 max-w-screen'}
			data-theme={
				storage.getGlobalPreference('defaultTheme') || theme || 'forest'
			}
			style={{
				...style,
			}}
		>
			{children}
		</div>
	);
}

Hero.propTypes = {
	theme: PropTypes.string,
	title: PropTypes.string,
	initialText: PropTypes.string,
	children: PropTypes.node,
	showFinder: PropTypes.bool,
	typeWriterSpeed: PropTypes.number,
};

export default Hero;
