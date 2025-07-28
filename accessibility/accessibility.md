# SvelteKit Accessibility Analysis & Improvement Guide for AI

# IMPORTANT

We have a canvas element that displays visual data for a graph.
This component is not accessible; it does not need fixing; we are working on alternative accessible displays for this data.

## Purpose

This guide provides an AI system with structured criteria and actionable patterns to analyze existing SvelteKit codebases and suggest specific accessibility improvements.

## Analysis Framework

### 1. Code Pattern Recognition

#### Identify These Problematic Patterns:

```svelte
<!-- PROBLEM: Missing alt text -->
<img src="/image.jpg" />

<!-- PROBLEM: Click handler without keyboard support -->
<div on:click={handleClick}>Button</div>

<!-- PROBLEM: Poor heading hierarchy -->
<h1>Title</h1>
<h4>Section</h4>

<!-- PROBLEM: Missing form labels -->
<input type="text" placeholder="Enter name" />

<!-- PROBLEM: No focus management in modals -->
{#if showModal}
	<div class="modal">Content</div>
{/if}

<!-- PROBLEM: Color-only information -->
<span class="error-red">Error</span>

<!-- PROBLEM: Missing live regions for dynamic content -->
{#if loading}
	<div>Loading...</div>
{/if}
```

#### Suggest These Improvements:

```svelte
<!-- SOLUTION: Implement focus management -->
<script>
	let modalElement;
	let previousFocus;

	function openModal() {
		previousFocus = document.activeElement;
		modalElement?.focus();
	}

	function closeModal() {
		previousFocus?.focus();
	}
</script>

<!-- SOLUTION: Add descriptive alt text -->
<img src="/image.jpg" alt="Sales chart showing 25% increase" />

<!-- SOLUTION: Add keyboard support and proper semantics -->
<button on:click={handleClick}>Button</button>
<!-- OR for non-button elements: -->
<div role="button" tabindex="0" on:click={handleClick} on:keydown={handleKeydown}>
	Interactive element
</div>

<!-- SOLUTION: Fix heading hierarchy -->
<h1>Title</h1>
<h2>Section</h2>

<!-- SOLUTION: Add proper labels -->
<label for="name">Name (required)</label>
<input id="name" type="text" required />

{#if showModal}
	<div class="modal" bind:this={modalElement} tabindex="-1" role="dialog">
		Content
		<button on:click={closeModal}>Close</button>
	</div>
{/if}

<!-- SOLUTION: Add text and icons for status -->
<span class="error">
	<span class="icon" aria-hidden="true">⚠</span>
	Error: Invalid input
</span>

<!-- SOLUTION: Add live region -->
{#if loading}
	<div role="status" aria-live="polite">
		<span class="sr-only">Loading content...</span>
	</div>
{/if}
```

### 2. SvelteKit-Specific Issues to Identify

#### Missing SvelteKit Accessibility Features:

```svelte
<!-- PROBLEM: No page titles -->
<!-- Missing <svelte:head><title>...</title></svelte:head> -->

<!-- PROBLEM: Form without enhancement -->
<form method="POST">
	<!-- form fields -->
</form>

<!-- PROBLEM: Navigation without current page indication -->
<nav>
	<a href="/home">Home</a>
	<a href="/about">About</a>
</nav>

<!-- PROBLEM: No focus management after navigation -->
<!-- Missing afterNavigate hook -->

<!-- PROBLEM: No error announcements -->
{#if $page.form?.errors}
	<div>{$page.form.errors.field}</div>
{/if}

<!-- PROBLEM: No loading states -->
<form method="POST">...</form>
```

#### SvelteKit Accessibility Improvements:

```svelte
<!-- SOLUTION: Add unique page titles -->
<svelte:head>
  <title>Dashboard - MyApp</title>
</svelte:head>

<!-- SOLUTION: Enhance forms with accessibility -->
<script>
  import { enhance } from '$app/forms';
  let loading = false;
</script>

<form
  method="POST"
  use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}
>
  <input type="text" name="field" required />
  <button type="submit" disabled={loading} aria-busy={loading}>
    {loading ? 'Submitting...' : 'Submit'}
  </button>
</form>

<!-- SOLUTION: Add current page indication -->
<script>
  import { page } from '$app/stores';
</script>

<nav aria-label="Main navigation">
  <a href="/home" aria-current={$page.url.pathname === '/home' ? 'page' : undefined}>
    Home
  </a>
  <a href="/about" aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
    About
  </a>
</nav>

<!-- SOLUTION: Add focus management -->
<script>
  import { afterNavigate } from '$app/navigation';

  afterNavigate(() => {
    const h1 = document.querySelector('h1');
    h1?.focus();
  });
</script>

<!-- SOLUTION: Make errors accessible -->
{#if $page.form?.errors}
  <div role="alert" class="error-summary">
    <h2>Please correct the following errors:</h2>
    <ul>
      {#each Object.entries($page.form.errors) as [field, error]}
        <li><a href="#{field}">{error}</a></li>
      {/each}
    </ul>
  </div>
{/if}
```

