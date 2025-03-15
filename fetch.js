let books = [];

async function fetchBooks(URL) {
	try {
		const response = await fetch(URL);
		if (!response.ok) {
			throw new Error("Failed to fetch books");
		}
		const result = await response.json();
		return result; // Return only the books array
	} catch (error) {
		console.error("Error fetching books:", error);
		bookList.innerHTML =
			"<h1>Error loading books. Please try again later.</h1>";
		return []; // Return an empty array in case of error
	}
}

export default fetchBooks;
