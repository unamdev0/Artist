import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import AdminRoute from './auth/helper/AdminRoutes';
import PrivateRoute from './auth/helper/PrivateRoutes';
import UserDashBoard from './user/UserDashBoard';
import AdminDashBoard from './user/AdminDashBoard';
import AddProduct from './admin/AddProduct';
import ManageProducts from './admin/ManageProducts';
// import UpdateProduct from './admin/UpdateProduct';
import Orders from './admin/Orders';
import Cart from './core/Cart';
import NewHome from './core/NewHome';
import ViewProduct from './core/ViewProduct';
import Order from './core/Order';

import NavBar from './core/NavBar';

function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={NewHome} />
				{/* <Route path="/" exact component={Home} /> */}
				{/* <Route path="/main" exact component={NewHome} /> */}
				<Route path="/product/view/:productId" exact component={ViewProduct} />
				<Route path="/signup" exact component={Signup} />
				<Route path="/signin" exact component={Signin} />
				<PrivateRoute path="/user/dashboard" exact component={UserDashBoard} />
				<AdminRoute path="/admin/dashboard" exact component={AdminDashBoard} />
				<AdminRoute path="/admin/create/product" exact component={AddProduct} />
				<AdminRoute path="/admin/products" exact component={ManageProducts} />
				{/* <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct} /> */}
				<Route path="/cart" exact component={Cart} />
				<Route path="/order" exact component={Order} />
				<AdminRoute path="/admin/orders" exact component={Orders} />
			</Switch>
		</BrowserRouter>
	);
}
export default Routes;