### 3. Component Analysis Checklist

When analyzing a SvelteKit component, check for:

#### Interactive Elements:

- [ ] All buttons use `<button>` or have `role="button"` with keyboard support
- [ ] All links use `<a>` with proper `href` attributes
- [ ] Custom interactive elements have `tabindex` and keyboard handlers
- [ ] Focus is visible and meets contrast requirements
- [ ] Touch targets are at least 24x24px

#### Forms:

- [ ] All inputs have associated labels (`<label for="id">` or `aria-label`)
- [ ] Required fields are marked with `required` attribute and indicated visually
- [ ] Error messages use `role="alert"` and are associated with inputs
- [ ] Fieldsets group related inputs with descriptive legends
- [ ] Form submission states are announced to screen readers

#### Dynamic Content:

- [ ] Loading states use `role="status"` or `aria-live`
- [ ] Error messages use `role="alert"`
- [ ] Content changes are announced appropriately
- [ ] Focus is managed when content appears/disappears

#### Navigation:

- [ ] Current page is indicated with `aria-current="page"`
- [ ] Navigation has descriptive `aria-label`
- [ ] Breadcrumbs use proper markup
- [ ] Skip links are provided

#### Media:

- [ ] Images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] Videos have captions and transcripts
- [ ] Audio content has transcripts

### 4. Automated Issue Detection Patterns

#### Missing ARIA Labels:

```regex
<!-- Find buttons without accessible names -->
<button(?![^>]*aria-label)(?![^>]*aria-labelledby)(?![^>]*>.*\w)
```

#### Images Without Alt Text:

```regex
<!-- Find img tags without alt attributes -->
<img(?![^>]*alt=)
```

#### Interactive Divs:

```regex
<!-- Find divs with click handlers but no role -->
<div[^>]*on:click(?![^>]*role=)
```

### 5. Priority Classification System

#### Critical Issues (Fix Immediately):

- Forms without labels
- Images without alt text
- Keyboard inaccessible interactive elements
- Missing page titles
- Color-only information
- No focus management in modals/dialogs

#### High Priority:

- Missing skip links
- Poor heading hierarchy
- No loading/error announcements
- Missing current page indication
- Insufficient color contrast

#### Medium Priority:

- Missing breadcrumbs
- No reduced motion support
- Inconsistent focus styles
- Missing landmarks

#### Low Priority:

- Enhancing existing alt text
- Adding more descriptive labels
- Optimizing screen reader experience

### 6. Analysis Output Format

When analyzing code, provide:

1. **Issues Found**: List specific problems with line numbers/code snippets
2. **Impact Level**: Critical/High/Medium/Low
3. **WCAG Violations**: Specific success criteria violated
4. **Fix Suggestions**: Exact code replacements
5. **Testing Notes**: How to verify the fix works

#### Example Analysis Output:

```
CRITICAL ISSUE - Line 23:
❌ <div on:click={handleSubmit}>Submit</div>
WCAG Violation: 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)
Impact: Users cannot submit form with keyboard

✅ SUGGESTED FIX:
<button type="submit" on:click={handleSubmit}>Submit</button>

TEST: Tab to button and press Enter/Space
```

### 8. Quick Reference for Common SvelteKit Patterns

#### Page Structure:

```svelte
<svelte:head>
	<title>Unique Page Title - Site Name</title>
</svelte:head>

<main id="main-content">
	<h1>Page Heading</h1>
	<!-- content -->
</main>
```

#### Skip Link:

```svelte
<a href="#main-content" class="skip-link">Skip to main content</a>
```

#### Loading States:

```svelte
<script>
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<div role="status" aria-live="polite">
		<span class="sr-only">Loading page...</span>
	</div>
{/if}
```

#### Error Handling:

```svelte
<!-- +error.svelte -->
<script>
	import { page } from '$app/stores';
</script>

<div role="alert">
	<h1>Error {$page.status}</h1>
	<p>{$page.error?.message}</p>
	<a href="/">Return home</a>
</div>
```

This guide provides the AI with specific patterns to recognize, concrete improvements to suggest, and templates for common accessibility implementations in SvelteKit applications.
