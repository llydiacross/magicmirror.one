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
						color: 'yellow',
					}}
				>
					ALL STARS 🌟 UPDATE
				</p>
				<p
					style={{
						fontSize: '0.7rem',
						textAlign: 'left',
						paddingLeft: '2rem',
						marginTop: '-1.7rem',
						color: 'yellow',
					}}
				>
					🔥️1️⃣0️⃣0️⃣.eth, Buidl Managers, 📰Letter.eth Ticker and more!
				</p>
			</div>
			{
				//Desktop
			}
			<div className="hidden md:block">
				<p
					style={{
						fontSize: '1.5rem',
						textAlign: 'left',
						paddingLeft: '2rem',
						paddingBottom: '1rem',
						fontWeight: 'bolder',
						paddingTop: '0.9rem',
						color: 'yellow',
					}}
				>
					ALL
				</p>
				<p
					className="font-apocalypse"
					style={{
						fontSize: '4.25rem',
						textAlign: 'left',
						paddingLeft: '5.5rem',
						paddingBottom: '1rem',
						marginTop: '-80px',
						backgroundImage:
							'linear-gradient(to right, yellow, orange)',
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						clipRule: 'evenodd',
						textShadow: '0 0 2px rgba(0,0,0,0.1)',
						WebkitTextStroke: '0.5px #000000',
					}}
				>
					STARS 🌟 UPDATE
				</p>
				<p
					style={{
						fontSize: '1rem',
						width: '560px',
						textAlign: 'left',
						marginLeft: '35.5rem',
						padding: '6px',
						marginTop: '-102px',
						color: 'whitesmoke',
						background: 'rgba(0,0,0,0.25)',
					}}
				>
					Introducing the 🔥️1️⃣0️⃣0️⃣.eth <b>Leaderboard</b>,{' '}
					<b>Buidl Managers</b>, <b>The 📰Letter.eth Ticker</b> and
					more!
				</p>
			</div>
		</div>
	);
}
