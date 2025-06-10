async function loadMarkdown(filePath) {
  try {
    // Assuming markdown files are served directly from the public directory
    // Adjust the path if your setup is different (e.g., if using a server-side API)
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error loading markdown:", error);
    return `Error: Could not load content from ${filePath}`;
  }
}

export { loadMarkdown }; 