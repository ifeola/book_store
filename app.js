const bookList = document.querySelector("#book__list");
const search = document.querySelector("#search");
const bookContent = document.querySelector("#book-details");

let books = [];

// GET AND DISPLAY BOOKS
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

function findBook() {
	// Filter books based on the search input
	searchInput = search.value;
	const filteredBooks = books.filter(
		(book) =>
			book.title.toLowerCase().includes(searchInput.toLowerCase()) ||
			book.authors[0].name.toLowerCase().includes(searchInput.toLowerCase())
	);
	renderBooks(filteredBooks);
}

search.addEventListener("keyup", findBook);

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
		bookItem.id = book.id;
		bookItem.className = "book";
		const imageUrl =
			book.formats["image/jpeg"] || "https://via.placeholder.com/150"; // Fallback image
		const authors = book.authors.map((author) => author.name); // Format authors

		bookItem.innerHTML = `
			<div class="book__wrapper">
				<div class="book__top">
					<div class="language">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
 						 <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
						</svg>	
						<span class="book__language">${book.languages[0]}</span>
					</div>
					<div class="download__count">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
					</svg>
					<span class="book__downloads">
					${book.download_count === 0 ? "No" : book.download_count}
						${book.download_count === 1 ? "Downloaded" : "Downloads"}
					</span>
				</div>
				</div>
				<div class="book__desc">
					<div class="book__image">
						<img src="${imageUrl}" alt="${book.title}" loading="lazy" />
					</div>
					<div class="book__desc-details">
						<div class="book__info">
							<h4 class="book__title">${book.title}</h4>
							<p class="book__author">By <span>${authors}</span></p>
						</div>
						<div class="summary summary-desktop">
							<p class="book__summary">${book.summaries[0]}</p>
						</div>
						<div class="book__actions actions-desktop">
							<a href="/books/book.html?id=${book.id}" class="book__cta">View Book</a>
						</div>
					</div>
			</div>
			<div class="mobile-view">
				<div class="summary">
					<p class="book__summary">${book.summaries[0]}</p>
				</div>
				<div class="book__actions">
					<a href="/books/book.html?id=${book.id}" class="book__cta">View Book</a>
				</div>
			</div>
			</div>

    `;
		bookList.appendChild(bookItem);
	});
}

async function init() {
	renderLoading(); // Show loading state
	books = await fetchBooks(); // Fetch books
	renderBooks(books); // Render books
}

document.addEventListener("DOMContentLoaded", init);
