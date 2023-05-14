import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function HistoryCapture({ children }) {
	/**
	 * This fixes foward and back button when navigating around the website
	 */

	useEffect(() => {
		let change = () => {
			if ((window as any).innerDocClick) {
				(window as any).innerDoClick = false;
			} else {
				if (window.location.hash != '#undefined') {
					{
						window.location.hash = (
							window.location as any
						).lasthash[
							(window.location as any).lasthash.length - 1
						];
						//blah blah blah
						(window.location as any).lasthash.pop();
					}
				} else {
					window.history.pushState(
						'',
						document.title,
						window.location.href
					);
				}
			}
		};

		window.onhashchange = change;
	}, []);

	return <>{children}</>;
}
