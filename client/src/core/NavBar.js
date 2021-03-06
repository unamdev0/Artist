import React, { Fragment } from 'react';
import '../styles.css';
import { isAuthenticated, signout } from '../auth/helper';
import { Link, withRouter } from 'react-router-dom';
import { getCartItemsNumber } from './helper/cartHelper';
import { useMediaQuery } from 'react-responsive';

function NavBar({ history }) {
	const isDesktopOrLaptop = useMediaQuery({
		query: '(min-device-width: 1224px)',
	});
	const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' });
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

	if (isDesktopOrLaptop) {
		return (
			<div className="header">
				<Link style={{ alignSelf: 'center', marginLeft: '-25px' }} to="/" className="nav-link">
					<img
						style={{ height: '2rem', margin: 5, alignSelf: 'center' }}
						// src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/647px-Apple_logo_black.svg.png"
						src={require('./logo.png')}
						alt=""
					/>
				</Link>
				<div
					style={{
						display: 'flex',
						margin: 'auto',
						fontSize: '14px',
						fontWeight: 300,
						border: 'none',
						marginLeft: '60px',
						flexDirection: 'row',
					}}
				>
					<input
						style={{ width: '30rem', fontSize: '14px', fontWeight: 300, border: 'none' }}
						type="text"
						placeholder="Search for products, brands and more..."
					/>
					<button style={{ backgroundColor: '#ffffff', border: 'none' }} type="submit">
						<svg width="20" height="20" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg">
							<g fill="#000000" fillRule="evenodd">
								<path d="m11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.02l-4.216-4.203"></path>
								<path d="m6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467"></path>
							</g>
						</svg>
					</button>
				</div>
				<div
					className="cart"
					style={{
						display: 'inlineBlock',
						marginRight: 'auto',
						alignSelf: 'center',
					}}
				>
					<Link className="nav-link" to="/cart" style={{ color: '#000000' }}>
						<img
							src="https://image.flaticon.com/icons/svg/626/626443.svg"
							alt=""
							height="20"
							style={{ marginRight: '5px', alignSelf: 'center' }}
						/>
						<span>Cart: </span>
						<span>{getCartItemsNumber()}</span>
					</Link>
				</div>
				{isAuthenticated() ? (
					<div
						className="dropdown"
						style={{
							alignSelf: 'center',
							marginLeft: '25px',
						}}
					>
						<button className="dropbtn">
							<img
								style={{
									borderRadius: 50,
									height: '2rem',
									width: '2rem',
									marginRight: '0.5em',
								}}
								src="https://image.shutterstock.com/image-vector/profile-vector-glyph-flat-icon-260nw-1697842372.jpg"
								alt="Profile Pic"
								height="30"
							/>
							<span>
								Hello, <b>{isAuthenticated().user.name}</b>
							</span>
						</button>
						<div className="dropdown-content">
							<Link to="/">My Account</Link>
							<Link to="/order">My Orders</Link>
							<a
								onClick={() => {
									signout(() => {
										history.push('/');
									});
								}}
							>
								Sign out
							</a>
						</div>
					</div>
				) : (
					<div
						className="dropdown"
						style={{
							alignSelf: 'center',
							marginRight: '5em',
						}}
					>
						<button className="dropbtn">
							<span>
								Hello, <b>Login</b>
							</span>
						</button>
						<div
							className="dropdown-content"
							style={{
								marginRight: '0.5em',
							}}
						>
							<Link to="/signup">Signup</Link>
							<Link to="/signin">Signin</Link>
						</div>
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div className="header mobTop">
				<Link style={{ alignSelf: 'center', marginLeft: '-50px' }} to="/" className="nav-link">
					<img
						style={{ height: '2rem', margin: 5, alignSelf: 'center' }}
						// src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/647px-Apple_logo_black.svg.png"
						src={require('./logo_mobile.png')}
						alt=""
					/>
				</Link>
				{/* <div
					className="cart"
					style={{
						display: 'inlineBlock',
						marginRight: 'auto',
						alignSelf: 'center',
					}}
				>
					<Link className="nav-link" to="/cart" style={{ color: '#000000' }}>
						<img
							src="https://image.flaticon.com/icons/svg/626/626443.svg"
							alt=""
							height="20"
							style={{ marginRight: '5px', alignSelf: 'center' }}
						/>
						<span>Cart: </span>
						<span>{getCartItemsNumber()}</span>
					</Link>
				</div> */}
				{isAuthenticated() ? (
					<div
						className="dropdown"
						style={{
							alignSelf: 'center',
							marginLeft: '25px',
							backgroundColor: '#1e1e1e',
						}}
					>
						<button className="dropbtn">
							<img
								style={{
									borderRadius: 50,
									height: '2rem',
									width: '2rem',
									marginRight: '0.5em',
								}}
								src="https://image.shutterstock.com/image-vector/profile-vector-glyph-flat-icon-260nw-1697842372.jpg"
								alt="Profile Pic"
								height="30"
							/>
							<span>
								Hello, <b>{isAuthenticated().user.name}</b>
							</span>
						</button>
						<div className="dropdown-content">
							<Link to="/">My Account</Link>
							<Link className="nav-link" to="/cart" style={{ color: '#000000' }}>
								<span>My Cart: </span>
								<span>{getCartItemsNumber()}</span>
							</Link>
							<Link to="/order">My Orders</Link>
							<a
								onClick={() => {
									signout(() => {
										history.push('/');
									});
								}}
							>
								Sign out
							</a>
						</div>
					</div>
				) : (
					<div
						className="dropdown"
						style={{
							alignSelf: 'center',
							marginRight: '4em',
						}}
					>
						<button className="dropbtn">
							<span>
								Hello, <b>Login</b>
							</span>
						</button>
						<div
							className="dropdown-content"
							style={{
								marginRight: '0.5em',
							}}
						>
							<Link to="/signup">Signup</Link>
							<Link to="/signin">Signin</Link>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default withRouter(NavBar);