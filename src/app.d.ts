// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:clickOutside'?: (event: CustomEvent<any>) => void;
	}
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
