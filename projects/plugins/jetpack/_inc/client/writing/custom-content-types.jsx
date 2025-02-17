import { ToggleControl, getRedirectUrl } from '@automattic/jetpack-components';
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import CompactCard from 'components/card/compact';
import { withModuleSettingsFormHelpers } from 'components/module-settings/with-module-settings-form-helpers';
import SettingsCard from 'components/settings-card';
import SettingsGroup from 'components/settings-group';
import React from 'react';
import { connect } from 'react-redux';
import { getModule, getModuleOverride } from 'state/modules';
import { isModuleFound as _isModuleFound } from 'state/search';

export class CustomContentTypes extends React.Component {
	state = {
		testimonial:
			this.props.getOptionValue( 'jetpack_testimonial', 'custom-content-types' ) || false,
		portfolio: this.props.getOptionValue( 'jetpack_portfolio', 'custom-content-types' ) || false,
	};

	updateCPTs = type => {
		const deactivate =
			'testimonial' === type
				? ! ( ! this.state.testimonial || this.state.portfolio )
				: ! ( ! this.state.portfolio || this.state.testimonial );

		this.props.updateFormStateModuleOption( 'custom-content-types', 'jetpack_' + type, deactivate );

		this.setState( {
			[ type ]: ! this.state[ type ],
		} );
	};

	linkIfActiveCPT = type => {
		return this.props.getSettingCurrentValue( `jetpack_${ type }`, 'custom-content-types' ) ? (
			<a href={ `${ this.props.siteAdminUrl }edit.php?post_type=jetpack-${ type }` } />
		) : (
			<span />
		);
	};

	handleTestimonialToggleChange = () => {
		this.updateCPTs( 'testimonial' );
	};

	handlePortfolioToggleChange = () => {
		this.updateCPTs( 'portfolio' );
	};

	render() {
		if ( ! this.props.isModuleFound( 'custom-content-types' ) ) {
			return null;
		}

		const woa_theme_supports_jetpack_portfolio =
			typeof jetpack_portfolio_theme_supports !== 'undefined'
				? jetpack_portfolio_theme_supports // eslint-disable-line no-undef
				: false;

		const module = this.props.module( 'custom-content-types' );
		const disabledByOverride =
			'inactive' === this.props.getModuleOverride( 'custom-content-types' );
		const disabledReason =
			disabledByOverride &&
			__( 'This feature has been disabled by a site administrator.', 'jetpack' );

		const portfolioDisabledReason =
			! disabledReason && woa_theme_supports_jetpack_portfolio
				? __( 'This feature is already supported by your theme.', 'jetpack' )
				: '';
		const portfolioText = woa_theme_supports_jetpack_portfolio
			? createInterpolateElement(
					__(
						'Use <portfolioLink>portfolios</portfolioLink> on your site to showcase your best work. If your theme doesn’t support Jetpack Portfolios, you can still use a simple shortcode to display them on your site. This feature is enabled by default in your theme settings.',
						'jetpack'
					),
					{
						portfolioLink: this.linkIfActiveCPT( 'portfolio' ),
					}
			  )
			: createInterpolateElement(
					__(
						'Use <portfolioLink>portfolios</portfolioLink> on your site to showcase your best work. If your theme doesn’t support Jetpack Portfolios, you can still use a simple shortcode to display them on your site.',
						'jetpack'
					),
					{
						portfolioLink: this.linkIfActiveCPT( 'portfolio' ),
					}
			  );
		return (
			<SettingsCard { ...this.props } module="custom-content-types" hideButton>
				<SettingsGroup
					hasChild
					module={ module }
					support={ {
						link: getRedirectUrl( 'jetpack-support-custom-content-types' ),
					} }
				>
					<p>
						{ createInterpolateElement(
							__(
								'Add <testimonialLink>testimonials</testimonialLink> to your website to attract new customers. If your theme doesn’t support Jetpack Testimonials, you can still use a simple shortcode to display them on your site.',
								'jetpack'
							),
							{
								testimonialLink: this.linkIfActiveCPT( 'testimonial' ),
							}
						) }
					</p>
					<ToggleControl
						checked={
							this.props.getOptionValue( 'jetpack_testimonial', 'custom-content-types' )
								? this.props.getOptionValue( 'jetpack_testimonial', 'custom-content-types' )
								: false
						}
						disabled={ disabledByOverride }
						toggling={ this.props.isSavingAnyOption( 'jetpack_testimonial' ) }
						onChange={ this.handleTestimonialToggleChange }
						disabledReason={ disabledReason }
						label={
							<span className="jp-form-toggle-explanation">
								{ __( 'Testimonials', 'jetpack' ) }
							</span>
						}
						help={
							<span className="jp-form-setting-explanation jp-form-shortcode-setting-explanation">
								{ __( 'Testimonials shortcode: [testimonials]', 'jetpack' ) }
							</span>
						}
					/>
				</SettingsGroup>
				{ this.props.testimonialActive && (
					<CompactCard
						className="jp-settings-card__configure-link"
						href={ `${ this.props.siteAdminUrl }post-new.php?post_type=jetpack-testimonial` }
					>
						{ __( 'Add a testimonial', 'jetpack' ) }
					</CompactCard>
				) }
				<SettingsGroup
					hasChild
					module={ module }
					support={ {
						link: getRedirectUrl( 'jetpack-support-custom-content-types' ),
					} }
				>
					<p>{ portfolioText }</p>
					<ToggleControl
						checked={
							this.props.getOptionValue( 'jetpack_portfolio', 'custom-content-types' )
								? this.props.getOptionValue( 'jetpack_portfolio', 'custom-content-types' )
								: false
						}
						disabled={ disabledByOverride || woa_theme_supports_jetpack_portfolio }
						toggling={ this.props.isSavingAnyOption( 'jetpack_portfolio' ) }
						onChange={ this.handlePortfolioToggleChange }
						disabledReason={ portfolioDisabledReason }
						label={
							<span className="jp-form-toggle-explanation">{ __( 'Portfolios', 'jetpack' ) }</span>
						}
						help={
							<span className="jp-form-setting-explanation jp-form-shortcode-setting-explanation">
								{ __( 'Portfolios shortcode: [portfolio]', 'jetpack' ) }
							</span>
						}
					/>
				</SettingsGroup>
				{ this.props.portfolioActive && (
					<CompactCard
						className="jp-settings-card__configure-link"
						href={ `${ this.props.siteAdminUrl }post-new.php?post_type=jetpack-portfolio` }
					>
						{ __( 'Add a portfolio item', 'jetpack' ) }
					</CompactCard>
				) }
			</SettingsCard>
		);
	}
}

export default withModuleSettingsFormHelpers(
	connect( ( state, ownProps ) => {
		const portfolioActive = ownProps.getSettingCurrentValue(
			'jetpack_portfolio',
			'custom-content-types'
		);
		const testimonialActive = ownProps.getSettingCurrentValue(
			'jetpack_testimonial',
			'custom-content-types'
		);
		return {
			module: module_name => getModule( state, module_name ),
			isModuleFound: module_name => _isModuleFound( state, module_name ),
			getModuleOverride: module_name => getModuleOverride( state, module_name ),
			portfolioActive,
			testimonialActive,
		};
	} )( CustomContentTypes )
);
