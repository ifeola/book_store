const bookList = document.querySelector("#book__list");

async function fetchBooks() {
	try {
		const response = await fetch("https://gutendex.com/books/");
		if (!response.ok) {
			throw new Error("Failed to fetch books");
		}
		const result = await response.json();
		return result.results; // Return only the books array
	} catch (error) {
		console.error("Error fetching books:", error);
		bookList.innerHTML =
			"<h1>Error loading books. Please try again later.</h1>";
		return []; // Return an empty array in case of error
	}
}

function renderLoading() {
	// Create 8 loading placeholders
	for (let i = 0; i < 8; i++) {
		const bookItem = document.createElement("li");
		bookItem.classList.add("loading");
		bookItem.innerHTML = `
					<div class="loading__image">
							<div class="image"></div>
					</div>
					<div class="loading__details">
							<div class="loading__info">
									<div class="loading__title"></div>
									<div class="loading__author"></div>
									<div class="loading__summary">
											<div class="summary"></div>
											<div class="summary"></div>
											<div class="summary"></div>
									</div>
							</div>
							<div class="loading__actions">
									<div class="loading__downloads"></div>
									<div class="loading__btn"></div>
							</div>
					</div>
			`;
		bookList.appendChild(bookItem); // Append each bookItem to the bookList
	}
}

function renderBooks(books) {
	bookList.innerHTML = ""; // Clear the loading message

	if (books.length === 0) {
		bookList.innerHTML = "<h1>No books found.</h1>";
		return;
	}

	books.forEach((book) => {
		const bookItem = document.createElement("li");
		bookItem.className = "book";
		const imageUrl =
			book.formats["image/jpeg"] || "https://via.placeholder.com/150"; // Fallback image
		const authors = book.authors.map((author) => author.name); // Format authors

		bookItem.innerHTML = `
				<div class="loading__image">
					<img src="${imageUrl}" alt="${book.title}" />
				</div>
				<div class="book__details">
					<div class="book__info">
						<h4 class="book__title">${book.title}</h4>
						<p class="book__author">By <span>${authors}</span></p>
						<p class="book__summary">${book.summaries[0]}</p>
					</div>
					<div class="book__actions">
						<span class="book__downloads">
							${book.download_count === 1 ? "Downloaded" : "Downloads"}:
							${book.download_count === 0 ? "No" : book.download_count}
						</span>
						<a href="${book.formats["text/html"]}" class="book__link
							">Read
						</a>
					</div>
				</div>
    `;
		bookList.appendChild(bookItem);
	});
}

async function init() {
	renderLoading(); // Show loading state
	const books = await fetchBooks(); // Fetch books
	renderBooks(books); // Render books
}

document.addEventListener("DOMContentLoaded", init);

/* const bookList = document.querySelector("#book__list");

async function fetchBooks() {
	let isLoading = true;
	const response = await fetch("https://gutendex.com/books/");
	const result = await response.json();
	let books = result.results;
	isLoading = false;
	return { books, isLoading };
}

async function renderBooks() {
	const { books, isLoading } = await fetchBooks();

	if (isLoading) {
		bookList.innerHTML = "<h1>Loading...</h1>";
		return;
	}

	books.forEach((book) => {
		const bookItem = document.createElement("li");
		bookItem.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p>${book.authors}</p>
    `;
		bookList.appendChild(bookItem);
	});
}

document.addEventListener("DOMContentLoaded", renderBooks);
 */
