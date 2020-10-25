import React from 'react';
import { API } from '../../backend';

const ImageHelper = ({ item }) => {
	const imageUrl = item
		? `${API}product/photo/${item._id}`
		: 'https://scontent.fbho1-1.fna.fbcdn.net/v/t1.0-9/19884147_479962445678486_4263267083297980837_n.jpg?_nc_cat=105&_nc_sid=0be424&_nc_ohc=-6YRO2nPGM8AX_62Bz7&_nc_ht=scontent.fbho1-1.fna&oh=1242dc6042c13a40076b0f304c1e27c3&oe=5F1A29DE';
	return (
		<div>
			<div className="rounded p-2">
				<img
					src={imageUrl}
					alt="photo"
					style={{ maxHeight: '100%', maxWidth: '100%' }}
					className="mb-3 rounded"
				/>
			</div>
		</div>
	);
};

export default ImageHelper;