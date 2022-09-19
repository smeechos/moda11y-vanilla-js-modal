/**
 * Main class for the library.
 *
 * @type {Moda11y}
 * @package moda11y-vanilla-js-modal
 */
module.exports = class Moda11y {
	/**
	 * Constructor.
	 */
	constructor() {
		this.modalCloseHandler   = this.closeModal.bind( this );
		this.modalTriggerHandler = this.initModalTriggerEventListener.bind( this );
		this.globalEventHandler  = this.initGlobalEventListeners.bind( this );
		this.initVariables();
		this.init();
	}

	/**
	 * Initializes necessary variables for the class.
	 */
	initVariables() {
		this.body            = document.querySelector( 'body' );
		this.focusableString = "a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
		this.previousFocus   = null;
		this.listeners       = [
			'click',
			'keydown',
		];
	}

	/**
	 * Initializes all functionality for the modals.
	 */
	init() {
		let modalTriggers = document.querySelectorAll( '.moda11y-trigger' );

		if ( null !== modalTriggers ) {
			// Set event listener for modal triggers.
			modalTriggers.forEach(
				function( ele ) {
					ele.addEventListener( 'click', this.modalTriggerHandler );
				}.bind( this )
			);

			// Loop over each event type, and add event listener for each.
			this.listeners.forEach(
				function ( eventType ) {
					document.addEventListener( eventType, this.globalEventHandler );
				}.bind( this )
			);
		}
	}

	/**
	 * Re-initializes any event listeners.
	 */
	reInit() {
		let modalTriggers = document.querySelectorAll( '.moda11y-trigger' );
		if ( null !== modalTriggers ) {
			// Remove previous event listener on modal triggers.
			modalTriggers.forEach(
				function (ele) {
					ele.removeEventListener( 'click', this.modalTriggerHandler );
				}.bind( this )
			);

			// Remove global event listeners.
			this.listeners.forEach(
				function ( eventType ) {
					document.removeEventListener( eventType, this.globalEventHandler );
				}.bind( this )
			);
		}

		// Initialize the modals.
		this.init();
	}

	/**
	 * Callback for when the modal trigger is clicked.
	 *
	 * @param e
	 */
	initModalTriggerEventListener( e ) {
		let ele = e.target.classList.contains( 'moda11y-trigger' ) ? e.target : e.target.closest( '.moda11y-trigger' );
		const event = new Event('moda11y-shown');

		e.preventDefault();

		// Set previous focused element.
		this.previousFocus = ele;

		// Set no-scroll class on body.
		this.body.classList.add( 'moda11y-no-scroll' );

		// Append our modal to the end of the body.
		this.body.appendChild( this.generateModal( ele ) );

		// Get the modal close button + set focus to it.
		let modalClose = document.querySelector( '.moda11y__close' );
		modalClose.focus();

		// Trigger "shown" event.
		ele.dispatchEvent(event);

		// Add event listener to handling closing the modal.
		modalClose.addEventListener( 'click', this.modalCloseHandler );
	}

	/**
	 * Callback for handling global events.
	 *
	 * Assists w/ tab trapping + closing the modal.
	 *
	 * @param e
	 */
	initGlobalEventListeners( e ) {
		if ( 'keydown' === e.type ) {
			let modal = document.querySelector( '.moda11y' );

			if ( null !== modal ) {
				let modalFocusable = [].slice.call( modal.querySelectorAll( this.focusableString ) );

				// Close any open modal is escape is pressed.
				if ( 27 === e.keyCode ) {
					this.closeModal( modal );
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

				// Focus back to modal if tabbing outside of the modal.
				if ( e.keyCode === 9 && modalFocusable.indexOf( e.target ) === -1 ) {
					e.preventDefault();
					modalFocusable[0].focus();
				}
			}
		}

		// Close modal if click outside of modal.
		if ( 'click' === e.type ) {
			let modal = document.querySelector( '.moda11y' );

			if ( null !== modal && e.target.classList.contains( 'moda11y__overlay' ) ) {
				this.closeModal( modal );
			}
		}
	}

	/**
	 * Closes a given modal.
	 */
	closeModal() {
		let modal = document.querySelector( '.moda11y' );
		const event = new Event('moda11y-remove');

		if ( null !== modal ) {
			modal.remove();
			this.body.classList.remove( 'moda11y-no-scroll' );
			// Trigger "remove event.
			this.previousFocus.dispatchEvent(event);
			this.previousFocus.focus();
		}
	}

	/**
	 * Generate a modal for a given trigger.
	 *
	 * @param trigger
	 * @returns {HTMLDivElement}
	 */
	generateModal( trigger ) {
		let modalHTML       = document.querySelector( '#' + trigger.dataset.moda11yTarget ).innerHTML,
			modalWrapperDiv = document.createElement( 'div' ),
			modalOverlayDiv = document.createElement( 'div' ),
			modalDiv        = document.createElement( 'div' ),
			modalClose      = document.createElement( 'button' ),
			modalCloseSpan  = document.createElement( 'span' );

		// Setup modal wrapper div.
		modalWrapperDiv.setAttribute( 'class', 'moda11y' );
		modalWrapperDiv.setAttribute( 'role', 'dialog' );
		modalWrapperDiv.setAttribute( 'data-moda11y-active', trigger.dataset.moda11yTarget );

		// Setup overlay div.
		modalOverlayDiv.setAttribute( 'class', 'moda11y__overlay' );

		// Setup modal div.
		modalDiv.setAttribute( 'class', 'moda11y__modal' );

		// Setup modal close button.
		modalClose.setAttribute( 'class', 'moda11y__close' );
		modalClose.setAttribute( 'type', 'button' );
		modalClose.setAttribute( 'data-moda11y-trigger', trigger.dataset.moda11yTarget );

		// Setup modal close button span.
		modalCloseSpan.setAttribute( 'class', 'moda11y__close-icon' );
		modalCloseSpan.append( '&#10005;' );

		// Build the modal.
		modalClose.appendChild( modalCloseSpan );
		modalDiv.appendChild( modalClose );
		modalDiv.insertAdjacentHTML( 'beforeend', modalHTML );
		modalWrapperDiv.appendChild( modalOverlayDiv );
		modalWrapperDiv.appendChild( modalDiv );

		return modalWrapperDiv;
	}
}
