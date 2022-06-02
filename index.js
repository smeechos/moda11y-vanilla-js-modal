module.exports = class Moda11y {
	constructor() {
		this.body            = document.querySelector( 'body' );
		this.focusableString = "a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
		this.previousFocus   = null;
		this.listeners       = [
			'click',
			'keydown',
		];
		this.#init();
	}

	#init() {
		let modalTriggers = document.querySelectorAll( '.moda11y-trigger' );

		if ( null !== modalTriggers ) {
			modalTriggers.forEach(
				function ( ele ) {
					ele.addEventListener(
						'click',
						function ( e ) {
							e.preventDefault();

							// Set previous focused element.
							this.previousFocus = ele;

							// Set no-scroll class on body.
							this.body.classList.add( 'moda11y-no-scroll' );

							// Append our modal to the end of the body.
							this.body.insertAdjacentHTML( 'beforeend', this.#generateModal( ele ) );

							// Get the modal close button + set focus to it.
							let modalClose = document.querySelector( '.moda11y__close' );
							modalClose.focus();

							// Add event listener to handling closing the modal.
							modalClose.addEventListener(
								'click',
								function ( ev ) {
									this.#closeModal( document.querySelector( '.moda11y' ) );
								}.bind( this )
							);
						}.bind( this )
					);
				}.bind( this )
			);

			// Loop over each event type, and add event listener for each.
			this.listeners.forEach(
				function ( eventType ) {
					document.addEventListener(
						eventType,
						function( e ) {
							if ( 'keydown' === eventType ) {
								let modal = document.querySelector( '.moda11y' );

								if ( null !== modal ) {
									let modalFocusable = [].slice.call( modal.querySelectorAll( this.focusableString ) );

									// Close any open modal is escape is pressed.
									if ( 27 === e.keyCode ) {
										this.#closeModal( modal );
									}

									// Focus first or last element in modal when tabbing (depending on direction).
									if ( 9 === e.keyCode && modalFocusable.indexOf( e.target ) >= 0 ) {
										if ( e.shiftKey ) {
											if ( e.target === modalFocusable[0] ) {
												e.preventDefault();
												modalFocusable[modalFocusable.length - 1].focus();
											}
										} else {
											if ( e.target === modalFocusable[modalFocusable.length - 1] ) {
												e.preventDefault();
												modalFocusable[0].focus();
											}
										}
									}
								}
							}

							// Close modal if click outside of modal.
							if ( 'click' === eventType ) {
								let modal = document.querySelector( '.moda11y' );

								if ( null !== modal && e.target.classList.contains( 'moda11y__overlay' ) ) {
									this.#closeModal( modal );
								}
							}
						}.bind( this )
					);
				}.bind( this )
			);
		}
	}

	/**
	 * Closes a given modal.
	 *
	 * @param modal
	 */
	#closeModal( modal ) {
		modal.remove();
		this.body.classList.remove( 'moda11y-no-scroll' );
		this.previousFocus.focus();
	}

	/**
	 * Generate a modal for a given trigger.
	 *
	 * @param trigger
	 * @returns {string}
	 */
	#generateModal( trigger ) {
		let modalHTML = document.querySelector( '#' + trigger.dataset.moda11yTarget ).innerHTML;
		return '<div class="moda11y" role="dialog" data-moda11y-active="' + trigger.dataset.moda11yTarget + '"><div class="moda11y__overlay"></div><div class="moda11y__modal"><button class="moda11y__close" type="button" data-moda11y-trigger="' + trigger.dataset.moda11yTarget + '">&#10005;</button> ' + modalHTML + '</div></div>';
	}
}
