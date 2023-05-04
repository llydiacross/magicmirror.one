import React from 'react';

export default function UpdateBanner() {
	return (
		<div
			className="w-full h-[64px] z-0 bg-white flex-col md:flex-row"
			style={{
				backgroundImage: 'url(/img/updatebg.gif)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				overflow: 'hidden',
			}}
		>
			{
				//Mobile
			}
			<div className="block md:hidden">
				<p
					className="font-amatic"
					style={{
						fontSize: '2.6rem',
						textAlign: 'left',
						paddingLeft: '2rem',
						paddingBottom: '1rem',
						fontWeight: 'bolder',
						marginTop: '-0.4rem',
						color: 'red',
					}}
				>
					The Genesis Update
				</p>
				<p
					style={{
						fontSize: '0.7rem',
						textAlign: 'left',
						paddingLeft: '2rem',
						marginTop: '-1.7rem',
						color: 'red',
					}}
				>
					Please be patient as we update the site.
				</p>
			</div>
			{
				//Desktop
			}
			<div className="hidden md:block">
				<p
					className="font-amatic"
					style={{
						fontSize: '2.6rem',
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
						textAlign: 'left',
						paddingLeft: '4.5rem',
						paddingBottom: '1rem',
						marginTop: '-94px',
						backgroundImage:
							'linear-gradient(to right, red, orange)',
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						clipRule: 'evenodd',
						textShadow: '0 0 2px rgba(0,0,0,0.1)',
						WebkitTextStroke: '0.5px #000000',
					}}
				>
					Genesis Update
				</p>
				<p
					style={{
						fontSize: '1rem',
						width: '560px',
						textAlign: 'left',
						marginLeft: '32.5rem',
						padding: '12px',
						paddingTop: '22px',
						marginTop: '-115px',
						color: 'whitesmoke',
						background: 'rgba(0,0,0,0.25)',
					}}
				>
					<b>OUT NOW!</b> New features include the Property Manager
					and Virtual Registry, and more!
				</p>
			</div>
		</div>
	);
}
