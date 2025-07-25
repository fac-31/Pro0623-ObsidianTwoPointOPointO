# 1 Critical Issues

## 1.1. Missing Form Labels & Accessible Errors

       * Location: src/lib/components/QueryPanel.svelte
       * Problem: The <textarea> for natural language queries is missing a <label>.
       * Suggestion: Add a <label> for the textarea to describe its purpose.
       * Location: src/lib/components/AuthForm.svelte
       * Problem: The error message {#if formData?.error} does not have role="alert" to announce errors to screen readers.
       * Suggestion: Add role="alert" to the paragraph tag.

## 1.2. Keyboard Inaccessible Interactive Elements

       * Location: src/lib/components/FloatingButton.svelte
       * Problem: The <div> with role="button" is focusable, but the <ul> that appears is not managed correctly, and the links inside are not easily accessible after the button is clicked.
       * Suggestion: The on:click event on the <a> tags should also have a corresponding on:keydown for Enter/Space keys.

# 2 High Priority Issues

## 2.1. Missing Page Titles

       * Location: All +page.svelte files.
       * Problem: None of the pages have a <svelte:head> section to define a unique <title>.
       * Suggestion: Add a unique and descriptive title to each page using <svelte:head>. For example, in src/routes/auth/+page.svelte, add <svelte:head><title>Login / Signup</title></svelte:head>.

## 2.2. No Loading/Error Announcements

       * Location: src/routes/worlds/+page.svelte
       * Problem: The loading state {#if awaiting} is a simple <p> tag.
       * Suggestion: Change the paragraph to a div with role="status" to announce the loading state to screen readers.
       * Location: src/routes/+page.svelte
       * Problem: The error message {#if errorMessage} does not have a role="alert".
       * Suggestion: Add role="alert" to the paragraph tag to ensure errors are announced.

## 2.3. Poor Heading Hierarchy

       * Location: src/routes/+page.svelte
       * Problem: The page starts with an <h1>, but then uses <h2> for "Add New User" and "Delete User" without a clear structure.
       * Suggestion: Ensure headings are used in a logical order (h1 -> h2 -> h3, etc.) to structure the page content.

# 3 Medium Priority Issues

## 3.1. Missing Landmarks

       * Location: src/lib/components/Dashboard.svelte
       * Problem: The dashboard is composed of several panes (<Pane>). These could benefit from being defined with HTML landmark elements or ARIA roles.
       * Suggestion: Use <section>, <aside>, or role attributes on the panes to give them semantic meaning (e.g., role="region" with an aria-label).

## 3.2. Inconsistent Focus Styles

       * Location: Throughout the application.
       * Problem: Some elements have custom focus rings (e.g., FloatingButton.svelte), while others rely on the browser's default.
       * Suggestion: Implement a consistent, highly visible focus style for all interactive elements in your app.css.
