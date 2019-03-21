'use strict';

/**
 * @module @10up/Tabs
 *
 * @description
 *
 * An accessible tabs UI component.
 *
 * [Demo]{@link https://10up.github.io/wp-component-library/component/tabs/index.html}
 *
 * @param {string} element Element selector for the tooltip container.
 * @param {Object} options Object of optional callbacks.
 */
export default class TenUpTabs {

	constructor( element, options = {} ) {

		// Defaults
		const defaults = {

			// Event callbacks
			onCreate: null,
			onTabChange: null,
		};

		if ( ! element || 'string' !== typeof element ) {
			console.error( '10up Tabs: No target supplied. A valid target (tab area) must be used.' ); // eslint-disable-line
			return;
		}

		// Tab Containers
		this.$tabs = document.querySelectorAll( element );

		// Bail out if there are no tabs.
		if ( ! this.$tabs  ) {
			console.error( '10up Tabs: Target not found. A valid target (tab area) must be used.'  ); // eslint-disable-line
			return;
		}

		// Settings
		this.settings = Object.assign( {}, defaults, options );

		for ( let tabArea of this.$tabs ) {
			this.setupTabs( tabArea );
		}

		/**
		 * Called after the tabs are initialized on page load.
		 * @callback onCreate
		 */
		if ( this.settings.onCreate && 'function' === typeof this.settings.onCreate ) {
			this.settings.onCreate.call();
		}
	}

	/**
	 * Initialize a given tab area
	 * Configure tab properties and set ARIA attributes.
	 *
	 * @param   {element} $tabArea The tabArea to scope changes
	 * @returns {void}
	 */
	setupTabs( tabArea ) {

		let tabLinks = tabArea.querySelectorAll( '.tab-list [role="tab"]' );

		for ( let tabLink of tabLinks ) {
			let tabId = tabLink.getAttribute( 'aria-controls' );
			let tabLinkId = `tab-${ tabId }`;
			let tabContent = document.getElementById( tabId );

			tabLink.setAttribute( 'id', tabLinkId );
			tabLink.setAttribute( 'aria-selected', false );
			tabLink.parentNode.setAttribute( 'role', 'presentation' );

			tabContent.setAttribute( 'aria-labeledby', tabLinkId );
			tabContent.setAttribute( 'aria-hidden', true );

			tabLink.addEventListener( 'click', ( event ) => {
				event.preventDefault();

				if ( ! event.target.parentNode.classList.contains( 'is-active' ) ) {
					this.goToTab( event, tabArea );
				}
			} );
		}

		this.setFirstTab( tabArea );
	}

	/**
	 * Sets the first tab as active.
	 * Adds CSS classes and toggle AIRA attributes.
	 *
	 * @param   {element} $tabArea The tabArea to scope changes.
	 * @returns {void}
	 */
	setFirstTab( tabArea ) {
		// Change state of first tab.
		let firstTab = tabArea.querySelector( '.tab-list li:first-child [role="tab"]' );
		let firstTabId = firstTab.getAttribute( 'aria-controls' );
		let firstTabContent = document.getElementById( firstTabId );

		firstTab.setAttribute( 'aria-selected', 'true' );
		firstTab.parentNode.classList.add( 'is-active' );

		// Show first tab content.
		firstTabContent.setAttribute( 'aria-hidden', 'false' );
		firstTabContent.classList.add( 'is-active' );
	}

	/**
	 * Changes the active tab when clicked.
	 * Adds CSS classes and toggle AIRA attributes.

	 * @param   {Object}  $event   The tab click event object.
	 * @param   {element} $tabArea The tabArea to scope changes.
	 * @returns {void}
	 */
	goToTab( event, tabArea ) {

		let oldTab = tabArea.querySelector( '.tab-list li.is-active [role="tab"]' );

		// Change state of previously selected tab.
		let oldTabId = oldTab.getAttribute( 'aria-controls' );
		let oldTabContent = document.getElementById( oldTabId );

		oldTab.setAttribute( 'aria-selected', 'false' );
		oldTab.parentNode.classList.remove( 'is-active' );

		oldTabContent.setAttribute( 'aria-hidden', 'true' );
		oldTabContent.classList.remove( 'is-active' );

		// Change state of newly selected tab.
		let newTab = event.target;
		let newTabId = newTab.getAttribute( 'aria-controls' );
		let newTabContent = document.getElementById( newTabId );

		newTab.setAttribute( 'aria-selected', 'true' );
		newTab.parentNode.classList.add( 'is-active' );

		// Show newly selected content.
		newTabContent.setAttribute( 'aria-hidden', 'false' );
		newTabContent.classList.add( 'is-active' );

		if ( newTabContent.querySelector( 'h2' ) ) {
			newTabContent.querySelector( 'h2' ).setAttribute( 'tabindex', -1 );
			newTabContent.querySelector( 'h2' ).focus();
		}

		/**
		 * Called after a tab has been changed.
		 * @callback onTabChange
		*/
		if ( this.settings.onTabChange && 'function' === typeof this.settings.onTabChange ) {
			this.settings.onTabChange.call();
		}
	}
}
