import metadata from '../../block.json';

export default {
	attributes: metadata.attributes,
	migrate: attributes => {
		const { style, className } = attributes;
		const styleClassName = 'standard' === style ? '' : `is-style-${ style }`;

		return {
			...attributes,
			className: className ? `${ className } ${ styleClassName }` : styleClassName,
		};
	},
	isEligible: ( { style, className } ) => {
		if ( style && 'standard' !== style ) {
			return ! className || className.indexOf( 'is-style-' ) === -1;
		}

		return false;
	},
	save: ( { attributes: { rid } } ) => (
		<div>
			{ rid.map( restaurantId => (
				<a
					key={ restaurantId }
					href={ `https://www.opentable.com/restref/client/?rid=${ restaurantId }` }
				>
					{ `https://www.opentable.com/restref/client/?rid=${ restaurantId }` }
				</a>
			) ) }
		</div>
	),
};
