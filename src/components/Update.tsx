import React from 'react';

export default function Update() {
	return (
		<div
			className="w-full h-[64px] z-0 bg-white"
			style={{
				//make teh background a yellow gradient which starts from the bottom
				//dark red
				backgroundImage: 'url(/img/updatebg.gif)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<p
				className="font-amatic"
				style={{
					fontSize: '2.6rem',
					//turn it a little
					textAlign: 'left',
					paddingLeft: '2rem',
					paddingBottom: '1rem',
					fontWeight: 'bolder',
					paddingTop: '0rem',
					color: 'red',
				}}
			>
				THE
			</p>
			<p
				className="font-apocalypse"
				style={{
					fontSize: '4.25rem',
					//turn it a little
					textAlign: 'left',
					paddingLeft: '4.5rem',
					paddingBottom: '1rem',
					marginTop: '-94px',
					//make the text colour a bright yellow and orange gradiant
					backgroundImage: 'linear-gradient(to right, red, orange)',
					//clip the backgorund to the text
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					//make the text transparent
					WebkitTextFillColor: 'transparent',
					clipRule: 'evenodd',
					//give the text a black outline
					textShadow: '0 0 2px rgba(0,0,0,0.1)',
					//give the text a stroke
					WebkitTextStroke: '0.5px #000000',
				}}
			>
				Genesis Update
			</p>
			<p
				style={{
					fontSize: '1rem',
					width: '560px',
					//turn it a little
					textAlign: 'left',
					marginLeft: '32.5rem',
					padding: '12px',
					marginTop: '-115px',
					color: 'whitesmoke',
					background: 'rgba(0,0,0,0.25)',
				}}
			>
				We've got some{' '}
				<b
					style={{
						fontSize: '1.5rem',
					}}
				>
					kick ass new features
				</b>{' '}
				on the way for you. Please note that we might go offline one or two
				times...
			</p>
		</div>
	);
}
